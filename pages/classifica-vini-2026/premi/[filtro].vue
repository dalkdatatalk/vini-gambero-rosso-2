<template>
  <HeaderMobile v-if="isMobile || isTablet" />
  <HeaderGeneral v-else />

  <main class="page">
    <section class="page__header">
      <h1>I vini premiati selezionati da Berebene 2026</h1>
      <p>
        Una selezione dedicata alle etichette che hanno ricevuto almeno un riconoscimento all'interno
        della guida Berebene 2026.
      </p>
    </section>

    <div class="filters" role="group" aria-label="Filtra vini premiati">
      <button
        type="button"
        class="filters__button"
        :class="{ 'filters__button--active': activeFilter === 'tutti' }"
        @click="onFilterClick('tutti')"
      >
        Tutti
      </button>
      <button
        type="button"
        class="filters__button"
        :class="{ 'filters__button--active': activeFilter === 'nazionali' }"
        @click="onFilterClick('nazionali')"
      >
        Nazionali
      </button>
      <button
        type="button"
        class="filters__button"
        :class="{ 'filters__button--active': activeFilter === 'regionali' }"
        @click="onFilterClick('regionali')"
      >
        Regionali
      </button>
    </div>

    <WineList :wines="filteredWines" empty-message="Non sono presenti vini premiati." />
  </main>

  <ScrollToTopButton />
  <Footer />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useHead, useRoute, useRouter } from '#imports';
import HeaderGeneral from '~/components/HeaderGeneral.vue';
import HeaderMobile from '~/components/HeaderMobile.vue';
import Footer from '~/components/Footer.vue';
import { useAwardedWines } from '~/composables/useAwardedWines';
import { useBreakpoints } from '~/composables/useBreakpoints';
import type { Wine } from '~/composables/useWines';

type FilterValue = 'tutti' | 'nazionali' | 'regionali';

const { isMobile, isTablet } = useBreakpoints();
const { awardedWines, getAwardForSlug, isNationalAward, isRegionalAward } = useAwardedWines();

const route = useRoute();
const router = useRouter();

const normalizeFilter = (value: string | string[] | undefined): FilterValue => {
  const candidate = Array.isArray(value) ? value[0] : value;
  if (candidate === 'nazionali' || candidate === 'regionali') {
    return candidate;
  }
  return 'tutti';
};

const activeFilter = ref<FilterValue>(normalizeFilter(route.params.filtro));

watch(
  () => route.params.filtro,
  (newParam) => {
    const resolved = normalizeFilter(newParam);
    const rawValue = Array.isArray(newParam) ? newParam[0] : newParam;

    activeFilter.value = resolved;

    if (rawValue !== resolved) {
      router.replace(`/classifica-vini-2026/premi/${resolved}`);
    }
  },
  { immediate: true }
);

const filteredWines = computed<Wine[]>(() => {
  if (activeFilter.value === 'tutti') {
    return awardedWines.value;
  }

  return awardedWines.value.filter((wine) => {
    const award = getAwardForSlug(wine.slug);
    const label = award?.label || award?.rawName || '';

    if (!label) return false;

    if (activeFilter.value === 'regionali') {
      return isRegionalAward(label);
    }

    return isNationalAward(label);
  });
});

const onFilterClick = async (filter: FilterValue) => {
  activeFilter.value = filter;
  const targetPath = `/classifica-vini-2026/premi/${filter}`;

  if (route.path !== targetPath) {
    await router.push(targetPath);
  }
};

const canonicalUrl = computed(
  () => `https://berebene.gamberorosso.it/classifica-vini-2026/premi/${activeFilter.value}`
);

useHead(() => ({
  title: 'Berebene 2026 | Vini premiati',
  meta: [
    {
      name: 'description',
      content:
        'Scopri i vini premiati selezionati da Berebene 2026: etichette con riconoscimenti e premi speciali della guida.',
    },
  ],
  link: [
    {
      rel: 'canonical',
      href: canonicalUrl.value,
    },
  ],
}));
</script>

<style scoped>
.page {
  margin: 0 auto;
  max-width: 1080px;
  padding: 48px 24px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

@media (max-width: 1279px) {
  .page {
    padding-top: 112px;
  }
}

.page__header {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.page__header h1 {
  font-size: 2.5rem;
  margin: 0;
  color: #1f2937;
}

.page__header p {
  margin: 0;
  color: #4b5563;
}

.filters {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.filters__button {
  border: 1px solid #e5e7eb;
  background: #ffffff;
  color: #1f2937;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 600;
}

.filters__button:hover {
  border-color: #c4c7cf;
  background: #f3f4f6;
}

.filters__button--active {
  background: #1f2937;
  color: #ffffff;
  border-color: #1f2937;
}
</style>
