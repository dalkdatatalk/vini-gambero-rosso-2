<template>
  <nav class="filters" aria-label="Filtra per tipologia di vino">
    <ul class="filters__list">
      <li v-for="macro in macroTypes" :key="macro.id" class="filters__item">
        <NuxtLink
          class="filters__link"
          :class="{ 'filters__link--active': macro.id === activeType }"
          :to="`/classifica-vini-2026/vini/${macro.id}`"
        >
          {{ macro.label }}
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from '#imports';
import { useWines } from '~/composables/useWines';

const route = useRoute();
const { getMacroWineTypes } = useWines();

const macroTypes = getMacroWineTypes();

const activeType = computed(() => {
  const param = route.params?.type;

  if (typeof param === 'string') {
    return param.trim().toLowerCase();
  }

  if (Array.isArray(param)) {
    return (param[0] ?? '').trim().toLowerCase();
  }

  return '';
});
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
