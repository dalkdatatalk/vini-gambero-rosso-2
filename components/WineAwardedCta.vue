<template>
  <div class="wine-cta-premiati">
    <a href="" class="wine-cta-premiati__link">
      Vedi tutti i vini premiati
    </a>
  </div>
</template>

<style scoped>
.wine-cta-premiati {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem 1.5rem;
  border: 1px solid var(--rosso);
  border-radius: 10px;
  background-color: var(--bianco);
  text-align: center;
}

.wine-cta-premiati__link {
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.5rem;
  padding: 0.85rem 1.5rem;
  font-family: var(--funnel-sans);
  font-weight: 300;
  font-size: 1rem;
  color: var(--rosso-scuro);
  text-align: left;
  text-decoration: none;
  border: 1px solid var(--rosso);
  border-radius: 999px;
  transition: color 0.2s ease, border-color 0.2s ease;
}

.wine-cta-premiati__link:focus-visible,
.wine-cta-premiati__link:hover {
  color: var(--rosso);
  border-color: var(--rosso);
}
</style>
