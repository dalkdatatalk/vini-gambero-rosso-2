<template>
  <div class="header-general">
    <div class="header-general__logo">
      <img src="/img/logo-gambero-rosso-sm.png" alt="Gambero Rosso" />
    </div>
    <div class="header-general__logo">
      <img src="/img/logo-bere-bene-sm.png" alt="Berebene" />
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.header-general {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  padding: 4rem;
}

.header-general__logo img {
  display: block;
  max-width: 100%;
  height: auto;
}
</style>
