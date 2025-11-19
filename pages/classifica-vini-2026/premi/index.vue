<template>
  <HeaderMobile v-if="isMobile || isTablet" />
  <HeaderGeneral v-else />

  <main class="page">
    <section class="page__header">
      <h1>I vini premiati selezionati da Berebene 2026</h1>
      <p>
        Una selezione dedicata alle etichette che hanno ricevuto almeno un riconoscimento all'interno
        della guida Berebene 2026.
      </p>
    </section>

    <WineList :wines="awardedWines" empty-message="Non sono presenti vini premiati." />
  </main>

  <ScrollToTopButton />
  <Footer />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useHead } from '#imports';
import HeaderGeneral from '~/components/HeaderGeneral.vue';
import HeaderMobile from '~/components/HeaderMobile.vue';
import Footer from '~/components/Footer.vue';
import { useBreakpoints } from '~/composables/useBreakpoints';
import { usePremioCleaner } from '~/composables/usePremioCleaner';
import { useWines } from '~/composables/useWines';
import type { Wine } from '~/composables/useWines';
import rawWines from '~/data/wines.json';

const { isMobile, isTablet } = useBreakpoints();

const wineTools = useWines();
const { wines } = wineTools;

const { parsePremio } = usePremioCleaner();

type RawWineWithPremi = {
  slug?: string;
  premi?: Array<{ name?: string }>;
};

const awardSlugMap = computed(() => {
  const map = new Map<string, string>();

  (rawWines as RawWineWithPremi[]).forEach((wine) => {
    const slug = (wine.slug ?? '').toLowerCase();
    if (!slug) return;

    const premioName = wine.premi?.[0]?.name ?? '';
    const { label } = parsePremio(premioName);

    if (label) {
      map.set(slug, label);
    }
  });

  return map;
});

const awardedWines = computed<Wine[]>(() => {
  const filtered = wines.value.filter((wine) => {
    const slug = (wine.slug ?? '').toLowerCase();
    return slug && awardSlugMap.value.has(slug);
  });

  return [...filtered].sort((a, b) => {
    const scoreA = a.score ?? 0;
    const scoreB = b.score ?? 0;

    if (scoreA !== scoreB) {
      return scoreB - scoreA;
    }

    return a.name.localeCompare(b.name);
  });
});

const canonicalUrl = 'https://berebene.gamberorosso.it/classifica-vini-2026/premi/';

useHead(() => ({
  title: 'Berebene 2026 | Vini premiati',
  meta: [
    {
      name: 'description',
      content:
        'Scopri i vini premiati selezionati da Berebene 2026: etichette con riconoscimenti e premi speciali della guida.',
    },
  ],
  link: [
    {
      rel: 'canonical',
      href: canonicalUrl,
    },
  ],
}));
</script>

<style scoped>
.page {
  margin: 0 auto;
  max-width: 1080px;
  padding: 48px 24px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

@media (max-width: 1279px) {
  .page {
    padding-top: 112px;
  }
}

.page__header {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.page__header h1 {
  font-size: 2.5rem;
  margin: 0;
  color: #1f2937;
}

.page__header p {
  margin: 0;
  color: #4b5563;
}
</style>
