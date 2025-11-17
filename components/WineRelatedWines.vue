<template>
  <section class="related-wines">
    <h3 class="related-wines__title">Vini simili che ti suggeriamo</h3>
    <div v-if="loading" class="related-wines__state">Caricamento suggerimenti…</div>
    <div v-else-if="error" class="related-wines__state">{{ error }}</div>
    <div v-else-if="items.length === 0" class="related-wines__state">Nessun vino correlato disponibile.</div>
    <div v-else class="related-wines__grid">
      <article
        v-for="wine in items"
        :key="wine.slug"
        class="related-wines__card"
      >
        <p class="wine-card__type">
          <span>Tipologia</span> {{ wine.type ?? 'n/d' }}
        </p>
        <NuxtLink
          class="wine-card__cta"
          :to="getWineDetailLink(wine)"
        >
          <h4 class="wine-card__name">
            {{ wine.name ?? 'n/d' }}
          </h4>
        </NuxtLink>
        <p class="wine-card__winery">
          {{ wine.wineryName ?? 'n/d' }}
        </p>
        <NuxtLink
          class="wine-card__cta"
          :to="getWineDetailLink(wine)"
        >
          Scopri di più
        </NuxtLink>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { Wine } from '~/composables/useWines';
import { useRelatedWines } from '~/composables/useRelatedWines';
import { findWineMenuItemByType } from '~/lib/wineMenuItems';

const props = defineProps<{
  currentWine: Wine;
  primaryRegion: string | null;
}>();

const items = ref<Wine[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
  try {
    const { items: related } = await useRelatedWines({
      current: props.currentWine,
      primaryRegion: props.primaryRegion,
      desiredCount: 3,
    });
    items.value = related;
  } catch (err) {
    error.value = 'Impossibile caricare i vini correlati.';
    console.error(err);
  } finally {
    loading.value = false;
  }
});

function getWineDetailLink(wine: Wine) {
  const typeSegment = findWineMenuItemByType(wine.type ?? null)?.id ?? 'tutti';
  return `/classifica-vini-2026/vini/${typeSegment}/${wine.slug}`;
}
</script>

<style scoped>
.related-wines {
  margin-top: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.related-wines__title {
  margin: 0;
  font-family: var(--cormorant-garamond);
  font-size: 1.6rem;
  color: var(--rosso-scuro);
}

.related-wines__state {
  font-family: var(--funnel-sans);
  font-size: 1rem;
  color: var(--rosso-scuro);
}

.related-wines__grid {
  display: flex;
  flex-direction: row;
  gap: 1.25rem;
  overflow-x: auto;
}

.related-wines__grid article {
  min-width: 200px;
}

.related-wines__card {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.25rem;
  border: 1px solid var(--rosso-scuro);
  border-radius: 8px;
  transition: border-color 0.2s ease, transform 0.2s ease;
}

.related-wines__card:hover {
  border-color: var(--rosso-scuro);
  transform: translateY(-2px);
}

.wine-card__type {
  margin: 0;
  font-family: var(--funnel-sans);
  font-size: 0.95rem;
  color: var(--rosso-scuro);
  text-transform: capitalize;
}

.wine-card__type span {
  color: var(--rosso);
}

.wine-card__name {
  margin: 0;
  font-family: var(--cormorant-garamond);
  font-size: 1.4rem;
  color: var(--rosso-scuro);
  text-align: left;
}

.wine-card__winery {
  margin: 0;
  font-family: var(--cormorant-garamond);
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--rosso-scuro);
}

.wine-card__cta {
  margin-top: auto;
  font-family: var(--funnel-sans);
  font-size: 0.95rem;
  color: var(--rosso-scuro);
  text-decoration: underline;
  text-align: right;
}

.wine-card__cta:hover {
  color: var(--rosso-scuro);
}

@media (min-width: 768px) {
  .related-wines__grid {
    gap: 1.5rem;
  }
}

@media (min-width: 1280px) {
  .related-wines__grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1.25rem;
    overflow-x: visible;
  }

  .related-wines__grid article {
    min-width: 0;
  }
}
</style>
