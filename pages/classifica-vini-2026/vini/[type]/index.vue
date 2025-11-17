<template>
  <HeaderMobile v-if="isMobile || isTablet" />
  <HeaderGeneral v-else />
  <main class="type-page">

    <WineTypeFilters v-model="typeSelection" class="type-page__filters page__filters" />

    <WineDetailFilters
      :wines="winesBySelection"
      v-model="filterStateBinding"
      :min-score="0"
      :max-score="100"
      @update:results="onFilterResults"
      class="page__filters"
    />

    <WineList
      :wines="filteredWines"
      empty-message="Nessun vino disponibile per questa tipologia."
      grid-class="type-page__grid"
      empty-class="type-page__empty"
      empty-variant="simple"
    />
  </main>

  <ScrollToTopButton />
  <Footer />
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { navigateTo, useHead, useRoute, useRouter, useSeoMeta } from '#imports';
import HeaderGeneral from '~/components/HeaderGeneral.vue';
import HeaderMobile from '~/components/HeaderMobile.vue';
import Footer from '~/components/Footer.vue';
import { useBreakpoints } from '~/composables/useBreakpoints';
import { useWines } from '~/composables/useWines';
import type { Wine } from '~/composables/useWines';
import {
  getWineMenuItemById,
  isWineMacroCategoryId,
  findWineMenuItemByType,
  type WineMacroCategoryId,
} from '~/lib/wineMenuItems';
import { buildWineListJsonLd } from '~/utils/structuredData';
import rawWines from '~/data/wines.json';

type RawGuideEntry = { name?: string | null };
type RawWineGuideInfo = { guide?: (RawGuideEntry | null | undefined)[] | null | undefined };

const route = useRoute();
const router = useRouter();
const { byType, bySlug, filterByMacroType, getMacroWineTypes } = useWines();

const { isMobile, isTablet } = useBreakpoints();

const macroTypes = getMacroWineTypes();

const typeParamRaw = computed(() => String(route.params.type ?? ''));
const currentType = computed(() => typeParamRaw.value.trim().toLowerCase());

const currentMacro = computed(() => {
  const id = currentType.value;
  if (!id || !isWineMacroCategoryId(id)) {
    return null;
  }
  return getWineMenuItemById(id) ?? null;
});

function getDetailTypeSegment(wine?: Wine | null) {
  const macro = findWineMenuItemByType(wine?.type ?? null);
  return macro?.id ?? 'tutti';
}

const redirectTarget = computed(() => {
  if (!typeParamRaw.value || currentMacro.value) {
    return null;
  }
  const wine = bySlug(typeParamRaw.value);
  if (wine) {
    const typeSegment = getDetailTypeSegment(wine);
    return `/classifica-vini-2026/vini/${typeSegment}/${wine.slug}`;
  }
  return null;
});

if (redirectTarget.value) {
  await navigateTo(redirectTarget.value, { replace: true });
}

const winesBySelection = computed(() => {
  if (!currentType.value) {
    return [];
  }

  if (currentMacro.value) {
    return filterByMacroType(currentMacro.value.id);
  }

  return byType(typeParamRaw.value);
});

const baseSortedWines = computed(() => {
  return [...winesBySelection.value].sort((a, b) => {
    const scoreA = a.score ?? 0;
    const scoreB = b.score ?? 0;

    if (scoreA !== scoreB) {
      return scoreB - scoreA;
    }

    return a.name.localeCompare(b.name);
  });
});

const filterState = reactive({
  query: '',
  region: null as string | null,
  grape: null as string | null,
  abbinamento: null as string | null,
  score: 0,
  price: 0,
});

const filterStateBinding = computed({
  get: () => filterState,
  set: (value) => {
    filterState.query = value?.query ?? '';
    filterState.region = value?.region ?? null;
    filterState.grape = value?.grape ?? null;
    filterState.abbinamento = value?.abbinamento ?? null;
    filterState.score = Number.isFinite(value?.score) ? Number(value?.score) : 0;
    filterState.price = Number.isFinite(value?.price) ? Number(value?.price) : 0;
  },
});

const detailFiltersApplied = ref(false);
const detailResults = ref<Wine[]>([]);

const filteredWines = computed(() => {
  const base = detailFiltersApplied.value ? detailResults.value : baseSortedWines.value;

  return [...base].sort((a, b) => {
    const scoreA = a.score ?? 0;
    const scoreB = b.score ?? 0;

    if (scoreA !== scoreB) {
      return scoreB - scoreA;
    }

    return a.name.localeCompare(b.name);
  });
});

const wines = filteredWines;

function onFilterResults(list: Wine[]) {
  detailFiltersApplied.value = true;
  detailResults.value = [...list];
}

const typeSelection = ref<WineMacroCategoryId | string>('');

watch(
  () => currentType.value,
  (value) => {
    const normalized = value || 'tutti';
    if (typeSelection.value !== normalized) {
      typeSelection.value = normalized;
    }
    detailFiltersApplied.value = false;
    detailResults.value = [];
  },
  { immediate: true }
);

watch(
  () => typeSelection.value,
  (value) => {
    const normalized = (value ?? '').trim().toLowerCase();
    if (!normalized) {
      return;
    }
    if (normalized === currentType.value) {
      return;
    }
    if (isWineMacroCategoryId(normalized)) {
      router.push(getWineMenuItemById(normalized)?.routePath ?? `/classifica-vini-2026/vini/${normalized}`);
      return;
    }
    router.push(`/classifica-vini-2026/vini/${normalized}`);
  }
);

const winesCountLabel = computed(() => {
  const count = filteredWines.value.length;
  if (count === 0) {
    return 'Nessun vino disponibile per la tipologia selezionata.';
  }

  if (count === 1) {
    return 'Un solo vino disponibile per la tipologia selezionata.';
  }

  return `${count} vini disponibili per la tipologia selezionata.`;
});

const fallbackLabel = computed(() => {
  const wine = baseSortedWines.value[0];
  if (wine?.type) {
    return wine.type;
  }
  const rawParam = route.params.type;
  if (typeof rawParam === 'string') {
    return rawParam.replace(/-/g, ' ');
  }
  if (Array.isArray(rawParam)) {
    return (rawParam[0] ?? '').replace(/-/g, ' ');
  }
  return '';
});

const typeLabel = computed(() => currentMacro.value?.label ?? fallbackLabel.value);

const isTuttiPage = computed(() => currentType.value === 'tutti');

const metaDescription = computed(() => {
  if (isTuttiPage.value) {
    return 'Scopri quali vini sotto ai 30 euro sono stati selezionati da Gambero Rosso come migliori per il 2026. Esplora per regione, tipologia e altro.';
  }
  return `Scopri quali vini ${typeLabel.value} sotto ai 30 euro sono stati selezionati da Gambero Rosso come migliori per il 2026.`;
});

const canonicalUrl = computed(() => {
  const type = String(route.params.type ?? 'tutti');
  return `https://berebene.gamberorosso.it/classifica-vini-2026/vini/${type}`;
});

const listTitle = computed(() => {
  const label = isTuttiPage.value ? 'Tutti i vini' : typeLabel.value || 'Tutti i vini';
  return `${label} | Berebene 2026`;
});

const berebeneYear = computed(() => {
  const winesSource = rawWines as RawWineGuideInfo[] | undefined;
  const guideName = winesSource?.[0]?.guide?.[0]?.name;
  if (typeof guideName !== 'string') {
    return null;
  }
  const normalized = guideName.replace(/^Berebene\s+/i, '').trim();
  return normalized || null;
});

const metaTitle = computed(() => {
  const suffix = 'Filtra e scopri i migliori vini qualità-prezzo';
  const base = 'Classifica Berebene';
  const year = berebeneYear.value;
  if (!year) {
    return `${base} – ${suffix}`;
  }
  return `${base} ${year} – ${suffix}`;
});

const listItems = computed(() =>
  wines.value.map((wine) => {
    const typeSegment = getDetailTypeSegment(wine);
    const url = `https://berebene.gamberorosso.it/classifica-vini-2026/vini/${typeSegment}/${wine.slug}`;
    return {
      name: wine.name,
      url,
      category: wine.type ?? null,
    };
  })
);

const listJsonLd = computed(() =>
  buildWineListJsonLd({
    canonicalUrl: canonicalUrl.value,
    title: listTitle.value,
    items: listItems.value,
  })
);

useSeoMeta({
  title: () => metaTitle.value,
  ogTitle: () => metaTitle.value,
  description: () => metaDescription.value,
  ogDescription: () => metaDescription.value,
});

useHead(() => ({
  link: [
    {
      rel: 'canonical',
      href: canonicalUrl.value,
    },
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify(listJsonLd.value),
    },
  ],
}));
</script>

<style scoped>
.type-page {
  margin: 0 auto;
  max-width: 1080px;
  padding: 48px 24px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

@media (max-width: 1279px) {
  .type-page {
    padding-top: 112px;
  }
}

.type-page__header {
  text-align: center;
}

.type-page__header h1 {
  font-size: 2.25rem;
  margin: 0;
  color: #1f2937;
}

.type-page__header p {
  margin: 12px 0 0;
  color: #4b5563;
}

</style>
