<template>
  <main class="detail-page">
    <NuxtLink to="/classifica-vini-2026/vini/" class="detail-page__back">
      ← Torna alla classifica
    </NuxtLink>

    <div class="wine-info-page">
      <section class="detail-page__content">
        <div class="wine-details-container">
          <div class="wine-column technical">
            <header class="detail-page__header">
              <h1>{{ wine.name }}</h1>
              <p>
                {{ wine.type ?? 'Tipologia non disponibile' }} ·
                {{ primaryRegion ?? 'Regione non disponibile' }}
              </p>
            </header>
            <WineTechnicalDetails
              :wine="wine"
              :winery-name="wineryName"
              :winery-link="wineryLink"
              :primary-region="primaryRegion"
              :formatted-score="formattedScore"
              :grapes-list="grapesList"
              :formatted-bottles="formattedBottles"
              :formatted-price="formattedPrice"
            />
          </div>
          <div class="wine-column description">
            <WineDescriptionDetails :wine="wine" />
          </div>
        </div>
      </section>
    </div>
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

const wineryName = computed(() => wine.value.relatedLocale?.title ?? null);
const wineryLink = computed(() => wine.value.relatedLocale?.website ?? null);
const relatedRegion = computed(() => wine.value.relatedLocale?.regioni?.[0]?.name ?? null);
const primaryRegion = computed(() => wine.value.region ?? relatedRegion.value ?? null);

const formattedScore = computed(() => {
  if (typeof wine.value.score === 'number') {
    return wine.value.score.toString();
  }
  return null;
});

const formattedBottles = computed(() => {
  if (typeof wine.value.bottles !== 'number') {
    return null;
  }

  return new Intl.NumberFormat('it-IT').format(wine.value.bottles);
});

const formattedPrice = computed(() => {
  if (typeof wine.value.price === 'number') {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(wine.value.price);
  }

  if (wine.value.priceRange) {
    return wine.value.priceRange;
  }

  return null;
});

const grapesList = computed(() => {
  if (!wine.value.grapes || wine.value.grapes.length === 0) {
    return null;
  }

  return wine.value.grapes.map((grape) => {
    if (typeof grape.percentage === 'number') {
      return `${grape.name} (${grape.percentage}%)`;
    }
    return grape.name;
  });
});

useHead({
  title: `${wine.value.name} | Classifica Vini 2026`,
  meta: [
    {
      name: 'description',
      content: `Scopri dettagli su ${wine.value.name}, tipologia ${wine.value.type ?? 'n/d'}, regione ${primaryRegion.value ?? 'n/d'}.`,
    },
  ],
});
</script>

<style scoped>
.detail-page {
  padding: 48px 6rem;
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

.detail-page__content {
  width: 100%;
}

.wine-details-container {
  display: flex;
  flex-direction: row;
  gap: 2rem;
}

.wine-column {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.wine-column.technical {
  flex: 0 0 50%;
  padding-right: 2rem;
  border-right: 2px solid var(--rosso);
}

.wine-column.description {
  flex: 1 1 50%;
}



@media (max-width: 768px) {
  .wine-details-container {
    flex-direction: column;
  }

  .wine-column.technical,
  .wine-column.description {
    flex: 1 1 auto;
  }
}
</style>
