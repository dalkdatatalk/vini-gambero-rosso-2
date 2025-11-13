<template>
  <HeaderBereBene />
  <main class="type-page">

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
import { computed, reactive, ref } from 'vue';
import { useHead } from '#imports';
import { useWines } from '~/composables/useWines';
import type { Wine } from '~/composables/useWines';

const { filterByMacroType } = useWines();

/**
 * 👇 Partiamo SEMPRE dalla macrocategoria "tutti"
 * (id presente in MACRO_WINE_TYPES dentro useWines.ts)
 */
const typeSelection = ref<'tutti' | string>('tutti');

/**
 * Lista di vini in base alla macro selezionata.
 * Per ora usiamo sempre "tutti", ma se in futuro
 * il componente <WineTypeFilters> cambia typeSelection,
 * questa computed seguirà la scelta dell'utente.
 */
const winesBySelection = computed<Wine[]>(() => {
  return filterByMacroType(typeSelection.value || 'tutti');
});

/**
 * Ordinamento base: prima per punteggio desc, poi per nome asc.
 */
const baseSortedWines = computed<Wine[]>(() => {
  return [...winesBySelection.value].sort((a, b) => {
    const scoreA = a.score ?? 0;
    const scoreB = b.score ?? 0;

    if (scoreA !== scoreB) {
      return scoreB - scoreA;
    }

    return a.name.localeCompare(b.name);
  });
});

/**
 * Stato filtri di dettaglio (search, regione, vitigno, punteggio, prezzo).
 */
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

/**
 * Gestione risultati filtrati da <WineDetailFilters>.
 */
const detailFiltersApplied = ref(false);
const detailResults = ref<Wine[]>([]);

const filteredWines = computed<Wine[]>(() => {
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

/**
 * SEO fissa per la pagina "Tutti".
 */
useHead({
  title: 'Berebene 2026 | Classifica migliori vini economici',
  meta: [
    {
      name: 'description',
      content:
        'Scopri tutti i vini sotto ai 30 euro selezionati da Gambero Rosso come migliori per il 2026. Esplora per regione, tipologia e altro.',
    },
  ],
  link: [
    {
      rel: 'canonical',
      href: 'https://berebene.gamberorosso.it/classifica-vini-2026/vini/tutti',
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
