<template>
  <nav class="filters" aria-label="Filtra per tipologia di vino">
    <ul class="filters__list">
      <li v-for="macro in macroTypes" :key="macro.id" class="filters__item">
        <button
          type="button"
          class="filters__link"
          :class="{ 'filters__link--active': isActive(macro.id) }"
          :aria-pressed="isActive(macro.id)"
          @click="select(macro.id)"
        >
          {{ macro.label }}
        </button>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useWines } from '~/composables/useWines';

const props = defineProps<{ modelValue?: string | string[] }>();
const emit = defineEmits<{ (e: 'update:modelValue', value: string | string[]): void }>();

const { getMacroWineTypes } = useWines();
const macroTypes = getMacroWineTypes();

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
.filters {
  width: 100%;
}

.filters__list {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 0;
  margin: 0;
  justify-content: center;
}

.filters__item {
  margin: 0;
}

.filters__link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 999px;
  border: 1px solid #d1d5db;
  background-color: #ffffff;
  color: #1f2937;
  font-weight: 600;
  font-size: 0.95rem;
  text-decoration: none;
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
  cursor: pointer;
}

.filters__link:hover,
.filters__link:focus-visible {
  border-color: #9ca3af;
  background-color: #f3f4f6;
  color: #111827;
}

.filters__link--active {
  border-color: #7f1d1d;
  background-color: #991b1b;
  color: #ffffff;
}
</style>

<style>
/* moved from page components */
.page__filters {
  margin: 0 auto;
  width: min(100%, 720px);
}
</style>
