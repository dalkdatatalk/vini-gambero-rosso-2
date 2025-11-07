<template>
  <main class="type-page">
    <header class="type-page__header">
      <h1>Vini {{ typeLabel }}</h1>
      <p>
        {{ winesCountLabel }}
      </p>
    </header>

    <WineFiltersType class="type-page__filters" />

    <section v-if="sortedWines.length" class="type-page__grid">
      <WineCard v-for="wine in sortedWines" :key="wine.id" :wine="wine" />
    </section>
    <p v-else class="type-page__empty">Nessun vino disponibile per questa tipologia.</p>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { navigateTo, useHead, useRoute } from '#imports';
import { useWines } from '~/composables/useWines';

const route = useRoute();
const { byType, bySlug, filterByMacroType, getMacroWineTypes } = useWines();

const macroTypes = getMacroWineTypes();

const typeParamRaw = computed(() => String(route.params.type ?? ''));
const currentType = computed(() => typeParamRaw.value.trim().toLowerCase());

const currentMacro = computed(() => {
  if (!currentType.value) {
    return null;
  }
  return macroTypes.find((macro) => macro.id === currentType.value) ?? null;
});

const redirectTarget = computed(() => {
  if (!typeParamRaw.value || currentMacro.value) {
    return null;
  }
  const wine = bySlug(typeParamRaw.value);
  if (wine) {
    return `/classifica-vini-2026/vini/schede/${wine.slug}`;
  }
  return null;
});

if (redirectTarget.value) {
  await navigateTo(redirectTarget.value, { replace: true });
}

const winesBySelection = computed(() => {
  if (!currentType.value) {
    return [];
  }

  if (currentMacro.value) {
    return filterByMacroType(currentType.value);
  }

  return byType(typeParamRaw.value);
});

const sortedWines = computed(() => {
  return [...winesBySelection.value].sort((a, b) => {
    const scoreA = a.score ?? 0;
    const scoreB = b.score ?? 0;

    if (scoreA !== scoreB) {
      return scoreB - scoreA;
    }

    return a.name.localeCompare(b.name);
  });
});

const winesCountLabel = computed(() => {
  const count = sortedWines.value.length;
  if (count === 0) {
    return 'Nessun vino disponibile per la tipologia selezionata.';
  }

  if (count === 1) {
    return 'Un solo vino disponibile per la tipologia selezionata.';
  }

  return `${count} vini disponibili per la tipologia selezionata.`;
});

const fallbackLabel = computed(() => {
  const wine = sortedWines.value[0];
  if (wine?.type) {
    return wine.type;
  }
  const rawParam = route.params.type;
  if (typeof rawParam === 'string') {
    return rawParam.replace(/-/g, ' ');
  }
  if (Array.isArray(rawParam)) {
    return (rawParam[0] ?? '').replace(/-/g, ' ');
  }
  return '';
});

const typeLabel = computed(() => currentMacro.value?.label ?? fallbackLabel.value);

useHead({
  title: `Vini ${typeLabel.value} | Classifica 2026`,
  meta: [
    {
      name: 'description',
      content: `Scopri tutti i vini per la tipologia ${typeLabel.value} nella classifica 2026.`,
    },
  ],
});
</script>

<style scoped>
.type-page {
  margin: 0 auto;
  max-width: 1080px;
  padding: 48px 24px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.type-page__header {
  text-align: center;
}

.type-page__header h1 {
  font-size: 2.25rem;
  margin: 0;
  color: #1f2937;
}

.type-page__header p {
  margin: 12px 0 0;
  color: #4b5563;
}

.type-page__filters {
  margin: 0 auto;
  width: min(100%, 720px);
}

.type-page__grid {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.type-page__empty {
  text-align: center;
  color: #6b7280;
  font-size: 0.95rem;
  margin: 0;
}
</style>
