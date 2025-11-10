<template>
  <header class="bbb-header">
    <NuxtLink
      to="/classifica-vini-2026/vini/"
      class="bbb-header__logo"
      aria-label="Bere Bene"
    >
      <div class="bbb-header__logo-placeholder logo-bere-bene" aria-hidden="true"></div>
    </NuxtLink>

    <nav class="bbb-header__nav" aria-label="Sezioni vini">
      <ul class="bbb-header__menu">
        <li v-for="item in items" :key="item.id">
          <NuxtLink
            :to="item.to"
            class="bbb-header__link"
            :class="{ active: isActive(item.id) }"
            :aria-current="isActive(item.id) ? 'page' : undefined"
          >
            {{ item.label }}
          </NuxtLink>
        </li>
      </ul>
    </nav>

    <NuxtLink
      to="/classifica-vini-2026/vini/"
      class="bbb-header__logo"
      aria-label="Gambero Rosso"
    >
      <div class="bbb-header__logo-placeholder logo-gambero-rosso" aria-hidden="true"></div>
    </NuxtLink>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from '#imports'
import { useWines } from '~/composables/useWines'

const route = useRoute()
const { bySlug, getMacroWineTypes } = useWines()
const MACROS = getMacroWineTypes()

const items = [
  { id: 'rossi', label: 'Rossi', to: '/classifica-vini-2026/vini/rossi' },
  { id: 'bianchi', label: 'Bianchi', to: '/classifica-vini-2026/vini/bianchi' },
  { id: 'bollicine', label: 'Bollicine', to: '/classifica-vini-2026/vini/bollicine' },
  { id: 'vini-dolci', label: 'Dolci', to: '/classifica-vini-2026/vini/vini-dolci' },
  { id: 'rosati', label: 'Rosati', to: '/classifica-vini-2026/vini/rosati' }
]

function macroIdFromWineType(wineType?: string | null): string | null {
  const t = (wineType ?? '').toLowerCase().trim()
  if (!t) return null
  for (const macro of MACROS) {
    if (!macro.types) continue
    const match = macro.types.some((x) => (x ?? '').toLowerCase().trim() === t)
    if (match) return macro.id
  }
  return null
}

function isHomePath(path: string) {
  return path === '/classifica-vini-2026/vini' || path === '/classifica-vini-2026/vini/'
}

const activeId = computed(() => {
  const path = route.path || ''
  if (path.startsWith('/classifica-vini-2026/vini/') && !path.includes('/schede/')) {
    const typeParam = String(route.params.type ?? '').toLowerCase().trim()
    if (!typeParam) return isHomePath(path) ? 'home' : null
    return typeParam
  }
  if (path.includes('/schede/')) {
    const slug = String(route.params.slug ?? '')
    const wine = bySlug(slug)
    const macroId = macroIdFromWineType(wine?.type ?? null)
    return macroId
  }
  if (isHomePath(path)) return 'home'
  return null
})

function isActive(id: string) {
  return activeId.value === id
}
</script>

<style scoped>
.bbb-header {
  display: flex;
  align-items: center;
  /* Desktop: in riga */
  flex-direction: row;
  gap: 16px;
  padding: 16px 24px;
  /* Giustifica in base allo spazio disponibile */
  justify-content: space-between;
}

.bbb-header__logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  width: 120px;
  text-decoration: none;
}

.bbb-header__logo-placeholder {
  height: 100%;
  width: 100%;
}

.logo-bere-bene{
  background-image: url('https://raw.githubusercontent.com/dalkdatatalk/vini-gambero-rosso-2/refs/heads/main/public/img/logo-bere-bene-sm.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.logo-gambero-rosso{
  background-image: url('https://raw.githubusercontent.com/dalkdatatalk/vini-gambero-rosso-2/refs/heads/main/public/img/logo-gambero-rosso-sm.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.bbb-header__nav {
  flex: 1 1 auto;
  display: flex;
  justify-content: center;
}

.bbb-header__menu {
  list-style: none;
  display: flex;
  gap: 5rem;
  margin: 0;
  padding: 0;
  flex-wrap: wrap;
}

.bbb-header__link {
  text-decoration: none;
  font-family: var(--cormorant-garamond);
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--rosso-scuro);
  opacity: .5;
}

.bbb-header__link:hover {
  opacity: 1;
}

.bbb-header__link.active {
  text-decoration: underline;
  text-decoration-color: var(--rosso);
  opacity: 1;
}
</style>
