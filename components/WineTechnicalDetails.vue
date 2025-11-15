<template>
  <section class="detail-page__info">
    <div class="detail-page__info-item cantina">
      <span class="detail-page__info-value">
        <template v-if="decodedWineryName">
          <template v-if="wineryLink">
            <!-- <a :href="wineryLink" target="_blank" rel="noopener noreferrer">{{ decodedWineryName }}</a> -->
            {{ decodedWineryName }}
          </template>
          <template v-else>{{ decodedWineryName }}</template>
        </template>
        <template v-else>Informazione non disponibile</template>
      </span>
    </div>

    <div class="region-price">
      <div class="detail-page__info-item regione">
        <span class="detail-page__info-value">
          {{ decodedPrimaryRegion ?? 'Informazione non disponibile' }}
        </span>
      </div>

      <div class="detail-page__info-item punteggio">
        <span class="detail-page__info-label">Punteggio</span>
        <span class="detail-page__info-value">
          {{ decodedScore ?? 'Informazione non disponibile' }}
        </span>
      </div>
    </div>

    <div class="detail-page__info-item">
      <span class="detail-page__info-label">Tipologia</span>
      <span class="detail-page__info-value">
        {{ decodedWineType ?? 'Informazione non disponibile' }}
      </span>
    </div>

    <div class="detail-page__info-item">
      <span class="detail-page__info-label">Vitigni</span>
      <span class="detail-page__info-value">
        <template v-if="decodedGrapesList?.length">
          <span v-for="(grape, index) in decodedGrapesList" :key="`${grape}-${index}`">
            {{ grape }}<span v-if="index < decodedGrapesList.length - 1">, </span>
          </span>
        </template>
        <template v-else>Informazioni non disponibili</template>
      </span>
    </div>

    <div class="detail-page__info-item">
      <span class="detail-page__info-label">Annata</span>
      <span class="detail-page__info-value">
        {{ wine.year ?? 'Informazione non disponibile' }}
      </span>
    </div>

    <div class="detail-page__info-item">
      <span class="detail-page__info-label">Denominazione</span>
      <span class="detail-page__info-value">
        {{ decodedDenominazione ?? 'Informazione non disponibile' }}
      </span>
    </div>

    <div class="detail-page__info-item">
      <span class="detail-page__info-label">Bottiglie prodotte</span>
      <span class="detail-page__info-value">
        {{ decodedFormattedBottles ?? 'Informazione non disponibile' }}
      </span>
    </div>

    <div class="detail-page__info-item">
      <span class="detail-page__info-label">Prezzo</span>
      <span class="detail-page__info-value">
        {{ decodedFormattedPrice ?? 'Informazione non disponibile' }}
      </span>
    </div>

    <WineRelatedWines
      v-if="isDesktop"
      :current-wine="wine"
      :primary-region="decodedPrimaryRegion"
      class="related-wines-section"
    />
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useMediaQuery } from '@vueuse/core';
import type { Wine } from '~/composables/useWines';
import WineRelatedWines from '~/components/WineRelatedWines.vue';
import { useHtmlEntities } from '~/composables/useHtmlEntities';

const props = defineProps<{
  wine: Wine;
  wineryName: string | null;
  wineryLink: string | null;
  primaryRegion: string | null;
  formattedScore: string | null;
  grapesList: string[] | null;
  formattedBottles: string | null;
  formattedPrice: string | null;
}>();

const { decodeHtml } = useHtmlEntities();

const isDesktop = useMediaQuery('(min-width: 1280px)');

const decodeOptional = (value?: string | null) => {
  const decoded = decodeHtml(value ?? null);
  const normalized = decoded.trim();
  return normalized.length > 0 ? normalized : null;
};

const decodedWineryName = computed(() => decodeOptional(props.wineryName));
const decodedPrimaryRegion = computed(() => decodeOptional(props.primaryRegion));
const decodedScore = computed(() => decodeOptional(props.formattedScore));
const decodedWineType = computed(() => decodeOptional(props.wine.type));
const decodedGrapesList = computed(() => {
  if (!props.grapesList || props.grapesList.length === 0) {
    return null;
  }

  const decoded = props.grapesList
    .map((grape) => decodeOptional(grape))
    .filter((value): value is string => Boolean(value));

  return decoded.length > 0 ? decoded : null;
});
const decodedDenominazione = computed(() => decodeOptional(props.wine.denominazione));
const decodedFormattedBottles = computed(() => decodeOptional(props.formattedBottles));
const decodedFormattedPrice = computed(() => decodeOptional(props.formattedPrice));
</script>

<style scoped>
h3 {
  font-family: var(--cormorant-garamond);
  font-size: 1.4rem;
}

.detail-page__info {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  width: 100%;
  box-sizing: border-box;
}

.cantina .detail-page__info-value {
  font-family: var(--cormorant-garamond);
  font-size: 1.2rem;
  font-weight: 500;
  color: var(--rosso-scuro);
}

.cantina .detail-page__info-value a {
  color: var(--rosso-scuro);
}

.region-price {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1.25rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--rosso);
}

.detail-page__info-item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
}

.detail-page__info-item.regione {
  display: flex;
  flex-direction: column;
}

.detail-page__info-item.regione .detail-page__info-label {
  color: var(--rosso-scuro);
  font-family: var(--funnel-sans);
  font-weight: 300;
  font-size: 1.1rem;
}

.detail-page__info-item.regione .detail-page__info-value {
  color: var(--rosso);
  font-family: var(--cormorant-garamond);
  font-weight: 300;
  font-size: 1.2rem;
}

.detail-page__info-item.punteggio {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.punteggio .detail-page__info-label {
  color: var(--rosso-scuro);
  font-family: var(--funnel-sans);
  font-size: 0.95rem;
}

.punteggio .detail-page__info-value {
  color: var(--rosso-scuro);
  font-family: var(--cormorant-garamond);
  font-size: 3rem;
  font-weight: 600;
}

.detail-page__info-label {
  color: var(--rosso);
  font-family: var(--funnel-sans);
  font-size: 1rem;
}

.detail-page__info-value {
  color: var(--rosso-scuro);
  font-family: var(--funnel-sans);
  font-size: 1rem;
  text-transform: capitalize;
  text-align: right;
  word-break: break-word;
}

@media (min-width: 768px) {
  .detail-page__info {
    gap: 1.25rem;
  }

  .region-price {
    gap: 1.5rem;
    padding-bottom: 2rem;
    align-items: flex-start;
  }

  .detail-page__info-item.regione .detail-page__info-label {
    font-size: 1.3rem;
  }

  .detail-page__info-item.regione .detail-page__info-value {
    font-size: 2.4rem;
  }

  .punteggio .detail-page__info-label {
    font-size: 1rem;
  }

  .punteggio .detail-page__info-value {
    font-size: 3.8rem;
  }

  .detail-page__info-label {
    font-size: 1.1rem;
  }

  .detail-page__info-value {
    font-size: 1.1rem;
    text-align: left;
  }
}

@media (min-width: 1280px) {
  .detail-page__info {
    gap: 1.5rem;
  }

  .region-price {
    gap: 2rem;
    align-items: flex-end;
  }

  .cantina .detail-page__info-value {
    font-size: 1.5rem;
  }

  .detail-page__info-item.regione .detail-page__info-label {
    font-size: 1.5rem;
  }

  .detail-page__info-item.regione .detail-page__info-value {
    font-size: 3rem;
  }

  .punteggio .detail-page__info-label {
    font-size: 1.1rem;
  }

  .punteggio .detail-page__info-value {
    font-size: 5rem;
  }

  .detail-page__info-value {
    text-align: right;
  }
}

@media (min-width: 1920px) {
  .detail-page__info {
    gap: 1.75rem;
  }

  .detail-page__info-item.regione .detail-page__info-value {
    font-size: 3.2rem;
  }

  .punteggio .detail-page__info-value {
    font-size: 5.2rem;
  }
}
</style>
