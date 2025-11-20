<script setup lang="ts">
import { definePageMeta, navigateTo } from '#imports';

definePageMeta({
  navId: 'vini-premiati',
});

await navigateTo('/classifica-vini-2026/premi/tutti', { redirectCode: 301 });
</script>

<template></template>
