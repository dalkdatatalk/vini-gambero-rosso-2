<template>
<section class="filters filters--details" aria-label="Filtri di dettaglio vini">
    <div class="filters__controls">
      <div class="filters__field">
        <label :for="regionInputId">Regione</label>
        <select :id="regionInputId" class="filters__select" v-model="regionModel">
          <option value="">Tutte</option>
          <option v-for="region in regions" :key="region" :value="region">{{ region }}</option>
        </select>
      </div>
      <div class="filters__field">
        <label :for="grapeInputId">Vitigno</label>
        <select :id="grapeInputId" class="filters__select" v-model="grapeModel">
          <option value="">Tutti</option>
          <option v-for="grape in grapes" :key="grape" :value="grape">{{ grape }}</option>
        </select>
      </div>
      <div class="filters__field filters__field--range">
        <label :for="scoreInputId">Punteggio minimo</label>
        <div class="filters__range-wrapper">
          <input
            :id="scoreInputId"
            v-model.number="scoreModel"
            class="filters__range"
            type="range"
            :min="computedMinScore"
            :max="computedMaxScore"
            step="1"
            :aria-valuemin="computedMinScore"
            :aria-valuemax="computedMaxScore"
            :aria-valuenow="scoreModel"
          />
          <span class="filters__range-value" aria-live="polite">{{ scoreModel }}</span>
        </div>
      </div>
    </div>

    <div class="page__search">
      <label class="visually-hidden" :for="queryInputId">Cerca vini</label>
      <div class="search-bar">
        <input
          :id="queryInputId"
          v-model="queryModel"
          class="search-bar__input"
          type="search"
          placeholder="Cerca un vino, denominazione o vitigno..."
        />
        <button type="button" class="search-bar__button" @click="clearQuery">Pulisci</button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue';

const props = defineProps<{
  wines: any[];
  minScore?: number;
  maxScore?: number;
  modelValue?: {
    query: string;
    region: string | null;
    grape: string | null;
    score: number;
  };
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: { query: string; region: string | null; grape: string | null; score: number }): void;
  (e: 'update:results', value: any[]): void;
}>();

const internalState = reactive({
  query: '',
  region: null as string | null,
  grape: null as string | null,
  score: 0,
});

const componentId = Math.random().toString(36).slice(2, 9);
const regionInputId = `wine-region-${componentId}`;
const grapeInputId = `wine-grape-${componentId}`;
const scoreInputId = `wine-score-${componentId}`;
const queryInputId = `wine-query-${componentId}`;
const computedMinScore = computed(() => Number.isFinite(props.minScore) ? Number(props.minScore) : 0);
const computedMaxScore = computed(() => Number.isFinite(props.maxScore) ? Number(props.maxScore) : 100);

const regions = computed(() => {
  const values = new Set<string>();
  for (const wine of props.wines ?? []) {
    for (const name of extractRegions(wine)) {
      if (name) {
        values.add(name);
      }
    }
  }
  return Array.from(values).sort((a, b) => a.localeCompare(b));
});

const grapes = computed(() => {
  const values = new Set<string>();
  for (const wine of props.wines ?? []) {
    for (const name of extractGrapes(wine)) {
      if (name) {
        values.add(name);
      }
    }
  }
  return Array.from(values).sort((a, b) => a.localeCompare(b));
});

const regionModel = computed({
  get: () => internalState.region ?? '',
  set: (value: string) => {
    internalState.region = value ? value : null;
    triggerUpdate(true);
  },
});

const grapeModel = computed({
  get: () => internalState.grape ?? '',
  set: (value: string) => {
    internalState.grape = value ? value : null;
    triggerUpdate(true);
  },
});

const scoreModel = computed({
  get: () => internalState.score,
  set: (value: number) => {
    const normalized = clampScore(Number.isFinite(value) ? value : computedMinScore.value);
    if (internalState.score !== normalized) {
      internalState.score = normalized;
    }
    triggerUpdate(true);
  },
});

const queryModel = computed({
  get: () => internalState.query,
  set: (value: string) => {
    internalState.query = value ?? '';
    triggerUpdate(false);
  },
});

let syncing = false;
let debounceHandle: ReturnType<typeof setTimeout> | null = null;

function triggerUpdate(immediate: boolean, forceModel = false) {
  const payload = {
    query: internalState.query,
    region: internalState.region,
    grape: internalState.grape,
    score: internalState.score,
  };

  const run = () => {
    if (debounceHandle) {
      clearTimeout(debounceHandle);
      debounceHandle = null;
    }

    if (!syncing || forceModel) {
      emit('update:modelValue', payload);
    }
    emit('update:results', applyFilters(props.wines ?? [], payload));
  };

  if (immediate) {
    run();
  } else {
    if (debounceHandle) {
      clearTimeout(debounceHandle);
    }
    debounceHandle = setTimeout(run, 150);
  }
}

watch(
  () => props.modelValue,
  (value) => {
    syncing = true;
    internalState.query = value?.query ?? '';
    internalState.region = value?.region ?? null;
    internalState.grape = value?.grape ?? null;
    const incomingScore = Number.isFinite(value?.score) ? Number(value?.score) : computedMinScore.value;
    internalState.score = clampScore(incomingScore);
    triggerUpdate(true, true);
    syncing = false;
  },
  { immediate: true, deep: true }
);

watch(
  () => (props.wines ?? []).length,
  () => {
    triggerUpdate(true, true);
  }
);

watch(
  () => computedMinScore.value,
  (min) => {
    internalState.score = clampScore(Math.max(internalState.score, min));
    triggerUpdate(true, true);
  }
);

watch(
  () => computedMaxScore.value,
  () => {
    internalState.score = clampScore(internalState.score);
    triggerUpdate(true, true);
  }
);

function clearQuery() {
  if (internalState.query) {
    internalState.query = '';
    triggerUpdate(true);
  }
}

function clampScore(value: number) {
  const min = computedMinScore.value;
  const max = computedMaxScore.value;
  const normalized = Number.isFinite(value) ? value : min;
  return Math.min(Math.max(normalized, min), max);
}

function toNumber(value: unknown): number {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0;
  }
  if (typeof value === 'string') {
    const parsed = Number.parseInt(value.trim(), 10);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function norm(value?: string | null): string {
  return (value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .trim();
}

function extractRegions(wine: any): string[] {
  const values = new Set<string>();
  const tryAdd = (input: unknown) => {
    if (!input) {
      return;
    }
    if (typeof input === 'string') {
      const trimmed = input.trim();
      if (trimmed) {
        values.add(trimmed);
      }
      return;
    }
    if (Array.isArray(input)) {
      for (const item of input) {
        if (item && typeof item === 'object') {
          const name = 'name' in item ? (item as any).name : undefined;
          if (typeof name === 'string' && name.trim()) {
            values.add(name.trim());
          }
        } else if (typeof item === 'string' && item.trim()) {
          values.add(item.trim());
        }
      }
    }
  };

  tryAdd(wine?.region);
  tryAdd(wine?.regioni);
  tryAdd(wine?.regions);
  tryAdd(wine?.related_locale?.regioni);

  return Array.from(values);
}

function extractGrapes(wine: any): string[] {
  const values = new Set<string>();
  const tryAdd = (input: unknown) => {
    if (!input) {
      return;
    }
    if (typeof input === 'string') {
      const trimmed = input.trim();
      if (trimmed) {
        values.add(trimmed);
      }
      return;
    }
    if (Array.isArray(input)) {
      for (const item of input) {
        if (item && typeof item === 'object') {
          const name = (item as any).name ?? (item as any).vitigno ?? (item as any).nome;
          if (typeof name === 'string' && name.trim()) {
            values.add(name.trim());
          }
        } else if (typeof item === 'string' && item.trim()) {
          values.add(item.trim());
        }
      }
    }
  };

  tryAdd(wine?.grapes);
  tryAdd(wine?.vitigni);
  tryAdd(wine?.vino_vitigni);
  tryAdd(wine?.prodotti_vitigni);

  for (let index = 1; index <= 5; index += 1) {
    const slot = wine?.[`vine_stock${index}_name`];
    if (typeof slot === 'string' && slot.trim()) {
      values.add(slot.trim());
    }
  }

  return Array.from(values);
}

function collectSearchTokens(wine: any): string[] {
  const values = new Set<string>();
  const push = (input: unknown) => {
    if (typeof input === 'string' && input.trim()) {
      values.add(input.trim());
    }
  };

  push(wine?.title ?? wine?.name);
  push(wine?.slug);
  push(wine?.type);
  push(wine?.denominazione);
  push(wine?.content);

  const arrays = [
    wine?.prodotti_denominazione_vino,
    wine?.vino_categoria,
    wine?.regioni,
    wine?.guide,
    wine?.prodotti_tipologia,
  ];
  for (const array of arrays) {
    if (Array.isArray(array)) {
      for (const item of array) {
        if (item && typeof item === 'object') {
          const name = (item as any).name;
          if (typeof name === 'string' && name.trim()) {
            values.add(name.trim());
          }
        } else if (typeof item === 'string' && item.trim()) {
          values.add(item.trim());
        }
      }
    }
  }

  for (const grape of extractGrapes(wine)) {
    values.add(grape);
  }
  for (const region of extractRegions(wine)) {
    values.add(region);
  }

  return Array.from(values);
}

function applyFilters(wines: any[], state: { query: string; region: string | null; grape: string | null; score: number }) {
  const minimumScore = Number.isFinite(state.score) ? state.score : 0;
  const regionNeedle = norm(state.region);
  const grapeNeedle = norm(state.grape);
  const queryNeedle = norm(state.query);

  return wines.filter((wine) => {
    const scoreValue = toNumber(wine?.vino_centesimi ?? wine?.score);
    if (scoreValue < minimumScore) {
      return false;
    }

    if (regionNeedle) {
      const regionsList = extractRegions(wine);
      const match = regionsList.some((item) => norm(item) === regionNeedle);
      if (!match) {
        return false;
      }
    }

    if (grapeNeedle) {
      const grapesList = extractGrapes(wine);
      const match = grapesList.some((item) => norm(item) === grapeNeedle);
      if (!match) {
        return false;
      }
    }

    if (queryNeedle) {
      const tokens = collectSearchTokens(wine).map((token) => norm(token));
      const match = tokens.some((token) => token.includes(queryNeedle));
      if (!match) {
        return false;
      }
    }

    return true;
  });
}
</script>

<style scoped>
.filters {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.filters__controls {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.filters__field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filters__field label {
  font-weight: 600;
  font-size: 0.9rem;
  color: #374151;
}

.filters__select {
  border: 1px solid #d1d5db;
  border-radius: 12px;
  padding: 10px 12px;
  font-size: 0.95rem;
  background-color: #ffffff;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.filters__select:focus-visible {
  outline: none;
  border-color: #f59e0b;
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.2);
}

.filters__field--range {
  justify-content: flex-end;
}

.filters__range-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.filters__range {
  width: 100%;
}

.filters__range-value {
  min-width: 2ch;
  font-weight: 600;
  color: #1f2937;
}

.page__search {
  margin: 0 auto;
  width: min(100%, 480px);
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.search-bar__input {
  flex: 1;
  border: 1px solid #d1d5db;
  border-radius: 999px;
  padding: 10px 16px;
  font-size: 0.95rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.search-bar__input:focus-visible {
  outline: none;
  border-color: #f59e0b;
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.2);
}

.search-bar__button {
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  background-color: #f9fafb;
  padding: 10px 18px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.search-bar__button:hover,
.search-bar__button:focus-visible {
  background-color: #f3f4f6;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
