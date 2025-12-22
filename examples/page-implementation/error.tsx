"use client";

/**
 * Error Boundary - Maneja errores de esta ruta
 *
 * Este archivo DEBE ser un Client Component ("use client").
 * Se activa cuando hay un error en:
 * - page.tsx
 * - layout.tsx
 * - Cualquier componente hijo
 *
 * NO captura errores en:
 * - root layout (usa global-error.tsx)
 * - Server Actions (manejar con try/catch)
 */

import { useEffect } from "react";
import { useLogger } from "@hooks";
// import { Button } from "@atoms";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const log = useLogger("FeatureError");

  useEffect(() => {
    // Log del error para debugging
    log.error("Feature error occurred", error, {
      digest: error.digest,
      stack: error.stack,
    });
  }, [error, log]);

  return (
    <main className="container mx-auto py-16 px-4">
      <div className="max-w-md mx-auto text-center">
        {/* Icono de error */}
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-red-600 dark:text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* Mensaje de error */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Algo salió mal
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Hubo un problema al cargar esta página. Por favor, intenta de nuevo.
        </p>

        {/* Detalles técnicos (solo en desarrollo) */}
        {process.env.NODE_ENV === "development" && (
          <details className="mb-6 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              Detalles técnicos
            </summary>
            <pre className="mt-2 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-auto text-xs text-red-600 dark:text-red-400">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}

        {/* Acciones */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Intentar de nuevo
          </button>
          <a
            href="/"
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Ir al inicio
          </a>
        </div>
      </div>
    </main>
  );
}

// =============================================================================
// Notas de Implementación
// =============================================================================

/**
 * PROPS DISPONIBLES:
 *
 * - error: Error capturado
 *   - error.message: Mensaje del error
 *   - error.digest: Hash único del error (producción)
 *   - error.stack: Stack trace (desarrollo)
 *
 * - reset: Función para reintentar
 *   - Limpia el error state
 *   - Re-renderiza el segmento de ruta
 *   - NO recarga la página completa
 *
 * BUENAS PRÁCTICAS:
 *
 * 1. Logging
 *    - Siempre loggea el error para debugging
 *    - Usa el digest para correlacionar en producción
 *
 * 2. UX Amigable
 *    - Mensaje claro, no técnico
 *    - Acciones claras (reintentar, volver)
 *    - Diseño consistente con la app
 *
 * 3. Desarrollo vs Producción
 *    - Mostrar stack trace SOLO en desarrollo
 *    - En producción, solo el mensaje genérico
 *
 * 4. Recover Gracefully
 *    - reset() permite recuperar sin reload
 *    - Ofrece alternativa (ir al inicio)
 *
 * ERRORES QUE CAPTURA:
 *
 * ✅ Errores en render de componentes
 * ✅ Errores en data fetching (fetch fallido)
 * ✅ Errores en event handlers (si no están en try/catch)
 *
 * ❌ Errores en Server Actions → manejar con try/catch
 * ❌ Errores en root layout → usar global-error.tsx
 * ❌ Errores en middleware → no capturados
 */
