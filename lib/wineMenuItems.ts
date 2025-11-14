export type WineMenuItem = {
  id: string
  label: string
  href?: string
  to?: string
}

export const wineMenuItems: WineMenuItem[] = [
  {
    id: 'home',
    label: 'Home',
    href: 'https://gambero-rosso---bere-bene.webflow.io/old-home',
  },
  { id: 'bianchi', label: 'Bianchi', to: '/classifica-vini-2026/vini/bianchi' },
  { id: 'rossi', label: 'Rossi', to: '/classifica-vini-2026/vini/rossi' },
  { id: 'bollicine', label: 'Bollicine', to: '/classifica-vini-2026/vini/bollicine' },
  { id: 'rosati', label: 'Rosati', to: '/classifica-vini-2026/vini/rosati' },
  { id: 'vini-dolci', label: 'Vini Dolci', to: '/classifica-vini-2026/vini/vini-dolci' },
  { id: 'tutti', label: 'Tutti', to: '/classifica-vini-2026/vini/tutti' },
]
