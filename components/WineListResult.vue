<template>
  <article class="wine-card">
    <NuxtLink :to="detailLink" class="wine-card__link">
      <header class="wine-card__header">
        <h3 class="wine-card__title">{{ wine.name }}</h3>
        <p class="wine-card__region">{{ regionLabel }}</p>
      </header>
      <dl class="wine-card__grid">
        <div class="wine-card__item">
          <dt class="wine-card__label">Tipologia</dt>
          <dd class="wine-card__value">{{ wine.type ?? 'N/D' }}</dd>
        </div>
        <div class="wine-card__item">
          <dt class="wine-card__label">Annata</dt>
          <dd class="wine-card__value">{{ wine.year ?? 'N/D' }}</dd>
        </div>
        <div class="wine-card__item">
          <dt class="wine-card__label">Punteggio</dt>
          <dd class="wine-card__value">{{ wine.score ?? 'N/D' }}</dd>
        </div>
        <div v-if="wine.denominazione" class="wine-card__item wine-card__item--wide">
          <dt class="wine-card__label">Denominazione</dt>
          <dd class="wine-card__value">{{ wine.denominazione }}</dd>
        </div>
      </dl>
    </NuxtLink>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Wine } from '~/composables/useWines';

const props = defineProps<{
  wine: Wine;
}>();

const detailLink = computed(() => `/classifica-vini-2026/vini/schede/${props.wine.slug}`);

const regionLabel = computed(() => props.wine.region ?? 'Regione non disponibile');
</script>

<style scoped>
.wine-card {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.94));
  box-shadow: 0 6px 16px rgba(15, 23, 42, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.wine-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.12);
}

.wine-card__link {
  display: block;
  padding: 20px;
  color: inherit;
  text-decoration: none;
}

.wine-card__header {
  margin-bottom: 12px;
}

.wine-card__title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 4px;
}

.wine-card__region {
  font-size: 0.9rem;
  color: #6b7280;
  margin: 0;
}

.wine-card__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px 16px;
  margin: 0;
}

.wine-card__item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.wine-card__item--wide {
  grid-column: 1 / -1;
}

.wine-card__label {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #9ca3af;
}

.wine-card__value {
  font-size: 0.95rem;
  color: #374151;
}
</style>
