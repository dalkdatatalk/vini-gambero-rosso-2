<template>
  <main class="page">
    <WineTypeFilters
      v-model="macroBinding"
      class="page__filters"
      data-test="macro-filter"
    />

    <WineDetailFilters
      :wines="baseList"
      v-model="detailState"
      :min-score="0"
      :max-score="100"
      @update:results="onFiltered"
      class="page__filters"
      data-test="detail-filters"
    />

    <WineList
      :wines="finalList"
      empty-message="Nessun vino corrisponde alla ricerca."
      data-test="wine-list"
    />
  </main>

  <ScrollToTopButton />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useHead } from '#imports'
import { useWines } from '~/composables/useWines'
import type { Wine as DatasetWine } from '~/composables/useWines'

/** Tipi di dominio */
type Wine = DatasetWine

type MacroCategory = {
  id: string
  label: string
  types: string[]
}

type DetailFilterState = {
  query: string
  region: string | null
  grape: string | null
  score: number
  price: number
}

const DEFAULT_MACRO: MacroCategory = { id: 'tutti', label: 'Tutti', types: [] }

const { wines, getMacroWineTypes } = useWines()

const macroOptions = computed<MacroCategory[]>(() => {
  const base = getMacroWineTypes().map<MacroCategory>((item) => ({
    id: item.id,
    label: item.label,
    types: Array.isArray(item.types) ? [...item.types] : []
  }))
  const withoutTutti = base.filter((item) => item.id !== 'tutti')
  return [{ ...DEFAULT_MACRO }, ...withoutTutti]
})

const macroMap = computed(() => {
  const map = new Map<string, MacroCategory>()
  for (const option of macroOptions.value) {
    map.set(option.id, option)
  }
  return map
})

const macro = ref<MacroCategory>({ ...DEFAULT_MACRO })
const detailState = ref<DetailFilterState>({
  query: '',
  region: null,
  grape: null,
  score: 0,
  price: 0
})
const filtered = ref<Wine[] | null>(null)

const macroBinding = computed<MacroCategory>({
  get: () => macro.value,
  set: (value: MacroCategory | string | null | undefined) => {
    let next: MacroCategory | undefined
    if (value && typeof value === 'object') {
      next = macroMap.value.get(value.id)
    } else if (typeof value === 'string') {
      next = macroMap.value.get(value)
    }
    macro.value = next ? { ...next, types: [...next.types] } : { ...DEFAULT_MACRO }
  }
})

watch(
  () => macro.value.id,
  () => {
    filtered.value = null
  }
)

const baseList = computed<Wine[]>(() => {
  const all = Array.isArray(wines.value) ? wines.value : []
  const activeMacro = macro.value
  if (!activeMacro || activeMacro.id === 'tutti' || activeMacro.types.length === 0) {
    return all
  }
  const allowed = new Set(activeMacro.types.map((type) => type.toLowerCase().trim()))
  return all.filter((wine) => {
    const wineType = (wine.type ?? '').toLowerCase().trim()
    return allowed.size === 0 || allowed.has(wineType)
  })
})

const finalList = computed<Wine[]>(() => filtered.value ?? baseList.value)

function onFiltered(list: Wine[] | null) {
  filtered.value = Array.isArray(list) ? list : null
}

useHead({
  title: 'Classifica Vini 2026 — Tutti i vini',
  meta: [
    {
      name: 'description',
      content:
        'Sfoglia e filtra tutti i vini della Classifica 2026 per tipologia, punteggio e altre caratteristiche.'
    }
  ],
  link: [
    {
      rel: 'canonical',
      href: 'https://berebene.gamberorosso.it/classifica-vini-2026/vini/'
    }
  ]
})
</script>

<style scoped>
.page {
  padding: 2rem 1rem 3rem;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.page__filters {
  margin-bottom: 1rem;
}
</style>
