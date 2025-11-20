import { computed } from 'vue';
import { usePremioCleaner } from '~/composables/usePremioCleaner';
import { useWines } from '~/composables/useWines';
import type { Wine } from '~/composables/useWines';
import rawWines from '~/data/wines.json';

type RawWineWithPremi = {
  slug?: string;
  premi?: Array<{ name?: string }>;
};

type AwardInfo = {
  label: string;
  rawName: string;
};

const REGIONAL_PREFIX = 'Premio Qualità/Prezzo Regionale';
const NATIONAL_PREFIX = 'Miglior';

const normalizeSlug = (value?: string): string => (value ?? '').trim().toLowerCase();

export function useAwardedWines() {
  const { wines } = useWines();
  const { parsePremio } = usePremioCleaner();

  const awardBySlug = computed<Map<string, AwardInfo>>(() => {
    const map = new Map<string, AwardInfo>();

    (rawWines as RawWineWithPremi[]).forEach((wine) => {
      const slug = normalizeSlug(wine.slug);
      if (!slug) return;

      const premioName = (wine.premi?.[0]?.name ?? '').trim();
      if (!premioName) return;

      const { label } = parsePremio(premioName);
      const resolvedLabel = label || premioName;

      map.set(slug, { label: resolvedLabel, rawName: premioName });
    });

    return map;
  });

  const awardedWines = computed<Wine[]>(() => {
    const filtered = wines.value.filter((wine) => {
      const slug = normalizeSlug(wine.slug);
      return slug && awardBySlug.value.has(slug);
    });

    return [...filtered].sort((a, b) => {
      const scoreA = a.score ?? 0;
      const scoreB = b.score ?? 0;

      if (scoreA !== scoreB) {
        return scoreB - scoreA;
      }

      return a.name.localeCompare(b.name);
    });
  });

  const isNationalAward = (label: string): boolean => label.trim().startsWith(NATIONAL_PREFIX);
  const isRegionalAward = (label: string): boolean => label.trim().startsWith(REGIONAL_PREFIX);

  const getAwardForSlug = (slug?: string): AwardInfo | undefined => {
    const normalized = normalizeSlug(slug);
    if (!normalized) return undefined;

    return awardBySlug.value.get(normalized);
  };

  return {
    awardBySlug,
    awardedWines,
    getAwardForSlug,
    isNationalAward,
    isRegionalAward,
  };
}
