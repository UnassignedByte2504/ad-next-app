/**
 * useApiError Hook
 *
 * Hook para manejar errores de API de forma consistente en componentes.
 * Proporciona:
 * - Estado de error tipado
 * - Mensajes de usuario listos para mostrar
 * - Detección de errores que requieren re-auth
 * - Reset de errores
 *
 * @example
 * ```tsx
 * function UserProfile() {
 *   const { error, setError, clearError, userMessage, requiresReauth } = useApiError();
 *
 *   async function loadUser() {
 *     try {
 *       const user = await apiClient.get('/users/me');
 *       // ...
 *     } catch (e) {
 *       setError(e);
 *     }
 *   }
 *
 *   if (requiresReauth) {
 *     return <LoginRedirect />;
 *   }
 *
 *   if (error) {
 *     return <ErrorMessage message={userMessage} onRetry={clearError} />;
 *   }
 *
 *   return <div>...</div>;
 * }
 * ```
 */

import { useState, useCallback, useMemo } from "react";
import {
  ApiError,
  ApiErrorCode,
  AppError,
  ErrorCode,
  ErrorSeverity,
  isAppError,
  API_ERROR_USER_MESSAGES,
  NetworkError,
} from "@/errors";
import { useLogger } from "./useLogger";

export interface UseApiErrorReturn {
  /** El error actual o null */
  error: ApiError | AppError | null;
  /** Código de error de API (si aplica) */
  apiCode: ApiErrorCode | null;
  /** Mensaje para mostrar al usuario */
  userMessage: string | null;
  /** Si el error requiere re-autenticación */
  requiresReauth: boolean;
  /** Si el error es retryable */
  isRetryable: boolean;
  /** Correlation ID para debugging */
  correlationId: string | null;
  /** Establecer un error */
  setError: (error: unknown) => void;
  /** Limpiar el error actual */
  clearError: () => void;
  /** Si hay un error activo */
  hasError: boolean;
}

export interface UseApiErrorOptions {
  /** Nombre del componente para logging */
  componentName?: string;
  /** Callback cuando ocurre un error */
  onError?: (error: ApiError | AppError) => void;
  /** Callback cuando se requiere re-auth */
  onRequiresReauth?: () => void;
}

/**
 * Hook para manejar errores de API en componentes
 */
export function useApiError(options: UseApiErrorOptions = {}): UseApiErrorReturn {
  const { componentName = "Component", onError, onRequiresReauth } = options;
  const log = useLogger(componentName);

  const [error, setErrorState] = useState<ApiError | AppError | null>(null);

  // Establecer error
  const setError = useCallback(
    (e: unknown) => {
      let appError: ApiError | AppError;

      if (e instanceof ApiError) {
        appError = e;
      } else if (isAppError(e)) {
        appError = e;
      } else if (e instanceof Error) {
        // Wrap error genérico como NetworkError
        appError = new NetworkError(
          e.message,
          ErrorCode.UNKNOWN_ERROR,
          "Ha ocurrido un error inesperado."
        );
      } else {
        // Error completamente desconocido
        appError = new NetworkError(
          String(e),
          ErrorCode.UNKNOWN_ERROR,
          "Ha ocurrido un error inesperado."
        );
      }

      log.error("API Error", appError, {
        apiCode: appError instanceof ApiError ? appError.apiCode : undefined,
        correlationId: appError instanceof ApiError ? appError.correlationId : undefined,
      });

      setErrorState(appError);
      onError?.(appError);

      // Detectar si requiere re-auth
      if (appError instanceof ApiError && appError.requiresReauth()) {
        onRequiresReauth?.();
      }
    },
    [log, onError, onRequiresReauth]
  );

  // Limpiar error
  const clearError = useCallback(() => {
    setErrorState(null);
  }, []);

  // Valores derivados
  const derivedValues = useMemo(() => {
    if (!error) {
      return {
        apiCode: null,
        userMessage: null,
        requiresReauth: false,
        isRetryable: false,
        correlationId: null,
        hasError: false,
      };
    }

    const isApiErr = error instanceof ApiError;

    return {
      apiCode: isApiErr ? error.apiCode : null,
      userMessage: isApiErr
        ? API_ERROR_USER_MESSAGES[error.apiCode] || error.message
        : isAppError(error)
          ? error.userMessage
          : "Ha ocurrido un error inesperado.",
      requiresReauth: isApiErr ? error.requiresReauth() : false,
      isRetryable: error.isRetryable,
      correlationId: isApiErr ? error.correlationId : null,
      hasError: true,
    };
  }, [error]);

  return {
    error,
    ...derivedValues,
    setError,
    clearError,
  };
}
