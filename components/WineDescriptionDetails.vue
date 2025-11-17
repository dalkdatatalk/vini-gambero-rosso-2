<template>
  <section class="detail-page__info">
    <div class="detail-page__info-item detail-page__info-item--stacked">
      <span class="detail-page__info-label">Descrizione</span>
      <div class="detail-page__info-value detail-page__info-value--rich">
        <RichContent v-if="wine.content" :html="wine.content" />
        <span v-else>Informazione non disponibile</span>
      </div>
    </div>

    <div
      v-if="wine.thumbnail?.medium"
      class="wine-image-placeholder"
    >
      <img
        :src="wine.thumbnail.full"
        :alt="wine.name"
        class="wine-image"
        loading="lazy"
      />
    </div>

    <div class="detail-page__info-item detail-page__info-item--stacked">
      <span class="detail-page__info-label">Abbinamento</span>
      <div class="detail-page__info-value detail-page__info-value--pairing">
        <span v-if="wine.pairing">{{ wine.pairing }}</span>
        <span v-else>Informazione non disponibile</span>
      </div>
    </div>
    <WineRelatedWines
      v-if="isMobileOrTablet"
      :current-wine="wine"
      :primary-region="decodedPrimaryRegion"
      class="related-wines-section"
    />
    <WineGoBackCta v-if="isMobileOrTablet" :wine="wine" :premio-name="premioName" />
    <div class="box-newsletter">
      <p>
        Degusta con noi! Iscriviti per ricevere<br />
        aggiornamenti e suggerimenti selezionati.
      </p>
      <a
        href="https://www.gamberorosso.it/"
        target="_blank"
        rel="noopener"
      >
        Iscriviti alla newsletter
      </a>
    </div>
    <SocialMediaShareButtons :title="wine.name" />
  </section>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue';
import { useMediaQuery } from '@vueuse/core';
import type { Wine } from '~/composables/useWines';
import SocialMediaShareButtons from '~/components/SocialMediaShareButtons.vue';
import WineRelatedWines from '~/components/WineRelatedWines.vue';
import WineGoBackCta from '~/components/WineGoBackCta.vue';

const props = defineProps<{
  wine: Wine;
  primaryRegion?: string | null;
  premioName?: string;
}>();

const { wine, primaryRegion, premioName } = toRefs(props);

const isMobileOrTablet = useMediaQuery('(max-width: 1279px)');

const decodedPrimaryRegion = computed(() => primaryRegion.value ?? null);
</script>

<style scoped>
.detail-page__info{
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.detail-page__info-item{
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.detail-page__info-label{
  font-family: var(--cormorant-garamond);
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--rosso-scuro);
}

.detail-page__info-value, .rich-content{
  font-family: var(--cormorant-garamond);
  color: var(--rosso-scuro);
}

.detail-page__info-value--pairing {
  font-size: 1.4rem;
}

.box-newsletter {
  display: flex;
  flex-direction: column;
  align-items: center;
  border-top: 1px solid var(--rosso);
  border-bottom: 1px solid var(--rosso);
  padding: 2rem 0;
  text-align: center;
}

.box-newsletter p {
  margin: 0 0 0.5rem;
  font-family: var(--cormorant-garamond);
  color: var(--rosso);
  font-weight: 600;
  font-size: 1.4rem;
  line-height: 1.4rem;
  padding: 1rem 0;
}

.box-newsletter a {
  color: var(--rosso-scuro);
  font-weight: 600;
  text-decoration: none;
  border: 1px solid var(--rosso);
  padding: 14px;
  border-radius: 10px;
}

.box-newsletter a:hover{
  background-color: var(--rosso);
  color: var(--bianco);
}

.wine-image-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1.5rem;
}

.wine-image {
  max-width: 200px;
  width: 100%;
  height: auto;
  object-fit: contain;
  border-radius: 4px;
}
</style>
