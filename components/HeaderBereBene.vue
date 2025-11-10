<template>
  <header class="bbb-header">
    <NuxtLink
      to="/classifica-vini-2026/vini/"
      class="bbb-header__logo"
      aria-label="Bere Bene"
    >
      <div class="bbb-header__logo-placeholder" aria-hidden="true"></div>
    </NuxtLink>

    <nav class="bbb-header__nav" aria-label="Sezioni vini">
      <ul class="bbb-header__menu">
        <li v-for="item in items" :key="item.label">
          <NuxtLink
            :to="item.to"
            class="bbb-header__link"
            :class="{ active: isActive(item) }"
            :aria-current="isActive(item) ? 'page' : undefined"
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
      <div class="bbb-header__logo-placeholder" aria-hidden="true"></div>
    </NuxtLink>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from '#imports';

const route = useRoute();

/**
 * Menu:
 * - Home -> /classifica-vini-2026/vini/
 * - Rossi/Bianchi/Bollicine/Dolci/Rosati -> /classifica-vini-2026/vini/<slug>
 */
const items = [
  { label: 'Rossi', to: '/classifica-vini-2026/vini/rossi', type: 'rossi' },
  { label: 'Bianchi', to: '/classifica-vini-2026/vini/bianchi', type: 'bianchi' },
  { label: 'Bollicine', to: '/classifica-vini-2026/vini/bollicine', type: 'bollicine' },
  { label: 'Dolci', to: '/classifica-vini-2026/vini/vini-dolci', type: 'dolci' },
  { label: 'Rosati', to: '/classifica-vini-2026/vini/rosati', type: 'rosati' },
];

const currentType = computed(() => {
  const raw = route.params.type;
  if (typeof raw === 'string') return raw.toLowerCase();
  if (Array.isArray(raw)) return (raw[0] ?? '').toLowerCase();
  return '';
});

function isHomePath(path: string) {
  // Considera entrambe le varianti con/ senza slash finale
  return path === '/classifica-vini-2026/vini' || path === '/classifica-vini-2026/vini/';
}

function isActive(item: { type: string | null; to: string }) {
  if (item.type === null) {
    // Home attiva solo nella lista principale
    return isHomePath(route.path);
  }
  // Attiva per pagina [type].vue con lo stesso slug
  return currentType.value === item.type;
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
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.08);
}

.bbb-header__nav {
  flex: 1 1 auto;
  display: flex;
  justify-content: center;
}

.bbb-header__menu {
  list-style: none;
  display: flex;
  gap: 20px;
  margin: 0;
  padding: 0;
  flex-wrap: wrap;
}

.bbb-header__link {
  text-decoration: none;
  font-weight: 600;
  line-height: 1;
  padding: 8px 10px;
  border-radius: 6px;
  opacity: 0.85;
  transition: opacity 0.15s ease, background-color 0.15s ease;
}

.bbb-header__link:hover {
  opacity: 1;
  text-decoration: underline;
}

.bbb-header__link.active {
  text-decoration: none;
  background: rgba(0, 0, 0, 0.06);
  opacity: 1;
}
</style>
