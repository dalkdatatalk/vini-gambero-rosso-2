<template>
  <main class="page">
    <header class="page__header">
      <h1>Classifica Vini 2026</h1>
      <p>Esplora i migliori vini della guida e scopri dettagli e cantine.</p>
    </header>

    <WineSearchBar v-model="query" class="page__search" />

    <section class="page__grid">
      <template v-if="filteredWines.length">
        <WineCard v-for="wine in filteredWines" :key="wine.id" :wine="wine" />
      </template>
      <p v-else class="page__empty">Nessun vino corrisponde alla ricerca.</p>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useHead } from '#imports';
import { useWines } from '~/composables/useWines';

const { search } = useWines();
const query = ref('');

const filteredWines = computed(() => {
  const results = search(query.value);

  return [...results].sort((a, b) => {
    const scoreA = a.score ?? 0;
    const scoreB = b.score ?? 0;

    if (scoreA !== scoreB) {
      return scoreB - scoreA;
    }

    return a.name.localeCompare(b.name);
  });
});

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

.page__search {
  margin: 0 auto;
  width: min(100%, 480px);
}

.page__grid {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.page__empty {
  text-align: center;
  color: #6b7280;
  font-size: 0.95rem;
  grid-column: 1 / -1;
  padding: 24px;
  border: 1px dashed #d1d5db;
  border-radius: 12px;
  background: #f9fafb;
}
</style>
