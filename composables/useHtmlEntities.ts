// composables/useHtmlEntities.ts
import { decode } from 'html-entities'

export function useHtmlEntities() {
  const decodeHtml = (input?: string | null) =>
    input ? decode(String(input), { level: 'all' }) : ''

  const normalizeEntityString = (input?: string | null) => {
    const decoded = decodeHtml(input)
    const trimmed = decoded.trim()
    return trimmed.length > 0 ? trimmed : ''
  }

  return { decodeHtml, normalizeEntityString }
}
