/**
 * Auth Service - Servicio de autenticación
 *
 * Abstrae las llamadas a la API de autenticación.
 * Usa httpOnly cookies para tokens (manejadas por el backend).
 *
 * @example
 * ```ts
 * import { authService } from "@lib/services/auth";
 *
 * // Login con credenciales
 * const { user } = await authService.login("email@example.com", "password");
 *
 * // Login con Google
 * const { authUrl } = await authService.getGoogleAuthUrl();
 * window.location.href = authUrl;
 *
 * // Logout
 * await authService.logout();
 * ```
 */

import { apiClient, type ApiResponse } from "@lib/api/client";

// ============================================
// Types - Alineados con backend
// ============================================

/** Usuario autenticado */
export interface AuthUser {
  id: number;
  email: string;
  username: string;
  first_name: string | null;
  last_name: string | null;
  profile_image: string | null;
  role: string | null;
  is_active: boolean;
  created_at: string;
}

/** Respuesta de tokens (informativo, los tokens van en cookies) */
export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

/** Respuesta de login/register */
export interface LoginResponse {
  user: AuthUser;
  tokens: TokenResponse;
}

/** Respuesta de /auth/me */
export interface MeResponse {
  user: AuthUser;
}

/** Respuesta de Google OAuth URL */
export interface GoogleAuthUrlResponse {
  auth_url: string;
  state: string;
}

/** Request de login */
export interface LoginRequest {
  email: string;
  password: string;
}

/** Request de registro */
export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
  first_name?: string;
  last_name?: string;
}

/** Request de refresh */
export interface RefreshTokenRequest {
  refresh_token: string;
}

// ============================================
// Auth Service
// ============================================

class AuthService {
  private readonly basePath = "/api/v1/auth";

  /**
   * Login con email y password
   *
   * El backend setea cookies httpOnly con los tokens.
   */
  async login(email: string, password: string): Promise<ApiResponse<LoginResponse>> {
    return apiClient.post<LoginResponse>(`${this.basePath}/login`, {
      email,
      password,
    });
  }

  /**
   * Registro de nuevo usuario
   *
   * El backend setea cookies httpOnly con los tokens.
   */
  async register(data: RegisterRequest): Promise<ApiResponse<LoginResponse>> {
    return apiClient.post<LoginResponse>(`${this.basePath}/register`, data);
  }

  /**
   * Obtener usuario actual
   *
   * Usa la cookie httpOnly para autenticar.
   */
  async getCurrentUser(): Promise<ApiResponse<MeResponse>> {
    return apiClient.get<MeResponse>(`${this.basePath}/me`);
  }

  /**
   * Refrescar tokens
   *
   * Usa la refresh cookie para obtener nuevos tokens.
   * El backend actualiza las cookies automáticamente.
   */
  async refreshTokens(): Promise<ApiResponse<TokenResponse>> {
    // El refresh_token se envía automáticamente via cookie
    return apiClient.post<TokenResponse>(`${this.basePath}/refresh`, {});
  }

  /**
   * Logout - Limpia las cookies de sesión
   */
  async logout(): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<{ message: string }>(`${this.basePath}/logout`);
  }

  /**
   * Obtener URL de autorización de Google OAuth
   *
   * Redirigir al usuario a esta URL para iniciar el flujo.
   */
  async getGoogleAuthUrl(): Promise<ApiResponse<GoogleAuthUrlResponse>> {
    return apiClient.get<GoogleAuthUrlResponse>(`${this.basePath}/google`);
  }

  /**
   * Manejar callback de Google OAuth
   *
   * Intercambia el code por tokens (setea cookies).
   */
  async handleGoogleCallback(
    code: string,
    state?: string
  ): Promise<ApiResponse<LoginResponse>> {
    const params: Record<string, string> = { code };
    if (state) {
      params.state = state;
    }

    return apiClient.get<LoginResponse>(`${this.basePath}/google/callback`, {
      params,
    });
  }
}

/** Singleton del servicio de autenticación */
export const authService = new AuthService();

/** Exportar clase para testing */
export { AuthService };
