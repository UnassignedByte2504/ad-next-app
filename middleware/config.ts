/**
 * Configuración del middleware.
 *
 * Define rutas protegidas, públicas, y configuración de seguridad.
 */

/**
 * Rutas que requieren autenticación.
 * Usar glob patterns con ** para subdirectorios.
 */
export const PROTECTED_ROUTES = [
  "/dashboard/**",
  "/profile/**",
  "/settings/**",
  "/messages/**",
  "/bands/create",
  "/bands/*/edit",
] as const;

/**
 * Rutas que son siempre públicas (no requieren auth check).
 * Útil para páginas de auth y landing.
 */
export const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/register",
  "/auth/**",
  "/about",
  "/privacy",
  "/terms",
] as const;

/**
 * Rutas que deben saltar el middleware completamente.
 * Incluye APIs, assets estáticos, etc.
 */
export const SKIP_MIDDLEWARE_ROUTES = [
  "/api/**",
  "/_next/**",
  "/_vercel/**",
  "/monitoring/**",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
] as const;

/**
 * Ruta de redirección cuando el usuario no está autenticado.
 */
export const LOGIN_REDIRECT = "/login";

/**
 * Ruta de redirección después del login exitoso.
 */
export const AFTER_LOGIN_REDIRECT = "/dashboard";

/**
 * Configuración de headers de seguridad.
 */
export const SECURITY_CONFIG = {
  /**
   * Habilitar CSRF protection.
   * Genera token en cookie y lo valida en requests POST/PUT/DELETE.
   */
  csrfEnabled: true,

  /**
   * Nombre de la cookie CSRF.
   */
  csrfCookieName: "csrf_token",

  /**
   * Headers adicionales de seguridad.
   * Los principales ya están en next.config.ts
   */
  additionalHeaders: {
    "X-DNS-Prefetch-Control": "on",
    "X-Download-Options": "noopen",
    "X-Permitted-Cross-Domain-Policies": "none",
  },
} as const;

/**
 * Verifica si una ruta coincide con un patrón glob simple.
 *
 * @param path - Ruta a verificar (ej: "/dashboard/settings")
 * @param pattern - Patrón glob (ej: "/dashboard/**")
 * @returns true si la ruta coincide con el patrón
 *
 * @example
 * matchRoute("/dashboard/settings", "/dashboard/**") // true
 * matchRoute("/profile/123", "/profile/*") // true
 * matchRoute("/about", "/dashboard/**") // false
 */
export function matchRoute(path: string, pattern: string): boolean {
  // Normalizar path (quitar locale prefix si existe)
  const normalizedPath = path.replace(/^\/(es|en)/, "") || "/";

  // Convertir glob a regex
  const regexPattern = pattern
    .replace(/\*\*/g, ".*") // ** = cualquier cosa incluyendo /
    .replace(/\*/g, "[^/]*") // * = cualquier cosa excepto /
    .replace(/\//g, "\\/"); // Escapar /

  const regex = new RegExp(`^${regexPattern}$`);
  return regex.test(normalizedPath);
}

/**
 * Verifica si una ruta está en una lista de patterns.
 */
export function isRouteInList(
  path: string,
  patterns: readonly string[]
): boolean {
  return patterns.some((pattern) => matchRoute(path, pattern));
}

/**
 * Verifica si una ruta requiere autenticación.
 */
export function isProtectedRoute(path: string): boolean {
  // Si está en rutas públicas, no es protegida
  if (isRouteInList(path, PUBLIC_ROUTES)) {
    return false;
  }
  // Si está en rutas protegidas explícitamente
  return isRouteInList(path, PROTECTED_ROUTES);
}
