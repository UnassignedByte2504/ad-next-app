/**
 * API Error Codes - Mirror del backend (app/errors/error_codes.py)
 *
 * Estos códigos se usan para manejar errores de la API de forma programática.
 * Los códigos string permiten identificar errores específicos y tomar acciones.
 */

/** Códigos de error de la API (string-based, igual que backend) */
export type ApiErrorCode =
  // General (5xx)
  | "INTERNAL_ERROR"
  | "VALIDATION_ERROR"

  // User Domain
  | "USER_NOT_FOUND"
  | "USERNAME_ALREADY_EXISTS"
  | "EMAIL_ALREADY_EXISTS"
  | "CANNOT_FOLLOW_SELF"
  | "ALREADY_FOLLOWING"
  | "NOT_FOLLOWING"

  // Band Domain
  | "BAND_NOT_FOUND"
  | "BAND_NAME_ALREADY_EXISTS"

  // Local Domain
  | "LOCAL_NOT_FOUND"

  // Event Domain
  | "EVENT_NOT_FOUND"

  // Authentication & Security
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "AUTHENTICATION_REQUIRED"
  | "INVALID_CREDENTIALS"
  | "TOKEN_EXPIRED"
  | "CSRF_TOKEN_MISSING"
  | "CSRF_TOKEN_INVALID"

  // Infrastructure
  | "DATABASE_ERROR"
  | "KAFKA_ERROR"
  | "EXTERNAL_SERVICE_ERROR";

/** HTTP status codes por error code (para referencia) */
export const API_ERROR_STATUS_MAP: Partial<Record<ApiErrorCode, number>> = {
  // 400 Bad Request
  VALIDATION_ERROR: 400,
  CANNOT_FOLLOW_SELF: 400,
  ALREADY_FOLLOWING: 400,
  NOT_FOLLOWING: 400,

  // 401 Unauthorized
  UNAUTHORIZED: 401,
  AUTHENTICATION_REQUIRED: 401,
  INVALID_CREDENTIALS: 401,
  TOKEN_EXPIRED: 401,

  // 403 Forbidden
  FORBIDDEN: 403,
  CSRF_TOKEN_MISSING: 403,
  CSRF_TOKEN_INVALID: 403,

  // 404 Not Found
  USER_NOT_FOUND: 404,
  BAND_NOT_FOUND: 404,
  LOCAL_NOT_FOUND: 404,
  EVENT_NOT_FOUND: 404,

  // 409 Conflict
  USERNAME_ALREADY_EXISTS: 409,
  EMAIL_ALREADY_EXISTS: 409,
  BAND_NAME_ALREADY_EXISTS: 409,

  // 500 Internal Server Error
  INTERNAL_ERROR: 500,

  // 503 Service Unavailable
  DATABASE_ERROR: 503,
  KAFKA_ERROR: 503,
  EXTERNAL_SERVICE_ERROR: 503,
};

/** Mensajes de usuario por código de error */
export const API_ERROR_USER_MESSAGES: Partial<Record<ApiErrorCode, string>> = {
  INTERNAL_ERROR: "Ha ocurrido un error interno. Por favor, inténtalo de nuevo.",
  VALIDATION_ERROR: "Los datos proporcionados no son válidos.",

  USER_NOT_FOUND: "Usuario no encontrado.",
  USERNAME_ALREADY_EXISTS: "Este nombre de usuario ya está en uso.",
  EMAIL_ALREADY_EXISTS: "Este email ya está registrado.",
  CANNOT_FOLLOW_SELF: "No puedes seguirte a ti mismo.",
  ALREADY_FOLLOWING: "Ya sigues a este usuario.",
  NOT_FOLLOWING: "No sigues a este usuario.",

  BAND_NOT_FOUND: "Banda no encontrada.",
  BAND_NAME_ALREADY_EXISTS: "Ya existe una banda con este nombre.",

  LOCAL_NOT_FOUND: "Local no encontrado.",
  EVENT_NOT_FOUND: "Evento no encontrado.",

  UNAUTHORIZED: "No autorizado. Por favor, inicia sesión.",
  FORBIDDEN: "No tienes permisos para realizar esta acción.",
  AUTHENTICATION_REQUIRED: "Debes iniciar sesión para continuar.",
  INVALID_CREDENTIALS: "Credenciales incorrectas.",
  TOKEN_EXPIRED: "Tu sesión ha expirado. Por favor, inicia sesión de nuevo.",
  CSRF_TOKEN_MISSING: "Token de seguridad faltante. Por favor, recarga la página.",
  CSRF_TOKEN_INVALID: "Token de seguridad inválido. Por favor, recarga la página.",

  DATABASE_ERROR: "Error de conexión. Por favor, inténtalo de nuevo.",
  KAFKA_ERROR: "Error de servicio. Por favor, inténtalo de nuevo.",
  EXTERNAL_SERVICE_ERROR: "Servicio externo no disponible.",
};

/** Verificar si un código es retryable */
export function isRetryableApiError(code: ApiErrorCode): boolean {
  const retryableCodes: ApiErrorCode[] = [
    "INTERNAL_ERROR",
    "DATABASE_ERROR",
    "KAFKA_ERROR",
    "EXTERNAL_SERVICE_ERROR",
  ];
  return retryableCodes.includes(code);
}

/** Verificar si requiere re-autenticación */
export function requiresReauth(code: ApiErrorCode): boolean {
  return code === "TOKEN_EXPIRED" || code === "AUTHENTICATION_REQUIRED";
}
