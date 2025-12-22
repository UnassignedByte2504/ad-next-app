/**
 * Custom hooks para el store
 *
 * Hooks adicionales que combinan estado y lógica común.
 */

import { useCallback } from "react";
import {
  useAuth,
  useUI,
  useAuthActions,
  useUIActions,
  useCurrentUser,
  useIsAuthenticated,
} from "./index";
import type { Notification } from "./types";

/**
 * Hook para manejar notificaciones toast
 *
 * @example
 * ```tsx
 * const { showSuccess, showError } = useNotify();
 *
 * showSuccess("Perfil actualizado");
 * showError("Error al guardar");
 * ```
 */
export function useNotify() {
  const { addNotification, removeNotification } = useUIActions();

  const showSuccess = useCallback(
    (title: string, message?: string) => {
      return addNotification({ type: "success", title, message });
    },
    [addNotification]
  );

  const showError = useCallback(
    (title: string, message?: string) => {
      return addNotification({ type: "error", title, message, duration: 8000 });
    },
    [addNotification]
  );

  const showWarning = useCallback(
    (title: string, message?: string) => {
      return addNotification({ type: "warning", title, message });
    },
    [addNotification]
  );

  const showInfo = useCallback(
    (title: string, message?: string) => {
      return addNotification({ type: "info", title, message });
    },
    [addNotification]
  );

  const showWithAction = useCallback(
    (
      notification: Omit<Notification, "id">,
    ) => {
      return addNotification(notification);
    },
    [addNotification]
  );

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showWithAction,
    dismiss: removeNotification,
  };
}

/**
 * Hook para autenticación con helpers
 *
 * @example
 * ```tsx
 * const { user, isAuthenticated, login, logout } = useAuthentication();
 *
 * if (!isAuthenticated) {
 *   return <LoginForm onSubmit={login} />;
 * }
 * ```
 */
export function useAuthentication() {
  const user = useCurrentUser();
  const isAuthenticated = useIsAuthenticated();
  const isLoading = useAuth((state) => state.isLoading);
  const error = useAuth((state) => state.error);
  const actions = useAuthActions();

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    ...actions,
  };
}

/**
 * Hook para UI con helpers
 *
 * @example
 * ```tsx
 * const { theme, isDark, toggleTheme } = useAppUI();
 * ```
 */
export function useAppUI() {
  const theme = useUI((state) => state.theme);
  const sidebarOpen = useUI((state) => state.sidebarOpen);
  const sidebarCollapsed = useUI((state) => state.sidebarCollapsed);
  const isOnline = useUI((state) => state.isOnline);
  const isMobile = useUI((state) => state.isMobile);
  const actions = useUIActions();

  const isDark = theme === "dark" ||
    (theme === "system" && typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  const toggleTheme = useCallback(() => {
    actions.setTheme(isDark ? "light" : "dark");
  }, [isDark, actions]);

  return {
    theme,
    isDark,
    toggleTheme,
    sidebarOpen,
    sidebarCollapsed,
    isOnline,
    isMobile,
    ...actions,
  };
}

/**
 * Hook para requerir autenticación
 * Redirige si no está autenticado
 *
 * @example
 * ```tsx
 * function ProtectedPage() {
 *   const { user } = useRequireAuth();
 *   // user está garantizado aquí
 * }
 * ```
 */
export function useRequireAuth() {
  const { user, isAuthenticated, isLoading } = useAuthentication();

  // TODO: Implementar redirección con next/navigation cuando se configure auth
  // const router = useRouter();
  // useEffect(() => {
  //   if (!isLoading && !isAuthenticated) {
  //     router.push("/login");
  //   }
  // }, [isLoading, isAuthenticated]);

  return {
    user: user!,
    isAuthenticated,
    isLoading,
  };
}
