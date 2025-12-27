/**
 * Bemyre Store - Estado global de la aplicación
 *
 * Usa Zustand con:
 * - Immer para mutaciones inmutables
 * - DevTools para debugging
 * - Persist para persistencia en localStorage
 *
 * @example
 * ```tsx
 * // En componentes
 * const user = useAuth((state) => state.user);
 * const { login, logout } = useAuthActions();
 *
 * const theme = useUI((state) => state.theme);
 * const { addNotification } = useUIActions();
 * ```
 */

import { create } from "zustand";
import { devtools, persist, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { useShallow } from "zustand/react/shallow";

import { createAuthSlice } from "./slices/authSlice";
import { createUISlice } from "./slices/uiSlice";
import { createSearchSlice } from "./slices/searchSlice";
import { createConsentSlice } from "./slices/consentSlice";
import type { StoreState, PersistedState } from "./types";

/**
 * Store principal de la aplicación
 *
 * Combina todos los slices en un solo store.
 * Usa middleware para devtools, persistencia e immer.
 */
export const useStore = create<StoreState>()(
  subscribeWithSelector(
    devtools(
      persist(
        immer((set, get, store) => ({
          auth: createAuthSlice(
            // @ts-expect-error - Zustand slice pattern requires this
            (fn) => set((state) => { fn(state); }),
            () => get(),
            store
          ),
          ui: createUISlice(
            // @ts-expect-error - Zustand slice pattern requires this
            (fn) => set((state) => { fn(state); }),
            () => get(),
            store
          ),
          search: createSearchSlice(
            // @ts-expect-error - Zustand slice pattern requires this
            (fn) => set((state) => { fn(state); }),
            () => get(),
            store
          ),
          consent: createConsentSlice(
            // @ts-expect-error - Zustand slice pattern requires this
            (fn) => set((state) => { fn(state); }),
            () => get(),
            store
          ),
        })),
        {
          name: "bemyre-store",
          version: 2, // Incrementar versión por cambio de schema
          // Solo persistir datos NO sensibles - tokens van en httpOnly cookies
          partialize: (state): PersistedState => ({
            auth: {
              user: state.auth.user,
              authMethod: state.auth.authMethod,
            },
            ui: {
              theme: state.ui.theme,
              sidebarCollapsed: state.ui.sidebarCollapsed,
            },
          }),
          // Deep merge para preservar las acciones de los slices durante rehidratación
          // El shallow merge por defecto sobrescribe los slices completos, perdiendo las funciones
          merge: (persistedState, currentState) => {
            const persisted = persistedState as PersistedState | undefined;
            return {
              ...currentState,
              auth: {
                ...currentState.auth,
                ...(persisted?.auth || {}),
              },
              ui: {
                ...currentState.ui,
                ...(persisted?.ui || {}),
              },
              // search y consent no se persisten, mantener currentState
            };
          },
          // Rehidratar: verificar sesión con el backend
          onRehydrateStorage: () => (state) => {
            if (state?.auth.user) {
              // Marcar como autenticado temporalmente
              // La app debería llamar fetchCurrentUser para verificar
              state.auth.isAuthenticated = true;
            }
          },
          // Migrar desde versión anterior (que tenía tokens)
          migrate: (persistedState, version) => {
            if (version < 2) {
              // Limpiar tokens de la versión anterior
              const oldState = persistedState as Record<string, unknown>;
              if (oldState.auth && typeof oldState.auth === "object") {
                const authState = oldState.auth as Record<string, unknown>;
                delete authState.token;
                delete authState.refreshToken;
              }
            }
            return persistedState as PersistedState;
          },
        }
      ),
      {
        name: "Bemyre Store",
        enabled: process.env.NODE_ENV === "development",
      }
    )
  )
);

// ============================================
// Selectores tipados para cada slice
// ============================================

/**
 * Selector para el slice de autenticación
 */
export const useAuth = <T>(selector: (state: StoreState["auth"]) => T): T => {
  return useStore((state) => selector(state.auth));
};

/**
 * Selector para el slice de UI
 */
export const useUI = <T>(selector: (state: StoreState["ui"]) => T): T => {
  return useStore((state) => selector(state.ui));
};

/**
 * Selector para el slice de búsqueda
 */
export const useSearch = <T>(selector: (state: StoreState["search"]) => T): T => {
  return useStore((state) => selector(state.search));
};

/**
 * Selector para el slice de consentimiento (GDPR)
 */
export const useConsent = <T>(selector: (state: StoreState["consent"]) => T): T => {
  return useStore((state) => selector(state.consent));
};

// ============================================
// Hooks de acciones (no causan re-renders)
// ============================================

/**
 * Acciones del slice de autenticación
 * Usa useShallow para suscripción estable sin re-renders innecesarios
 */
export const useAuthActions = () => {
  return useStore(
    useShallow((state) => ({
      login: state.auth.login,
      loginWithGoogle: state.auth.loginWithGoogle,
      handleGoogleCallback: state.auth.handleGoogleCallback,
      logout: state.auth.logout,
      register: state.auth.register,
      refreshSession: state.auth.refreshSession,
      fetchCurrentUser: state.auth.fetchCurrentUser,
      updateUser: state.auth.updateUser,
      clearError: state.auth.clearError,
      setLoading: state.auth.setLoading,
    }))
  );
};

/**
 * Acciones del slice de UI
 * Usa useShallow para suscripción estable sin re-renders innecesarios
 */
export const useUIActions = () => {
  return useStore(
    useShallow((state) => ({
      setTheme: state.ui.setTheme,
      toggleSidebar: state.ui.toggleSidebar,
      setSidebarOpen: state.ui.setSidebarOpen,
      setSidebarCollapsed: state.ui.setSidebarCollapsed,
      addNotification: state.ui.addNotification,
      removeNotification: state.ui.removeNotification,
      clearNotifications: state.ui.clearNotifications,
      openModal: state.ui.openModal,
      closeModal: state.ui.closeModal,
      closeAllModals: state.ui.closeAllModals,
      setOnline: state.ui.setOnline,
      setMobile: state.ui.setMobile,
    }))
  );
};

/**
 * Acciones del slice de búsqueda
 * Usa useShallow para suscripción estable sin re-renders innecesarios
 */
export const useSearchActions = () => {
  return useStore(
    useShallow((state) => ({
      setQuery: state.search.setQuery,
      setFilters: state.search.setFilters,
      clearFilters: state.search.clearFilters,
      search: state.search.search,
      clearResults: state.search.clearResults,
    }))
  );
};

/**
 * Acciones del slice de consentimiento (GDPR)
 * Usa useShallow para suscripción estable sin re-renders innecesarios
 */
export const useConsentActions = () => {
  return useStore(
    useShallow((state) => ({
      acceptAll: state.consent.acceptAll,
      rejectAll: state.consent.rejectAll,
      updateConsent: state.consent.updateConsent,
      setShowBanner: state.consent.setShowBanner,
      setHideBanner: state.consent.setHideBanner,
      resetConsent: state.consent.resetConsent,
    }))
  );
};

// ============================================
// Selectores comunes pre-definidos
// ============================================

/** Usuario actual o null */
export const useCurrentUser = () => useAuth((state) => state.user);

/** Si el usuario está autenticado */
export const useIsAuthenticated = () => useAuth((state) => state.isAuthenticated);

/** Tema actual */
export const useTheme = () => useUI((state) => state.theme);

/** Lista de notificaciones */
export const useNotifications = () => useUI((state) => state.notifications);

/** Si hay modales abiertos */
export const useHasModals = () => useUI((state) => state.modals.length > 0);

/** Si está buscando */
export const useIsSearching = () => useSearch((state) => state.isSearching);

/** Preferencias de consentimiento */
export const useConsentPreferences = () => useConsent((state) => state.preferences);

/** Si debe mostrar el banner de consentimiento */
export const useShowConsentBanner = () => useConsent((state) => state.showBanner);

/** Si el usuario ha dado consentimiento */
export const useHasConsented = () => useConsent((state) => state.hasConsented);

// ============================================
// Subscripciones para efectos secundarios
// ============================================

// Escuchar cambios de conexión
if (typeof window !== "undefined") {
  window.addEventListener("online", () => {
    useStore.getState().ui.setOnline(true);
  });

  window.addEventListener("offline", () => {
    useStore.getState().ui.setOnline(false);
  });

  // Theme sync moved to useThemeSync hook
  // System preference changes are now handled in the hook
}
