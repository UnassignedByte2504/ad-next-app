import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";
import { loadMessages } from "./messages";

/**
 * Configuración de request para next-intl.
 *
 * Carga los mensajes modulares para el locale actual.
 * Los mensajes se organizan en archivos separados por namespace:
 *   messages/{locale}/common.json
 *   messages/{locale}/home.json
 *   messages/{locale}/auth.json
 *   etc.
 */
export default getRequestConfig(async ({ requestLocale }) => {
  // Obtener locale del request (desde middleware/proxy)
  const requested = await requestLocale;

  // Validar que el locale sea soportado
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  // Cargar mensajes desde archivos modulares
  const messages = await loadMessages(locale);

  return {
    locale,
    messages,
  };
});
