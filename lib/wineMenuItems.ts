export type WineMacroCategoryId =
  | 'bollicine'
  | 'bianchi'
  | 'rosati'
  | 'rossi'
  | 'vini-dolci'
  | 'tutti'

type WineSpecialNavigationId = 'vini-premiati'

export interface WineMenuItem {
  id: WineMacroCategoryId
  label: string
  routePath: string
  order: number
  types?: string[]
}

const WHITE_TYPES = ['bianco', 'bianco macerato/orange wine', 'bianco liquoroso']
const RED_TYPES = ['rosso']
const BUBBLES_TYPES = [
  'spumante bianco',
  'spumante rosato',
  'spumante rosso',
  'spumante dolce bianco',
]
const ROSATI_TYPES = ['rosato']
const SWEET_TYPES = ['dolce bianco', 'dolce rosso']

const ALL_WINE_TYPES = [
  ...WHITE_TYPES,
  ...RED_TYPES,
  ...BUBBLES_TYPES,
  ...ROSATI_TYPES,
  ...SWEET_TYPES,
]

export const WINE_MENU_ITEMS: WineMenuItem[] = [
  {
    id: 'bollicine',
    label: 'Bollicine',
    routePath: '/classifica-vini-2026/vini/bollicine',
    order: 1,
    types: BUBBLES_TYPES,
  },
  {
    id: 'bianchi',
    label: 'Bianchi',
    routePath: '/classifica-vini-2026/vini/bianchi',
    order: 2,
    types: WHITE_TYPES,
  },
  {
    id: 'rosati',
    label: 'Rosati',
    routePath: '/classifica-vini-2026/vini/rosati',
    order: 3,
    types: ROSATI_TYPES,
  },
  {
    id: 'rossi',
    label: 'Rossi',
    routePath: '/classifica-vini-2026/vini/rossi',
    order: 4,
    types: RED_TYPES,
  },
  {
    id: 'vini-dolci',
    label: 'Dolci',
    routePath: '/classifica-vini-2026/vini/vini-dolci',
    order: 5,
    types: SWEET_TYPES,
  },
  {
    id: 'tutti',
    label: 'Tutti',
    routePath: '/classifica-vini-2026/vini/tutti',
    order: 6,
    types: ALL_WINE_TYPES,
  },
]

export interface WineNavigationItem {
  id: 'home' | WineMacroCategoryId | WineSpecialNavigationId
  label: string
  href?: string
  to?: string
  order: number
}

export const HOME_NAV_ITEM: WineNavigationItem = {
  id: 'home',
  label: 'Home',
  href: 'https://berebene.gamberorosso.it/classifica-vini-2026.html',
  order: 0,
}

export const AWARD_NAV_ITEM: WineNavigationItem = {
  id: 'vini-premiati',
  label: 'Vini premiati',
  to: '/classifica-vini-2026/premi/',
  order: 0.5,
}

const navigationItems: WineNavigationItem[] = [
  HOME_NAV_ITEM,
  AWARD_NAV_ITEM,
  ...WINE_MENU_ITEMS.map<WineNavigationItem>((item) => ({
    id: item.id,
    label: item.label,
    to: item.routePath,
    order: item.order,
  })),
]

export const WINE_NAVIGATION_ITEMS: WineNavigationItem[] = navigationItems.sort(
  (a, b) => a.order - b.order,
)

export const wineMenuItemsById = WINE_MENU_ITEMS.reduce<
  Record<WineMacroCategoryId, WineMenuItem>
>((acc, item) => {
  acc[item.id] = item
  return acc
}, {} as Record<WineMacroCategoryId, WineMenuItem>)

export function getWineMenuItemById(id: WineMacroCategoryId): WineMenuItem {
  return wineMenuItemsById[id]
}

export function isWineMacroCategoryId(value: string): value is WineMacroCategoryId {
  return value in wineMenuItemsById
}

export function findWineMenuItemByType(wineType?: string | null): WineMenuItem | null {
  const normalized = (wineType ?? '').toLowerCase().trim()
  if (!normalized) {
    return null
  }

  for (const item of WINE_MENU_ITEMS) {
    if (!item.types) {
      continue
    }
    const match = item.types.some((type) => type.toLowerCase().trim() === normalized)
    if (match) {
      return item
    }
  }

  return null
}
