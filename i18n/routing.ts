import { defineRouting } from "next-intl/routing";

/**
 * Configuración central de routing i18n.
 *
 * @see https://next-intl.dev/docs/routing/configuration
 */
export const routing = defineRouting({
  // Locales soportados
  locales: ["es", "en"],

  // Locale por defecto
  defaultLocale: "es",

  // Prefijo del locale en URLs
  // - 'always': /es/about, /en/about
  // - 'as-needed': /about (default), /en/about
  // - 'never': /about (sin prefijo)
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];
