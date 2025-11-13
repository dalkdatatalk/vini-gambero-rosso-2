<template>
  <div class="header-general">
    <!-- no sponsor -->
    <div class="header-general--no-sponsor">
      <div class="header-general__logo">
        <img src="/img/logo-gambero-rosso-sm.png" alt="Gambero Rosso" />
      </div>
      <div class="header-general__logo">
        <img src="/img/logo-bere-bene-sm.png" alt="Berebene" />
      </div>
    </div>

    <!-- sponsor -->
    <div class="header-general--sponsor">
      <div class="header-general__logo">
        <img src="/img/logo-gambero-rosso-sm.png" alt="Gambero Rosso" />
      </div>
      <div class="header-general__logo">
        <img src="/img/logo-bere-bene-sm.png" alt="Berebene" />
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.header-general--no-sponsor {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  padding: 2rem 0;
}

.header-general__logo img {
  position: relative;
  display: block;
  max-height: 70px;
  height: auto;
}

.header-general__logo:first-child img{
  max-height: 40px;
}

</style>
