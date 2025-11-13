<template>
  <div class="header-general">
    <!-- no sponsor -->
    <div class="header-general--no-sponsor" v-if="!showSponsor">
      <div class="header-general__logo">
        <img src="/img/logo-gambero-rosso-sm.png" alt="Gambero Rosso" />
      </div>
      <div class="header-general__logo">
        <img src="/img/logo-bere-bene-sm.png" alt="Berebene" />
      </div>
    </div>

    <!-- sponsor -->
    <div class="header-general--sponsor" v-else>
      <div class="header-general__logo">
        <img src="/img/logo-gambero-rosso-sm.png" alt="Gambero Rosso" />
      </div>
      <div class="header-general__logo">
        <img src="/img/logo-bere-bene-sm.png" alt="Berebene" />
      </div>
      <div class="header-general__logo sponsor-area">
        <p>in collaborazione con</p>
        <img src="/img/logo-sponsor.png" alt="Sponsor" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  sponsor?: boolean | string | null
}>()

const showSponsor = computed(() => props.sponsor !== false)
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

.header-general--sponsor{
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  padding: 2rem 0;
}

.sponsor-area{
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
}

</style>
