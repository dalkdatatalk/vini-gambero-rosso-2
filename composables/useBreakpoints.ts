import { computed } from 'vue';
import { useBreakpoints as useVueUseBreakpoints } from '@vueuse/core';

export type BreakpointName = 'mobile' | 'tablet' | 'desktop' | 'desktopLarge';

const BREAKPOINTS = {
  mobile: 0,
  tablet: 768,
  desktop: 1280,
  desktopLarge: 1920,
} as const;

const breakpoints = useVueUseBreakpoints(BREAKPOINTS);

export function useBreakpoints() {
  const isMobile = breakpoints.smaller('tablet');
  const isTablet = breakpoints.between('tablet', 'desktop');
  const isDesktop = breakpoints.between('desktop', 'desktopLarge');
  const isDesktopLarge = breakpoints.greaterOrEqual('desktopLarge');

  const currentBreakpoint = computed<BreakpointName>(() => {
    if (isDesktopLarge.value) {
      return 'desktopLarge';
    }

    if (isDesktop.value) {
      return 'desktop';
    }

    if (isTablet.value) {
      return 'tablet';
    }

    return 'mobile';
  });

  return {
    isMobile,
    isTablet,
    isDesktop,
    isDesktopLarge,
    currentBreakpoint,
  };
}
