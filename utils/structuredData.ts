import type { Wine } from '~/composables/useWines';

export interface BuildWineProductJsonLdOptions {
  wine: Wine;
  canonicalUrl: string;
  wineryName?: string | null;
  wineryLink?: string | null;
  primaryRegion?: string | null;
  macroCategoryLabel?: string | null;
  premioName?: string | undefined;
  formattedBottles?: string | null;
  modifiedAt?: string | null;
}

interface JsonLdOffer {
  '@type': 'Offer';
  price: number;
  priceCurrency: 'EUR';
  url: string;
  availability: 'https://schema.org/InStock';
}

interface JsonLdRating {
  '@type': 'AggregateRating';
  ratingValue: number;
  bestRating: 100;
}

interface JsonLdOrganization {
  '@type': 'Organization';
  name: string;
  url?: string;
}

interface JsonLdPropertyValue {
  '@type': 'PropertyValue';
  name: string;
  value: string;
}

type WineWithOptionalDescription = Wine & {
  description?: string | null;
};

function resolveDescription(wine: WineWithOptionalDescription): string | null {
  const description = wine.description;
  if (typeof description === 'string' && description.trim().length > 0) {
    return description;
  }

  if (typeof wine.content === 'string' && wine.content.trim().length > 0) {
    return wine.content;
  }

  return null;
}

export interface WineProductJsonLd {
  '@context': 'https://schema.org';
  '@type': 'Product';
  '@id': string;
  name: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
  lastReviewed?: string;
  brand?: JsonLdOrganization;
  category?: string;
  productionDate?: string;
  offers?: JsonLdOffer;
  aggregateRating?: JsonLdRating;
  award?: string;
  additionalProperty?: JsonLdPropertyValue[];
}

function buildAdditionalProperties(
  wine: Wine,
  primaryRegion?: string | null,
  formattedBottles?: string | null
): JsonLdPropertyValue[] {
  const properties: JsonLdPropertyValue[] = [];

  if (primaryRegion) {
    properties.push({
      '@type': 'PropertyValue',
      name: 'Regione',
      value: primaryRegion,
    });
  }

  if (wine.type) {
    properties.push({
      '@type': 'PropertyValue',
      name: 'Tipologia',
      value: wine.type,
    });
  }

  if (wine.grapes && wine.grapes.length > 0) {
    const grapeNames = wine.grapes
      .map((grape) => grape.name)
      .filter((name) => Boolean(name))
      .join(', ');

    if (grapeNames) {
      properties.push({
        '@type': 'PropertyValue',
        name: 'Vitigni',
        value: grapeNames,
      });
    }
  }

  const bottleValue =
    typeof wine.bottles === 'number'
      ? String(wine.bottles)
      : formattedBottles ?? null;

  if (bottleValue) {
    properties.push({
      '@type': 'PropertyValue',
      name: 'Numero di bottiglie',
      value: bottleValue,
    });
  }

  return properties;
}

export function buildWineProductJsonLd(
  options: BuildWineProductJsonLdOptions
): WineProductJsonLd {
  const {
    wine,
    canonicalUrl,
    wineryName,
    wineryLink,
    primaryRegion,
    macroCategoryLabel,
    premioName,
    formattedBottles,
    modifiedAt,
  } = options;

  const brand: JsonLdOrganization | undefined = wineryName
    ? {
        '@type': 'Organization',
        name: wineryName,
        ...(wineryLink ? { url: wineryLink } : {}),
      }
    : undefined;

  const offers: JsonLdOffer | undefined =
    typeof wine.price === 'number'
      ? {
          '@type': 'Offer',
          price: wine.price,
          priceCurrency: 'EUR',
          url: canonicalUrl,
          availability: 'https://schema.org/InStock',
        }
      : undefined;

  const aggregateRating: JsonLdRating | undefined =
    typeof wine.score === 'number'
      ? {
          '@type': 'AggregateRating',
          ratingValue: wine.score,
          bestRating: 100,
        }
      : undefined;

  const additionalProperty = buildAdditionalProperties(
    wine,
    primaryRegion,
    formattedBottles ?? null
  );

  const description =
    resolveDescription(wine as WineWithOptionalDescription) ??
    `Scopri tutto quello che c’è da sapere sul ${wine.name}, un vino selezionato da Gambero Rosso per Berebene 2026.`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': canonicalUrl,
    name: wine.name,
    description,
    url: canonicalUrl,
    ...(modifiedAt
      ? { datePublished: modifiedAt, dateModified: modifiedAt, lastReviewed: modifiedAt }
      : {}),
    ...(brand ? { brand } : {}),
    ...(macroCategoryLabel || wine.type
      ? { category: macroCategoryLabel ?? wine.type ?? undefined }
      : {}),
    ...(typeof wine.year === 'number' ? { productionDate: String(wine.year) } : {}),
    ...(offers ? { offers } : {}),
    ...(aggregateRating ? { aggregateRating } : {}),
    ...(premioName ? { award: premioName } : {}),
    ...(additionalProperty.length > 0 ? { additionalProperty } : {}),
  } satisfies WineProductJsonLd;
}

export interface WineListItemInput {
  name: string;
  url: string;
  category?: string | null;
}

export interface BuildWineListJsonLdOptions {
  canonicalUrl: string;
  title: string;
  items: WineListItemInput[];
}

export interface WineListJsonLd {
  '@context': 'https://schema.org';
  '@type': 'ItemList';
  '@id': string;
  name: string;
  url: string;
  itemListOrder: 'https://schema.org/ItemListOrderAscending';
  numberOfItems: number;
  itemListElement: {
    '@type': 'ListItem';
    position: number;
    item: {
      '@type': 'Product';
      '@id': string;
      name: string;
      url: string;
      category?: string;
    };
  }[];
}

export function buildWineListJsonLd(
  options: BuildWineListJsonLdOptions
): WineListJsonLd {
  const { canonicalUrl, title, items } = options;

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': canonicalUrl,
    name: title,
    url: canonicalUrl,
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        '@id': item.url,
        name: item.name,
        url: item.url,
        ...(item.category ? { category: item.category } : {}),
      },
    })),
  };
}

