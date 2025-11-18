<template>
  <section
    ref="containerRef"
    :class="containerClass"
    :style="containerStyle"
    v-bind="$attrs"
  >
    <template v-if="hasResults">
      <WineListResult
        v-for="wine in wines"
        :key="wine.id ?? wine.slug ?? wine.name"
        :wine="wine"
      />
    </template>
    <p v-else :class="['wine-list__empty', emptyClass, emptyVariantClass]">
      {{ emptyMessage }}
    </p>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
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

const containerRef = ref<HTMLElement | null>(null);
const placeholderHeight = ref(0);

const containerStyle = computed(() =>
  placeholderHeight.value > 0 ? { minHeight: `${placeholderHeight.value}px` } : {}
);

const containerClass = computed(() => {
  const classes: Array<string | Record<string, boolean>> = ['wine-list'];

  if (hasResults.value) {
    classes.push('wine-list__grid');
    const extra = props.gridClass;
    if (typeof extra === 'string') {
      classes.push(extra);
    } else if (Array.isArray(extra)) {
      classes.push(...extra);
    } else if (extra && typeof extra === 'object') {
      classes.push(extra);
    }
  } else {
    classes.push('wine-list__empty-wrapper');
  }

  return classes;
});

watch(
  hasResults,
  (value, oldValue) => {
    if (!value && oldValue && containerRef.value) {
      placeholderHeight.value = containerRef.value.offsetHeight;
    } else if (value) {
      placeholderHeight.value = 0;
    }
  },
  { flush: 'pre' }
);

const emptyVariantClass = computed(() =>
  props.emptyVariant === 'simple' ? 'wine-list__empty--simple' : 'wine-list__empty--detailed'
);
</script>

<style scoped>
.wine-list {
  width: 100%;
}

.wine-list__grid {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: 2rem;
}

.wine-list__grid > :deep(*) {
  width: 100%;
}

.wine-list__empty-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100%;
  padding: 48px 0;
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
