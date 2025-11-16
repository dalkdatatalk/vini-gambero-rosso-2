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
  padding: 1rem 0;
  border-top: 1px solid var(--rosso);
  border-bottom: 1px solid var(--rosso);
  text-align: center;
  background-color: transparent;
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
  color: var(--rosso);
  text-align: left;
  text-decoration: underline;
  border: none;
  border-radius: 0;
  transition: color 0.2s ease;
}

.wine-cta-premiati__link:focus-visible,
.wine-cta-premiati__link:hover {
  color: var(--rosso);
}
</style>
