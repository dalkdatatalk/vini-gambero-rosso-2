// composables/useHtmlEntities.ts
import { decode } from 'html-entities'

export function useHtmlEntities() {
  const decodeHtml = (input?: string | null) =>
    input ? decode(String(input), { level: 'all' }) : ''
  return { decodeHtml }
}
