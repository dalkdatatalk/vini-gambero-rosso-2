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
          class="social-share__icon"
          aria-hidden="true"
        />
      </a>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, toRef } from 'vue';
import { useShareLinks } from '~/composables/useShareLinks';

type ShareNetwork = 'facebook' | 'x' | 'whatsapp';

interface SocialButtonConfig {
  id: ShareNetwork;
  icon: string;
  ariaLabel: string;
}

const props = defineProps<{
  title?: string;
}>();

const title = toRef(props, 'title');

const { links } = useShareLinks({ title });

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
    href: links.value[button.id],
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
  justify-content: center;
  gap: 0.75rem;
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

.social-share__button:hover,
.social-share__button:focus-visible,
.social-share__button:active {
  color: var(--rosso);
}
</style>
