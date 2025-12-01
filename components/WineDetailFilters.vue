<template>
  <section
    class="filters filters--details"
    aria-label="Filtri di dettaglio vini"
  >
    <div class="filter-controls">
      <!-- 1 Regione -->
      <div class="filter-item filter-item--region">
        <label
          :id="`region-combobox-label-${componentId}`"
          class="filter-label visually-hidden"
        >
          Regione
        </label>

        <ComboboxRoot
          v-model="regionModel"
          :aria-labelledby="`region-combobox-label-${componentId}`"
          class="combobox-root"
        >
          <ComboboxAnchor class="combobox-anchor">
            <ComboboxInput
              class="combobox-input"
              placeholder="Regione"
            />
            <ComboboxTrigger
              class="combobox-trigger"
              aria-label="Apri elenco regioni"
            >
              <span class="dropdown-icon" aria-hidden="true">
                <svg viewBox="0 0 15 13" fill="none">
                  <path d="M0 0L7.5 13L15 0H0Z" fill="#290005" />
                </svg>
              </span>
            </ComboboxTrigger>
          </ComboboxAnchor>

          <ComboboxContent class="combobox-content">
            <ComboboxViewport class="combobox-viewport">
              <ComboboxItem
                v-for="option in regionOptions"
                :key="option"
                :value="option === 'Tutte' ? ALL_REGION_VALUE : option"
                class="combobox-item"
              >
                {{ option }}
              </ComboboxItem>
            </ComboboxViewport>
          </ComboboxContent>
        </ComboboxRoot>
      </div>

      <!-- Fascia di Prezzo -->
      <!-- <div class="filter-item">
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
        </div>
      </div> -->

      <!-- 2 Punteggio -->
      <div class="filter-item">
        <p class="filter-label">Punteggio</p>
        <div class="filter-range" role="group" aria-label="Filtra per punteggio minimo">
          <span class="range-min">{{ computedMinScore }}</span>
          <div class="range-slider" :style="{ '--range-progress': scoreProgress + '%' }">
            <div
              class="range-bubble"
              :class="{ 'range-bubble--visible': scoreBubbleVisible }"
              aria-hidden="true"
            >
              {{ scoreModel }}
            </div>
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
              @input="handleScoreInput"
            />
          </div>
          <span class="range-max">{{ computedMaxScore }}</span>
        </div>
      </div>

      <!-- 3 Vitigno -->
      <div class="filter-item filter-item--grape">
        <label
          :id="`grape-combobox-label-${componentId}`"
          class="filter-label visually-hidden"
        >
          Vitigno
        </label>

        <ComboboxRoot
          v-model="grapeModel"
          :aria-labelledby="`grape-combobox-label-${componentId}`"
          class="combobox-root"
        >
          <ComboboxAnchor class="combobox-anchor">
            <ComboboxInput
              class="combobox-input"
              placeholder="Vitigno"
            />
            <ComboboxTrigger
              class="combobox-trigger"
              aria-label="Apri elenco vitigni"
            >
              <span class="dropdown-icon" aria-hidden="true">
                <svg viewBox="0 0 15 13" fill="none">
                  <path d="M0 0L7.5 13L15 0H0Z" fill="#290005" />
                </svg>
              </span>
            </ComboboxTrigger>
          </ComboboxAnchor>

          <ComboboxContent class="combobox-content">
            <ComboboxViewport class="combobox-viewport">
              <ComboboxItem
                v-for="option in grapeOptions"
                :key="option"
                :value="option === 'Tutti' ? ALL_GRAPE_VALUE : option"
                class="combobox-item"
              >
                {{ option }}
              </ComboboxItem>
            </ComboboxViewport>
          </ComboboxContent>
        </ComboboxRoot>
      </div>

      <!-- 4 Abbinamento -->
      <div class="filter-item filter-item--pairing">
        <label
          :id="`pairing-combobox-label-${componentId}`"
          class="filter-label visually-hidden"
        >
          Abbinamento
        </label>

        <ComboboxRoot
          v-model="pairingModel"
          :aria-labelledby="`pairing-combobox-label-${componentId}`"
          class="combobox-root"
        >
          <ComboboxAnchor class="combobox-anchor">
            <ComboboxInput
              class="combobox-input"
              placeholder="Abbinamenti"
            />
            <ComboboxTrigger
              class="combobox-trigger"
              aria-label="Apri elenco abbinamenti"
            >
              <span class="dropdown-icon" aria-hidden="true">
                <svg viewBox="0 0 15 13" fill="none">
                  <path d="M0 0L7.5 13L15 0H0Z" fill="#290005" />
                </svg>
              </span>
            </ComboboxTrigger>
          </ComboboxAnchor>

          <ComboboxContent class="combobox-content">
            <ComboboxViewport class="combobox-viewport">
              <ComboboxItem
                v-for="option in pairingOptions"
                :key="option"
                :value="option === 'Tutti gli abbinamenti' ? ALL_PAIRING_VALUE : option"
                class="combobox-item"
              >
                {{ option }}
              </ComboboxItem>
            </ComboboxViewport>
          </ComboboxContent>
        </ComboboxRoot>
      </div>

      <div class="filter-item filter-item--winery">
        <ComboboxRoot
          v-model="selectedWineryLocal"
          aria-label="Cantina"
          class="combobox-root"
        >
          <ComboboxAnchor class="combobox-anchor">
            <ComboboxInput
              class="combobox-input"
              placeholder="Cantina"
            />
            <ComboboxTrigger
              class="combobox-trigger"
              aria-label="Apri elenco cantine"
            >
              <span class="dropdown-icon" aria-hidden="true">
                <svg viewBox="0 0 15 13" fill="none">
                  <path d="M0 0L7.5 13L15 0H0Z" fill="#290005" />
                </svg>
              </span>
            </ComboboxTrigger>
          </ComboboxAnchor>

          <ComboboxContent class="combobox-content">
            <ComboboxViewport class="combobox-viewport">
              <ComboboxItem :value="ALL_WINERY_VALUE" class="combobox-item">
                Tutte le cantine
              </ComboboxItem>

              <ComboboxItem
                v-for="winery in wineryOptions"
                :key="winery"
                :value="winery"
                class="combobox-item"
              >
                {{ winery }}
              </ComboboxItem>
            </ComboboxViewport>
          </ComboboxContent>
        </ComboboxRoot>
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
import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue';
import {
  ComboboxAnchor,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxRoot,
  ComboboxTrigger,
  ComboboxViewport,
} from 'radix-vue';

const ALL_REGION_VALUE = 'Regioni';
const ALL_GRAPE_VALUE = 'Vitigni';
const ALL_PAIRING_VALUE = 'Abbinamenti';
const ALL_WINERY_VALUE = 'Cantine';

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
    abbinamento: string | null;
    score: number;
    price: number;
  };
}>();

const emit = defineEmits<{
  (
    e: 'update:modelValue',
    value: {
      query: string;
      region: string | null;
      grape: string | null;
      abbinamento: string | null;
      score: number;
      price: number;
    }
  ): void;
  (e: 'update:results', value: any[]): void;
}>();

const internalState = reactive({
  query: '',
  region: null as string | null,
  grape: null as string | null,
  abbinamento: null as string | null,
  score: 0,
  price: 0,
});

const componentId = Math.random().toString(36).slice(2, 9);
const scoreInputId = `wine-score-${componentId}`;
const queryInputId = `wine-query-${componentId}`;
const priceInputId = `wine-price-${componentId}`;
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

const pairings = computed(() => {
  const values = new Set<string>();
  for (const wine of props.wines ?? []) {
    for (const name of extractPairingTags(wine)) {
      if (name) {
        values.add(name);
      }
    }
  }
  return Array.from(values).sort((a, b) => a.localeCompare(b));
});

const wineries = computed(() => {
  const values = new Set<string>();
  for (const wine of props.wines ?? []) {
    const name = extractWineryName(wine);
    if (name) {
      values.add(name);
    }
  }
  return Array.from(values).sort((a, b) => a.localeCompare(b));
});

const selectedWineryLocal = ref(ALL_WINERY_VALUE);

const regionModel = computed({
  get: () => internalState.region ?? ALL_REGION_VALUE,
  set: (value: string) => {
    internalState.region = !value || value === ALL_REGION_VALUE ? null : value;
    triggerUpdate(true);
  },
});

const grapeModel = computed({
  get: () => internalState.grape ?? ALL_GRAPE_VALUE,
  set: (value: string) => {
    internalState.grape = !value || value === ALL_GRAPE_VALUE ? null : value;
    triggerUpdate(true);
  },
});

const pairingModel = computed({
  get: () => internalState.abbinamento ?? ALL_PAIRING_VALUE,
  set: (value: string) => {
    internalState.abbinamento =
      !value || value === ALL_PAIRING_VALUE ? null : value;
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

const scoreBubbleVisible = ref(false);
let scoreBubbleTimeout: ReturnType<typeof setTimeout> | null = null;

const handleScoreInput = () => {
  scoreBubbleVisible.value = true;
  if (scoreBubbleTimeout) {
    clearTimeout(scoreBubbleTimeout);
  }
  scoreBubbleTimeout = setTimeout(() => {
    scoreBubbleVisible.value = false;
    scoreBubbleTimeout = null;
  }, 1200);
};

const scoreProgress = computed(() => {
  const min = computedMinScore.value;
  const max = computedMaxScore.value;
  if (max <= min) {
    return 0;
  }
  const ratio = (scoreModel.value - min) / (max - min);
  return Math.min(100, Math.max(0, ratio * 100));
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

onBeforeUnmount(() => {
  if (scoreBubbleTimeout) {
    clearTimeout(scoreBubbleTimeout);
    scoreBubbleTimeout = null;
  }
});

const regionOptions = computed(() => ['Tutte', ...regions.value]);
const grapeOptions = computed(() => ['Tutti', ...grapes.value]);
const pairingOptions = computed(() => ['Tutti gli abbinamenti', ...pairings.value]);
const wineryOptions = computed(() => wineries.value);
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
const priceValueLabel = computed(() => priceFormatter.format(priceModel.value));

let syncing = false;
let debounceHandle: ReturnType<typeof setTimeout> | null = null;

function triggerUpdate(immediate: boolean, forceModel = false) {
  const payload = {
    query: internalState.query,
    region: internalState.region,
    grape: internalState.grape,
    abbinamento: internalState.abbinamento,
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
    internalState.abbinamento = value?.abbinamento ?? null;
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

watch(
  () => selectedWineryLocal.value,
  () => {
    triggerUpdate(true);
  }
);

watch(
  () => wineryOptions.value,
  (options) => {
    if (
      selectedWineryLocal.value !== ALL_WINERY_VALUE &&
      selectedWineryLocal.value &&
      !options.includes(selectedWineryLocal.value)
    ) {
      selectedWineryLocal.value = ALL_WINERY_VALUE;
    }
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

function extractPairingTags(wine: any): string[] {
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
        if (typeof item === 'string') {
          const trimmed = item.trim();
          if (trimmed) {
            values.add(trimmed);
          }
        } else if (item && typeof item === 'object') {
          const name = (item as any).name;
          if (typeof name === 'string' && name.trim()) {
            values.add(name.trim());
          }
        }
      }
    }
  };

  tryAdd(wine?.pairingTags);
  tryAdd(wine?.tag_abbinamento);

  return Array.from(values);
}

function extractWineryName(wine: any): string | null {
  const candidates = [wine?.wineryName, wine?.relatedLocale?.title];
  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim()) {
      return candidate.trim();
    }
  }
  return null;
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
  push(extractWineryName(wine));

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
  for (const pairing of extractPairingTags(wine)) {
    values.add(pairing);
  }

  return Array.from(values);
}

function applyFilters(
  wines: any[],
  state: {
    query: string;
    region: string | null;
    grape: string | null;
    abbinamento: string | null;
    score: number;
    price: number;
  }
) {
  const minimumScore = Number.isFinite(state.score) ? state.score : 0;
  const minimumPrice = Number.isFinite(state.price) ? state.price : computedMinPrice.value;
  const regionNeedle = norm(state.region);
  const grapeNeedle = norm(state.grape);
  const pairingNeedle = norm(state.abbinamento);
  const wineryValue =
    selectedWineryLocal.value === ALL_WINERY_VALUE ? null : selectedWineryLocal.value;
  const wineryNeedle = norm(wineryValue);
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

    if (pairingNeedle) {
      const pairingsList = extractPairingTags(wine);
      const match = pairingsList.some((item) => norm(item) === pairingNeedle);
      if (!match) {
        return false;
      }
    }

    if (wineryNeedle) {
      const wineryName = extractWineryName(wine);
      if (!wineryName || norm(wineryName) !== wineryNeedle) {
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

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Funnel+Sans:wght@400;600&display=swap');

.filters {
  width: 100%;
}

.filter-controls {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  gap: 16px;
}

.filter-item {
  position: relative;
  flex: 0 0 auto;
  min-width: 0;
  width: 100%;
}

.filter-item--search {
  flex: 0 0 auto;
  min-width: 0;
  width: 100%;
}

.filter-label {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 600;
  font-size: 24px;
  color: #290005;
  letter-spacing: -0.72px;
  margin-bottom: 10px;
}


.filter-range {
  position: relative;
  display: grid;
  grid-template-columns: auto 1fr auto;
  column-gap: 12px;
  row-gap: 12px;
  align-items: center;
}

.range-min,
.range-max {
  font-family: 'Funnel Sans', sans-serif;
  font-weight: 600;
  font-size: 16px;
  color: #290005;
  letter-spacing: -0.48px;
  opacity: 0.4;
  white-space: nowrap;
}

.range-slider {
  position: relative;
  height: 36px;
  display: flex;
  align-items: center;
  width: 100%;
  grid-column: 2 / 3;
  grid-row: 1;
  --range-progress: 0%;
}

.range-slider::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 2px;
  background-color: #290005;
  opacity: 0.4;
  transform: translateY(-50%);
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

.range-slider input[type='range']:focus-visible {
  outline: none;
  box-shadow: 0 0 0 6px rgba(202, 31, 30, 0.15);
  border-radius: 999px;
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

.range-bubble {
  position: absolute;
  left: var(--range-progress);
  bottom: calc(50% + 2px);
  transform: translate(-50%, 0) scale(0.75);
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background-color: #ca1f1e;
  color: #fff;
  font-family: 'Funnel Sans', sans-serif;
  font-weight: 600;
  font-size: 12px;
  letter-spacing: -0.24px;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 3;
  opacity: 0;
  transition: left 0.12s ease, opacity 0.15s ease, transform 0.15s ease;
  box-shadow: 0 2px 8px rgba(41, 0, 5, 0.15);
}

.range-bubble--visible {
  opacity: 1;
  transform: translate(-50%, 0) scale(1);
}

.range-slider input[type='range']::-moz-range-thumb {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #ca1f1e;
  cursor: pointer;
  border: 2px solid #290005;
}

.combobox-root {
  position: relative;
  width: 100%;
}

.combobox-anchor {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid var(--rosso-scuro);
  border-radius: 20px;
  padding: 8px 12px;
}

.combobox-anchor:hover {
  cursor: pointer;
}

.combobox-input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font: inherit;
  color: inherit;
}

.combobox-trigger {
  all: unset;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.dropdown-icon {
  display: inline-flex;
  width: 14px;
  height: 12px;
  transition: transform 0.2s ease;
}

.combobox-content {
  position: absolute;
  width: 100%;
  top: calc(100% + 4px);
  left: 0;
  z-index: 10;
  background: #fff;
  border: 1px solid var(--rosso-scuro);
  border-radius: 12px;
  padding: 2rem 1rem;
  max-height: 320px;
  overflow-y: auto;
}

@media (max-width: 1024px) {
  .combobox-content {
    left: 50%;
    transform: translateX(-50%);
    width: min(100%, calc(100vw - 32px));
    max-width: calc(100vw - 32px);
  }
}

.combobox-viewport {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.combobox-item {
  padding: 0;
}

.combobox-item:hover {
  cursor: pointer;
  background-color: color-mix(in srgb, var(--rosso) 20%, transparent);
}

.combobox-trigger[data-state='open'] .dropdown-icon {
  transform: rotate(180deg);
}

.filter-input {
  width: 100%;
  border: none;
  background: transparent;
  font-family: 'Cormorant Garamond', serif;
  font-weight: 600;
  font-size: 24px;
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

@media (min-width: 768px) {
  .filter-controls {
    flex-direction: column;
    gap: 20px;
  }

  .filter-item,
  .filter-item--search {
    flex: 0 0 100%;
  }

  .filter-input {
    font-size: 28px;
  }
}

@media (min-width: 1280px) {
  .filter-controls {
    gap: 24px 32px;
    padding: 16px 0 24px;
    align-items: stretch;
    flex-direction: row;
    flex-wrap: wrap;
  }

  .filter-item {
    flex: 1 1 220px;
    min-width: 220px;
  }

  .filter-item--search {
    flex: 1 1 280px;
    min-width: 280px;
  }

  .filter-input {
    font-size: 32px;
  }
}
</style>
