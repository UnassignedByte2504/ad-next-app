/**
 * Middleware Layer
 *
 * Proporciona funcionalidades de middleware para Next.js:
 * - Correlation IDs para tracing end-to-end
 * - Auth checks para rutas protegidas
 * - Security headers y CSRF protection
 *
 * @example
 * ```ts
 * // En proxy.ts
 * import { createMiddlewareChain } from "@/middleware";
 *
 * export default createMiddlewareChain();
 * ```
 *
 * @example
 * ```ts
 * // En Server Actions
 * import { getCorrelationId } from "@/middleware";
 *
 * export async function myAction() {
 *   const correlationId = getCorrelationId(request);
 *   // Propagar a llamadas al backend
 * }
 * ```
 */

// Types
export {
  type MiddlewareFunction,
  type MiddlewareContext,
  HEADERS,
  AUTH_COOKIES,
} from "./types";

// Config
export {
  PROTECTED_ROUTES,
  PUBLIC_ROUTES,
  SKIP_MIDDLEWARE_ROUTES,
  LOGIN_REDIRECT,
  AFTER_LOGIN_REDIRECT,
  SECURITY_CONFIG,
  matchRoute,
  isRouteInList,
  isProtectedRoute,
} from "./config";

// Correlation
export {
  generateId,
  correlationMiddleware,
  getCorrelationId,
  getRequestId,
  createCorrelationHeaders,
} from "./correlation";

// Auth
export {
  type AuthCheckResult,
  checkAuth,
  authMiddleware,
  isAuthenticated,
  getPostLoginRedirect,
} from "./auth";

// Security
export {
  applySecurityHeaders,
  csrfMiddleware,
  securityMiddleware,
} from "./security";
