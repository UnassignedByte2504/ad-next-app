import type { ReactNode } from "react";
import type { Metadata } from "next";

// =============================================================================
// Layout Metadata
// =============================================================================

export const metadata: Metadata = {
  // El título se hereda/combina con el de page.tsx
  // Usa template en el root layout: { template: "%s | Bemyre" }
};

// =============================================================================
// Layout Props
// =============================================================================

interface LayoutProps {
  children: ReactNode;
  // Parallel routes (si los usas)
  // modal?: ReactNode;
}

// =============================================================================
// Layout Component
// =============================================================================

/**
 * Layout específico de la feature
 *
 * Se aplica a esta ruta y todas sus sub-rutas.
 * Útil para:
 * - Sidebar de navegación
 * - Header específico
 * - Contexto de datos compartidos
 * - Parallel routes (modals, drawers)
 *
 * Si la feature no necesita layout específico, ELIMINA este archivo.
 * El layout padre se aplicará automáticamente.
 */
export default function FeatureLayout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar opcional */}
      {/* <FeatureSidebar /> */}

      {/* Contenido principal */}
      <div className="flex-1">{children}</div>

      {/* Parallel route para modals (opcional) */}
      {/* {modal} */}
    </div>
  );
}

// =============================================================================
// Notas de Implementación
// =============================================================================

/**
 * CUÁNDO USAR LAYOUT:
 *
 * ✅ La feature tiene navegación lateral propia
 * ✅ Necesitas compartir estado entre sub-rutas
 * ✅ Quieres un header/footer específico
 * ✅ Usas parallel routes (@modal, @sidebar)
 *
 * ❌ NO lo uses si solo quieres estilos diferentes
 *    → Usa clases en page.tsx o CSS modules
 *
 * ❌ NO lo uses para fetch de datos comunes
 *    → Usa Server Components con fetch en cada page
 *    → O React Context si es estado del cliente
 *
 * PARALLEL ROUTES:
 *
 * Si necesitas modals que no reemplacen la página:
 *
 * app/feature/
 * ├── layout.tsx      # Renderiza children + @modal
 * ├── page.tsx        # Lista
 * ├── @modal/
 * │   ├── default.tsx # null (cuando no hay modal)
 * │   └── [id]/
 * │       └── page.tsx # Modal de detalle
 * └── [id]/
 *     └── page.tsx    # Página de detalle (navegación directa)
 */

