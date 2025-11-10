<template>
  <section class="related-wines">
    <h3 class="related-wines__title">Vini correlati</h3>
    <div v-if="loading" class="related-wines__state">Caricamento suggerimenti…</div>
    <div v-else-if="error" class="related-wines__state">{{ error }}</div>
    <div v-else-if="items.length === 0" class="related-wines__state">Nessun vino correlato disponibile.</div>
    <div v-else class="related-wines__grid">
      <NuxtLink
        v-for="item in items"
        :key="item.slug"
        :to="`/classifica-vini-2026/vini/schede/${item.slug}`"
        class="related-wines__card"
      >
        <h4 class="related-wines__name">{{ item.name }}</h4>
        <p class="related-wines__meta">
          <span>{{ item.type ?? 'Tipologia n/d' }}</span>
          <span v-if="item.region"> · {{ item.region }}</span>
        </p>
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { Wine } from '~/composables/useWines';
import { useRelatedWines } from '~/composables/useRelatedWines';

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
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.25rem;
}

.related-wines__card {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 1.25rem;
  border: 1px solid var(--rosso);
  border-radius: 8px;
  text-decoration: none;
  transition: border-color 0.2s ease, transform 0.2s ease;
}

.related-wines__card:hover {
  border-color: var(--rosso-scuro);
  transform: translateY(-2px);
}

.related-wines__name {
  margin: 0;
  font-family: var(--cormorant-garamond);
  font-size: 1.4rem;
  color: var(--rosso-scuro);
}

.related-wines__meta {
  margin: 0;
  font-family: var(--funnel-sans);
  font-size: 0.95rem;
  color: var(--rosso-scuro);
  text-transform: capitalize;
}

@media (max-width: 1024px) {
  .related-wines__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .related-wines__grid {
    grid-template-columns: 1fr;
  }
}
</style>
