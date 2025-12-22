"use client";

/**
 * FeatureFiltersSkeleton - Skeleton para los filtros
 *
 * Se muestra mientras carga la página.
 * Coincide con la estructura de FeatureFilters.
 */

import { Box, Skeleton } from "@mui/material";

export function FeatureFiltersSkeleton() {
  return (
    <>
      <Box className="flex flex-col sm:flex-row gap-4">
        {/* Search field skeleton */}
        <Skeleton
          variant="rounded"
          height={40}
          className="flex-1"
          animation="wave"
        />

        {/* Sort select skeleton */}
        <Skeleton
          variant="rounded"
          width={150}
          height={40}
          animation="wave"
        />

        {/* Filters button skeleton */}
        <Skeleton
          variant="rounded"
          width={100}
          height={40}
          animation="wave"
        />
      </Box>
    </>
  );
}
