<template>
  <div class="header-general">
    <!-- no sponsor -->
    <div class="header-general--no-sponsor" v-if="!showSponsor">
      <div class="header-general__logo">
        <img src="/img/logo-gambero-rosso-sm.png" alt="Gambero Rosso" />
      </div>
      <div class="header-general__logo">
        <img src="/img/logo-bere-bene-sm.png" alt="Berebene" />
      </div>
    </div>

    <!-- sponsor -->
    <div class="header-general--sponsor" v-else>
      <div class="header-general__logo">
        <img src="/img/logo-gambero-rosso-sm.png" alt="Gambero Rosso" />
      </div>
      <div class="header-general__logo">
        <img src="/img/logo-bere-bene-sm.png" alt="Berebene" />
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
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from '#imports'
import { useWines } from '~/composables/useWines'
import { wineMenuItems } from '~/lib/wineMenuItems'

const props = defineProps<{
  sponsor?: boolean | string | null
}>()

const showSponsor = computed(() => props.sponsor !== false)

const route = useRoute()
const { bySlug, getMacroWineTypes } = useWines()
const MACROS = getMacroWineTypes()

const items = wineMenuItems

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
.header-general--no-sponsor {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  padding: 2rem 0;
}

.header-general__logo img {
  position: relative;
  display: block;
  max-height: 70px;
  height: auto;
}

.header-general__logo:first-child img{
  max-height: 40px;
}

.header-general--sponsor{
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  padding: 2rem 0;
}

.sponsor-area{
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
}

</style>
