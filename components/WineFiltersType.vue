<template>
  <nav class="filters" aria-label="Filtra per tipologia di vino">
    <ul class="filters__list">
      <li v-for="filter in filters" :key="filter.slug" class="filters__item">
        <NuxtLink
          class="filters__link"
          :class="{ 'filters__link--active': filter.slug === activeSlug }"
          :to="filter.href"
        >
          {{ filter.label }}
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from '#imports';
import { useWines } from '~/composables/useWines';
import { slugify } from '~/utils/slugify';

const route = useRoute();
const { wines } = useWines();

interface FilterOption {
  slug: string;
  label: string;
  href: string;
}

const filters = computed<FilterOption[]>(() => {
  const options = new Map<string, string>();

  for (const wine of wines.value) {
    if (!wine.categories.length) {
      continue;
    }

    for (const category of wine.categories) {
      const slug = slugify(category);
      if (!options.has(slug)) {
        options.set(slug, category);
      }
    }
  }

  return Array.from(options, ([slug, label]) => ({
    slug,
    label,
    href: `/classifica-vini-2026/vini/${slug}`,
  })).sort((a, b) => a.label.localeCompare(b.label));
});

const activeSlug = computed(() => {
  const param = route.params?.type;

  if (typeof param === 'string') {
    return param.toLowerCase();
  }

  if (Array.isArray(param)) {
    return (param[0] ?? '').toLowerCase();
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
