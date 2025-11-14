<template>
  <div v-if="isMobile" class="header-mobile">
    <button
      type="button"
      class="burger-menu"
      :aria-expanded="isMenuOpen ? 'true' : 'false'"
      aria-controls="mobile-wine-menu"
      @click="toggleMenu"
    >
      <span class="burger-menu__bar" />
      <span class="burger-menu__bar" />
      <span class="burger-menu__bar" />
    </button>
    <img
      class="logo"
      src="/img/logo-bere-bene-sm.png"
      alt="Berebene logo"
    />

    <Teleport to="body">
      <div
        v-if="isMenuOpen"
        class="mobile-menu-overlay"
        role="dialog"
        aria-modal="true"
      >
        <div class="mobile-menu-content">
          <nav class="mobile-menu-nav" aria-label="Menu principale">
            <ul id="mobile-wine-menu" class="mobile-menu-list">
              <li v-for="item in mobileMenuItems" :key="item.id" class="mobile-menu-item">
                <a
                  v-if="item.href"
                  :href="item.href"
                  class="mobile-menu-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  @click="closeMenu"
                >
                  {{ item.displayLabel }}
                </a>
                <NuxtLink
                  v-else
                  :to="item.to"
                  class="mobile-menu-link"
                  :class="{ active: isActive(item.id) }"
                  :aria-current="isActive(item.id) ? 'page' : undefined"
                  @click="closeMenu"
                >
                  {{ item.displayLabel }}
                </NuxtLink>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useMediaQuery } from '@vueuse/core';
import { useRoute } from '#imports';
import { useWines } from '~/composables/useWines';
import { wineMenuItems, type WineMenuItem } from '~/lib/wineMenuItems';

const isMobile = useMediaQuery('(max-width: 767px)');
const isMenuOpen = ref(false);

const route = useRoute();
const { bySlug, getMacroWineTypes } = useWines();
const MACROS = getMacroWineTypes();

type MobileMenuItem = WineMenuItem & { displayLabel: string };

const mobileMenuOrder: WineMenuItem['id'][] = [
  'home',
  'rossi',
  'bianchi',
  'bollicine',
  'vini-dolci',
  'rosati',
];

const mobileMenuItems = computed<MobileMenuItem[]>(() =>
  mobileMenuOrder
    .map((id) => wineMenuItems.find((item) => item.id === id))
    .filter((item): item is WineMenuItem => Boolean(item))
    .map((item) => ({
      ...item,
      displayLabel: item.id === 'vini-dolci' ? 'Dolci' : item.label,
    })),
);

const activeId = computed(() => {
  const path = route.path || '';
  if (path.startsWith('/classifica-vini-2026/vini/') && !path.includes('/schede/')) {
    const typeParam = String(route.params.type ?? '').toLowerCase().trim();
    if (!typeParam) return isHomePath(path) ? 'home' : null;
    return typeParam;
  }
  if (path.includes('/schede/')) {
    const slug = String(route.params.slug ?? '');
    const wine = bySlug(slug);
    const macroId = macroIdFromWineType(wine?.type ?? null);
    return macroId;
  }
  if (isHomePath(path)) return 'home';
  return null;
});

function macroIdFromWineType(wineType?: string | null): string | null {
  const t = (wineType ?? '').toLowerCase().trim();
  if (!t) return null;
  for (const macro of MACROS) {
    if (!macro.types) continue;
    const match = macro.types.some((x) => (x ?? '').toLowerCase().trim() === t);
    if (match) return macro.id;
  }
  return null;
}

function isHomePath(path: string) {
  return path === '/classifica-vini-2026/vini' || path === '/classifica-vini-2026/vini/';
}

function isActive(id: string) {
  return activeId.value === id;
}

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value;
}

function closeMenu() {
  isMenuOpen.value = false;
}

watch(
  () => route.fullPath,
  () => {
    closeMenu();
  },
);

watch(isMobile, (value) => {
  if (!value) {
    closeMenu();
  }
});
</script>

<style scoped>
.header-mobile {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 64px;
  padding: 0 16px;
  box-sizing: border-box;
}

.burger-menu {
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  padding: 8px;
  background-color: #eee;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.burger-menu:focus-visible {
  outline: 2px solid #333;
  outline-offset: 2px;
}

.burger-menu__bar {
  width: 100%;
  height: 3px;
  background-color: #333;
  border-radius: 2px;
}

.burger-menu__bar + .burger-menu__bar {
  margin-top: 5px;
}

.logo {
  height: 40px;
  object-fit: contain;
}

.mobile-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 32px 16px;
  box-sizing: border-box;
  z-index: 1000;
}

.mobile-menu-content {
  width: min(420px, 100%);
  background-color: #fff;
  border-radius: 16px;
  padding: 32px 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.mobile-menu-nav {
  width: 100%;
}

.mobile-menu-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: stretch;
}

.mobile-menu-link {
  display: block;
  width: 100%;
  text-decoration: none;
  text-align: center;
  padding: 12px 16px;
  font-family: var(--cormorant-garamond);
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--rosso-scuro);
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.8);
  transition: background-color 0.2s ease, color 0.2s ease;
}

.mobile-menu-link:hover,
.mobile-menu-link:focus-visible {
  background-color: var(--rosso-chiaro, #fbe9e9);
  color: var(--rosso, #b00);
  outline: none;
}

.mobile-menu-link.active {
  background-color: var(--rosso, #b00);
  color: #fff;
}
</style>
