<template>
  <main class="detail-page">
    <NuxtLink to="/classifica-vini-2026/vini/" class="detail-page__back">
      ← Torna alla classifica
    </NuxtLink>

    <header class="detail-page__header">
      <h1>{{ wine.name }}</h1>
      <p>{{ wine.type ?? 'Tipologia non disponibile' }} · {{ wine.region ?? 'Regione non disponibile' }}</p>
    </header>

    <section class="detail-page__metrics">
      <div class="detail-page__metric">
        <h2>Annata</h2>
        <p>{{ wine.year ?? 'N/D' }}</p>
      </div>
      <div class="detail-page__metric">
        <h2>Punteggio</h2>
        <p>{{ wine.score ?? 'N/D' }}</p>
      </div>
      <div v-if="wine.denominazione" class="detail-page__metric detail-page__metric--wide">
        <h2>Denominazione</h2>
        <p>{{ wine.denominazione }}</p>
      </div>
    </section>

    <section>
      <h2 class="detail-page__section-title">Descrizione</h2>
      <RichContent :html="wine.content" />
    </section>

    <section v-if="wine.relatedLocale" class="detail-page__related">
      <h2 class="detail-page__section-title">Cantina</h2>
      <p class="detail-page__related-title">{{ wine.relatedLocale.title ?? 'Nome non disponibile' }}</p>
      <p v-if="relatedRegion" class="detail-page__related-region">{{ relatedRegion }}</p>
      <p v-if="wine.relatedLocale.website" class="detail-page__related-link">
        <a :href="wine.relatedLocale.website" target="_blank" rel="noopener noreferrer">Visita il sito</a>
      </p>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { createError, useHead, useRoute } from '#imports';
import { useWines } from '~/composables/useWines';

const route = useRoute();
const { bySlug } = useWines();

// primo step: potrebbe essere undefined
const rawWine = computed(() => bySlug(String(route.params.slug ?? '')));

// se non esiste, 404
if (!rawWine.value) {
  throw createError({ statusCode: 404, statusMessage: 'Vino non trovato' });
}

// secondo step: da qui in poi è DEFINITO
const wine = computed(() => rawWine.value!);

const relatedRegion = computed(() => {
  const regions = wine.value.relatedLocale?.regioni;
  return regions?.[0]?.name ?? null;
});

useHead({
  title: `${wine.value.name} | Classifica Vini 2026`,
  meta: [
    {
      name: 'description',
      content: `Scopri dettagli su ${wine.value.name}, tipologia ${wine.value.type ?? 'n/d'}, regione ${wine.value.region ?? 'n/d'}.`,
    },
  ],
});
</script>

<style scoped>
.detail-page {
  margin: 0 auto;
  max-width: 720px;
  padding: 48px 24px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.detail-page__back {
  color: #b45309;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
}

.detail-page__back:hover {
  text-decoration: underline;
}

.detail-page__header h1 {
  margin: 0;
  font-size: 2.4rem;
  color: #1f2937;
}

.detail-page__header p {
  margin: 8px 0 0;
  color: #4b5563;
  font-size: 1rem;
}

.detail-page__metrics {
  display: grid;
  gap: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background-color: #ffffff;
  padding: 24px;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
}

.detail-page__metric {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.detail-page__metric h2 {
  margin: 0;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #9ca3af;
}

.detail-page__metric p {
  margin: 0;
  font-size: 1.1rem;
  color: #1f2937;
}

.detail-page__metric--wide {
  grid-column: 1 / -1;
}

.detail-page__section-title {
  font-size: 1.4rem;
  margin: 0 0 12px;
  color: #1f2937;
}

.detail-page__related {
  border: 1px solid #fcd34d;
  background: #fef3c7;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-page__related-title {
  font-weight: 600;
  color: #92400e;
  margin: 0;
}

.detail-page__related-region {
  margin: 0;
  color: #b45309;
  font-size: 0.9rem;
}

.detail-page__related-link a {
  color: #92400e;
  text-decoration: underline;
  font-weight: 600;
}
</style>
