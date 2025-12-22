/**
 * Search Slice - Estado de búsqueda
 *
 * Maneja:
 * - Query de búsqueda
 * - Filtros (géneros, instrumentos, ubicación)
 * - Resultados
 */

import type { StateCreator } from "zustand";
import type { StoreState, SearchSlice, SearchState, SearchFilters } from "../types";
import { logger } from "@lib/logger";

const initialState: SearchState = {
  query: "",
  filters: {},
  results: {
    musicians: [],
    bands: [],
    venues: [],
  },
  isSearching: false,
  hasSearched: false,
};

export const createSearchSlice: StateCreator<
  StoreState,
  [["zustand/immer", never], ["zustand/devtools", never]],
  [],
  SearchSlice
> = (set, get) => ({
  ...initialState,

  setQuery: (query: string) => {
    set((state) => {
      state.search.query = query;
    });
  },

  setFilters: (filters: Partial<SearchFilters>) => {
    set((state) => {
      state.search.filters = { ...state.search.filters, ...filters };
    });
  },

  clearFilters: () => {
    set((state) => {
      state.search.filters = {};
    });
  },

  search: async () => {
    const { query, filters } = get().search;

    set((state) => {
      state.search.isSearching = true;
    });

    try {
      const params = new URLSearchParams();

      if (query) params.set("q", query);
      if (filters.genres?.length) params.set("genres", filters.genres.join(","));
      if (filters.instruments?.length) params.set("instruments", filters.instruments.join(","));
      if (filters.location?.city) params.set("city", filters.location.city);
      if (filters.availability !== undefined) params.set("available", String(filters.availability));

      const response = await fetch(`/api/search?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const data = await response.json();

      set((state) => {
        state.search.results = {
          musicians: data.musicians || [],
          bands: data.bands || [],
          venues: data.venues || [],
        };
        state.search.isSearching = false;
        state.search.hasSearched = true;
      });

      logger.debug("Search completed", {
        query,
        resultsCount: data.musicians?.length + data.bands?.length + data.venues?.length
      });
    } catch (error) {
      set((state) => {
        state.search.isSearching = false;
        state.search.hasSearched = true;
      });

      logger.error("Search failed", error instanceof Error ? error : undefined, { query });
      throw error;
    }
  },

  clearResults: () => {
    set((state) => {
      state.search.results = {
        musicians: [],
        bands: [],
        venues: [],
      };
      state.search.hasSearched = false;
    });
  },
});
