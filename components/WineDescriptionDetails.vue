<template>
  <section class="detail-page__info">
    <div class="detail-page__info-item detail-page__info-item--stacked">
      <span class="detail-page__info-label">Descrizione</span>
      <div class="detail-page__info-value detail-page__info-value--rich">
        <RichContent v-if="wine.content" :html="wine.content" />
        <span v-else>Informazione non disponibile</span>
      </div>
    </div>

    <div class="wine-image-placeholder" style="display: flex; flex-direction: column; align-items: center;">
      <img src="/img/placeholder-img-vino.png" alt="Immagine del vino" style="max-width: 200px;" />
    </div>

    <div class="detail-page__info-item detail-page__info-item--stacked">
      <span class="detail-page__info-label">Abbinamento</span>
      <div class="detail-page__info-value">
        <span v-if="wine.pairing">{{ wine.pairing }}</span>
        <span v-else>Informazione non disponibile</span>
      </div>
    </div>
    <SocialMediaShareButtons :title="wine.name" />
  </section>
</template>

<script setup lang="ts">
import type { Wine } from '~/composables/useWines';
import SocialMediaShareButtons from '~/components/SocialMediaShareButtons.vue';

defineProps<{
  wine: Wine;
}>();
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
  font-size: 1.7rem;
  color: var(--rosso-scuro);
}
</style>