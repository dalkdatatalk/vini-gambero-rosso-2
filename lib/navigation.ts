import { WINE_MENU_ITEMS } from './wineMenuItems'

export interface NavItem {
  id: string
  label: string
  to: string
  order: number
}

const baseNavItems: NavItem[] = [
  { id: 'home', label: 'Home', to: '/classifica-vini-2026/vini/tutti', order: 0 },
  { id: 'vini-premiati', label: 'Vini premiati', to: '/classifica-vini-2026/premi/tutti', order: 1 },
]

const wineNavItems: NavItem[] = WINE_MENU_ITEMS.map((item) => ({
  id: item.id,
  label: item.label,
  to: item.routePath,
  order: item.order + 1,
}))

export const NAV_ITEMS: NavItem[] = [...baseNavItems, ...wineNavItems].sort(
  (a, b) => a.order - b.order,
)
