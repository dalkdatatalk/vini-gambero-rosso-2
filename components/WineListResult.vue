<template>
  <article :class="['wine-card', { 'wine-card--featured': wine.score && wine.score >= 95 }]"><!-- featured style applied for high scores -->
    <NuxtLink :to="detailLink" class="wine-card__link">
      <div class="wine-card__content">
        <div class="wine-card__info">

          <div v-if="premioLabel" class="wine-card__award">
            {{ premioLabel }}
          </div>
          <h3 class="wine-card__name">{{ safeWineName }}</h3>
          <p class="wine-card__region">{{ regionLabel }}</p>
          <p v-if="wineType" class="wine-card__type">{{ wineType }}</p>
          <p v-if="wineDenominazione" class="wine-card__denominazione">{{ wineDenominazione }}</p>
          <p v-if="wine.price" class="wine-card__price">€{{ wine.price }}</p>
        </div>

        <div class="wine-card__score">
          <p class="wine-card__score-label">Punteggio</p>
          <div class="score-inline">
            <p class="wine-card__score-value">{{ wine.score ?? 'N/D' }}</p>
            <span class="wine-card__arrow" aria-hidden="true">
              <svg viewBox="0 0 47 18" fill="none" role="presentation">
                <path
                  d="M36.0352 0C38.1999 2.36003 40.0716 4.15853 41.6504 5.39551C43.2292 6.61621 44.7184 7.52767 46.1182 8.12988V9.22852C44.5068 10.0098 42.9443 11.0107 41.4307 12.2314C39.917 13.4359 38.1104 15.21 36.0107 17.5537H34.1309C35.6608 14.2822 37.264 11.7676 38.9404 10.0098H0V7.54395H38.9404C37.7035 5.98145 36.8408 4.81771 36.3525 4.05273C35.8643 3.27148 35.14 1.92057 34.1797 0H36.0352Z"
                  fill="currentColor"
                />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </NuxtLink>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useHtmlEntities } from '~/composables/useHtmlEntities';
import { usePremioCleaner } from '~/composables/usePremioCleaner';
import rawWines from '~/data/wines.json';
import type { Wine } from '~/composables/useWines';

type Premio = { name?: string };
type RawWineWithPremi = { slug?: string; premi?: Premio[] };

const props = defineProps<{
  wine: Wine;
}>();

const { decodeHtml } = useHtmlEntities();
const { parsePremioName } = usePremioCleaner();

const detailLink = computed(() => `/classifica-vini-2026/vini/schede/${props.wine.slug}`);

const safeWineName = computed(() => decodeHtml(props.wine.name ?? ''));

const regionLabel = computed(() => {
  const region = props.wine.region;
  return region ? decodeHtml(region) : 'Regione non disponibile';
});

const wineType = computed(() => {
  const type = props.wine.type;
  return type ? decodeHtml(type) : '';
});

const wineDenominazione = computed(() => {
  const denominazione = props.wine.denominazione;
  return denominazione ? decodeHtml(denominazione) : '';
});

const matchedRaw = computed(() => {
  const slugValue = (props.wine?.slug ?? '').toLowerCase();
  return (rawWines as RawWineWithPremi[]).find(
    (item) => (item.slug ?? '').toLowerCase() === slugValue
  );
});

const premioNameRaw = computed(() => matchedRaw.value?.premi?.[0]?.name ?? '');

const premioLabel = computed(() => parsePremioName(premioNameRaw.value));
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Funnel+Sans:wght@400;600&display=swap');

.wine-card {
  position: relative;
  width: 100%;
  overflow: hidden;
  transition: background-color 0.3s ease;
  border-bottom: 1px solid var(--rosso);
}

.wine-card:first-child{
  border-top: 1px solid var(--rosso);
}

.wine-card:hover {
  background-color: var(--rosso);
}

.wine-card:hover .wine-card__name,
.wine-card:hover .wine-card__region,
.wine-card:hover .wine-card__type,
.wine-card:hover .wine-card__denominazione,
.wine-card:hover .wine-card__score-label,
.wine-card:hover .wine-card__score-value,
.wine-card:hover .wine-card__arrow,
.wine-card:hover .wine-card__award{
  color: var(--bianco);
}

.wine-card:hover .wine-card__arrow svg {
  fill: var(--bianco);
}

.wine-card--featured {
  background-color: #f6f6f6;
}

.wine-card--featured:hover {
  background-color: #efefef;
}

.wine-card__link {
  display: block;
  color: inherit;
  text-decoration: none;
  padding: 2rem 24px;
}

.wine-card__content {
  position: relative;
  display: flex;
  align-items: stretch;
  gap: 32px;
  justify-content: space-between;
}

.wine-card__info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  max-width: 65%;
}

.wine-card__badge {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 700;
  font-size: 1.5rem;
  color: #ca1f1e;
  letter-spacing: -0.04em;
  margin: 0;
}

.wine-card__name {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 600;
  font-size: clamp(2.5rem, 3vw, 3.2rem);
  color: #290005;
  letter-spacing: -0.03em;
  margin: 0;
  line-height: 1.1;
}

.wine-card__award {
  color: var(--rosso);
  font-family: var(--cormorant-garamond);
  font-weight: 600;
  font-size: 1.4rem;
}

.wine-card__region {
  font-family: 'Funnel Sans', sans-serif;
  font-weight: 600;
  font-style: italic;
  font-size: 1.25rem;
  color: #ca1f1e;
  letter-spacing: -0.02em;
  margin: 0;
}

.wine-card__type,
.wine-card__denominazione,
.wine-card__price {
  font-family: 'Funnel Sans', sans-serif;
  font-weight: 400;
  font-size: 1.25rem;
  color: #290005;
  letter-spacing: -0.02em;
  margin: 0;
  text-transform: capitalize;
}

.wine-card__score {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  min-width: 180px;
}

.wine-card__score-label {
  font-family: 'Funnel Sans', sans-serif;
  font-size: 1rem;
  color: #290005;
  margin: 0;
}

.score-inline{
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  gap: 1rem;
}

.wine-card__score-value {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 600;
  font-size: clamp(5rem, 4vw, 6rem);
  color: #290005;
  letter-spacing: -0.05em;
  line-height: 0.9;
  margin: 0;
}

.wine-card__arrow {
  display: inline-flex;
  width: 46px;
  height: 18px;
  transition: transform 0.3s ease;
}

.wine-card__link:hover .wine-card__arrow {
  transform: translateX(6px);
}

.wine-card__arrow svg {
  display: block;
  width: 100%;
  height: 100%;
}

.wine-card__divider {
  margin-top: 32px;
  height: 1px;
  background: rgba(202, 31, 30, 0.5);
}

@media (max-width: 768px) {
  .wine-card__link {
    padding: 24px;
  }

  .wine-card__content {
    flex-direction: column;
    gap: 24px;
  }

  .wine-card__info {
    max-width: 100%;
  }

  .wine-card__score {
    align-items: flex-start;
  }

  .wine-card__score-value {
    text-align: left;
  }
}
</style>
