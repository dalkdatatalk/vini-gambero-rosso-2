export interface NavItem {
  id: string // 'home', 'vini-premiati', 'rossi', 'bianchi', 'bollicine', ...
  label: string
  to: string
  order: number
}

export const NAV_ITEMS: NavItem[] = [
  {
    id: 'home',
    label: 'Home',
    to: '/classifica-vini-2026/vini/tutti',
    order: 0,
  },
  {
    id: 'vini-premiati',
    label: 'Vini premiati',
    to: '/classifica-vini-2026/premi/tutti',
    order: 1,
  },
  {
    id: 'rossi',
    label: 'Rossi',
    to: '/classifica-vini-2026/vini/rossi',
    order: 2,
  },
  {
    id: 'bianchi',
    label: 'Bianchi',
    to: '/classifica-vini-2026/vini/bianchi',
    order: 3,
  },
  {
    id: 'bollicine',
    label: 'Bollicine',
    to: '/classifica-vini-2026/vini/bollicine',
    order: 4,
  },
  {
    id: 'rosati',
    label: 'Rosati',
    to: '/classifica-vini-2026/vini/rosati',
    order: 5,
  },
  {
    id: 'vini-dolci',
    label: 'Dolci',
    to: '/classifica-vini-2026/vini/vini-dolci',
    order: 6,
  },
  // aggiungi qui eventuali altre categorie già presenti nel progetto
]
