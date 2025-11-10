<template>
  <transition name="scroll-top-fade">
    <button
      v-if="isVisible"
      type="button"
      class="scroll-top-button"
      @click="scrollToTop"
    >
      <slot>Torna all'inizio</slot>
    </button>
  </transition>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

const props = withDefaults(
  defineProps<{
    threshold?: number;
  }>(),
  {
    threshold: 200,
  }
);

const isVisible = ref(false);

function updateVisibility() {
  isVisible.value = window.scrollY > props.threshold;
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

onMounted(() => {
  updateVisibility();
  window.addEventListener('scroll', updateVisibility, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', updateVisibility);
});
</script>

<style scoped>
.scroll-top-button {
  position: fixed;
  bottom: 32px;
  right: 24px;
  padding: 12px 20px;
  border: none;
  border-radius: 999px;
  background-color: #b21f24;
  color: #ffffff;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  z-index: 10;
}

.scroll-top-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.2);
}

.scroll-top-fade-enter-active,
.scroll-top-fade-leave-active {
  transition: opacity 0.2s ease;
}

.scroll-top-fade-enter-from,
.scroll-top-fade-leave-to {
  opacity: 0;
}
</style>
