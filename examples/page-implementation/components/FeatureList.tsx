"use client";

/**
 * FeatureList - Lista de items con estado del cliente
 *
 * Recibe datos iniciales del servidor y puede actualizarlos.
 * Usa Material UI + Tailwind para layout responsivo.
 */

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, Typography, Button } from "@mui/material";
import { Add as AddIcon, Refresh as RefreshIcon } from "@mui/icons-material";

import { FeatureCard, FeatureCardSkeleton } from "./FeatureCard";
import { useFeatureData } from "../hooks/useFeatureData";
import type { FeatureEntity, FeatureListProps } from "../types";

export function FeatureList({ initialData, initialFilters }: FeatureListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Estado local para selección múltiple
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Hook para data fetching reactivo
  const { data, isLoading, refetch } = useFeatureData({
    initialData,
    filters: initialFilters,
  });

  // Handlers
  const handleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleCardClick = useCallback(
    (item: FeatureEntity) => {
      router.push(`/features/${item.id}`);
    },
    [router]
  );

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  // Loading state
  if (isLoading) {
    return <FeatureListSkeleton count={12} />;
  }

  // Empty state
  if (data.length === 0) {
    const hasFilters = searchParams.get("query") || searchParams.get("sortBy");

    return (
      <>
        <Box className="text-center py-16 px-4">
          <Box className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <Typography variant="h2" component="span">
              {hasFilters ? "🔍" : "📭"}
            </Typography>
          </Box>

          <Typography
            variant="h5"
            component="h3"
            className="font-semibold mb-2"
          >
            {hasFilters ? "Sin resultados" : "Todavía no hay items"}
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            className="mb-6 max-w-md mx-auto"
          >
            {hasFilters
              ? "Prueba con otros términos de búsqueda o ajusta los filtros."
              : "Sé el primero en crear uno."}
          </Typography>

          <Box className="flex gap-3 justify-center">
            {hasFilters ? (
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={() => router.push("/features")}
              >
                Limpiar filtros
              </Button>
            ) : (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => router.push("/features/new")}
              >
                Crear nuevo
              </Button>
            )}
          </Box>
        </Box>
      </>
    );
  }

  // Grid de items
  return (
    <>
      {/* Toolbar de selección (cuando hay items seleccionados) */}
      {selectedIds.size > 0 && (
        <Box className="mb-4 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg flex items-center justify-between">
          <Typography variant="body2" className="font-medium">
            {selectedIds.size} item{selectedIds.size > 1 ? "s" : ""}{" "}
            seleccionado{selectedIds.size > 1 ? "s" : ""}
          </Typography>
          <Box className="flex gap-2">
            <Button
              size="small"
              variant="outlined"
              onClick={() => setSelectedIds(new Set())}
            >
              Cancelar
            </Button>
            <Button size="small" variant="contained" color="error">
              Eliminar
            </Button>
          </Box>
        </Box>
      )}

      {/* Grid responsivo */}
      <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {data.map((item) => (
          <FeatureCard
            key={item.id}
            item={item}
            isSelected={selectedIds.has(item.id)}
            onSelect={handleSelect}
            onClick={() => handleCardClick(item)}
          />
        ))}
      </Box>
    </>
  );
}

// =============================================================================
// Skeleton Component
// =============================================================================

interface FeatureListSkeletonProps {
  count?: number;
}

export function FeatureListSkeleton({ count = 8 }: FeatureListSkeletonProps) {
  return (
    <>
      <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: count }).map((_, index) => (
          <FeatureCardSkeleton key={index} />
        ))}
      </Box>
    </>
  );
}

// =============================================================================
// Notas de Implementación
// =============================================================================

/**
 * PATRÓN SERVER → CLIENT:
 *
 * 1. page.tsx (Server) hace el fetch inicial
 * 2. Pasa los datos como `initialData` a este componente
 * 3. Este componente puede refetch cuando cambian filtros
 *
 * GRID RESPONSIVO:
 *
 * - 1 columna en móvil (default)
 * - 2 columnas desde sm (640px)
 * - 3 columnas desde lg (1024px)
 * - 4 columnas desde xl (1280px)
 *
 * SELECCIÓN MÚLTIPLE:
 *
 * - Estado local con Set<string> para O(1) lookup
 * - Toolbar contextual cuando hay selección
 * - Acciones batch (eliminar, etc.)
 *
 * EMPTY STATES:
 *
 * Diferenciamos entre:
 * - Sin resultados por filtros → sugerir limpiar
 * - Sin items en general → sugerir crear
 *
 * MUI + TAILWIND:
 *
 * - Box de MUI como contenedor flexible
 * - Typography para texto semántico
 * - Button para acciones
 * - Grid con clases de Tailwind
 */
