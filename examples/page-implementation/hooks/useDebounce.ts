"use client";

/**
 * useDebounce - Hook para debounce de valores
 *
 * Útil para inputs de búsqueda donde no quieres
 * hacer una request en cada keystroke.
 *
 * @example
 * const [query, setQuery] = useState("");
 * const debouncedQuery = useDebounce(query, 300);
 *
 * useEffect(() => {
 *   // Solo se ejecuta 300ms después del último cambio
 *   search(debouncedQuery);
 * }, [debouncedQuery]);
 */

import { useState, useEffect } from "react";

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Crear timer
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpiar timer si el valor cambia antes del delay
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

// =============================================================================
// Variante con callback
// =============================================================================

/**
 * useDebouncedCallback - Hook para debounce de funciones
 *
 * @example
 * const debouncedSearch = useDebouncedCallback((query: string) => {
 *   api.search(query);
 * }, 300);
 *
 * <input onChange={(e) => debouncedSearch(e.target.value)} />
 */

import { useCallback, useRef } from "react";

export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );
}

// =============================================================================
// Notas de Implementación
// =============================================================================

/**
 * CUÁNDO USAR:
 *
 * - Búsqueda en tiempo real
 * - Autoguardado de formularios
 * - Resize handlers
 * - Scroll handlers
 *
 * DIFERENCIA CON THROTTLE:
 *
 * - Debounce: Ejecuta después de X ms de inactividad
 * - Throttle: Ejecuta máximo una vez cada X ms
 *
 * Para throttle, considera usar lodash/throttle o crear un hook similar.
 */
