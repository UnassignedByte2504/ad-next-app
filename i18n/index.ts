/**
 * i18n - Internacionalización
 *
 * @example
 * ```tsx
 * // En Server Components
 * import { getTranslations } from "next-intl/server";
 * const t = await getTranslations("Home");
 *
 * // En Client Components
 * import { useTranslations } from "next-intl";
 * const t = useTranslations("Home");
 *
 * // Navegación con locale
 * import { Link, useRouter } from "@/i18n/navigation";
 * ```
 *
 * Estructura de mensajes (modular por namespace):
 *   messages/
 *     es/
 *       common.json, home.json, auth.json, ...
 *     en/
 *       common.json, home.json, auth.json, ...
 */

export { routing, type Locale } from "./routing";
export { Link, redirect, usePathname, useRouter, getPathname } from "./navigation";
export { NAMESPACES, loadMessages, loadNamespace, type Namespace } from "./messages";
