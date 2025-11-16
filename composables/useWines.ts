import { useState } from '#imports';
import rawWines from '~/data/wines.json';
import { slugify } from '~/utils/slugify';

const MACRO_WINE_TYPES = [
  { id: 'bianchi', label: 'Bianchi', types: ['bianco', 'bianco macerato/orange wine', 'bianco liquoroso'] },
  { id: 'rossi', label: 'Rossi', types: ['rosso'] },
  { id: 'bollicine', label: 'Bollicine', types: ['spumante bianco', 'spumante rosato', 'spumante rosso', 'spumante dolce bianco'] },
  { id: 'rosati', label: 'Rosati', types: ['rose'] },
  { id: 'vini-dolci', label: 'Vini dolci', types: ['dolce bianco', 'dolce rosso'] },
  { id: 'tutti', label: 'Tutti', types: ['bianco', 'bianco macerato/orange wine', 'bianco liquoroso','rosso','spumante bianco', 'spumante rosato', 'spumante rosso', 'spumante dolce bianco','rose','dolce bianco', 'dolce rosso'] },
];

type TaxonomyItem = {
  id: number;
  name: string;
};

type RelatedLocale = {
  title?: string;
  regioni?: TaxonomyItem[];
  website?: string;
  [key: string]: unknown;
};

type RawGrape = {
  vitigno?: string;
  nome?: string;
  name?: string;
  percentuale?: string | number | null;
  percentage?: string | number | null;
  value?: string | number | null;
};

type RawWine = {
  id: number;
  slug?: string;
  title: string;
  link: string;
  status: string;
  modified: string;
  guide?: TaxonomyItem[];
  regioni?: TaxonomyItem[];
  prodotti_tipologia?: TaxonomyItem[];
  prodotti_fascia_di_prezzo?: TaxonomyItem[];
  vino_categoria?: TaxonomyItem[];
  vino_bicchieri?: TaxonomyItem[];
  prodotti_denominazione_vino?: TaxonomyItem[];
  tag_abbinamento?: TaxonomyItem[] | null;
  anno?: string | number | null;
  vino_centesimi?: string | number | null;
  alcol?: string | null;
  prezzo?: string | number | null;
  numero_bottiglie?: string | number | null;
  vitigni?: RawGrape[] | null;
  vino_vitigni?: RawGrape[] | null;
  prodotti_vitigni?: RawGrape[] | null;
  abbinamento?: string | null;
  vino_abbinamento?: string | null;
  content?: string | null;
  related_locale?: RelatedLocale | null;
  thumbnail?: {
    full?: string | null;
    medium?: string | null;
    thumbnail?: string | null;
  } | null;
};

export interface GrapeComposition {
  name: string;
  percentage: number | null;
}

export interface Wine {
  id: number;
  slug: string;
  name: string;
  type: string | null;
  region: string | null;
  year: number | null;
  score: number | null;
  denominazione: string | null;
  content: string | null;
  price: number | null;
  priceRange: string | null;
  bottles: number | null;
  grapes: GrapeComposition[];
  pairing: string | null;
  pairingTags: string[];
  relatedLocale: RelatedLocale | null;
  thumbnail: {
    full: string | null;
    medium: string | null;
    thumbnail: string | null;
  } | null;
}

function toNumber(value: string | number | null | undefined): number | null {
  if (value === null || value === undefined) {
    return null;
  }

  const parsed = typeof value === 'number' ? value : Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function safeText(value: string | undefined | null): string | null {
  if (!value) {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function firstName(items?: TaxonomyItem[]): string | null {
  if (!items || items.length === 0) {
    return null;
  }
  return safeText(items[0]?.name) ?? null;
}

function parseGrapes(raw?: RawGrape[] | null): GrapeComposition[] {
  if (!raw || raw.length === 0) {
    return [];
  }

  return raw
    .map((item) => {
      const label = safeText(item.vitigno ?? item.nome ?? item.name ?? undefined);
      if (!label) {
        return null;
      }

      const percentageValue = item.percentuale ?? item.percentage ?? item.value;
      const percentage = toNumber(percentageValue ?? null);

      return { name: label, percentage } satisfies GrapeComposition;
    })
    .filter((item): item is GrapeComposition => item !== null);
}

function parsePairingTags(items?: TaxonomyItem[] | null): string[] {
  if (!items || items.length === 0) {
    return [];
  }

  const values = new Set<string>();
  for (const item of items) {
    const label = safeText(item?.name ?? null);
    if (label) {
      values.add(label);
    }
  }

  return Array.from(values);
}

function parseThumbnail(
  raw?: { full?: string | null; medium?: string | null; thumbnail?: string | null } | null
) {
  if (!raw) return null;

  const full = safeText(raw.full ?? null);
  const medium = safeText(raw.medium ?? null);
  const thumb = safeText(raw.thumbnail ?? null);

  if (!full && !medium && !thumb) return null;

  return {
    full,
    medium,
    thumbnail: thumb,
  };
}

export function normalizeWine(raw: RawWine): Wine {
  const name = safeText(raw.title) ?? 'Senza nome';
  const slug = safeText(raw.slug) ?? slugify(name);

  const rawGrapes = raw.vitigni ?? raw.vino_vitigni ?? raw.prodotti_vitigni ?? null;
  const pairingText = safeText(raw.abbinamento ?? raw.vino_abbinamento ?? null);
  const pairingTags = parsePairingTags(raw.tag_abbinamento ?? null);

  return {
    id: raw.id,
    slug,
    name,
    type: firstName(raw.vino_categoria),
    region: firstName(raw.regioni),
    year: toNumber(raw.anno),
    score: toNumber(raw.vino_centesimi),
    denominazione: firstName(raw.prodotti_denominazione_vino),
    content: safeText(raw.content) ?? null,
    price: toNumber(raw.prezzo),
    priceRange: firstName(raw.prodotti_fascia_di_prezzo),
    bottles: toNumber(raw.numero_bottiglie),
    grapes: parseGrapes(rawGrapes),
    pairing: pairingText,
    pairingTags,
    relatedLocale: raw.related_locale ?? null,
    thumbnail: parseThumbnail(raw.thumbnail),
  };
}

export function normalizeSlugParamForLookup(
  slugParam: string | string[] | undefined
): string {
  const rawValue = Array.isArray(slugParam) ? slugParam[0] ?? '' : slugParam ?? '';
  const normalized = rawValue.trim().toLowerCase();
  if (!normalized) {
    return '';
  }
  return encodeURIComponent(normalized).toLowerCase();
}

const normalizedWines: Wine[] = (rawWines as RawWine[]).map(normalizeWine);

export function useWines() {
  const wines = useState<Wine[]>('wines', () => normalizedWines);

  function search(query: string): Wine[] {
    const term = query?.trim().toLowerCase();

    if (!term) {
      return wines.value;
    }

    return wines.value.filter((wine) => {
      const haystack = [wine.name, wine.region, wine.type, wine.price]
        .filter((value): value is string => Boolean(value))
        .map((value) => value.toLowerCase());

      return haystack.some((value) => value.includes(term));
    });
  }

  function byType(typeParam: string): Wine[] {
    const typeSlug = slugify(typeParam);

    return wines.value.filter((wine) => {
      if (!wine.type) {
        return false;
      }
      return slugify(wine.type) === typeSlug;
    });
  }

  function bySlug(slugParam: string | string[] | undefined): Wine | undefined {
    const encodedSlug = normalizeSlugParamForLookup(slugParam);
    if (!encodedSlug) {
      return undefined;
    }
    return wines.value.find((wine) => wine.slug.trim().toLowerCase() === encodedSlug);
  }

  function getMacroWineTypes() {
    return MACRO_WINE_TYPES;
  }

  function filterByMacroType(macroId: string): Wine[] {
    const normalizedId = macroId.trim().toLowerCase();
    const macro = MACRO_WINE_TYPES.find((item) => item.id === normalizedId);
    if (!macro) {
      return [];
    }
    if (!macro.types) {
      return wines.value;
    }
    const allowed = macro.types.map((type) => type.toLowerCase().trim());
    return wines.value.filter((wine) => {
      const wineType = (wine.type ?? '').toLowerCase().trim();
      return allowed.includes(wineType);
    });
  }

  return {
    wines,
    search,
    byType,
    bySlug,
    getMacroWineTypes,
    filterByMacroType,
  };
}
