<template>
  <main class="page page--type">
    <header class="page__header">
      <h1>Vini {{ typeLabel }}</h1>
      <p>
        {{ winesCountLabel }}
      </p>
    </header>

    <WineFiltersType class="page__filters" />

    <section v-if="sortedWines.length" class="page__grid">
      <WineCard v-for="wine in sortedWines" :key="wine.id" :wine="wine" />
    </section>
    <p v-else class="page__empty">Nessun vino disponibile per questa tipologia.</p>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useHead, useRoute } from '#imports';
import { useWines } from '~/composables/useWines';
import { slugify } from '~/utils/slugify';

const route = useRoute();
const { byType } = useWines();

const typeParam = computed(() => String(route.params.type ?? ''));
const typeSlug = computed(() => slugify(typeParam.value));

const winesByType = computed(() => byType(typeParam.value));
const sortedWines = computed(() => {
  return [...winesByType.value].sort((a, b) => {
    const scoreA = a.score ?? 0;
    const scoreB = b.score ?? 0;

    if (scoreA !== scoreB) {
      return scoreB - scoreA;
    }

    return a.name.localeCompare(b.name);
  });
});

const winesCountLabel = computed(() => {
  const count = sortedWines.value.length;
  if (count === 0) {
    return 'Nessun vino disponibile per la tipologia selezionata.';
  }

  if (count === 1) {
    return 'Un solo vino disponibile per la tipologia selezionata.';
  }

  return `${count} vini disponibili per la tipologia selezionata.`;
});

const typeLabel = computed(() => {
  const slug = typeSlug.value;
  if (slug) {
    for (const wine of sortedWines.value) {
      const match = wine.categories.find((category) => slugify(category) === slug);
      if (match) {
        return match;
      }
    }
  }
  return typeParam.value.replace(/-/g, ' ');
});

useHead({
  title: `Vini ${typeLabel.value} | Classifica 2026`,
  meta: [
    {
      name: 'description',
      content: `Scopri tutti i vini per la tipologia ${typeLabel.value} nella classifica 2026.`,
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
}

.page__header h1 {
  font-size: 2.25rem;
  margin: 0;
  color: #1f2937;
}

.page__header p {
  margin: 12px 0 0;
  color: #4b5563;
}

.page__filters {
  margin: 0 auto;
  width: min(100%, 720px);
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
  margin: 0;
}

.page__empty {
  grid-column: 1 / -1;
  padding: 24px;
  border: 1px dashed #d1d5db;
  border-radius: 12px;
  background: #f9fafb;
}
</style>
