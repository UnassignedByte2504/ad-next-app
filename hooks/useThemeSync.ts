/**
 * useThemeSync - Sincroniza el tema de Zustand con el DOM
 *
 * Este hook separa la lógica de efectos secundarios (DOM mutations)
 * de la lógica de estado puro en el store.
 *
 * Responsabilidades:
 * - Aplicar la clase 'dark' al <html> cuando cambia el tema
 * - Escuchar cambios en las preferencias del sistema
 * - Aplicar el tema inicial al montar la aplicación
 *
 * @example
 * ```tsx
 * function Providers() {
 *   useThemeSync(); // Solo llamar una vez en el root
 *   return <div>...</div>
 * }
 * ```
 */

import { useEffect } from "react";
import { useStore } from "@/store";

export function useThemeSync() {
  // Suscribirse a cambios de tema usando subscribeWithSelector
  useEffect(() => {
    // Aplicar tema inicial inmediatamente
    const applyTheme = (theme: "light" | "dark" | "system") => {
      if (typeof window === "undefined") return;

      const root = document.documentElement;

      if (theme === "system") {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        root.classList.toggle("dark", prefersDark);
      } else {
        root.classList.toggle("dark", theme === "dark");
      }
    };

    // Aplicar tema inicial
    const currentTheme = useStore.getState().ui.theme;
    applyTheme(currentTheme);

    // Suscribirse a cambios de tema
    const unsubscribe = useStore.subscribe(
      (state) => state.ui.theme,
      (theme) => {
        applyTheme(theme);
      }
    );

    // Escuchar cambios en las preferencias del sistema
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleMediaChange = (e: MediaQueryListEvent) => {
      const theme = useStore.getState().ui.theme;
      if (theme === "system") {
        document.documentElement.classList.toggle("dark", e.matches);
      }
    };

    mediaQuery.addEventListener("change", handleMediaChange);

    // Cleanup
    return () => {
      unsubscribe();
      mediaQuery.removeEventListener("change", handleMediaChange);
    };
  }, []);
}
