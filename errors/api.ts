/**
 * API Error Response Types
 *
 * Tipos y utilidades para manejar errores de la API de Ayla Designs.
 * Alineado con el backend (app/errors/responses.py)
 */

import {
  ApiErrorCode,
  API_ERROR_USER_MESSAGES,
  isRetryableApiError,
  requiresReauth,
} from "./codes";
import { AppError, ErrorCode, ErrorSeverity, NetworkError } from "./base";

/**
 * Respuesta de error de la API (mirror de backend ErrorResponse)
 */
export interface ApiErrorResponse {
  /** Código de error string (ej: "USER_NOT_FOUND") */
  code: ApiErrorCode;
  /** Mensaje técnico del error */
  message: string;
  /** HTTP status code */
  status_code: number;
  /** ID de correlación para trazabilidad */
  correlation_id: string;
  /** Timestamp ISO del error */
  timestamp: string;
  /** Path del endpoint que falló */
  path: string;
  /** Detalles adicionales del error */
  details?: Record<string, unknown>;
}

/**
 * Error específico de API que extiende AppError
 */
export class ApiError extends AppError {
  public readonly apiCode: ApiErrorCode;
  public readonly correlationId: string;
  public readonly path: string;
  public readonly details: Record<string, unknown>;
  public readonly apiTimestamp: Date;

  constructor(response: ApiErrorResponse) {
    // Map API code to internal ErrorCode for compatibility
    const internalCode = mapApiCodeToInternal(response.code);
    const severity = getSeverityFromStatus(response.status_code);
    const userMessage = API_ERROR_USER_MESSAGES[response.code] || response.message;
    const isRetryable = isRetryableApiError(response.code);

    super(
      response.message,
      internalCode,
      severity,
      userMessage,
      isRetryable,
      {
        correlationId: response.correlation_id,
        url: response.path,
        additionalData: response.details,
      }
    );

    this.name = "ApiError";
    this.apiCode = response.code;
    this.correlationId = response.correlation_id;
    this.path = response.path;
    this.details = response.details || {};
    this.apiTimestamp = new Date(response.timestamp);
  }

  /**
   * Verifica si el error requiere re-autenticación
   */
  requiresReauth(): boolean {
    return requiresReauth(this.apiCode);
  }

  /**
   * Serializa para logging/debugging
   */
  override toJSON() {
    return {
      ...super.toJSON(),
      apiCode: this.apiCode,
      correlationId: this.correlationId,
      path: this.path,
      details: this.details,
      apiTimestamp: this.apiTimestamp.toISOString(),
    };
  }
}

/**
 * Parsea una respuesta de error de la API
 * @param responseData - Datos de la respuesta (puede ser unknown)
 * @param fallbackStatus - Status code fallback si no está en la respuesta
 * @returns ApiError si es válido, o null si no se puede parsear
 */
export function parseApiError(
  responseData: unknown,
  fallbackStatus: number = 500
): ApiError | null {
  if (!isApiErrorResponse(responseData)) {
    return null;
  }

  return new ApiError({
    ...responseData,
    status_code: responseData.status_code || fallbackStatus,
  });
}

/**
 * Type guard para verificar si es una respuesta de error de API válida
 */
export function isApiErrorResponse(data: unknown): data is ApiErrorResponse {
  if (typeof data !== "object" || data === null) {
    return false;
  }

  const obj = data as Record<string, unknown>;

  return (
    typeof obj.code === "string" &&
    typeof obj.message === "string" &&
    typeof obj.correlation_id === "string"
  );
}

/**
 * Mapea códigos de API a códigos internos del cliente
 */
function mapApiCodeToInternal(apiCode: ApiErrorCode): ErrorCode {
  const mapping: Partial<Record<ApiErrorCode, ErrorCode>> = {
    // Network/Server errors
    INTERNAL_ERROR: ErrorCode.SYSTEM_ERROR,
    DATABASE_ERROR: ErrorCode.SERVICE_UNAVAILABLE,
    KAFKA_ERROR: ErrorCode.SERVICE_UNAVAILABLE,
    EXTERNAL_SERVICE_ERROR: ErrorCode.SERVICE_UNAVAILABLE,

    // Auth errors
    UNAUTHORIZED: ErrorCode.AUTH_FAILED,
    FORBIDDEN: ErrorCode.INSUFFICIENT_PERMISSIONS,
    AUTHENTICATION_REQUIRED: ErrorCode.AUTH_FAILED,
    INVALID_CREDENTIALS: ErrorCode.AUTH_FAILED,
    TOKEN_EXPIRED: ErrorCode.TOKEN_EXPIRED,
    CSRF_TOKEN_MISSING: ErrorCode.INSUFFICIENT_PERMISSIONS,
    CSRF_TOKEN_INVALID: ErrorCode.INSUFFICIENT_PERMISSIONS,

    // Validation
    VALIDATION_ERROR: ErrorCode.VALIDATION_ERROR,

    // Not found (map to network for now)
    USER_NOT_FOUND: ErrorCode.REQUEST_FAILED,
    BAND_NOT_FOUND: ErrorCode.REQUEST_FAILED,
    LOCAL_NOT_FOUND: ErrorCode.REQUEST_FAILED,
    EVENT_NOT_FOUND: ErrorCode.REQUEST_FAILED,

    // Conflict
    USERNAME_ALREADY_EXISTS: ErrorCode.VALIDATION_ERROR,
    EMAIL_ALREADY_EXISTS: ErrorCode.VALIDATION_ERROR,
    BAND_NAME_ALREADY_EXISTS: ErrorCode.VALIDATION_ERROR,

    // Business rules
    CANNOT_FOLLOW_SELF: ErrorCode.VALIDATION_ERROR,
    ALREADY_FOLLOWING: ErrorCode.VALIDATION_ERROR,
    NOT_FOLLOWING: ErrorCode.VALIDATION_ERROR,
  };

  return mapping[apiCode] || ErrorCode.UNKNOWN_ERROR;
}

/**
 * Obtiene severidad basada en status code HTTP
 */
function getSeverityFromStatus(status: number): ErrorSeverity {
  if (status >= 500) return ErrorSeverity.HIGH;
  if (status === 401 || status === 403) return ErrorSeverity.MEDIUM;
  if (status >= 400) return ErrorSeverity.LOW;
  return ErrorSeverity.MEDIUM;
}

/**
 * Crea un error apropiado a partir de un error de fetch/axios
 * Útil para errores de red que no llegan a obtener respuesta del servidor
 */
export function createNetworkErrorFromFetch(
  error: unknown,
  url?: string
): NetworkError | ApiError {
  // Si ya es un ApiError, devolverlo
  if (error instanceof ApiError) {
    return error;
  }

  // Si es un Response con error body
  if (error instanceof Response) {
    // El caller debería haber parseado el body
    return new NetworkError(
      `Request failed with status ${error.status}`,
      ErrorCode.REQUEST_FAILED,
      "Error de conexión con el servidor.",
      { url }
    );
  }

  // Error de red genérico (fetch failed, timeout, etc.)
  if (error instanceof TypeError) {
    return new NetworkError(
      error.message,
      ErrorCode.NETWORK_ERROR,
      "No se pudo conectar al servidor. Verifica tu conexión.",
      { url }
    );
  }

  // Error desconocido
  const message = error instanceof Error ? error.message : "Unknown error";
  return new NetworkError(
    message,
    ErrorCode.UNKNOWN_NETWORK_ERROR,
    "Ha ocurrido un error de red inesperado.",
    { url }
  );
}
