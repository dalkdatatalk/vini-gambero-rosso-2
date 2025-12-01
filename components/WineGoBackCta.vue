<template>
  <div class="wine-go-back-cta">
    <button
      type="button"
      class="wine-go-back-cta__link"
      :aria-label="ctaLabel"
      @click="onGoBack"
    >
      {{ ctaLabel }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from '#imports';
import type { Wine } from '~/composables/useWines';
import { findWineMenuItemByType } from '~/lib/wineMenuItems';

const props = defineProps<{
  wine: Wine;
  premioName?: string;
}>();

const macroCategoria = computed(() => findWineMenuItemByType(props.wine.type ?? null));

const ctaHref = computed(() => {
  if (!macroCategoria.value) {
    return '/classifica-vini-2026/vini/tutti';
  }

  return macroCategoria.value.routePath;
});

const router = useRouter();

const onGoBack = () => {
  if (process.client && window.history.state && window.history.state.position > 0) {
    router.back();
    return;
  }

  router.push(ctaHref.value);
};

const hasAward = computed(() => Boolean(props.premioName?.trim().length));

const ctaLabel = computed(() => {
  if (hasAward.value) {
    return 'Vedi tutti i vini premiati';
  }

  const categoryLabel = macroCategoria.value?.label ?? 'Tutti';
  return `Vedi tutti i vini ${categoryLabel}`;
});
</script>

<style scoped>
.wine-go-back-cta {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1rem 0;
  border-top: 1px solid var(--rosso);
  border-bottom: 1px solid var(--rosso);
  text-align: center;
  background-color: transparent;
}

.wine-go-back-cta__link {
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.5rem;
  padding: 0.85rem 1.5rem;
  font-family: var(--funnel-sans);
  font-weight: 300;
  font-size: 1rem;
  color: var(--rosso);
  text-align: left;
  text-decoration: underline;
  background: none;
  border: none;
  border-radius: 0;
  cursor: pointer;
  transition: color 0.2s ease;
}

.wine-go-back-cta__link:focus-visible,
.wine-go-back-cta__link:hover {
  color: var(--rosso);
}
</style>
