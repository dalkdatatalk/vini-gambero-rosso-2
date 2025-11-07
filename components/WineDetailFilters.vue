<template>
  <section
    ref="rootRef"
    class="filters filters--details"
    aria-label="Filtri di dettaglio vini"
  >
    <div class="filter-controls">
      <div class="filter-item">
        <p class="filter-label">Regione</p>
        <button
          type="button"
          class="filter-dropdown"
          :aria-expanded="dropdownState.region ? 'true' : 'false'"
          :aria-controls="regionDropdownId"
          @click.stop="toggleDropdown('region')"
        >
          <span>{{ regionLabel }}</span>
          <span
            class="dropdown-icon"
            :class="{ 'dropdown-icon--open': dropdownState.region }"
            aria-hidden="true"
          >
            <svg viewBox="0 0 15 13" fill="none">
              <path d="M0 0L7.5 13L15 0H0Z" fill="#290005" />
            </svg>
          </span>
        </button>
        <ul
          v-if="dropdownState.region"
          :id="regionDropdownId"
          class="dropdown-menu"
          role="listbox"
          @click.stop
        >
          <li v-for="option in regionOptions" :key="option" class="dropdown-item">
            <button type="button" class="dropdown-item-button" @click="selectRegion(option)">
              {{ option }}
            </button>
          </li>
        </ul>
      </div>

      <div class="filter-item">
        <p class="filter-label">Fascia di prezzo</p>
        <div class="filter-range" role="group" aria-label="Filtra per prezzo minimo">
          <span class="range-min">{{ priceMinLabel }}</span>
          <div class="range-slider">
            <input
              :id="priceInputId"
              v-model.number="priceModel"
              type="range"
              :min="computedMinPrice"
              :max="computedMaxPrice"
              :step="priceStep"
              :aria-valuemin="computedMinPrice"
              :aria-valuemax="computedMaxPrice"
              :aria-valuenow="priceModel"
              aria-label="Prezzo minimo"
            />
          </div>
          <span class="range-value">{{ priceValueLabel }}</span>
          <span class="range-max">{{ priceMaxLabel }}</span>
          <span class="arrow-down" aria-hidden="true">
            <svg viewBox="0 0 15 13" fill="none">
              <path d="M0 0L7.5 13L15 0H0Z" fill="#290005" />
            </svg>
          </span>
        </div>
      </div>

      <div class="filter-item">
        <p class="filter-label">Punteggio</p>
        <div class="filter-range" role="group" aria-label="Filtra per punteggio minimo">
          <span class="range-min">{{ computedMinScore }}</span>
          <div class="range-slider">
            <input
              :id="scoreInputId"
              v-model.number="scoreModel"
              type="range"
              :min="computedMinScore"
              :max="computedMaxScore"
              step="1"
              :aria-valuemin="computedMinScore"
              :aria-valuemax="computedMaxScore"
              :aria-valuenow="scoreModel"
              aria-label="Punteggio minimo"
            />
          </div>
          <span class="range-value">{{ scoreModel }}</span>
          <span class="range-max">{{ computedMaxScore }}</span>
          <span class="arrow-down" aria-hidden="true">
            <svg viewBox="0 0 15 13" fill="none">
              <path d="M0 0L7.5 13L15 0H0Z" fill="#290005" />
            </svg>
          </span>
        </div>
      </div>

      <div class="filter-item">
        <p class="filter-label">Vitigno</p>
        <button
          type="button"
          class="filter-dropdown"
          :aria-expanded="dropdownState.grape ? 'true' : 'false'"
          :aria-controls="grapeDropdownId"
          @click.stop="toggleDropdown('grape')"
        >
          <span>{{ grapeLabel }}</span>
          <span
            class="dropdown-icon"
            :class="{ 'dropdown-icon--open': dropdownState.grape }"
            aria-hidden="true"
          >
            <svg viewBox="0 0 15 13" fill="none">
              <path d="M0 0L7.5 13L15 0H0Z" fill="#290005" />
            </svg>
          </span>
        </button>
        <ul
          v-if="dropdownState.grape"
          :id="grapeDropdownId"
          class="dropdown-menu"
          role="listbox"
          @click.stop
        >
          <li v-for="option in grapeOptions" :key="option" class="dropdown-item">
            <button type="button" class="dropdown-item-button" @click="selectGrape(option)">
              {{ option }}
            </button>
          </li>
        </ul>
      </div>

      <div class="filter-item filter-item--search">
        <label class="visually-hidden" :for="queryInputId">Cerca vini per nome</label>
        <input
          :id="queryInputId"
          v-model="queryModel"
          class="filter-input"
          type="search"
          placeholder="Cerca per nome"
        />
        <div class="filter-underline" aria-hidden="true"></div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';

const props = defineProps<{
  wines: any[];
  minScore?: number;
  maxScore?: number;
  minPrice?: number;
  maxPrice?: number;
  modelValue?: {
    query: string;
    region: string | null;
    grape: string | null;
    score: number;
    price: number;
  };
}>();

const emit = defineEmits<{
  (
    e: 'update:modelValue',
    value: { query: string; region: string | null; grape: string | null; score: number; price: number }
  ): void;
  (e: 'update:results', value: any[]): void;
}>();

const internalState = reactive({
  query: '',
  region: null as string | null,
  grape: null as string | null,
  score: 0,
  price: 0,
});

const componentId = Math.random().toString(36).slice(2, 9);
const scoreInputId = `wine-score-${componentId}`;
const queryInputId = `wine-query-${componentId}`;
const priceInputId = `wine-price-${componentId}`;
const regionDropdownId = `wine-region-menu-${componentId}`;
const grapeDropdownId = `wine-grape-menu-${componentId}`;
const computedMinScore = computed(() => Number.isFinite(props.minScore) ? Number(props.minScore) : 0);
const computedMaxScore = computed(() => Number.isFinite(props.maxScore) ? Number(props.maxScore) : 100);

const priceStats = computed(() => {
  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;
  for (const wine of props.wines ?? []) {
    for (const value of extractPriceCandidates(wine)) {
      if (value < min) {
        min = value;
      }
      if (value > max) {
        max = value;
      }
    }
  }

  if (!Number.isFinite(min)) {
    min = 0;
  }
  if (!Number.isFinite(max)) {
    max = min;
  }

  min = Math.max(0, Math.floor(min));
  max = Math.max(min, Math.ceil(max));

  return { min, max };
});

const computedMinPrice = computed(() => {
  if (Number.isFinite(props.minPrice)) {
    return Math.max(0, Math.floor(Number(props.minPrice)));
  }
  return priceStats.value.min;
});

const computedMaxPrice = computed(() => {
  const fallback = priceStats.value.max;
  if (Number.isFinite(props.maxPrice)) {
    return Math.max(computedMinPrice.value, Math.ceil(Number(props.maxPrice)));
  }
  return Math.max(computedMinPrice.value, fallback);
});

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

const priceModel = computed({
  get: () => internalState.price,
  set: (value: number) => {
    const normalized = clampPrice(Number.isFinite(value) ? value : computedMinPrice.value);
    if (internalState.price !== normalized) {
      internalState.price = normalized;
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

const regionOptions = computed(() => ['Tutte', ...regions.value]);
const grapeOptions = computed(() => ['Tutti', ...grapes.value]);
const regionLabel = computed(() => regionModel.value || 'Tutte');
const grapeLabel = computed(() => grapeModel.value || 'Tutti');

const priceStep = computed(() => {
  const span = computedMaxPrice.value - computedMinPrice.value;
  if (span <= 20) {
    return 1;
  }
  if (span <= 100) {
    return 5;
  }
  return 10;
});

const priceFormatter = new Intl.NumberFormat('it-IT', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
});

const priceMinLabel = computed(() => priceFormatter.format(computedMinPrice.value));
const priceMaxLabel = computed(() => priceFormatter.format(computedMaxPrice.value));
const priceValueLabel = computed(() => priceFormatter.format(priceModel.value));

const dropdownState = reactive({
  region: false,
  grape: false,
});

const rootRef = ref<HTMLElement | null>(null);

function toggleDropdown(type: 'region' | 'grape') {
  if (type === 'region') {
    dropdownState.region = !dropdownState.region;
    if (dropdownState.region) {
      dropdownState.grape = false;
    }
  } else {
    dropdownState.grape = !dropdownState.grape;
    if (dropdownState.grape) {
      dropdownState.region = false;
    }
  }
}

function closeDropdowns() {
  dropdownState.region = false;
  dropdownState.grape = false;
}

function selectRegion(option: string) {
  regionModel.value = option === 'Tutte' ? '' : option;
  closeDropdowns();
}

function selectGrape(option: string) {
  grapeModel.value = option === 'Tutti' ? '' : option;
  closeDropdowns();
}

function handleDocumentClick(event: MouseEvent) {
  if (!rootRef.value) {
    return;
  }
  const target = event.target as Node | null;
  if (target && rootRef.value.contains(target)) {
    return;
  }
  closeDropdowns();
}

let syncing = false;
let debounceHandle: ReturnType<typeof setTimeout> | null = null;

function triggerUpdate(immediate: boolean, forceModel = false) {
  const payload = {
    query: internalState.query,
    region: internalState.region,
    grape: internalState.grape,
    score: internalState.score,
    price: internalState.price,
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
    const incomingPrice = Number.isFinite(value?.price) ? Number(value?.price) : computedMinPrice.value;
    internalState.price = clampPrice(incomingPrice);
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

watch(
  () => computedMinPrice.value,
  (min) => {
    internalState.price = clampPrice(Math.max(internalState.price, min));
    triggerUpdate(true, true);
  }
);

watch(
  () => computedMaxPrice.value,
  () => {
    internalState.price = clampPrice(internalState.price);
    triggerUpdate(true, true);
  }
);

function clampScore(value: number) {
  const min = computedMinScore.value;
  const max = computedMaxScore.value;
  const normalized = Number.isFinite(value) ? value : min;
  return Math.min(Math.max(normalized, min), max);
}

function clampPrice(value: number) {
  const min = computedMinPrice.value;
  const max = computedMaxPrice.value;
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
  push(wine?.prezzo);

  const arrays = [
    wine?.prodotti_denominazione_vino,
    wine?.vino_categoria,
    wine?.regioni,
    wine?.guide,
    wine?.prodotti_tipologia,
    wine?.prodotti_fascia_di_prezzo,
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

function applyFilters(
  wines: any[],
  state: { query: string; region: string | null; grape: string | null; score: number; price: number }
) {
  const minimumScore = Number.isFinite(state.score) ? state.score : 0;
  const minimumPrice = Number.isFinite(state.price) ? state.price : computedMinPrice.value;
  const regionNeedle = norm(state.region);
  const grapeNeedle = norm(state.grape);
  const queryNeedle = norm(state.query);

  return wines.filter((wine) => {
    const scoreValue = toNumber(wine?.vino_centesimi ?? wine?.score);
    if (scoreValue < minimumScore) {
      return false;
    }

    if (minimumPrice > computedMinPrice.value) {
      const priceValue = getWinePrice(wine);
      if (priceValue == null || priceValue < minimumPrice) {
        return false;
      }
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

function getWinePrice(wine: any): number | null {
  const directValues: number[] = [];
  const rangeValues: number[] = [];

  const pushDirect = (input: unknown) => {
    const parsed = parsePriceValue(input);
    if (parsed != null) {
      directValues.push(parsed);
    }
  };

  pushDirect(wine?.prezzo);
  pushDirect(wine?.price);
  pushDirect(wine?.vino_prezzo);

  if (directValues.length) {
    directValues.sort((a, b) => a - b);
    return directValues[0];
  }

  const ranges = wine?.prodotti_fascia_di_prezzo;
  if (Array.isArray(ranges)) {
    for (const range of ranges) {
      const label = typeof range?.name === 'string' ? range.name : undefined;
      if (!label) {
        continue;
      }
      for (const value of parsePriceRangeText(label)) {
        rangeValues.push(value);
      }
    }
  }

  if (rangeValues.length) {
    rangeValues.sort((a, b) => a - b);
    return rangeValues[rangeValues.length - 1];
  }

  return null;
}

function extractPriceCandidates(wine: any): number[] {
  const set = new Set<number>();

  const push = (value: number | null) => {
    if (value == null) {
      return;
    }
    set.add(value);
  };

  push(parsePriceValue(wine?.prezzo));
  push(parsePriceValue(wine?.price));
  push(parsePriceValue(wine?.vino_prezzo));

  const ranges = wine?.prodotti_fascia_di_prezzo;
  if (Array.isArray(ranges)) {
    for (const range of ranges) {
      const label = typeof range?.name === 'string' ? range.name : undefined;
      if (!label) {
        continue;
      }
      for (const value of parsePriceRangeText(label)) {
        push(value);
      }
    }
  }

  return Array.from(set).sort((a, b) => a - b);
}

function parsePriceValue(input: unknown): number | null {
  if (typeof input === 'number' && Number.isFinite(input)) {
    return input;
  }
  if (typeof input === 'string') {
    const normalized = input.trim();
    if (!normalized) {
      return null;
    }
    const parsed = Number.parseFloat(normalized.replace(/[^0-9.,-]/g, '').replace(',', '.'));
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return null;
}

function parsePriceRangeText(text: string): number[] {
  const matches = text.match(/\d+(?:[.,]\d+)?/g);
  if (!matches) {
    return [];
  }

  const values: number[] = [];
  for (const match of matches) {
    const parsed = Number.parseFloat(match.replace(',', '.'));
    if (Number.isFinite(parsed)) {
      values.push(parsed);
    }
  }
  return values;
}

onMounted(() => {
  document.addEventListener('click', handleDocumentClick);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleDocumentClick);
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Funnel+Sans:wght@400;600&display=swap');

.filters {
  width: 100%;
}

.filter-controls {
  display: flex;
  gap: 40px;
  align-items: flex-start;
  width: 100%;
  flex-wrap: wrap;
}

.filter-item {
  position: relative;
  flex: 1 1 220px;
  min-width: 220px;
}

.filter-item--search {
  flex: 1 1 280px;
  min-width: 280px;
}

.filter-label {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 600;
  font-size: 24px;
  color: #290005;
  letter-spacing: -0.72px;
  margin-bottom: 10px;
}

.filter-dropdown {
  position: relative;
  height: 42px;
  border: 1px solid #290005;
  border-radius: 10px;
  opacity: 0.4;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 17px;
  cursor: pointer;
  transition: opacity 0.3s ease;
  width: 100%;
  background: transparent;
}

.filter-dropdown:hover,
.filter-dropdown:focus-visible {
  opacity: 0.6;
  outline: none;
}

.filter-dropdown span:first-child {
  font-family: 'Funnel Sans', sans-serif;
  font-weight: 400;
  font-size: 20px;
  color: #290005;
  letter-spacing: -0.6px;
}

.dropdown-icon {
  width: 17px;
  height: 17px;
  transform: rotate(180deg);
  transition: transform 0.3s ease;
}

.dropdown-icon--open {
  transform: rotate(0deg);
}

.dropdown-icon svg,
.arrow-down svg {
  display: block;
  width: 100%;
  height: 100%;
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 5px);
  left: 0;
  right: 0;
  background-color: #f6f6f6;
  border: 1px solid #290005;
  border-radius: 10px;
  z-index: 10;
  max-height: 220px;
  overflow-y: auto;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
  padding: 6px 0;
}

.dropdown-item {
  padding: 0 4px;
}

.dropdown-item-button {
  width: 100%;
  background: transparent;
  border: none;
  padding: 10px 13px;
  font-family: 'Funnel Sans', sans-serif;
  font-weight: 400;
  font-size: 18px;
  color: #290005;
  text-align: left;
  cursor: pointer;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

.dropdown-item-button:hover,
.dropdown-item-button:focus-visible {
  background-color: rgba(202, 31, 30, 0.1);
  outline: none;
}

.filter-range {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
}

.range-min,
.range-max,
.range-value {
  font-family: 'Funnel Sans', sans-serif;
  font-weight: 600;
  font-size: 16px;
  color: #290005;
  letter-spacing: -0.48px;
}

.range-min,
.range-max {
  opacity: 0.4;
}

.range-value {
  font-size: 20px;
  letter-spacing: -0.6px;
  min-width: 60px;
  text-align: center;
}

.range-slider {
  flex: 1;
  position: relative;
  height: 20px;
  display: flex;
  align-items: center;
}

.range-slider::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: 1px;
  background-color: #290005;
  opacity: 0.5;
}

.range-slider input[type='range'] {
  width: 100%;
  height: 2px;
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  outline: none;
  position: relative;
  z-index: 2;
  cursor: pointer;
}

.range-slider input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #ca1f1e;
  cursor: pointer;
  border: 2px solid #290005;
}

.range-slider input[type='range']::-moz-range-thumb {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #ca1f1e;
  cursor: pointer;
  border: 2px solid #290005;
}

.arrow-down {
  width: 17px;
  height: 17px;
  transform: rotate(180deg);
  opacity: 0.6;
}

.filter-input {
  width: 100%;
  border: none;
  background: transparent;
  font-family: 'Cormorant Garamond', serif;
  font-weight: 600;
  font-size: 32px;
  color: #290005;
  letter-spacing: -0.96px;
  outline: none;
  padding: 5px 0;
}

.filter-input::placeholder {
  opacity: 0.2;
  color: #290005;
}

.filter-underline {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background-color: #290005;
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

@media (max-width: 900px) {
  .filter-controls {
    gap: 24px;
  }

  .filter-item {
    min-width: 200px;
  }

  .filter-input {
    font-size: 28px;
  }
}

@media (max-width: 640px) {
  .filter-controls {
    flex-direction: column;
  }

  .filter-item,
  .filter-item--search {
    width: 100%;
    min-width: 0;
  }

  .filter-input {
    font-size: 24px;
  }
}
</style>
