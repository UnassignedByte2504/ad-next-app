import { NextResponse, type NextRequest } from "next/server";
import { HEADERS } from "./types";

/**
 * Genera un ID único para correlation/request tracking.
 * Formato: timestamp-random (ej: "1733312456789-a1b2c3d4")
 */
export function generateId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 10);
  return `${timestamp}-${random}`;
}

/**
 * Middleware de Correlation ID.
 *
 * Funcionalidades:
 * - Extrae X-Correlation-ID del request (si existe, viene del frontend o upstream)
 * - Si no existe, genera uno nuevo
 * - Genera un X-Request-ID único para este request específico
 * - Añade ambos headers a la response para tracing end-to-end
 *
 * Esto permite trazabilidad completa:
 * - Frontend → Next.js middleware → Backend → Kafka → Logs
 *
 * @param request - NextRequest entrante
 * @param response - NextResponse a modificar
 * @returns NextResponse con headers de correlation añadidos
 */
export function correlationMiddleware(
  request: NextRequest,
  response: NextResponse
): NextResponse {
  const startTime = performance.now();

  // Obtener o generar Correlation ID
  // Correlation ID persiste a través de múltiples requests relacionados
  const correlationId =
    request.headers.get(HEADERS.CORRELATION_ID) || generateId();

  // Request ID es único para cada request individual
  const requestId = request.headers.get(HEADERS.REQUEST_ID) || generateId();

  // Añadir headers a la response
  response.headers.set(HEADERS.CORRELATION_ID, correlationId);
  response.headers.set(HEADERS.REQUEST_ID, requestId);

  // Calcular tiempo de procesamiento del middleware
  const processTime = (performance.now() - startTime).toFixed(2);
  response.headers.set(HEADERS.PROCESS_TIME, `${processTime}ms`);

  return response;
}

/**
 * Obtiene el Correlation ID de un request.
 * Útil para logging en Server Actions o API routes.
 *
 * @param request - NextRequest
 * @returns Correlation ID o un nuevo ID si no existe
 */
export function getCorrelationId(request: NextRequest): string {
  return request.headers.get(HEADERS.CORRELATION_ID) || generateId();
}

/**
 * Obtiene el Request ID de un request.
 *
 * @param request - NextRequest
 * @returns Request ID o un nuevo ID si no existe
 */
export function getRequestId(request: NextRequest): string {
  return request.headers.get(HEADERS.REQUEST_ID) || generateId();
}

/**
 * Crea headers para propagar correlation a llamadas downstream.
 * Útil cuando el frontend hace fetch al backend.
 *
 * @param correlationId - Correlation ID a propagar
 * @param requestId - Request ID a propagar
 * @returns Headers object para usar en fetch
 *
 * @example
 * const headers = createCorrelationHeaders(correlationId, requestId);
 * fetch('/api/data', { headers });
 */
export function createCorrelationHeaders(
  correlationId: string,
  requestId?: string
): Record<string, string> {
  const headers: Record<string, string> = {
    [HEADERS.CORRELATION_ID]: correlationId,
  };

  if (requestId) {
    headers[HEADERS.REQUEST_ID] = requestId;
  }

  return headers;
}
