import { useState } from '#app';

export type WineFiltersState = {
  query: string;
  region: string | null;
  grape: string | null;
  abbinamento: string | null;
  score: number;
  price: number;
  selectedWinery: string | null;
};

export function useWineFiltersState(listId: string = 'default') {
  const state = useState<WineFiltersState>(`wine-filters-${listId}`, () => ({
    query: '',
    region: null,
    grape: null,
    abbinamento: null,
    score: 0,
    price: 0,
    selectedWinery: null,
  }));

  return {
    state,
  };
}
