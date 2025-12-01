import { useState } from '#app';

export function useLastWineListRoute() {
  return useState<string | null>('last-wine-list-route', () => null);
}
