<template>
  <section class="social-share">
    <span class="social-share__label">Condividi sui Social</span>
    <div class="social-share__buttons" role="group" aria-label="Condivisione sui social">
      <a
        :href="links.facebook"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Condividi su Facebook"
        class="social-share__button"
      >
        <FacebookIcon class="social-share__icon" />
      </a>
      <a
        :href="links.x"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Condividi su X"
        class="social-share__button"
      >
        <XIcon class="social-share__icon" />
      </a>
      <a
        :href="links.whatsapp"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Condividi su WhatsApp"
        class="social-share__button"
      >
        <WhatsappIcon class="social-share__icon" />
      </a>
      <!--
      <a
        :href="links.linkedin"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Condividi su LinkedIn"
        class="social-share__button"
      >
        LinkedIn
      </a>
      -->
    </div>
  </section>
</template>

<script setup lang="ts">
import { toRef } from 'vue';
import { useShareLinks } from '~/composables/useShareLinks';
import FacebookIcon from '~/assets/icons/facebook.svg';
import XIcon from '~/assets/icons/x.svg';
import WhatsappIcon from '~/assets/icons/whatsapp.svg';

const props = defineProps<{
  title?: string;
}>();

const title = toRef(props, 'title');

const { links } = useShareLinks({ title });
</script>

<style scoped>
.social-share {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.social-share__label {
  font-weight: 600;
  font-family: var(--cormorant-garamond);
  color: var(--rosso-scuro);
}

.social-share__buttons {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.social-share__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  border: 1px solid var(--rosso-scuro);
  border-radius: 999px;
  color: var(--rosso-scuro);
  text-decoration: none;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.social-share__button:hover,
.social-share__button:focus-visible {
  background-color: var(--rosso-scuro);
  color: #fff;
}

.social-share__icon {
  width: 1.25rem;
  height: 1.25rem;
  fill: currentColor;
  display: block;
}
</style>
