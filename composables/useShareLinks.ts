import { computed, toValue, type MaybeRefOrGetter } from 'vue';
import { useRequestURL, useRuntimeConfig } from '#imports';

interface ShareLinks {
  facebook: string;
  x: string;
  whatsapp: string;
  linkedin: string;
}

interface UseShareLinksOptions {
  title?: MaybeRefOrGetter<string | undefined>;
  urlOverride?: MaybeRefOrGetter<string | undefined>;
}

export function useShareLinks(options: UseShareLinksOptions = {}) {
  const requestUrl = useRequestURL();
  const runtimeConfig = useRuntimeConfig();
  const siteUrl = runtimeConfig?.public?.siteUrl as string | undefined;

  const baseUrl = computed(() => {
    const pathWithQuery = `${requestUrl.pathname}${requestUrl.search}`;
    const origin = requestUrl.origin;

    if (origin && origin.startsWith('http')) {
      return `${origin}${pathWithQuery}`;
    }

    if (process.client && typeof window !== 'undefined' && window.location.href) {
      return window.location.href;
    }

    if (siteUrl) {
      const normalizedSite = siteUrl.endsWith('/') ? siteUrl.slice(0, -1) : siteUrl;
      return `${normalizedSite}${pathWithQuery}`;
    }

    return pathWithQuery;
  });

  const resolvedOverride = computed(() => {
    const override = toValue(options.urlOverride);
    const trimmed = override?.trim();
    return trimmed && trimmed.length > 0 ? trimmed : undefined;
  });

  const resolvedTitle = computed(() => {
    const provided = toValue(options.title);
    const trimmed = provided?.trim();
    return trimmed && trimmed.length > 0 ? trimmed : undefined;
  });

  const url = computed(() => resolvedOverride.value ?? baseUrl.value);

  const text = computed(() => resolvedTitle.value ?? 'Dai un\u2019occhiata a questo contenuto');

  const encode = (value: string) => encodeURIComponent(value);

  const links = computed<ShareLinks>(() => {
    const shareUrl = url.value;
    const shareText = text.value;
    const textWithUrl = shareText ? `${shareText} ${shareUrl}`.trim() : shareUrl;

    return {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encode(shareUrl)}`,
      x: `https://twitter.com/intent/tweet?url=${encode(shareUrl)}&text=${encode(shareText)}`,
      whatsapp: `https://api.whatsapp.com/send?text=${encode(textWithUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encode(shareUrl)}`,
    };
  });

  return {
    url,
    text,
    links,
  };
}
