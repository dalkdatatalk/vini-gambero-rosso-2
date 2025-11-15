import { useState } from '#imports';

type WineListContext = {
  route: string;
  macroId: string | null;
};

type ListContextInput = {
  route: string;
  macroId?: string | null;
};

export function useWineListNavigation() {
  const lastListContext = useState<WineListContext | null>('wine-list-context', () => null);
  const scrollPositions = useState<Record<string, number>>('wine-list-scroll-positions', () => ({}));

  function normalizeRoute(route: string | undefined | null): string | null {
    if (!route) {
      return null;
    }
    const trimmed = route.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  function setListContext(context: ListContextInput) {
    const route = normalizeRoute(context.route);
    if (!route) {
      return;
    }
    lastListContext.value = {
      route,
      macroId: context.macroId ?? null,
    };
  }

  function saveScrollPosition(route: string, scrollY: number) {
    const normalizedRoute = normalizeRoute(route);
    if (!normalizedRoute || Number.isNaN(scrollY)) {
      return;
    }
    scrollPositions.value = {
      ...scrollPositions.value,
      [normalizedRoute]: Math.max(0, scrollY),
    };
  }

  function getScrollPosition(route: string) {
    const normalizedRoute = normalizeRoute(route);
    if (!normalizedRoute) {
      return 0;
    }
    return scrollPositions.value[normalizedRoute] ?? 0;
  }

  function restoreScrollPosition(route: string) {
    if (!process.client || typeof window === 'undefined') {
      return;
    }
    const target = getScrollPosition(route);
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: target, behavior: 'auto' });
    });
  }

  return {
    lastListContext,
    setListContext,
    saveScrollPosition,
    getScrollPosition,
    restoreScrollPosition,
  };
}
