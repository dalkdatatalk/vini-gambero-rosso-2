<template>
  <section class="wine-type-filters" aria-label="Filtra per tipologia di vino">
    <p class="title">Cerca il tuo vino</p>

    <div class="category-buttons" role="group">
      <button
        v-for="macro in macroTypes"
        :key="macro.id"
        type="button"
        class="btn-category"
        :class="{ active: isActive(macro.id) }"
        :aria-pressed="isActive(macro.id)"
        @click="select(macro.id)"
      >
        <span class="btn-category__label">{{ macro.label }}</span>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useWines } from '~/composables/useWines'

type MacroCategory = {
  id: string
  label: string
  types: string[]
}

type ModelValue = string | MacroCategory | null | undefined

const props = defineProps<{ modelValue?: ModelValue }>()
const emit = defineEmits<{ (e: 'update:modelValue', value: ModelValue): void }>()

const { getMacroWineTypes } = useWines()

const macroTypes = computed<MacroCategory[]>(() => {
  const base = getMacroWineTypes().map<MacroCategory>((item) => ({
    id: item.id,
    label: item.label,
    types: Array.isArray(item.types) ? [...item.types] : []
  }))
  const withoutTutti = base.filter((item) => item.id !== 'tutti')
  return [{ id: 'tutti', label: 'Tutti', types: [] }, ...withoutTutti]
})

const expectsObject = computed(() => {
  const value = props.modelValue
  return value !== null && typeof value === 'object' && !Array.isArray(value)
})

const activeId = computed(() => {
  const value = props.modelValue
  if (!value) {
    return 'tutti'
  }
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase()
    return normalized.length > 0 ? normalized : 'tutti'
  }
  if (typeof value === 'object') {
    const id = value.id?.trim().toLowerCase()
    return id && id.length > 0 ? id : 'tutti'
  }
  return 'tutti'
})

function select(rawId: string) {
  const id = (rawId ?? '').trim().toLowerCase() || 'tutti'
  const macro =
    macroTypes.value.find((item) => item.id === id) ?? ({ id, label: rawId, types: [] } satisfies MacroCategory)

  if (expectsObject.value) {
    emit('update:modelValue', macro)
    return
  }

  emit('update:modelValue', macro.id)
}

function isActive(rawId: string) {
  const id = (rawId ?? '').trim().toLowerCase()
  if (!id) {
    return false
  }
  return id === activeId.value
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Funnel+Sans:wght@400;600&display=swap');

.wine-type-filters {
  position: relative;
  width: 100%;
}

.title {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 400;
  font-style: normal;
  font-size: 3rem;
  color: #ca1f1e;
  letter-spacing: 0;
  line-height: normal;
  white-space: nowrap;
  margin-bottom: 1rem;
  text-align: left;
}

.category-buttons {
  display: flex;
  justify-content: flex-start;
  gap: 14px;
  align-items: center;
  line-height: 0;
}

.btn-category {
  position: relative;
  border: 1px solid #ca1f1e;
  border-radius: 10px;
  display: inline-grid;
  place-items: start;
  flex-shrink: 0;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
}

.btn-category:hover,
.btn-category:focus-visible {
  background-color: var(--rosso);
}

.btn-category:hover .btn-category__label{
  color: var(--bianco);
}

.btn-category:focus-visible .btn-category__label{
  color: var(--bianco);
}

.btn-category.active {
  background-color: var(--rosso);
  border: none;
}

.btn-category.active:hover,
.btn-category.active:focus-visible {
  background-color: #b01b1a;
}

.btn-category__label {
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-family: 'Cormorant Garamond', serif;
  font-weight: 600;
  font-style: italic;
  font-size: 1.5rem;
  color: #ca1f1e;
  text-align: center;
  position: relative;
  padding: 10px 14px;
}

.btn-category.active .btn-category__label {
  color: #f6f6f6;
}
</style>

<style>
/* moved from page components */
.page__filters {
  margin: 0 auto;
  width: min(100%, 720px);
}
</style>
