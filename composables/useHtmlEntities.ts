import { decode } from 'html-entities';

// Funziona sia in SSR che in client
export function useHtmlEntities() {
  const decodeHtml = (input?: string | null) =>
    input ? decode(String(input), { level: 'all' }) : '';

  return { decodeHtml };
}
