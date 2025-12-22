/**
 * SessionProvider Component
 *
 * Provider de gestión de sesión para la aplicación.
 * Envuelve la app para proporcionar:
 * - Detección de inactividad
 * - Advertencias de timeout
 * - Auto-logout tras inactividad
 * - Refresh automático de sesión
 *
 * SEGURIDAD:
 * - Solo activo cuando el usuario está autenticado
 * - Implementa CVSS 5.8 audit requirement
 * - Usa httpOnly cookies (tokens no accesibles desde JS)
 *
 * @example
 * ```tsx
 * // En app/layout.tsx o app/providers.tsx
 * <SessionProvider>
 *   <YourApp />
 * </SessionProvider>
 * ```
 */

"use client";

import { ReactNode } from "react";
import { useSessionManager } from "@lib/hooks";
import { SessionWarningModal } from "@organisms";
import { useStore } from "@store";
import { logger } from "@lib/logger";

// ============================================
// Types
// ============================================

export interface SessionProviderProps {
  /** Componentes hijos */
  children: ReactNode;
  /** Callback cuando se muestra advertencia (opcional) */
  onWarning?: () => void;
  /** Callback cuando expira la sesión (opcional) */
  onTimeout?: () => void;
}

// ============================================
// Component
// ============================================

/**
 * Provider de gestión de sesión
 *
 * Debe estar por debajo del StoreProvider en el árbol de componentes
 * para poder acceder al estado de autenticación.
 */
export function SessionProvider({
  children,
  onWarning,
  onTimeout,
}: SessionProviderProps) {
  // Solo activar si el usuario está autenticado
  const isAuthenticated = useStore((state) => state.auth.isAuthenticated);

  // Hook de gestión de sesión
  const { showWarning, remainingTime, handleContinueSession, handleLogout } =
    useSessionManager({
      onWarning: () => {
        logger.warn("Session warning modal displayed");
        onWarning?.();
      },
      onTimeout: () => {
        logger.warn("Session timeout - user logged out");
        onTimeout?.();
      },
    });

  return (
    <>
      {children}

      {/* Modal de advertencia - solo visible cuando está autenticado */}
      {isAuthenticated && (
        <SessionWarningModal
          open={showWarning}
          remainingTime={remainingTime}
          onContinue={handleContinueSession}
          onLogout={handleLogout}
        />
      )}
    </>
  );
}
