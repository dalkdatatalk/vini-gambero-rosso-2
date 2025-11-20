<template>
  <header
    class="bbb-header"
    :class="{ 'is-scrolled': isScrolled }"
    :style="cssVars"
  >
    <div class="bbb-header__inner">
      <div class="bbb-header__logo-wrapper bbb-logo--left">
        <NuxtLink
          v-if="isWineDetailPage"
          :to="macroCategoriaLink"
          class="detail-page__back"
          aria-label="Ritorna indietro"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
            class="detail-page__back-icon"
          >
            <path d="M4.5 12h15" />
            <path d="M10.5 6l-6 6 6 6" />
          </svg>
        </NuxtLink>
        <NuxtLink
          v-else
          :to="homeLink"
          class="detail-page__back"
          aria-label="Ritorna indietro"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
            class="detail-page__back-icon"
          >
            <path d="M4.5 12h15" />
            <path d="M10.5 6l-6 6 6 6" />
          </svg>
        </NuxtLink>
        <NuxtLink
          to="/classifica-vini-2026/vini/"
          class="bbb-header__logo"
          aria-label="Bere Bene"
        >
          <img
            src="/img/logo-bere-bene-sm.png"
            alt="Bere Bene"
            class="bbb-header__logo-image"
          />
        </NuxtLink>
      </div>

      <div class="bbb-header__center">
        <slot>
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
        </slot>
      </div>

      <div class="bbb-header__logo-wrapper bbb-logo--right">
        <NuxtLink
          to="/classifica-vini-2026/vini/"
          class="bbb-header__logo"
          aria-label="Gambero Rosso"
        >
          <img
            src="/img/logo-gambero-rosso-sm.png"
            alt="Gambero Rosso"
            class="bbb-header__logo-image"
          />
        </NuxtLink>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from '#imports'
import { useWines } from '~/composables/useWines'
import { NAV_ITEMS } from '~/lib/navigation'
import { findWineMenuItemByType } from '~/lib/wineMenuItems'

const props = withDefaults(
  defineProps<{
    scrollThreshold?: number
    logoMaxWidth?: string
    logoMaxHeight?: string
  }>(),
  {
    scrollThreshold: 48,
    logoMaxWidth: 'clamp(80px, 16vw, 180px)',
    logoMaxHeight: '48px',
  },
)

const route = useRoute()
const { bySlug } = useWines()

// Reactive scroll state toggles background when passing the threshold
const isScrolled = ref(false)

const cssVars = computed(() => ({
  '--logo-max-width': props.logoMaxWidth,
  '--logo-max-height': props.logoMaxHeight,
}))

const items = NAV_ITEMS

const slugParam = computed(() => {
  const raw = route.params.slug
  if (Array.isArray(raw)) {
    return typeof raw[0] === 'string' ? raw[0] : null
  }
  return typeof raw === 'string' ? raw : null
})

const isWineDetailPage = computed(() => Boolean(slugParam.value))

const currentWine = computed(() => {
  const slug = slugParam.value
  if (!slug) return null
  return bySlug(slug) ?? null
})

const macroCategoria = computed(() => {
  const wine = currentWine.value
  if (!wine?.type) return null
  return findWineMenuItemByType(wine.type)
})

const macroCategoriaLink = computed(() => {
  if (!macroCategoria.value) {
    return '/classifica-vini-2026/vini/tutti'
  }
  return macroCategoria.value.routePath
})

const homeLink = computed(() => items.find((item) => item.id === 'home')?.to ?? '/')

const activeId = computed(() => {
  const metaNavId = route.meta?.navId
  if (typeof metaNavId === 'string' && metaNavId.trim().length > 0) {
    return metaNavId
  }
  return null
})

function isActive(id: string) {
  return activeId.value === id
}

let ticking = false

const updateScrollState = () => {
  if (typeof window === 'undefined') return
  const offset = window.scrollY || window.pageYOffset || 0
  const shouldBeScrolled = offset > props.scrollThreshold
  if (isScrolled.value !== shouldBeScrolled) {
    isScrolled.value = shouldBeScrolled
  }
}

const handleScroll = () => {
  if (typeof window === 'undefined') return
  if (!ticking) {
    ticking = true
    window.requestAnimationFrame(() => {
      updateScrollState()
      ticking = false
    })
  }
}

onMounted(() => {
  if (typeof window === 'undefined') return
  updateScrollState()
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onBeforeUnmount(() => {
  if (typeof window === 'undefined') return
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.bbb-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: min(100vw, 100%);
  z-index: 50;
  display: flex;
  justify-content: center;
  padding: 12px 16px;
  background-color: transparent;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  backdrop-filter: blur(6px);
  overflow-x: hidden;
  box-sizing: border-box;
}

.bbb-header.is-scrolled {
  background-color: var(--bianco);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
}

.bbb-header__inner {
  width: 100%;
  display: grid;
  grid-template-columns: minmax(0, auto) minmax(0, 1fr) minmax(0, auto);
  align-items: center;
  gap: 12px;
  max-width: 1200px;
  margin: 0 auto;
}

.bbb-header__logo-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  max-width: var(--logo-max-width);
  gap: 12px;
}

.bbb-logo--left {
  justify-content: flex-start;
}

.bbb-header__logo {
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
}

.bbb-header__logo-image {
  width: 100%;
  height: auto;
  max-width: var(--logo-max-width);
  max-height: var(--logo-max-height);
  object-fit: contain;
}

.bbb-header__center {
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 0;
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

@media (min-width: 768px) {
  .bbb-header {
    padding: 12px 24px;
  }

  .bbb-header__inner {
    gap: 16px;
  }
}
</style>
