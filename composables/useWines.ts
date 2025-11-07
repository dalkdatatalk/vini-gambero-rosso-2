import { useState } from '#imports';
import rawWines from '~/data/wines.json';
import { slugify } from '~/utils/slugify';

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
  anno?: string | number | null;
  vino_centesimi?: string | number | null;
  alcol?: string | null;
  prezzo?: string | number | null;
  numero_bottiglie?: string | number | null;
  content?: string | null;
  related_locale?: RelatedLocale | null;
};

export interface Wine {
  id: number;
  slug: string;
  name: string;
  type: string | null;
  categories: string[];
  region: string | null;
  year: number | null;
  score: number | null;
  denominazione: string | null;
  content: string | null;
  relatedLocale: RelatedLocale | null;
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

function normalizeCategories(items?: TaxonomyItem[]): string[] {
  if (!items || items.length === 0) {
    return [];
  }

  const names = items
    .map((item) => safeText(item?.name))
    .filter((name): name is string => Boolean(name));

  return Array.from(new Set(names));
}

export function normalizeWine(raw: RawWine): Wine {
  const name = safeText(raw.title) ?? 'Senza nome';
  const slug = safeText(raw.slug) ?? slugify(name);
  const categories = normalizeCategories(raw.vino_categoria);

  return {
    id: raw.id,
    slug,
    name,
    type: categories[0] ?? null,
    categories,
    region: firstName(raw.regioni),
    year: toNumber(raw.anno),
    score: toNumber(raw.vino_centesimi),
    denominazione: firstName(raw.prodotti_denominazione_vino),
    content: safeText(raw.content) ?? null,
    relatedLocale: raw.related_locale ?? null,
  };
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
      const haystack = [wine.name, wine.region, wine.type, ...wine.categories]
        .filter((value): value is string => Boolean(value))
        .map((value) => value.toLowerCase());

      return haystack.some((value) => value.includes(term));
    });
  }

  function byType(typeParam: string): Wine[] {
    const typeSlug = slugify(typeParam);

    if (!typeSlug) {
      return [];
    }

    return wines.value.filter((wine) => {
      if (!wine.categories.length) {
        return false;
      }

      return wine.categories.some((category) => slugify(category) === typeSlug);
    });
  }

  function bySlug(slugParam: string): Wine | undefined {
    const slugValue = slugParam.trim().toLowerCase();
    return wines.value.find((wine) => wine.slug.toLowerCase() === slugValue);
  }

  return {
    wines,
    search,
    byType,
    bySlug,
  };
}
