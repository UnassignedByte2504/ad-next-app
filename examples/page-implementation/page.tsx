import { Suspense } from "react";
import type { Metadata } from "next";
import { Container, Typography, Box, Pagination } from "@mui/material";

import { FeatureList } from "./components/FeatureList";
import { FeatureFilters } from "./components/FeatureFilters";
import { FeatureListSkeleton } from "./components/FeatureList";
import { fetchFeatures } from "./actions";
import type { FeatureFilters as Filters } from "./types";

// =============================================================================
// Metadata (SEO)
// =============================================================================

export const metadata: Metadata = {
  title: "Feature Name | Ayla Designs",
  description: "Descripción de la página para SEO",
  openGraph: {
    title: "Feature Name | Ayla Designs",
    description: "Descripción para redes sociales",
    // images: ["/og-image.jpg"],
  },
};

// =============================================================================
// Page Props
// =============================================================================

interface PageProps {
  searchParams: Promise<{
    query?: string;
    page?: string;
    sortBy?: string;
    // TODO: Añadir más params según filtros
  }>;
}

// =============================================================================
// Page Component (Server Component)
// =============================================================================

/**
 * Página principal de la feature
 *
 * Este es un Server Component. NO uses hooks de React aquí.
 *
 * Responsabilidades:
 * - Parsear searchParams
 * - Fetch inicial de datos
 * - Pasar datos a Client Components
 * - Definir estructura con Suspense
 */
export default async function FeaturePage({ searchParams }: PageProps) {
  // Parsear y validar search params
  const params = await searchParams;
  const filters: Filters = {
    query: params.query ?? "",
    page: params.page ? parseInt(params.page, 10) : 1,
    sortBy: (params.sortBy as Filters["sortBy"]) ?? "createdAt",
    pageSize: 12,
  };

  // Fetch inicial en el servidor
  // Esto se ejecuta en el servidor, no envía JS al cliente
  const initialData = await fetchFeatures(filters);

  return (
    <>
      <Container maxWidth="xl" className="py-8">
        {/* Header de la página */}
        <Box component="header" className="mb-8">
          <Typography
            variant="h3"
            component="h1"
            className="font-bold mb-2"
          >
            Feature Name
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Descripción breve de lo que muestra esta página.
          </Typography>
        </Box>

        {/* Filtros - Client Component para interactividad */}
        <Box component="section" className="mb-6">
          <FeatureFilters initialFilters={filters} />
        </Box>

        {/* Lista con Suspense para streaming */}
        <Suspense fallback={<FeatureListSkeleton count={12} />}>
          <FeatureList initialData={initialData.data} filters={filters} />
        </Suspense>

        {/* Paginación con MUI */}
        {initialData.pagination.totalPages > 1 && (
          <Box
            component="nav"
            className="mt-8 flex justify-center"
            aria-label="Paginación"
          >
            <Pagination
              count={initialData.pagination.totalPages}
              page={filters.page}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
            />
          </Box>
        )}
      </Container>
    </>
  );
}

// =============================================================================
// Notas de Implementación
// =============================================================================

/**
 * PATRONES APLICADOS:
 *
 * 1. Server Component por defecto
 *    - page.tsx NUNCA tiene "use client"
 *    - El fetch ocurre en el servidor
 *    - Mejor SEO y performance inicial
 *
 * 2. Suspense Boundaries
 *    - Cada sección async tiene su Suspense
 *    - loading.tsx es el fallback de toda la página
 *    - Suspense inline para secciones específicas
 *
 * 3. Search Params para Estado de URL
 *    - Filtros persisten en la URL
 *    - Permite compartir links con filtros
 *    - SEO: cada combinación es indexable
 *
 * 4. Datos Iniciales + Hidratación
 *    - Fetch en servidor → pasa a Client Component
 *    - Client puede refetch si el usuario interactúa
 *    - Evita waterfall de requests
 *
 * ANTI-PATRONES A EVITAR:
 *
 * ❌ useState/useEffect en page.tsx
 * ❌ Fetch en Client Component sin datos iniciales
 * ❌ Props drilling excesivo (usa contexto o store)
 * ❌ Lógica de negocio compleja en page.tsx
 */
