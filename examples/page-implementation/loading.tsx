/**
 * Loading UI - Se muestra mientras page.tsx está cargando
 *
 * Next.js App Router usa este archivo automáticamente como
 * fallback de Suspense para toda la ruta.
 *
 * IMPORTANTE:
 * - Este componente NO es async
 * - Debe renderizar inmediatamente
 * - Usa skeletons que coincidan con el layout de page.tsx
 */

import { Container, Box, Skeleton } from "@mui/material";

import { FeatureListSkeleton } from "./components/FeatureList";
import { FeatureFiltersSkeleton } from "./components/FeatureFiltersSkeleton";

export default function Loading() {
  return (
    <>
      <Container maxWidth="xl" className="py-8">
        {/* Header skeleton */}
        <Box component="header" className="mb-8">
          <Skeleton
            variant="text"
            width={250}
            height={48}
            animation="wave"
            className="mb-2"
          />
          <Skeleton
            variant="text"
            width={400}
            height={24}
            animation="wave"
          />
        </Box>

        {/* Filtros skeleton */}
        <Box component="section" className="mb-6">
          <FeatureFiltersSkeleton />
        </Box>

        {/* Lista skeleton */}
        <FeatureListSkeleton count={12} />
      </Container>
    </>
  );
}

// =============================================================================
// Notas de Implementación
// =============================================================================

/**
 * BUENAS PRÁCTICAS:
 *
 * 1. Matching Layout
 *    - El skeleton debe coincidir con el layout de page.tsx
 *    - Mismas dimensiones, espaciado, estructura
 *    - Evita "saltos" cuando carga el contenido real
 *
 * 2. MUI Skeleton
 *    - variant="text" para textos
 *    - variant="rounded" para botones/inputs
 *    - variant="rectangular" para imágenes
 *    - animation="wave" para efecto de carga
 *
 * 3. Performance
 *    - loading.tsx se envía inmediatamente al cliente
 *    - Mejora la percepción de velocidad
 *    - Importante para Core Web Vitals (LCP, CLS)
 *
 * SKELETON VS SPINNER:
 *
 * ✅ Skeleton: Para listas, cards, contenido estructurado
 *    → Mejor UX, el usuario "ve" el layout
 *
 * ⚠️ Spinner: Solo para acciones puntuales (submit, refresh)
 *    → No para carga inicial de páginas
 */

