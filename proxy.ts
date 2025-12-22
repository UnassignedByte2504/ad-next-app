import { NextResponse, type NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import {
  correlationMiddleware,
  authMiddleware,
  securityMiddleware,
  isRouteInList,
  SKIP_MIDDLEWARE_ROUTES,
} from "./middleware";

/**
 * Middleware i18n de next-intl.
 */
const intlMiddleware = createIntlMiddleware(routing);

/**
 * Proxy/Middleware principal para Next.js 16.
 *
 * Cadena de middlewares:
 * 1. Skip check - Salta rutas que no necesitan middleware
 * 2. Auth - Verifica autenticación para rutas protegidas
 * 3. i18n - Detección y routing de locale
 * 4. Correlation - Añade IDs de tracing
 * 5. Security - Headers de seguridad y CSRF
 *
 * @param request - NextRequest entrante
 * @returns NextResponse procesada por la cadena de middlewares
 */
export default async function middleware(
  request: NextRequest
): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  // 1. Skip rutas que no necesitan middleware
  if (isRouteInList(pathname, SKIP_MIDDLEWARE_ROUTES)) {
    return NextResponse.next();
  }

  // 2. Auth middleware - puede retornar redirect
  const authResponse = authMiddleware(request);
  if (authResponse) {
    return authResponse;
  }

  // 3. i18n middleware - maneja locale detection y routing
  const response = intlMiddleware(request);

  // 4. Correlation middleware - añade IDs de tracing
  correlationMiddleware(request, response);

  // 5. Security middleware - headers y CSRF
  securityMiddleware(request, response);

  return response;
}

export const config = {
  // Matcher para aplicar el middleware
  // Excluye: archivos estáticos con extensión
  matcher: "/((?!.*\\..*).*)",
};
