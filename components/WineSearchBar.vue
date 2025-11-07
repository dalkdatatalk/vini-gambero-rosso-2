<template>
  <div class="search-bar">
    <input
      :value="modelValue"
      :placeholder="resolvedPlaceholder"
      class="search-bar__input"
      type="search"
      @input="onInput"
    />
    <button type="button" class="search-bar__button" @click="clear">Pulisci</button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  modelValue: string;
  placeholder?: string;
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void;
}>();

const resolvedPlaceholder = computed(() => props.placeholder ?? 'Cerca un vino...');

function onInput(event: Event) {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
}

function clear() {
  emit('update:modelValue', '');
}
</script>

<style scoped>
.search-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.search-bar__input {
  flex: 1;
  border: 1px solid #d1d5db;
  border-radius: 999px;
  padding: 10px 16px;
  font-size: 0.95rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.search-bar__input:focus {
  outline: none;
  border-color: #f59e0b;
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.2);
}

.search-bar__button {
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  background-color: #f9fafb;
  padding: 10px 18px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.search-bar__button:hover {
  background-color: #f3f4f6;
}
</style>
