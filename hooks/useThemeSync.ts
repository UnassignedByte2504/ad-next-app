/**
 * useThemeSync - Sincroniza el tema de Zustand con MUI's color scheme system
 *
 * Este hook conecta el estado de tema en Zustand con el sistema de
 * color scheme de MUI, que maneja la clase CSS en el elemento <html>.
 *
 * Responsabilidades:
 * - Sincronizar tema de Zustand → MUI's localStorage key
 * - Aplicar la clase directamente al DOM para sincronización inmediata
 * - Re-aplicar el tema después de la rehidratación del persist middleware
 *
 * MUI's InitColorSchemeScript usa 'mui-mode' como key en localStorage.
 * Sincronizamos nuestro Zustand store a ese key.
 *
 * @example
 * ```tsx
 * function Providers() {
 *   useThemeSync(); // Solo llamar una vez en el root
 *   return <div>...</div>
 * }
 * ```
 */

import { useEffect, useLayoutEffect } from "react";
import { useStore } from "@/store";

// MUI's default storage key for color scheme mode
const MUI_MODE_STORAGE_KEY = "mui-mode";

// useLayoutEffect en cliente, useEffect en servidor (para evitar warnings SSR)
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function useThemeSync() {
  useIsomorphicLayoutEffect(() => {
    // Aplicar tema al DOM y sincronizar con MUI's storage
    const applyTheme = (theme: "light" | "dark" | "system") => {
      if (typeof window === "undefined") return;

      const root = document.documentElement;

      // Determinar clase a aplicar
      let resolvedClass: "light" | "dark";
      if (theme === "system") {
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        resolvedClass = prefersDark ? "dark" : "light";
      } else {
        resolvedClass = theme;
      }

      // Aplicar clase directamente al DOM
      root.classList.remove("light", "dark");
      root.classList.add(resolvedClass);

      // Sincronizar con MUI's localStorage key para que
      // InitColorSchemeScript aplique el tema correcto en el próximo reload
      localStorage.setItem(MUI_MODE_STORAGE_KEY, theme);
    };

    // CRÍTICO: Verificar si la hidratación ya ocurrió
    const alreadyHydrated = useStore.persist.hasHydrated();
    const currentTheme = useStore.getState().ui.theme;

    // Aplicar tema inmediatamente
    if (alreadyHydrated) {
      applyTheme(currentTheme);
    }

    // Suscribirse a cambios del store
    const unsubscribe = useStore.subscribe((state, prevState) => {
      if (state.ui.theme !== prevState.ui.theme) {
        applyTheme(state.ui.theme);
      }
    });

    // Callback para hidratación
    const unsubscribeHydration = useStore.persist.onFinishHydration((state) => {
      applyTheme(state.ui.theme);
    });

    // Escuchar cambios en las preferencias del sistema
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleMediaChange = (e: MediaQueryListEvent) => {
      const theme = useStore.getState().ui.theme;
      if (theme === "system") {
        const root = document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(e.matches ? "dark" : "light");
      }
    };
    mediaQuery.addEventListener("change", handleMediaChange);

    // Cleanup
    return () => {
      unsubscribe();
      unsubscribeHydration();
      mediaQuery.removeEventListener("change", handleMediaChange);
    };
  }, []);
}
