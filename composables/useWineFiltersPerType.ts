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
      const key = currentTypeKey.value
      let existing = filtersByType.value[key]

      // se non esiste ancora uno stato per questa tipologia, crealo e salvalo
      if (!existing) {
        existing = { ...DEFAULT_STATE }
        filtersByType.value[key] = existing
      }

      // importante: restituiamo SEMPRE lo stesso oggetto,
      // non una copia nuova ogni volta
      return existing
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
