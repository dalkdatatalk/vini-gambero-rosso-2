import type { Wine } from '~/composables/useWines';
import { useWines } from '~/composables/useWines';
import { useHtmlEntities } from '~/composables/useHtmlEntities';

type UseRelatedWineParams = {
  current: Wine;
  primaryRegion: string | null;
  desiredCount?: number;
  seed?: number | string;
};

type UseRelatedWineResult = {
  items: Wine[];
};

function normalizeText(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  return trimmed.toLowerCase();
}

function createSeededRandom(seed?: number | string) {
  if (seed === undefined) {
    return Math.random;
  }

  let state: number;
  if (typeof seed === 'number' && Number.isFinite(seed)) {
    state = seed;
  } else {
    const textSeed = String(seed);
    state = Array.from(textSeed).reduce((acc, char, index) => {
      return acc + char.charCodeAt(0) * (index + 1);
    }, 0);
  }

  if (state === 0) {
    state = 1;
  }

  return () => {
    state = (state * 9301 + 49297) % 233280;
    return state / 233280;
  };
}

function shuffleUnique<T>(items: T[], seed?: number | string): T[] {
  const array = [...items];
  const random = createSeededRandom(seed);

  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

function pickN<T>(items: T[], count: number): T[] {
  if (count <= 0) {
    return [];
  }
  if (items.length <= count) {
    return [...items];
  }
  return items.slice(0, count);
}

function getRegionCandidates(current: Wine, primaryRegion: string | null): string[] {
  const normalizedPrimary = normalizeText(primaryRegion);
  const extraRegions: string[] = [];

  if (current.relatedLocale && Array.isArray((current.relatedLocale as { regioni?: { name?: string }[] }).regioni)) {
    for (const region of (current.relatedLocale as { regioni?: { name?: string | null }[] }).regioni ?? []) {
      const normalizedRegion = normalizeText(region?.name ?? null);
      if (normalizedRegion && normalizedRegion !== normalizedPrimary && !extraRegions.includes(normalizedRegion)) {
        extraRegions.push(normalizedRegion);
      }
    }
  }

  const normalizedWineRegion = normalizeText(current.region);
  if (normalizedWineRegion && normalizedWineRegion !== normalizedPrimary && !extraRegions.includes(normalizedWineRegion)) {
    extraRegions.push(normalizedWineRegion);
  }

  return extraRegions;
}

function matchesType(base: Wine, candidate: Wine): boolean {
  const baseType = normalizeText(base.type);
  const candidateType = normalizeText(candidate.type);

  if (!baseType || !candidateType) {
    return false;
  }

  return baseType === candidateType;
}

function matchesRegion(region: string | null, candidate: Wine): boolean {
  const normalizedRegion = normalizeText(region);
  if (!normalizedRegion) {
    return false;
  }
  return normalizeText(candidate.region) === normalizedRegion;
}

export async function useRelatedWines({
  current,
  primaryRegion,
  desiredCount = 3,
  seed,
}: UseRelatedWineParams): Promise<UseRelatedWineResult> {
  const { wines } = useWines();
  const { decodeHtml } = useHtmlEntities();
  const pool = wines.value.filter((wine) => wine.slug !== current.slug);

  const grouped: Wine[] = [];
  const alreadyAdded = new Set<string>();

  const addCandidates = (items: Wine[]) => {
    for (const wine of items) {
      if (alreadyAdded.has(wine.slug)) {
        continue;
      }
      grouped.push(wine);
      alreadyAdded.add(wine.slug);
    }
  };

  const typeMatches = pool.filter((wine) => matchesType(current, wine));

  if (primaryRegion) {
    const sameRegion = typeMatches.filter((wine) => matchesRegion(primaryRegion, wine));
    addCandidates(shuffleUnique(sameRegion, seed));
  }

  if (grouped.length < desiredCount) {
    const secondaryRegions = getRegionCandidates(current, primaryRegion);
    if (secondaryRegions.length > 0) {
      const secondaryMatches: Wine[] = [];
      for (const region of secondaryRegions) {
        const matches = typeMatches.filter((wine) => normalizeText(wine.region) === region);
        secondaryMatches.push(...matches);
      }
      addCandidates(shuffleUnique(secondaryMatches, seed));
    }
  }

  if (grouped.length < desiredCount) {
    const typeOnly = typeMatches.filter((wine) => !alreadyAdded.has(wine.slug));
    addCandidates(shuffleUnique(typeOnly, seed));
  }

  if (grouped.length < desiredCount) {
    const remaining = pool.filter((wine) => !alreadyAdded.has(wine.slug));
    addCandidates(shuffleUnique(remaining, seed));
  }

  const sanitizedItems = pickN(grouped, desiredCount).map((wine) => {
    const decodedWineryName = decodeHtml(wine.wineryName ?? null).trim();
    return {
      ...wine,
      wineryName: decodedWineryName.length > 0 ? decodedWineryName : wine.wineryName,
    } satisfies Wine;
  });

  return { items: sanitizedItems };
}
