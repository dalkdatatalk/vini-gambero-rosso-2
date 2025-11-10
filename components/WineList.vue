<template>
  <section v-if="hasResults" :class="['wine-list__grid', gridClass]" v-bind="$attrs">
    <WineListResult
      v-for="wine in wines"
      :key="wine.id ?? wine.slug ?? wine.name"
      :wine="wine"
    />
  </section>
  <p v-else :class="['wine-list__empty', emptyClass, emptyVariantClass]" v-bind="$attrs">
    {{ emptyMessage }}
  </p>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Wine } from '~/composables/useWines';

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    wines: Wine[];
    emptyMessage?: string;
    gridClass?: string | string[] | Record<string, boolean>;
    emptyClass?: string | string[] | Record<string, boolean>;
    emptyVariant?: 'detailed' | 'simple';
  }>(),
  {
    wines: () => [],
    emptyMessage: 'Nessun vino disponibile.',
    gridClass: () => [],
    emptyClass: () => [],
    emptyVariant: 'detailed',
  }
);

const hasResults = computed(() => props.wines.length > 0);

const emptyVariantClass = computed(() =>
  props.emptyVariant === 'simple' ? 'wine-list__empty--simple' : 'wine-list__empty--detailed'
);
</script>

<style scoped>
.wine-list__grid {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: 5rem;
}

.wine-list__grid > :deep(*) {
  width: 100%;
}

.wine-list__empty {
  text-align: center;
  color: #6b7280;
  font-size: 0.95rem;
}

.wine-list__empty--detailed {
  grid-column: 1 / -1;
  padding: 24px;
  border: 1px dashed #d1d5db;
  border-radius: 12px;
  background: #f9fafb;
}

.wine-list__empty--simple {
  margin: 0;
}
</style>
