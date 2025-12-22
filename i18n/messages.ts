/**
 * Cargador de mensajes i18n modular.
 *
 * Combina múltiples archivos JSON por namespace en un solo objeto de mensajes.
 * Esto permite organizar traducciones en archivos más pequeños y manejables.
 *
 * Estructura:
 *   messages/
 *     es/
 *       common.json
 *       home.json
 *       auth.json
 *       ...
 *     en/
 *       common.json
 *       home.json
 *       auth.json
 *       ...
 *
 * Los namespaces disponibles se definen en NAMESPACES.
 * Cada archivo se mapea a un namespace con PascalCase (home.json → Home).
 */

import type { AbstractIntlMessages } from "next-intl";

/**
 * Lista de namespaces disponibles.
 * Agregar nuevos namespaces aquí al crear nuevos archivos de traducción.
 */
export const NAMESPACES = [
  "metadata",
  "home",
  "common",
  "auth",
  "navigation",
  "components",
  "storybook",
] as const;

export type Namespace = (typeof NAMESPACES)[number];

/**
 * Convierte nombre de archivo a namespace PascalCase.
 * @example "home" → "Home", "auth" → "Auth"
 */
function toNamespaceKey(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

/**
 * Carga todos los mensajes para un locale específico.
 * Combina todos los namespaces en un objeto plano.
 *
 * @param locale - El código del locale (es, en, etc.)
 * @returns Objeto con todos los mensajes organizados por namespace
 *
 * @example
 * const messages = await loadMessages("es");
 * // { Metadata: {...}, Home: {...}, Common: {...}, ... }
 */
export async function loadMessages(
  locale: string
): Promise<AbstractIntlMessages> {
  const messages: AbstractIntlMessages = {};

  // Cargar todos los namespaces en paralelo
  const loadPromises = NAMESPACES.map(async (namespace) => {
    try {
      const translations = await import(`../messages/${locale}/${namespace}.json`);
      const key = toNamespaceKey(namespace);
      messages[key] = translations.default;
    } catch (error) {
      console.warn(
        `[i18n] Missing namespace "${namespace}" for locale "${locale}"`
      );
    }
  });

  await Promise.all(loadPromises);

  return messages;
}

/**
 * Carga un namespace específico para un locale.
 * Útil para carga diferida (lazy loading) de traducciones.
 *
 * @param locale - El código del locale
 * @param namespace - El namespace a cargar
 * @returns Objeto con los mensajes del namespace
 */
export async function loadNamespace(
  locale: string,
  namespace: Namespace
): Promise<AbstractIntlMessages> {
  try {
    const translations = await import(`../messages/${locale}/${namespace}.json`);
    return translations.default;
  } catch {
    console.warn(
      `[i18n] Missing namespace "${namespace}" for locale "${locale}"`
    );
    return {};
  }
}
