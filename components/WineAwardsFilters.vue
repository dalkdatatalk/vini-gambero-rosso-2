<template>
  <section class="wine-type-filters" aria-label="Filtra per tipologia di vino">
    <h1 class="title">
      {{ title || 'I vini premiati selezionati da Berebene 2026' }}
    </h1>

    <div class="category-buttons" role="group">
      <button
        v-for="filter in filters"
        :key="filter.id"
        type="button"
        class="btn-category"
        :class="{ active: isActive(filter.id) }"
        :aria-pressed="isActive(filter.id)"
        @click="select(filter.id)"
      >
        <span class="btn-category__label">{{ filter.label }}</span>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
type FilterValue = 'tutti' | 'nazionali' | 'regionali';

const props = defineProps<{
  title?: string;
  activeFilter: FilterValue;
  onFilter: (filter: FilterValue) => void;
}>();

const filters: Array<{ id: FilterValue; label: string }> = [
  { id: 'nazionali', label: 'Nazionali' },
  { id: 'regionali', label: 'Regionali' },
  { id: 'tutti', label: 'Tutti' },
];

function isActive(id: FilterValue) {
  return props.activeFilter === id;
}

function select(id: FilterValue) {
  props.onFilter(id);
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
  line-height: 1.15;
  white-space: normal;
  padding-right: 4rem;
  padding-top: 2rem;
  margin-bottom: 1rem;
  text-align: left;
}

@media (max-width: 375px) {
  .title {
    /* Tighter spacing for iPhone SE and similarly narrow screens */
    padding-right: 2rem;
  }
}

@media (min-width: 768px) {
  .title {
    font-size: 2.5rem;
    line-height: normal;
    white-space: nowrap;
    padding-right: 0;
    padding-top: 0;
  }
}

@media (min-width: 1024px) {
  .title {
    font-size: 3rem;
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
