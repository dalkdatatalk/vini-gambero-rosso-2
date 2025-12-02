// composables/useWineFiltersPerType.ts
import { computed } from 'vue'
import { useRoute, useState } from '#imports'

export type WineFilterState = {
  query: string
  region: string | null
  grape: string | null
  abbinamento: string | null
  score: number
  price: number
}

const DEFAULT_STATE: WineFilterState = {
  query: '',
  region: null,
  grape: null,
  abbinamento: null,
  score: 0,
  price: 0,
}

export function useWineFiltersPerType() {
  const route = useRoute()

  // mappa: tipo (rossi, bianchi, bollicine, tutti, ecc.) -> stato filtri
  const filtersByType = useState<Record<string, WineFilterState>>(
    'wine-filters-by-type',
    () => ({})
  )

  const currentTypeKey = computed(() => {
    const raw = route.params.type

    const type =
      typeof raw === 'string'
        ? raw
        : Array.isArray(raw)
          ? raw[0]
          : 'tutti'

    return type.toString().trim().toLowerCase() || 'tutti'
  })

  const filterState = computed<WineFilterState>({
    get() {
      return filtersByType.value[currentTypeKey.value] ?? { ...DEFAULT_STATE }
    },
    set(value) {
      filtersByType.value[currentTypeKey.value] = {
        ...DEFAULT_STATE,
        ...(value ?? {}),
      }
    },
  })

  function patchFilterState(partial: Partial<WineFilterState>) {
    filterState.value = { ...filterState.value, ...partial }
  }

  function resetCurrent() {
    delete filtersByType.value[currentTypeKey.value]
  }

  return {
    filterState,
    patchFilterState,
    resetCurrent,
  }
}
