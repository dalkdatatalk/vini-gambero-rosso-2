<template>
  <div class="wine-single-sponsor flex flex-row items-center gap-3">
    <div class="name-premio-vino">
      {{ label || 'Premio non disponibile' }}
    </div>
    <div class="img-premio-vino" aria-hidden="true">
      <div class="placeholder-icon" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { usePremioCleaner } from '~/composables/usePremioCleaner';

const props = defineProps<{ premioName?: string }>();

const { parsePremio } = usePremioCleaner();
const parsed = computed(() => parsePremio(props.premioName));
const label = computed(() => parsed.value.label);
</script>

<style scoped>
.wine-single-sponsor {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.75rem;
}

.name-premio-vino {
  font-weight: 600;
  font-size: 0.95rem;
}

.img-premio-vino {
  display: flex;
}

.placeholder-icon {
  width: 48px;
  height: 48px;
  background: #eee;
  border-radius: 0.25rem;
}
</style>
