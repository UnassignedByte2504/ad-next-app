import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIES } from "./types";
import { isProtectedRoute, LOGIN_REDIRECT } from "./config";

/**
 * Resultado del check de autenticación.
 */
export interface AuthCheckResult {
  isAuthenticated: boolean;
  userId?: string;
  shouldRedirect: boolean;
  redirectUrl?: string;
}

/**
 * Middleware de autenticación.
 *
 * Funcionalidades:
 * - Verifica la presencia de la cookie access_token
 * - Para rutas protegidas, redirige a login si no está autenticado
 * - NO valida el token (eso lo hace el backend) - solo verifica presencia
 *
 * Flujo:
 * 1. Usuario accede a /dashboard
 * 2. Middleware detecta que es ruta protegida
 * 3. Verifica si existe cookie access_token
 * 4. Si no existe → redirect a /login?redirect=/dashboard
 * 5. Si existe → continúa (backend validará el token)
 *
 * @param request - NextRequest entrante
 * @returns AuthCheckResult con estado de autenticación
 */
export function checkAuth(request: NextRequest): AuthCheckResult {
  const pathname = request.nextUrl.pathname;

  // Verificar si tiene cookie de acceso
  const accessToken = request.cookies.get(AUTH_COOKIES.ACCESS_TOKEN)?.value;
  const isAuthenticated = !!accessToken;

  // Si la ruta no requiere auth, continuar
  if (!isProtectedRoute(pathname)) {
    return {
      isAuthenticated,
      shouldRedirect: false,
    };
  }

  // Ruta protegida sin autenticación → redirect a login
  if (!isAuthenticated) {
    // Guardar la URL original para redirect después del login
    const redirectUrl = new URL(LOGIN_REDIRECT, request.url);
    redirectUrl.searchParams.set("redirect", pathname);

    return {
      isAuthenticated: false,
      shouldRedirect: true,
      redirectUrl: redirectUrl.toString(),
    };
  }

  // Autenticado, continuar
  return {
    isAuthenticated: true,
    shouldRedirect: false,
  };
}

/**
 * Aplica el middleware de autenticación.
 * Retorna una response de redirect si es necesario, o undefined para continuar.
 *
 * @param request - NextRequest entrante
 * @returns NextResponse redirect o undefined
 */
export function authMiddleware(
  request: NextRequest
): NextResponse | undefined {
  const authCheck = checkAuth(request);

  if (authCheck.shouldRedirect && authCheck.redirectUrl) {
    return NextResponse.redirect(authCheck.redirectUrl);
  }

  return undefined;
}

/**
 * Verifica si el usuario está autenticado (tiene cookie).
 * Útil para lógica condicional en componentes.
 *
 * @param request - NextRequest
 * @returns true si tiene cookie access_token
 */
export function isAuthenticated(request: NextRequest): boolean {
  return !!request.cookies.get(AUTH_COOKIES.ACCESS_TOKEN)?.value;
}

/**
 * Obtiene el redirect URL después del login.
 * Lee el parámetro ?redirect= de la URL.
 *
 * @param request - NextRequest
 * @param defaultPath - Path por defecto si no hay redirect
 * @returns URL a la que redirigir
 */
export function getPostLoginRedirect(
  request: NextRequest,
  defaultPath: string = "/"
): string {
  const redirectParam = request.nextUrl.searchParams.get("redirect");

  // Validar que el redirect sea una ruta interna (seguridad)
  if (redirectParam && redirectParam.startsWith("/")) {
    return redirectParam;
  }

  return defaultPath;
}
