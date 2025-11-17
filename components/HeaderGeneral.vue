<template>
  <div class="header-general-container">
    <header ref="headerRef" class="header-general">
      <!-- no sponsor -->
      <div class="header-general--no-sponsor" v-if="!showSponsor">
        <div class="header-general__logo">
          <a href="https://www.gamberorosso.it/">
            <img src="/img/logo-gambero-rosso-sm.png" alt="Gambero Rosso" />
          </a>
        </div>
        <div class="header-general__logo">
          <a :href="HOME_NAV_ITEM.href">
            <img src="/img/logo-bere-bene-sm.png" alt="Berebene" />
          </a>
        </div>
      </div>

      <!-- sponsor -->
      <div class="header-general--sponsor" v-else>
        <div class="header-general__logo">
          <a href="https://www.gamberorosso.it/">
            <img src="/img/logo-gambero-rosso-sm.png" alt="Gambero Rosso" />
          </a>
        </div>
        <div class="header-general__logo">
          <a :href="HOME_NAV_ITEM.href">
            <img src="/img/logo-bere-bene-sm.png" alt="Berebene" />
          </a>
        </div>
        <div class="header-general__logo sponsor-area">
          <p>in collaborazione con</p>
          <img src="/img/logo-sponsor.png" alt="Sponsor" />
        </div>
      </div>

      <div class="bbb-header__center">
        <slot>
          <nav class="bbb-header__nav" aria-label="Sezioni vini">
            <ul class="bbb-header__menu">
              <li v-for="item in items" :key="item.id">
                <a
                  v-if="item.href"
                  :href="item.href"
                  class="bbb-header__link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {{ item.label }}
                </a>
                <NuxtLink
                  v-else
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
        </slot>
      </div>
    </header>
    <div class="header-general__spacer" :style="{ height: spacerHeightStyle }" aria-hidden="true"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from '#imports'
import { useWines } from '~/composables/useWines'
import { HOME_NAV_ITEM, WINE_NAVIGATION_ITEMS, findWineMenuItemByType } from '~/lib/wineMenuItems'

const props = defineProps<{
  sponsor?: boolean | string | null
}>()

const showSponsor = computed(() => props.sponsor !== false)

const route = useRoute()
const { bySlug } = useWines()

const items = WINE_NAVIGATION_ITEMS

const headerRef = ref<HTMLElement | null>(null)
const headerHeight = ref(0)

const spacerHeightStyle = computed(() => `${headerHeight.value}px`)

function updateHeaderHeight() {
  headerHeight.value = headerRef.value?.offsetHeight ?? 0
}

let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  updateHeaderHeight()
  if (headerRef.value && typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => updateHeaderHeight())
    resizeObserver.observe(headerRef.value)
  }
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', updateHeaderHeight)
  }
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  resizeObserver = null
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', updateHeaderHeight)
  }
})

const slugParam = computed(() => {
  const raw = route.params.slug
  if (Array.isArray(raw)) {
    return typeof raw[0] === 'string' ? raw[0] : null
  }
  return typeof raw === 'string' ? raw : null
})

function macroIdFromWineType(wineType?: string | null): string | null {
  return findWineMenuItemByType(wineType)?.id ?? null
}

function isHomePath(path: string) {
  return path === '/classifica-vini-2026/vini' || path === '/classifica-vini-2026/vini/'
}

const activeId = computed(() => {
  const path = route.path || ''
  const slug = slugParam.value
  if (path.startsWith('/classifica-vini-2026/vini/') && !slug) {
    const typeParam = String(route.params.type ?? '').toLowerCase().trim()
    if (!typeParam) return isHomePath(path) ? 'home' : null
    return typeParam
  }
  if (slug) {
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
.header-general-container {
  position: relative;
  width: 100%;
}

.header-general {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  box-sizing: border-box;
  padding: 0 24px;
}

.header-general__spacer {
  width: 100%;
  display: block;
  pointer-events: none;
}

.header-general--no-sponsor {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  padding: 1rem 0 0;
}

.header-general__logo img {
  position: relative;
  display: block;
  max-height: 70px;
  height: auto;
}

.header-general__logo img[alt='Gambero Rosso'] {
  max-height: 30px;
}

.header-general__logo img[alt='Berebene'] {
  max-height: 50px;
}

.header-general--sponsor {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  padding: 2rem 0;
}

.sponsor-area {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
}

.bbb-header__center {
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 0;
  padding: 1rem 0;
}

.bbb-header__nav {
  display: flex;
  justify-content: center;
  width: 100%;
}

.bbb-header__menu {
  list-style: none;
  display: flex;
  gap: clamp(1rem, 4vw, 3.5rem);
  margin: 0;
  padding: 0;
  flex-wrap: wrap;
  justify-content: center;
}

.bbb-header__link {
  text-decoration: none;
  font-family: var(--cormorant-garamond);
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--rosso-scuro);
  opacity: 0.5;
  transition: opacity 0.2s ease;
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
