<template>
  <main class="page">
    <header class="page__header">
      <h1>Classifica Vini 2026</h1>
      <p>Esplora i migliori vini della guida e scopri dettagli e cantine.</p>
    </header>

    <WineTypeFilters v-model="typeSelection" class="page__filters" />

    <WineDetailFilters
      :wines="wines"
      v-model="filterStateBinding"
      :min-score="0"
      :max-score="100"
      @update:results="onFilterResults"
      class="page__filters"
    />

    <WineList :wines="filteredWines" empty-message="Nessun vino corrisponde alla ricerca." />
  </main>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useHead } from '#imports';
import { useWines } from '~/composables/useWines';
import type { Wine } from '~/composables/useWines';
import { slugify } from '~/utils/slugify';

const wineTools = useWines();
const { wines } = wineTools;
const macroTypes = wineTools.getMacroWineTypes();

const typeSelection = ref<string | string[]>('tutti');

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

const normalizedTypeSelection = computed(() => {
  const value = typeSelection.value;
  const list = Array.isArray(value) ? value : value ? [value] : [];
  return list
    .map((item) => (item ?? '').toString().trim().toLowerCase())
    .filter((item) => item.length > 0);
});

const macroMap = computed(() => {
  const map = new Map<string, (typeof macroTypes)[number]>();
  for (const macro of macroTypes) {
    map.set(macro.id, macro);
  }
  return map;
});

function matchesType(wine: Wine, selections: string[]) {
  if (selections.length === 0 || selections.includes('tutti')) {
    return true;
  }

  const wineType = (wine.type ?? '').toLowerCase().trim();
  const wineTypeSlug = slugify(wine.type ?? '');

  return selections.some((selection) => {
    const macro = macroMap.value.get(selection);
    if (macro) {
      if (!macro.types) {
        return true;
      }
      return macro.types.some((type) => type.toLowerCase().trim() === wineType);
    }

    return wineType === selection || slugify(selection) === wineTypeSlug;
  });
}

const baseList = computed(() => (detailFiltersApplied.value ? detailResults.value : wines.value));

const filteredWines = computed(() => {
  const filteredByType = baseList.value.filter((wine) => matchesType(wine, normalizedTypeSelection.value));

  return [...filteredByType].sort((a, b) => {
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

useHead({
  title: 'Classifica Vini 2026 | Dashboard',
  meta: [
    {
      name: 'description',
      content: 'Ricerca e consulta i migliori vini della guida 2026 con filtri per nome, regione e tipologia.',
    },
  ],
});

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

</style>
