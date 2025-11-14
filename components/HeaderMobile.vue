<template>
  <div v-if="isMobile" class="header-mobile">
    <div class="burger-placeholder" aria-hidden="true" />
    <img
      class="logo"
      src="/img/logo-bere-bene-sm.png"
      alt="Berebene logo"
    />
  </div>
</template>

<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core';

const isMobile = useMediaQuery('(max-width: 767px)');
</script>

<style scoped>
.header-mobile {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 64px;
  padding: 0 16px;
  box-sizing: border-box;
}

.burger-placeholder {
  width: 40px;
  height: 40px;
  background-color: #eee;
  border-radius: 8px;
}

.logo {
  height: 40px;
  object-fit: contain;
}
</style>
