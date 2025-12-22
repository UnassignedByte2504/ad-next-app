import { NextResponse, type NextRequest } from "next/server";
import { HEADERS } from "./types";
import { SECURITY_CONFIG } from "./config";
import { generateId } from "./correlation";

/**
 * Middleware de seguridad.
 *
 * Funcionalidades:
 * - Genera y valida CSRF tokens para mutaciones
 * - Añade headers de seguridad adicionales
 * - Complementa los headers ya definidos en next.config.ts
 *
 * Headers en next.config.ts (estáticos):
 * - X-Content-Type-Options: nosniff
 * - X-Frame-Options: DENY
 * - X-XSS-Protection: 1; mode=block
 * - Referrer-Policy: strict-origin-when-cross-origin
 * - Permissions-Policy: camera=(), microphone=(), geolocation=()
 *
 * Headers añadidos aquí (dinámicos):
 * - X-DNS-Prefetch-Control
 * - X-Download-Options
 * - X-Permitted-Cross-Domain-Policies
 * - CSRF token (en cookie)
 */

/**
 * Genera un CSRF token seguro.
 * Usa crypto.randomUUID si está disponible, sino generateId.
 */
function generateCsrfToken(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return generateId();
}

/**
 * Aplica headers de seguridad adicionales a la response.
 *
 * @param response - NextResponse a modificar
 * @returns NextResponse con headers de seguridad
 */
export function applySecurityHeaders(response: NextResponse): NextResponse {
  // Añadir headers adicionales de seguridad
  for (const [key, value] of Object.entries(
    SECURITY_CONFIG.additionalHeaders
  )) {
    response.headers.set(key, value);
  }

  return response;
}

/**
 * Middleware de CSRF protection.
 *
 * Para requests GET/HEAD:
 * - Genera un nuevo CSRF token y lo guarda en cookie
 *
 * Para requests POST/PUT/DELETE/PATCH:
 * - Valida que el header X-CSRF-Token coincida con la cookie
 * - Si no coincide, retorna 403 Forbidden
 *
 * @param request - NextRequest entrante
 * @param response - NextResponse a modificar
 * @returns NextResponse o error response si CSRF falla
 */
export function csrfMiddleware(
  request: NextRequest,
  response: NextResponse
): NextResponse {
  if (!SECURITY_CONFIG.csrfEnabled) {
    return response;
  }

  const method = request.method.toUpperCase();
  const isReadOnly = ["GET", "HEAD", "OPTIONS"].includes(method);

  if (isReadOnly) {
    // Para requests de lectura, generar/refrescar token
    const existingToken = request.cookies.get(
      SECURITY_CONFIG.csrfCookieName
    )?.value;
    const token = existingToken || generateCsrfToken();

    // Setear cookie si es nuevo
    if (!existingToken) {
      response.cookies.set(SECURITY_CONFIG.csrfCookieName, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });
    }

    // También exponer en header para que el frontend pueda leerlo
    response.headers.set(HEADERS.CSRF_TOKEN, token);
  } else {
    // Para mutaciones, validar token
    const cookieToken = request.cookies.get(
      SECURITY_CONFIG.csrfCookieName
    )?.value;
    const headerToken = request.headers.get(HEADERS.CSRF_TOKEN);

    if (!cookieToken || !headerToken || cookieToken !== headerToken) {
      // CSRF validation failed
      return new NextResponse(
        JSON.stringify({
          error: "CSRF token validation failed",
          code: "CSRF_INVALID",
        }),
        {
          status: 403,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  }

  return response;
}

/**
 * Aplica todas las medidas de seguridad.
 *
 * @param request - NextRequest entrante
 * @param response - NextResponse a modificar
 * @returns NextResponse con seguridad aplicada
 */
export function securityMiddleware(
  request: NextRequest,
  response: NextResponse
): NextResponse {
  // Aplicar headers de seguridad
  response = applySecurityHeaders(response);

  // Aplicar CSRF protection
  response = csrfMiddleware(request, response);

  return response;
}
