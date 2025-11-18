<template>
  <section class="wine-type-filters" aria-label="Filtra per tipologia di vino">
    <h1 class="title">{{ titleText }}</h1>

    <div class="category-buttons" role="group">
      <button
        v-for="macro in macroTypes"
        :key="macro.id"
        type="button"
        class="btn-category"
        :class="{ active: isActive(macro.id) }"
        :aria-pressed="isActive(macro.id)"
        @click="select(macro.id)"
      >
        <span class="btn-category__label">{{ macro.label }}</span>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { WINE_MENU_ITEMS } from '~/lib/wineMenuItems';

const props = defineProps<{ modelValue?: string | string[]; heading?: string | null }>();
const emit = defineEmits<{ (e: 'update:modelValue', value: string | string[]): void }>();

const macroTypes = WINE_MENU_ITEMS;

const titleText = computed(() => {
  const heading = (props.heading ?? '').toString().trim();
  if (heading.length > 0) {
    return heading;
  }
  return 'Cerca il tuo vino';
});

const isMultiple = computed(() => Array.isArray(props.modelValue));

const normalizedSelection = computed(() => {
  const value = props.modelValue;
  if (!value) {
    return [] as string[];
  }
  const list = Array.isArray(value) ? value : [value];
  return list
    .map((item) => (item ?? '').toString().trim().toLowerCase())
    .filter((item) => item.length > 0);
});

function emitSelection(selection: string[]) {
  if (isMultiple.value) {
    emit('update:modelValue', selection);
    return;
  }
  emit('update:modelValue', selection[0] ?? '');
}

function select(rawId: string) {
  const id = (rawId ?? '').trim().toLowerCase();
  if (!id) {
    emitSelection([]);
    return;
  }

  const current = [...normalizedSelection.value];

  if (isMultiple.value) {
    let next = current.filter((item) => item !== id);

    if (current.includes(id)) {
      // already handled by filter (toggle off)
    } else {
      if (id === 'tutti') {
        next = ['tutti'];
      } else {
        next = next.filter((item) => item !== 'tutti');
        next.push(id);
      }
    }

    if (next.length === 0) {
      next = ['tutti'];
    }

    emitSelection(next);
    return;
  }

  emitSelection([id]);
}

function isActive(rawId: string) {
  const id = (rawId ?? '').trim().toLowerCase();
  if (!id) {
    return false;
  }
  const selection = normalizedSelection.value;
  if (selection.length === 0) {
    return id === 'tutti';
  }
  if (selection.includes('tutti')) {
    return id === 'tutti';
  }
  return selection.includes(id);
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Funnel+Sans:wght@400;600&display=swap');

.wine-type-filters {
  position: relative;
  width: 100%;
}

.title {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 400;
  font-style: normal;
  font-size: 2rem;
  color: #ca1f1e;
  letter-spacing: 0;
  line-height: normal;
  white-space: normal;
  margin-bottom: 1rem;
  text-align: left;
}

@media (min-width: 768px) {
  .title {
    font-size: 3rem;
    white-space: nowrap;
  }
}

.category-buttons {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 14px;
  align-items: center;
  line-height: 0;
}

.btn-category {
  position: relative;
  border: 1px solid #ca1f1e;
  border-radius: 10px;
  display: inline-grid;
  place-items: start;
  flex-shrink: 0;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
}

.btn-category:hover,
.btn-category:focus-visible {
  background-color: var(--rosso);
}

.btn-category:hover .btn-category__label{
  color: var(--bianco);
}

.btn-category:focus-visible .btn-category__label{
  color: var(--bianco);
}

.btn-category.active {
  background-color: var(--rosso);
  border: none;
}

.btn-category.active:hover,
.btn-category.active:focus-visible {
  background-color: #b01b1a;
}

.btn-category__label {
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-family: 'Cormorant Garamond', serif;
  font-weight: 600;
  font-style: italic;
  font-size: 1.5rem;
  color: #ca1f1e;
  text-align: center;
  position: relative;
  padding: 10px 14px;
}

.btn-category.active .btn-category__label {
  color: #f6f6f6;
}
</style>

<style>
/* moved from page components */
.page__filters {
  margin: 0 auto;
  width: min(100%, 720px);
}
</style>
