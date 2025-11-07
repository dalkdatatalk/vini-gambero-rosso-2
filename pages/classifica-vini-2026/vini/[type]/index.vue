<template>
  <main class="type-page">
    <header class="type-page__header">
      <h1>Vini {{ typeLabel }}</h1>
      <p>Primo vino disponibile per la tipologia selezionata.</p>
    </header>

    <WineCard v-if="featuredWine" :wine="featuredWine" />
    <p v-else class="type-page__empty">Nessun vino disponibile per questa tipologia.</p>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useHead, useRoute } from '#imports';
import { useWines } from '~/composables/useWines';

const route = useRoute();
const { byType } = useWines();

const typeParam = computed(() => String(route.params.type ?? ''));

const winesByType = computed(() => byType(typeParam.value));
const featuredWine = computed(() => winesByType.value[0]);

const typeLabel = computed(() => {
  const wine = featuredWine.value;
  if (wine?.type) {
    return wine.type;
  }
  return typeParam.value.replace(/-/g, ' ');
});

useHead({
  title: `Vini ${typeLabel.value} | Classifica 2026`,
  meta: [
    {
      name: 'description',
      content: `Scopri il vino più rappresentativo per la tipologia ${typeLabel.value} nella classifica 2026.`,
    },
  ],
});
</script>

<style scoped>
.type-page {
  margin: 0 auto;
  max-width: 720px;
  padding: 48px 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.type-page__header {
  text-align: center;
}

.type-page__header h1 {
  font-size: 2rem;
  margin: 0;
  color: #1f2937;
}

.type-page__header p {
  margin: 8px 0 0;
  color: #4b5563;
}

.type-page__empty {
  text-align: center;
  color: #6b7280;
  font-size: 0.95rem;
}
</style>
