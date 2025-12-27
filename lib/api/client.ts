/**
 * API Client para Ayla Designs
 *
 * Cliente HTTP con:
 * - Manejo de errores consistente (alineado con backend)
 * - Correlation IDs automáticos
 * - Logging integrado
 * - Type-safe responses
 * - CSRF protection (double-submit pattern)
 */

import { logger } from "@lib/logger";
import {
  ApiError,
  ApiErrorResponse,
  isApiErrorResponse,
  createNetworkErrorFromFetch,
} from "@/errors";

/** Configuración del cliente */
export interface ApiClientConfig {
  baseUrl: string;
  defaultHeaders?: Record<string, string>;
  timeout?: number;
  /** Include credentials (cookies) in requests - default true */
  withCredentials?: boolean;
}

/** Opciones para cada request */
export interface RequestOptions extends Omit<RequestInit, "body"> {
  params?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
  timeout?: number;
}

/** Respuesta tipada del cliente */
export interface ApiResponse<T> {
  data: T;
  status: number;
  correlationId: string | null;
}

/** Genera un correlation ID único */
function generateCorrelationId(): string {
  return `fe-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/** Callback para manejar errores 401 (sesión expirada) */
export type UnauthorizedHandler = () => void | Promise<void>;

/**
 * CSRF Token Manager
 * Maneja la obtención y caché del token CSRF del backend
 */
class CsrfTokenManager {
  private token: string | null = null;
  private isFetching: boolean = false;
  private fetchPromise: Promise<string> | null = null;

  // Lazy initialization para evitar circular dependencies
  private get log() {
    return logger.withContext({ component: "CsrfTokenManager" });
  }

  /**
   * Obtiene el token CSRF (desde caché o del servidor)
   */
  async getToken(baseUrl: string): Promise<string> {
    // Si ya tenemos token, devolverlo
    if (this.token) {
      return this.token;
    }

    // Si ya estamos obteniendo el token, esperar a que termine
    if (this.isFetching && this.fetchPromise) {
      return this.fetchPromise;
    }

    // Obtener token del servidor
    this.isFetching = true;
    this.fetchPromise = this.fetchFromServer(baseUrl);

    try {
      const token = await this.fetchPromise;
      this.token = token;
      return token;
    } finally {
      this.isFetching = false;
      this.fetchPromise = null;
    }
  }

  /**
   * Refresca el token CSRF (fuerza nueva petición al servidor)
   */
  async refreshToken(baseUrl: string): Promise<string> {
    this.log.debug("Refreshing CSRF token");
    this.token = null;
    return this.getToken(baseUrl);
  }

  /**
   * Limpia el token en caché
   */
  clearToken(): void {
    this.log.debug("Clearing CSRF token");
    this.token = null;
  }

  /**
   * Obtiene el token del servidor
   */
  private async fetchFromServer(baseUrl: string): Promise<string> {
    const url = new URL("/api/v1/auth/csrf-token", baseUrl);

    this.log.debug("Fetching CSRF token from server", { url: url.toString() });

    try {
      const response = await fetch(url.toString(), {
        method: "GET",
        credentials: "include", // Incluir cookies para autenticación
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch CSRF token: ${response.status}`);
      }

      const data = await response.json() as { csrf_token: string };

      if (!data.csrf_token) {
        throw new Error("CSRF token not found in response");
      }

      this.log.debug("CSRF token fetched successfully");
      return data.csrf_token;
    } catch (error) {
      this.log.error("Failed to fetch CSRF token", error instanceof Error ? error : new Error(String(error)));
      throw error;
    }
  }
}

/** Métodos HTTP que requieren CSRF protection */
const CSRF_PROTECTED_METHODS = ["POST", "PUT", "PATCH", "DELETE"];

/**
 * Cliente API con manejo de errores integrado
 *
 * Features:
 * - Cookies httpOnly automáticas (credentials: include)
 * - Correlation IDs para trazabilidad
 * - Manejo de errores alineado con backend
 * - Callback para 401 (logout automático)
 * - CSRF protection para métodos POST, PUT, PATCH, DELETE
 */
export class ApiClient {
  private config: Required<ApiClientConfig>;
  private onUnauthorized: UnauthorizedHandler | null = null;
  private csrfManager: CsrfTokenManager;

  // Lazy initialization para evitar circular dependencies
  private get log() {
    return logger.withContext({ component: "ApiClient" });
  }

  constructor(config: ApiClientConfig) {
    this.config = {
      baseUrl: config.baseUrl,
      defaultHeaders: {
        "Content-Type": "application/json",
        ...config.defaultHeaders,
      },
      timeout: config.timeout ?? 30000,
      withCredentials: config.withCredentials ?? true,
    };
    this.csrfManager = new CsrfTokenManager();
  }

  /**
   * Registra un callback para manejar errores 401
   * Útil para logout automático cuando la sesión expira
   */
  setUnauthorizedHandler(handler: UnauthorizedHandler): void {
    this.onUnauthorized = handler;
  }

  /**
   * Realiza una petición GET
   */
  async get<T>(path: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>("GET", path, options);
  }

  /**
   * Realiza una petición POST
   */
  async post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>("POST", path, { ...options, body });
  }

  /**
   * Realiza una petición PUT
   */
  async put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>("PUT", path, { ...options, body });
  }

  /**
   * Realiza una petición PATCH
   */
  async patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>("PATCH", path, { ...options, body });
  }

  /**
   * Realiza una petición DELETE
   */
  async delete<T>(path: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>("DELETE", path, options);
  }

  /**
   * Método interno que realiza la petición
   */
  private async request<T>(
    method: string,
    path: string,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    const correlationId = generateCorrelationId();
    const url = this.buildUrl(path, options?.params);
    const timeout = options?.timeout ?? this.config.timeout;

    // Headers con correlation ID
    const headers: Record<string, string> = {
      ...this.config.defaultHeaders,
      "X-Correlation-ID": correlationId,
      ...(options?.headers as Record<string, string>),
    };

    // Añadir CSRF token para métodos que modifican estado
    if (CSRF_PROTECTED_METHODS.includes(method.toUpperCase())) {
      try {
        const csrfToken = await this.csrfManager.getToken(this.config.baseUrl);
        headers["X-CSRF-Token"] = csrfToken;
      } catch (error) {
        this.log.error("Failed to get CSRF token", error instanceof Error ? error : new Error(String(error)), {
          method,
          path,
          correlationId,
        });
        // Re-lanzar el error para que el caller maneje la falla
        throw error;
      }
    }

    // Configuración del fetch
    const fetchConfig: RequestInit = {
      method,
      headers,
      // Incluir cookies httpOnly en las peticiones
      credentials: this.config.withCredentials ? "include" : "same-origin",
      ...(options?.body !== undefined && {
        body: JSON.stringify(options.body),
      }),
    };

    // Log de inicio
    this.log.debug(`${method} ${path}`, {
      correlationId,
      hasBody: options?.body !== undefined,
      hasCsrfToken: !!headers["X-CSRF-Token"],
    });

    const startTime = performance.now();

    try {
      // Fetch con timeout
      const response = await this.fetchWithTimeout(url, fetchConfig, timeout);
      const duration = performance.now() - startTime;

      // Obtener correlation ID del response (puede ser diferente si el backend lo genera)
      const serverCorrelationId =
        response.headers.get("X-Correlation-ID") || correlationId;

      // Log de respuesta
      this.log.debug(`${method} ${path} completed`, {
        status: response.status,
        duration: `${duration.toFixed(0)}ms`,
        correlationId: serverCorrelationId,
      });

      // Manejar errores HTTP
      if (!response.ok) {
        // Si es 403 y es un error CSRF, refrescar token y reintentar
        if (response.status === 403 && CSRF_PROTECTED_METHODS.includes(method.toUpperCase())) {
          const isCsrfError = await this.isCsrfError(response.clone());

          if (isCsrfError) {
            this.log.warn("CSRF validation failed, refreshing token and retrying", {
              path,
              correlationId: serverCorrelationId,
            });

            // Refrescar token
            try {
              await this.csrfManager.refreshToken(this.config.baseUrl);

              // Reintentar la petición UNA SOLA VEZ
              this.log.debug("Retrying request with new CSRF token", { path });
              return this.requestWithoutCsrfRetry<T>(method, path, options);
            } catch (retryError) {
              this.log.error("Failed to retry after CSRF refresh", retryError instanceof Error ? retryError : new Error(String(retryError)), {
                path,
                correlationId: serverCorrelationId,
              });
              // Si falla el retry, continuar con el manejo normal de error
            }
          }
        }

        // Si es 401, notificar al handler (para logout automático)
        if (response.status === 401 && this.onUnauthorized) {
          this.log.warn("Unauthorized response, triggering logout", {
            path,
            correlationId: serverCorrelationId,
          });
          await this.onUnauthorized();
        }
        await this.handleErrorResponse(response, serverCorrelationId, path);
      }

      // Parsear respuesta exitosa
      const data = await this.parseResponseBody<T>(response);

      return {
        data,
        status: response.status,
        correlationId: serverCorrelationId,
      };
    } catch (error) {
      const duration = performance.now() - startTime;

      // Si ya es ApiError, propagar
      if (error instanceof ApiError) {
        this.log.error(`${method} ${path} failed`, error, {
          duration: `${duration.toFixed(0)}ms`,
          apiCode: error.apiCode,
          correlationId: error.correlationId,
        });
        throw error;
      }

      // Convertir otros errores a NetworkError
      const networkError = createNetworkErrorFromFetch(error, url);
      this.log.error(`${method} ${path} network error`, networkError, {
        duration: `${duration.toFixed(0)}ms`,
        correlationId,
      });
      throw networkError;
    }
  }

  /**
   * Construye la URL con query params
   */
  private buildUrl(
    path: string,
    params?: Record<string, string | number | boolean | undefined>
  ): string {
    const url = new URL(path, this.config.baseUrl);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  /**
   * Fetch con timeout usando AbortController
   */
  private async fetchWithTimeout(
    url: string,
    config: RequestInit,
    timeout: number
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });
      return response;
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error(`Request timeout after ${timeout}ms`);
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Maneja respuestas de error (4xx, 5xx)
   */
  private async handleErrorResponse(
    response: Response,
    correlationId: string,
    path: string
  ): Promise<never> {
    let body: unknown;

    try {
      body = await response.json();
    } catch {
      // Si no es JSON, crear error genérico
      throw new ApiError({
        code: "INTERNAL_ERROR",
        message: response.statusText || "Unknown error",
        status_code: response.status,
        correlation_id: correlationId,
        timestamp: new Date().toISOString(),
        path,
      });
    }

    // Si el body tiene formato de error de API
    if (isApiErrorResponse(body)) {
      throw new ApiError({
        ...body,
        correlation_id: body.correlation_id || correlationId,
        status_code: body.status_code || response.status,
      });
    }

    // Error no estructurado del servidor
    throw new ApiError({
      code: "INTERNAL_ERROR",
      message: typeof body === "object" && body !== null && "detail" in body
        ? String((body as { detail: unknown }).detail)
        : "Server error",
      status_code: response.status,
      correlation_id: correlationId,
      timestamp: new Date().toISOString(),
      path,
      details: typeof body === "object" ? (body as Record<string, unknown>) : undefined,
    });
  }

  /**
   * Parsea el body de la respuesta
   */
  private async parseResponseBody<T>(response: Response): Promise<T> {
    // 204 No Content
    if (response.status === 204) {
      return undefined as T;
    }

    const contentType = response.headers.get("Content-Type") || "";

    if (contentType.includes("application/json")) {
      return response.json() as Promise<T>;
    }

    // Para otros tipos, devolver texto
    return response.text() as unknown as T;
  }

  /**
   * Verifica si un error 403 es un error de CSRF
   */
  private async isCsrfError(response: Response): Promise<boolean> {
    try {
      const body = await response.json();

      // Verificar si es una respuesta de error de API
      if (isApiErrorResponse(body)) {
        // El backend debería devolver un código específico para CSRF
        return (
          body.code === "CSRF_TOKEN_MISSING" ||
          body.code === "CSRF_TOKEN_INVALID" ||
          (body.code === "FORBIDDEN" &&
            (body.message.toLowerCase().includes("csrf") ||
              body.message.toLowerCase().includes("token")))
        );
      }
    } catch {
      // Si no se puede parsear el JSON, no es un error CSRF estructurado
      return false;
    }

    return false;
  }

  /**
   * Realiza una petición sin el mecanismo de retry de CSRF
   * Se usa al reintentar después de refrescar el token para evitar loops infinitos
   */
  private async requestWithoutCsrfRetry<T>(
    method: string,
    path: string,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    const correlationId = generateCorrelationId();
    const url = this.buildUrl(path, options?.params);
    const timeout = options?.timeout ?? this.config.timeout;

    // Headers con correlation ID
    const headers: Record<string, string> = {
      ...this.config.defaultHeaders,
      "X-Correlation-ID": correlationId,
      ...(options?.headers as Record<string, string>),
    };

    // Añadir CSRF token para métodos que modifican estado
    if (CSRF_PROTECTED_METHODS.includes(method.toUpperCase())) {
      try {
        const csrfToken = await this.csrfManager.getToken(this.config.baseUrl);
        headers["X-CSRF-Token"] = csrfToken;
      } catch (error) {
        this.log.error("Failed to get CSRF token on retry", error instanceof Error ? error : new Error(String(error)), {
          method,
          path,
          correlationId,
        });
        throw error;
      }
    }

    // Configuración del fetch
    const fetchConfig: RequestInit = {
      method,
      headers,
      credentials: this.config.withCredentials ? "include" : "same-origin",
      ...(options?.body !== undefined && {
        body: JSON.stringify(options.body),
      }),
    };

    this.log.debug(`${method} ${path} (retry)`, {
      correlationId,
      hasBody: options?.body !== undefined,
      hasCsrfToken: !!headers["X-CSRF-Token"],
    });

    const startTime = performance.now();

    try {
      const response = await this.fetchWithTimeout(url, fetchConfig, timeout);
      const duration = performance.now() - startTime;

      const serverCorrelationId =
        response.headers.get("X-Correlation-ID") || correlationId;

      this.log.debug(`${method} ${path} (retry) completed`, {
        status: response.status,
        duration: `${duration.toFixed(0)}ms`,
        correlationId: serverCorrelationId,
      });

      // Manejar errores HTTP (sin retry de CSRF esta vez)
      if (!response.ok) {
        if (response.status === 401 && this.onUnauthorized) {
          this.log.warn("Unauthorized response on retry, triggering logout", {
            path,
            correlationId: serverCorrelationId,
          });
          await this.onUnauthorized();
        }
        await this.handleErrorResponse(response, serverCorrelationId, path);
      }

      const data = await this.parseResponseBody<T>(response);

      return {
        data,
        status: response.status,
        correlationId: serverCorrelationId,
      };
    } catch (error) {
      const duration = performance.now() - startTime;

      if (error instanceof ApiError) {
        this.log.error(`${method} ${path} (retry) failed`, error, {
          duration: `${duration.toFixed(0)}ms`,
          apiCode: error.apiCode,
          correlationId: error.correlationId,
        });
        throw error;
      }

      const networkError = createNetworkErrorFromFetch(error, url);
      this.log.error(`${method} ${path} (retry) network error`, networkError, {
        duration: `${duration.toFixed(0)}ms`,
        correlationId,
      });
      throw networkError;
    }
  }
}

/**
 * Instancia por defecto del cliente (lazy initialization)
 * Configurar con la URL del backend
 *
 * NOTA: Usamos lazy initialization para evitar TDZ errors durante SSR.
 * La instancia se crea la primera vez que se accede a ella.
 */
let _apiClient: ApiClient | null = null;

export function getApiClient(): ApiClient {
  if (!_apiClient) {
    _apiClient = new ApiClient({
      baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
    });
  }
  return _apiClient;
}

// Backwards-compatible export (getter)
// This allows `import { apiClient }` to still work
export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) => getApiClient().get<T>(path, options),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) => getApiClient().post<T>(path, body, options),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) => getApiClient().put<T>(path, body, options),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) => getApiClient().patch<T>(path, body, options),
  delete: <T>(path: string, options?: RequestOptions) => getApiClient().delete<T>(path, options),
  setUnauthorizedHandler: (handler: UnauthorizedHandler) => getApiClient().setUnauthorizedHandler(handler),
};

/**
 * Exportar para crear instancias personalizadas
 */
export { generateCorrelationId };
