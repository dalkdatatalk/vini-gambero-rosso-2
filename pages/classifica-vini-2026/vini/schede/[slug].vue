<template>
  <HeaderMobile v-if="isMobile || isTablet" />
  <HeaderGeneral v-else />
  <main class="detail-page">
    <div class="wine-info-page">
      <section class="detail-page__content">
        <div class="wine-details-container">
          <div class="wine-column technical">
            <header class="detail-page__header">
              <WineSingleSponsor v-if="premioName" :premio-name="premioName" />
              <div class="wine-header-row">
                <NuxtLink :to="backToCategoryHref" class="wine-back-button" aria-label="Torna alla lista dei vini">
                  <Icon name="ph:arrow-left" class="wine-back-button__icon" />
                </NuxtLink>
                <h1 class="name-wine">{{ wine.name }}</h1>
              </div>
            </header>
            <WineTechnicalDetails
              :wine="wine"
              :winery-name="wineryName"
              :winery-link="wineryLink"
              :primary-region="primaryRegion"
              :formatted-score="formattedScore"
              :grapes-list="grapesList"
              :formatted-bottles="formattedBottles"
              :formatted-price="formattedPrice"
            />
          </div>
          <div class="wine-column description">
            <WineDescriptionDetails :wine="wine" />
          </div>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { createError, useHead, useRoute } from '#imports';
import { useWines } from '~/composables/useWines';
import { useBreakpoints } from '~/composables/useBreakpoints';
import { slugify } from '~/utils/slugify';
import { buildWineProductJsonLd } from '~/utils/structuredData';
import HeaderGeneral from '~/components/HeaderGeneral.vue';
import WineSingleSponsor from '~/components/WineSingleSponsor.vue';
import HeaderMobile from '~/components/HeaderMobile.vue';
import rawWines from '~/data/wines.json';
import { useWineListNavigation } from '~/composables/useWineListNavigation';

type RawPremio = { name?: string | null };
type RawWineWithPremi = { slug?: string | null; premi?: RawPremio[] };

const route = useRoute();

const { isMobile, isTablet } = useBreakpoints();

const { bySlug, getMacroWineTypes } = useWines();
const { lastListContext } = useWineListNavigation();

// primo step: potrebbe essere undefined
const rawWine = computed(() => bySlug(String(route.params.slug ?? '')));

// se non esiste, 404
if (!rawWine.value) {
  throw createError({ statusCode: 404, statusMessage: 'Vino non trovato' });
}

// secondo step: da qui in poi è DEFINITO
const wine = computed(() => rawWine.value!);

const macroCategories = getMacroWineTypes();

const macroCategoria = computed(() => {
  const wineType = wine.value.type;
  if (!wineType) {
    return null;
  }

  const normalizedWineType = slugify(wineType);

  return (
    macroCategories.find((category) =>
      category.types.some((type) => slugify(type) === normalizedWineType)
    ) ?? null
  );
});

const fallbackCategoryHref = computed(() => {
  if (!macroCategoria.value) {
    return '/classifica-vini-2026/vini/tutti';
  }

  return `/classifica-vini-2026/vini/${macroCategoria.value.id}`;
});

const storedListHref = computed(() => {
  const context = lastListContext.value;
  if (!context?.route) {
    return null;
  }

  if (context.macroId === 'tutti') {
    return context.route;
  }

  const macroId = macroCategoria.value?.id ?? null;
  if (macroId && context.macroId === macroId) {
    return context.route;
  }

  if (!context.macroId) {
    return context.route;
  }

  return null;
});

const backToCategoryHref = computed(() => storedListHref.value ?? fallbackCategoryHref.value);

const premioName = computed(() => {
  const slugValue = wine.value.slug.toLowerCase();
  const match = (rawWines as RawWineWithPremi[]).find(
    (item) => (item.slug ?? '').toLowerCase() === slugValue
  );

  const firstValid = match?.premi?.find(
    (premio) => typeof premio?.name === 'string' && premio.name.trim().length > 0
  );

  return firstValid?.name ?? undefined;
});

const wineryName = computed(() => wine.value.relatedLocale?.title ?? null);
const wineryLink = computed(() => wine.value.relatedLocale?.website ?? null);
const relatedRegion = computed(() => wine.value.relatedLocale?.regioni?.[0]?.name ?? null);
const primaryRegion = computed(() => wine.value.region ?? relatedRegion.value ?? null);

const formattedScore = computed(() => {
  if (typeof wine.value.score === 'number') {
    return wine.value.score.toString();
  }
  return null;
});

const formattedBottles = computed(() => {
  if (typeof wine.value.bottles !== 'number') {
    return null;
  }

  return new Intl.NumberFormat('it-IT').format(wine.value.bottles);
});

const formattedPrice = computed(() => {
  if (typeof wine.value.price === 'number') {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(wine.value.price);
  }

  if (wine.value.priceRange) {
    return wine.value.priceRange;
  }

  return null;
});

const grapesList = computed(() => {
  if (!wine.value.grapes || wine.value.grapes.length === 0) {
    return null;
  }

  return wine.value.grapes.map((grape) => {
    if (typeof grape.percentage === 'number') {
      return `${grape.name} (${grape.percentage}%)`;
    }
    return grape.name;
  });
});

const canonicalUrl = computed(() => {
  return `https://berebene.gamberorosso.it/classifica-vini-2026/vini/${wine.value.slug}`;
});

const productJsonLd = computed(() =>
  buildWineProductJsonLd({
    wine: wine.value,
    canonicalUrl: canonicalUrl.value,
    wineryName: wineryName.value,
    wineryLink: wineryLink.value,
    primaryRegion: primaryRegion.value,
    macroCategoryLabel: macroCategoria.value?.label ?? null,
    premioName: premioName.value,
    formattedBottles: formattedBottles.value,
  })
);

useHead(() => ({
  title: `${wine.value.name} | Berebene 2026`,
  meta: [
    {
      name: 'description',
      content: `Scopri tutto quello che c’è da sapere sul ${wine.value.name}, un vino selezionato da Gambero Rosso per Berebene 2026.`,
    },
  ],
  link: [
    {
      rel: 'canonical',
      href: canonicalUrl.value,
    },
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify(productJsonLd.value),
    },
  ],
}));
</script>

<style scoped>
.detail-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 2.5rem 1.5rem;
  padding-top: 112px;
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
}

.detail-page__content {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.detail-page__header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.wine-header-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 0.75rem;
  flex-wrap: nowrap;
  width: 100%;
  position: relative;
}

.wine-back-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.35rem;
  color: var(--rosso-scuro);
  text-decoration: none;
  border-radius: 999px;
  transition: color 0.2s ease;
  flex-shrink: 0;
}

.wine-back-button:focus-visible,
.wine-back-button:hover {
  color: var(--rosso);
}

.wine-back-button__icon {
  width: 1.85rem;
  height: 1.85rem;
}

.wine-header-row .name-wine {
  flex: 1 1 auto;
  min-width: 0;
  text-align: left;
}

.detail-page__header h1 {
  margin: 0;
  font-size: 1.2rem;
  line-height: 1.2rem;
  color: var(--rosso-scuro);
  font-family: var(--cormorant-garamond);
  padding-bottom: 1.25rem;
  word-break: break-word;
}

.detail-page__header p {
  margin: 0;
  color: #4b5563;
  font-size: 0.95rem;
}

.wine-info-page {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--rosso);
  border-radius: 5px;
  padding: 1.5rem;
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
  gap: 2rem;
}

.wine-details-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  box-sizing: border-box;
  align-items: flex-start;
  overflow-x: hidden;
}

.wine-column {
  display: flex;
  flex-direction: column;
  min-width: 0;
  width: 100%;
}

.wine-column.technical {
  flex: 1 1 0;
  padding-right: 0;
  padding-bottom: 1.5rem;
  border-right: none;
  border-bottom: 2px solid var(--rosso);
}

.wine-column.description {
  flex: 1 1 0;
  padding-top: 1.5rem;
}

.name-wine {
  text-align: left;
}

@media (min-width: 768px) {
  .detail-page {
    padding: 112px 3rem 4rem;
    gap: 28px;
  }

  .wine-info-page {
    padding: 2rem;
  }

  .detail-page__header {
    gap: 1.5rem;
  }

  .wine-header-row {
    gap: 1rem;
  }

  .wine-back-button {
    padding: 0.35rem;
  }

  .wine-back-button__icon {
    width: 2rem;
    height: 2rem;
  }

  .detail-page__header h1 {
    font-size: 2.75rem;
    line-height: 2.8rem;
    padding-bottom: 1.75rem;
  }

  .detail-page__header p {
    font-size: 1rem;
  }

  .wine-details-container {
    gap: 2rem;
  }

  .wine-column.technical {
    padding-bottom: 2rem;
  }

  .wine-column.description {
    padding-top: 2rem;
  }
}

@media (min-width: 1280px) {
  .detail-page {
    padding: 6rem 6rem;
    gap: 32px;
  }

  .detail-page__header h1 {
    font-size: 3.5rem;
    line-height: 3.4rem;
    padding-bottom: 2rem;
  }

  .wine-info-page {
    padding: 2.5rem 3rem;
  }

  .wine-header-row {
    justify-content: flex-start;
    min-height: 3rem;
  }

  .wine-back-button {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translate(-120%, -50%);
  }

  .wine-details-container {
    flex-direction: row;
    gap: 2rem;
  }

  .wine-column.technical {
    padding-right: 2rem;
    padding-bottom: 0;
    border-right: 2px solid var(--rosso);
    border-bottom: none;
  }

  .wine-column.description {
    padding-top: 0;
  }

  .name-wine {
    text-align: left;
  }
}

@media (min-width: 1920px) {
  .detail-page {
    padding: 7rem 20rem;
  }

  .detail-page__header h1 {
    font-size: 4rem;
    line-height: 3.8rem;
  }
}
</style>
