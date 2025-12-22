import type { NextRequest, NextResponse } from "next/server";

/**
 * Tipo para funciones middleware.
 * Cada middleware recibe el request y puede retornar una response
 * o undefined para continuar con el siguiente middleware.
 */
export type MiddlewareFunction = (
  request: NextRequest,
  response: NextResponse
) => Promise<NextResponse | undefined> | NextResponse | undefined;

/**
 * Contexto compartido entre middlewares.
 * Permite pasar datos entre middlewares en la cadena.
 */
export interface MiddlewareContext {
  correlationId: string;
  requestId: string;
  locale: string;
  isAuthenticated: boolean;
  userId?: string;
}

/**
 * Headers estándar usados en el middleware.
 */
export const HEADERS = {
  CORRELATION_ID: "X-Correlation-ID",
  REQUEST_ID: "X-Request-ID",
  PROCESS_TIME: "X-Process-Time",
  CSRF_TOKEN: "X-CSRF-Token",
} as const;

/**
 * Cookies usadas para autenticación.
 */
export const AUTH_COOKIES = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
} as const;
