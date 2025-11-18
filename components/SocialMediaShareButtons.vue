<template>
  <section class="social-share">
    <!-- <span class="social-share__label">Condividi sui Social</span> -->
    <div class="social-share__buttons" role="group" aria-label="Condivisione sui social">
      <a
        v-for="button in socialButtons"
        :key="button.id"
        :href="button.href"
        target="_blank"
        rel="noopener noreferrer"
        :aria-label="button.ariaLabel"
        class="social-share__button"
      >
        <Icon
          :name="button.icon"
          :class="[
            'social-share__icon',
            { 'social-share__icon--x': button.id === 'x' },
          ]"
          aria-hidden="true"
        />
      </a>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRuntimeConfig } from '#imports';
import type { Wine } from '~/composables/useWines';

type ShareNetwork = 'facebook' | 'x' | 'whatsapp';

interface SocialButtonConfig {
  id: ShareNetwork;
  icon: string;
  ariaLabel: string;
}

const props = defineProps<{ wine: Wine }>();

const route = useRoute();
const runtimeConfig = useRuntimeConfig();

const fullUrl = computed(() => {
  const siteUrl = runtimeConfig.public?.siteUrl ?? '';
  const normalizedSiteUrl = siteUrl.endsWith('/') ? siteUrl.slice(0, -1) : siteUrl;
  return `${normalizedSiteUrl}${route.fullPath}`;
});

const wineTitle = computed(() => {
  const title = props.wine.name?.trim();
  return title && title.length > 0 ? title : 'Vino Berebene';
});

const cantinaName = computed(() => {
  const rawCantina = props.wine.wineryName ?? props.wine.relatedLocale?.title ?? '';
  const trimmedCantina = rawCantina?.trim();
  return trimmedCantina && trimmedCantina.length > 0
    ? trimmedCantina
    : 'Cantina Berebene';
});

const shareMessage = computed(
  () => `${wineTitle.value} | ${cantinaName.value} | Berebene 2026\n${fullUrl.value}`,
);

const encodedShareMessage = computed(() => encodeURIComponent(shareMessage.value));
const encodedFullUrl = computed(() => encodeURIComponent(fullUrl.value));

const shareLinks = computed<Record<ShareNetwork, string>>(() => ({
  facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedFullUrl.value}&quote=${encodedShareMessage.value}`,
  x: `https://twitter.com/intent/tweet?text=${encodedShareMessage.value}`,
  whatsapp: `https://api.whatsapp.com/send?text=${encodedShareMessage.value}`,
}));

const buttonConfigs: SocialButtonConfig[] = [
  {
    id: 'facebook',
    icon: 'mdi:facebook',
    ariaLabel: 'Condividi su Facebook',
  },
  {
    id: 'x',
    icon: 'simple-icons:x',
    ariaLabel: 'Condividi su X',
  },
  {
    id: 'whatsapp',
    icon: 'mdi:whatsapp',
    ariaLabel: 'Condividi su WhatsApp',
  },
];

const socialButtons = computed(() =>
  buttonConfigs.map((button) => ({
    ...button,
    href: shareLinks.value[button.id],
  })),
);
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
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  width: 100%;
}

.social-share__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: var(--rosso-scuro);
  text-decoration: none;
  transition: color 0.2s ease;
}

.social-share__icon {
  width: 1.75rem;
  height: 1.75rem;
  display: inline-flex;
  color: currentColor;
}

.social-share__icon--x {
  width: 1.5rem;
  height: 1.5rem;
}

.social-share__button:hover,
.social-share__button:focus-visible,
.social-share__button:active {
  color: var(--rosso);
}
</style>
