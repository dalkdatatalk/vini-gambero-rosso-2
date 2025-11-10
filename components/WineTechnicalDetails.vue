<template>
  <section class="detail-page__info">

    <div class="detail-page__info-item cantina">
      <span class="detail-page__info-value">
        <template v-if="wineryName">
          <template v-if="wineryLink">
            <a :href="wineryLink" target="_blank" rel="noopener noreferrer">{{ wineryName }}</a>
          </template>
          <template v-else>{{ wineryName }}</template>
        </template>
        <template v-else>Informazione non disponibile</template>
      </span>
    </div>

    <div class="region-price">
      <div class="detail-page__info-item">
        <span class="detail-page__info-value">{{ primaryRegion ?? 'Informazione non disponibile' }}</span>
      </div>

      <div class="detail-page__info-item punteggio">
        <span class="detail-page__info-label">Punteggio</span>
        <span class="detail-page__info-value">{{ formattedScore ?? 'Informazione non disponibile' }}</span>
      </div>
    </div>
    <div class="detail-page__info-item">
      <span class="detail-page__info-label">Tipologia</span>
      <span class="detail-page__info-value">{{ wine.type ?? 'Informazione non disponibile' }}</span>
    </div>

    <div class="detail-page__info-item">
      <span class="detail-page__info-label">Vitigni</span>
      <span class="detail-page__info-value">
        <template v-if="grapesList?.length">
          <span v-for="(grape, index) in grapesList" :key="`${grape}-${index}`">
            {{ grape }}<span v-if="index < grapesList.length - 1">, </span>
          </span>
        </template>
        <template v-else>Informazioni non disponibili</template>
      </span>
    </div>

    <div class="detail-page__info-item">
      <span class="detail-page__info-label">Annata</span>
      <span class="detail-page__info-value">{{ wine.year ?? 'Informazione non disponibile' }}</span>
    </div>

    <div class="detail-page__info-item">
      <span class="detail-page__info-label">Denominazione</span>
      <span class="detail-page__info-value">{{ wine.denominazione ?? 'Informazione non disponibile' }}</span>
    </div>

    <div class="detail-page__info-item">
      <span class="detail-page__info-label">Bottiglie prodotte</span>
      <span class="detail-page__info-value">{{ formattedBottles ?? 'Informazione non disponibile' }}</span>
    </div>

    <div class="detail-page__info-item">
      <span class="detail-page__info-label">Prezzo</span>
      <span class="detail-page__info-value">{{ formattedPrice ?? 'Informazione non disponibile' }}</span>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Wine } from '~/composables/useWines';

defineProps<{
  wine: Wine;
  wineryName: string | null;
  wineryLink: string | null;
  primaryRegion: string | null;
  formattedScore: string | null;
  grapesList: string[] | null;
  formattedBottles: string | null;
  formattedPrice: string | null;
}>();
</script>

<style scoped>

h3{
  font-family: var(--cormorant-garamond);
  font-size: 1.4rem;
}

.cantina .detail-page__info-value{
  font-family: var(--cormorant-garamond);
  font-size: 2rem;
  font-weight: 500;
  color: var(--rosso-scuro);
}

.detail-page__info{
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.region-price{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--rosso);
}

.detail-page__info-item.punteggio{
  display: flex;
  flex-direction: column;
}

.punteggio .detail-page__info-label{
  color: var(--rosso-scuro);
  font-family: var(--funnel-sans);
}

.punteggio .detail-page__info-value{
  color: var(--rosso-scuro);
  font-family: var(--cormorant-garamond);
  font-size: 5rem;
  font-weight: 600;
}

.detail-page__info-item{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.detail-page__info-label{
  color: var(--rosso);
  font-family: var(--funnel-sans);
  font-size: 1.1rem;
}

.detail-page__info-value{
  color: var(--rosso-scuro);
  font-family: var(--funnel-sans);
  font-size: 1.1rem;
}
</style>
