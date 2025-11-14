<template>
  <div
    v-if="isMobile"
    :class="['header-mobile', { 'header-mobile--open': isMenuOpen }]"
  >
    <div class="header-mobile__bar">
      <button
        type="button"
        :class="['burger-menu', { 'burger-menu--open': isMenuOpen }]"
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
    </div>

    <div
      v-if="isMenuOpen"
      id="mobile-wine-menu"
      class="header-mobile__menu"
    >
      <nav class="mobile-menu-nav" aria-label="Menu principale">
        <ul class="mobile-menu-list">
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
  position: relative;
  width: 100%;
  background-color: #fff;
  box-sizing: border-box;
  z-index: 20;
}

.header-mobile--open {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  z-index: 1000;
}

.header-mobile__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  padding: 0 16px;
  box-sizing: border-box;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
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
  transition: background-color 0.2s ease;
}

.burger-menu:focus-visible {
  outline: 2px solid #333;
  outline-offset: 2px;
}

.burger-menu--open {
  background-color: #ddd;
}

.burger-menu__bar {
  display: block;
  width: 100%;
  height: 3px;
  background-color: #333;
  border-radius: 2px;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.burger-menu__bar + .burger-menu__bar {
  margin-top: 5px;
}

.burger-menu--open .burger-menu__bar:nth-child(1) {
  transform: translateY(8px) rotate(45deg);
}

.burger-menu--open .burger-menu__bar:nth-child(2) {
  opacity: 0;
}

.burger-menu--open .burger-menu__bar:nth-child(3) {
  transform: translateY(-8px) rotate(-45deg);
}

.logo {
  height: 40px;
  object-fit: contain;
}

.header-mobile__menu {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 32px 24px;
  overflow-y: auto;
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
}

.mobile-menu-link {
  display: block;
  padding: 14px 16px;
  text-decoration: none;
  font-family: var(--cormorant-garamond);
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--rosso-scuro);
  border-radius: 8px;
  background-color: rgba(243, 243, 243, 1);
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
