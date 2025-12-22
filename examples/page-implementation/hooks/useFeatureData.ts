"use client";

/**
 * useFeatureData - Hook para obtener y actualizar datos de la feature
 *
 * Maneja:
 * - Datos iniciales del servidor
 * - Refetch cuando cambian filtros
 * - Estados de loading/error
 *
 * En el futuro, esto podría usar React Query o SWR.
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";

import { fetchFeatures } from "../actions";
import type { FeatureEntity, FeatureFilters } from "../types";

// =============================================================================
// Types
// =============================================================================

interface UseFeatureDataOptions {
  /** Datos iniciales del servidor */
  initialData: FeatureEntity[];
  /** Filtros iniciales */
  filters?: FeatureFilters;
  /** Refetch automático cuando cambian los searchParams */
  autoRefetch?: boolean;
}

interface UseFeatureDataReturn {
  /** Datos actuales */
  data: FeatureEntity[];
  /** Si está cargando */
  isLoading: boolean;
  /** Error si ocurrió */
  error: Error | null;
  /** Función para refetch manual */
  refetch: () => Promise<void>;
  /** Si es el fetch inicial */
  isInitialLoading: boolean;
}

// =============================================================================
// Hook
// =============================================================================

export function useFeatureData({
  initialData,
  filters,
  autoRefetch = true,
}: UseFeatureDataOptions): UseFeatureDataReturn {
  const searchParams = useSearchParams();
  const [data, setData] = useState<FeatureEntity[]>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const isFirstRender = useRef(true);

  // Refetch function
  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Construir filtros desde searchParams
      const currentFilters: FeatureFilters = {
        query: searchParams.get("query") ?? undefined,
        page: searchParams.get("page")
          ? parseInt(searchParams.get("page")!, 10)
          : undefined,
        sortBy:
          (searchParams.get("sortBy") as FeatureFilters["sortBy"]) ?? undefined,
        pageSize: filters?.pageSize ?? 12,
      };

      const response = await fetchFeatures(currentFilters);
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Error fetching data"));
    } finally {
      setIsLoading(false);
    }
  }, [searchParams, filters?.pageSize]);

  // Auto-refetch cuando cambian los searchParams
  useEffect(() => {
    // Saltar el primer render (ya tenemos initialData)
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (autoRefetch) {
      refetch();
    }
  }, [searchParams, autoRefetch, refetch]);

  return {
    data,
    isLoading,
    error,
    refetch,
    isInitialLoading: isFirstRender.current && isLoading,
  };
}

// =============================================================================
// Notas de Implementación
// =============================================================================

/**
 * PATRÓN DE DATOS:
 *
 * 1. Server Component hace fetch inicial → pasa como initialData
 * 2. Este hook inicia con initialData (sin loading)
 * 3. Cuando cambian los searchParams, hace refetch
 * 4. Durante refetch, isLoading = true pero data sigue mostrándose
 *
 * MIGRACIÓN A REACT QUERY:
 *
 * Este hook se puede reemplazar fácilmente por React Query:
 *
 * const { data, isLoading, refetch } = useQuery({
 *   queryKey: ["features", Object.fromEntries(searchParams)],
 *   queryFn: () => fetchFeatures(filters),
 *   initialData,
 *   staleTime: 60 * 1000, // 1 minuto
 * });
 *
 * OPTIMISTIC UPDATES:
 *
 * Para operaciones como "favorito", usa:
 *
 * const toggleFavorite = (id: string) => {
 *   setData(prev => prev.map(item =>
 *     item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
 *   ));
 *   // Luego sincroniza con el servidor
 * };
 */
