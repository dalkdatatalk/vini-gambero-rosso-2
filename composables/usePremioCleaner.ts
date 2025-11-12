type PremioParsed = { nome?: string; anno?: string; label: string };

export function usePremioCleaner() {
  function parsePremio(raw?: string): PremioParsed {
    const safe = (raw ?? '').trim();

    if (!safe) {
      return { label: '' };
    }

    const parts = safe.split(';').map((part) => part.trim());
    const nome = parts[0] && parts[0].length > 0 ? parts[0] : undefined;
    const annoCandidate = parts[2];
    const anno = annoCandidate && /^\d{4}$/.test(annoCandidate) ? annoCandidate : undefined;

    const labelParts: string[] = [];
    if (nome) {
      labelParts.push(nome);
    }
    if (anno) {
      labelParts.push(anno);
    }

    const label = labelParts.join(' ');

    return { nome, anno, label };
  }

  return { parsePremio };
}
