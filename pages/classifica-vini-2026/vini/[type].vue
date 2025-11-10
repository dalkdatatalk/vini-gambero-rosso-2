<template>
  <HeaderBereBene />
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
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { navigateTo, useHead, useRoute, useRouter } from '#imports';
import { useWines } from '~/composables/useWines';
import type { Wine } from '~/composables/useWines';

const route = useRoute();
const router = useRouter();
const { byType, bySlug, filterByMacroType, getMacroWineTypes } = useWines();

const macroTypes = getMacroWineTypes();

const typeParamRaw = computed(() => String(route.params.type ?? ''));
const currentType = computed(() => typeParamRaw.value.trim().toLowerCase());

const currentMacro = computed(() => {
  if (!currentType.value) {
    return null;
  }
  return macroTypes.find((macro) => macro.id === currentType.value) ?? null;
});

const redirectTarget = computed(() => {
  if (!typeParamRaw.value || currentMacro.value) {
    return null;
  }
  const wine = bySlug(typeParamRaw.value);
  if (wine) {
    return `/classifica-vini-2026/vini/schede/${wine.slug}`;
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
    return filterByMacroType(currentType.value);
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
  score: 0,
  price: 0,
});

const filterStateBinding = computed({
  get: () => filterState,
  set: (value) => {
    filterState.query = value?.query ?? '';
    filterState.region = value?.region ?? null;
    filterState.grape = value?.grape ?? null;
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

function onFilterResults(list: Wine[]) {
  detailFiltersApplied.value = true;
  detailResults.value = [...list];
}

const typeSelection = ref('');

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

const metaTitle = computed(() => {
  if (isTuttiPage.value) {
    return 'Berebene 2026 | Classifica migliori vini economici';
  }
  return `Berebene 2026 | Classifica migliori vini ${typeLabel.value} economici`;
});

const metaDescription = computed(() => {
  if (isTuttiPage.value) {
    return 'Scopri quali vini sotto ai 30 euro sono stati selezionati da Gambero Rosso come migliori per il 2026. Esplora per regione, tipologia e altro.';
  }
  return `Scopri quali vini ${typeLabel.value} sotto ai 30 euro sono stati selezionati da Gambero Rosso come migliori per il 2026.`;
});

const canonicalSegment = computed(() => {
  const param = route.params.type;
  if (Array.isArray(param)) {
    return param[0] ?? '';
  }
  return String(param ?? '');
});

const canonicalHref = computed(() => {
  if (isTuttiPage.value) {
    return 'https://berebene.gamberorosso.it/classifica-vini-2026/vini/tutti';
  }
  const segment = canonicalSegment.value.trim().replace(/\/+$/, '');
  if (!segment) {
    return 'https://berebene.gamberorosso.it/classifica-vini-2026/vini/';
  }
  return `https://berebene.gamberorosso.it/classifica-vini-2026/vini/${segment}/`;
});

useHead({
  title: metaTitle.value,
  meta: [
    {
      name: 'description',
      content: metaDescription.value,
    },
  ],
  link: [
    {
      rel: 'canonical',
      href: canonicalHref.value,
    },
  ],
});
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
