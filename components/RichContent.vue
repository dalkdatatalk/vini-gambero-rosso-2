<template>
  <div v-if="sanitizedHtml" class="rich-content" v-html="sanitizedHtml"></div>
  <p v-else class="rich-content__placeholder">Nessuna descrizione disponibile.</p>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  html: string | null | undefined;
}>();

const allowedTags = new Set(['p', 'strong', 'em', 'ul', 'ol', 'li', 'br', 'a', 'blockquote', 'h2', 'h3']);

const sanitizedHtml = computed(() => {
  if (!props.html) {
    return '';
  }

  const withoutScripts = props.html.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');
  const withoutEvents = withoutScripts.replace(/ on\w+="[^"]*"/gi, '');

  return withoutEvents.replace(/<\/?([a-z0-9-]+)([^>]*)>/gi, (match, tag, attributes) => {
    const tagName = String(tag).toLowerCase();
    if (!allowedTags.has(tagName)) {
      return '';
    }

    if (tagName === 'a') {
      let safeAttrs = attributes || '';
      safeAttrs = safeAttrs.replace(/href="javascript:[^"]*"/gi, '');
      if (!/rel="[^"]*"/i.test(safeAttrs)) {
        safeAttrs += ' rel="noopener noreferrer"';
      }
      if (!/target="[^"]*"/i.test(safeAttrs)) {
        safeAttrs += ' target="_blank"';
      }
      return match.startsWith('</') ? `</${tagName}>` : `<${tagName}${safeAttrs}>`;
    }

    return match.startsWith('</') ? `</${tagName}>` : `<${tagName}${attributes || ''}>`;
  });
});
</script>

<style scoped>
.rich-content {
  font-size: 1.4rem;
  line-height: 1.65;
  color: #374151;
}

.rich-content p {
  margin: 0 0 1em;
}

.rich-content a {
  color: #b45309;
  text-decoration: underline;
}

.rich-content__placeholder {
  color: #6b7280;
  font-size: 0.9rem;
}
</style>
