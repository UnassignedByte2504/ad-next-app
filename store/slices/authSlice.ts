/**
 * Auth Slice - Estado de autenticación
 *
 * Maneja:
 * - Login/Logout con credenciales
 * - Login con Google OAuth
 * - Registro
 * - Refresh de sesión
 * - Estado del usuario
 *
 * SEGURIDAD:
 * - Tokens JWT almacenados en cookies httpOnly (no accesibles desde JS)
 * - Solo datos de usuario persistidos en localStorage
 * - Backend maneja la rotación de tokens
 */

import type { StateCreator } from "zustand";
import type { StoreState, AuthSlice, AuthState, RegisterData, User } from "../types";
import { logger } from "@lib/logger";
import { authService, type AuthUser } from "@lib/services/auth";
import { ApiError } from "@/errors";

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  authMethod: null,
};

/**
 * Convierte AuthUser del backend a User del frontend
 */
function mapAuthUserToUser(authUser: AuthUser): User {
  return {
    id: String(authUser.id),
    email: authUser.email,
    name: authUser.first_name
      ? `${authUser.first_name} ${authUser.last_name || ""}`.trim()
      : authUser.username,
    avatar: authUser.profile_image || undefined,
    role: (authUser.role as User["role"]) || "musician",
    createdAt: authUser.created_at,
  };
}

export const createAuthSlice: StateCreator<
  StoreState,
  [["zustand/immer", never], ["zustand/devtools", never]],
  [],
  AuthSlice
> = (set, get) => ({
  ...initialState,

  /**
   * Login con email y password
   * El backend setea cookies httpOnly con los tokens
   */
  login: async (email: string, password: string) => {
    set((state) => {
      state.auth.isLoading = true;
      state.auth.error = null;
    });

    try {
      const { data } = await authService.login(email, password);

      set((state) => {
        state.auth.user = mapAuthUserToUser(data.user);
        state.auth.isAuthenticated = true;
        state.auth.isLoading = false;
        state.auth.authMethod = "credentials";
      });

      logger.info("User logged in", { userId: data.user.id });
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.userMessage
          : error instanceof Error
            ? error.message
            : "Login failed";

      set((state) => {
        state.auth.error = message;
        state.auth.isLoading = false;
      });

      logger.error("Login failed", error instanceof Error ? error : undefined, { email });
      throw error;
    }
  },

  /**
   * Inicia el flujo de login con Google OAuth
   * Redirige al usuario a Google para autenticar
   */
  loginWithGoogle: async () => {
    set((state) => {
      state.auth.isLoading = true;
      state.auth.error = null;
    });

    try {
      const { data } = await authService.getGoogleAuthUrl();

      // Guardar state en sessionStorage para validación CSRF
      if (typeof window !== "undefined") {
        sessionStorage.setItem("google_oauth_state", data.state);
      }

      // Redirigir a Google
      window.location.href = data.auth_url;
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.userMessage
          : "Failed to initiate Google login";

      set((state) => {
        state.auth.error = message;
        state.auth.isLoading = false;
      });

      logger.error("Google OAuth initiation failed", error instanceof Error ? error : undefined);
      throw error;
    }
  },

  /**
   * Maneja el callback de Google OAuth
   * Llamado desde la página de callback después de la redirección
   */
  handleGoogleCallback: async (code: string) => {
    set((state) => {
      state.auth.isLoading = true;
      state.auth.error = null;
    });

    try {
      // Obtener state guardado para validación CSRF
      const savedState =
        typeof window !== "undefined"
          ? sessionStorage.getItem("google_oauth_state")
          : undefined;

      const { data } = await authService.handleGoogleCallback(
        code,
        savedState || undefined
      );

      // Limpiar state guardado
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("google_oauth_state");
      }

      set((state) => {
        state.auth.user = mapAuthUserToUser(data.user);
        state.auth.isAuthenticated = true;
        state.auth.isLoading = false;
        state.auth.authMethod = "google";
      });

      logger.info("User logged in via Google", { userId: data.user.id });
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.userMessage
          : "Google authentication failed";

      set((state) => {
        state.auth.error = message;
        state.auth.isLoading = false;
      });

      logger.error(
        "Google OAuth callback failed",
        error instanceof Error ? error : undefined
      );
      throw error;
    }
  },

  /**
   * Logout - Limpia cookies y estado local
   */
  logout: async () => {
    const userId = get().auth.user?.id;

    try {
      // Llamar al backend para limpiar cookies
      await authService.logout();
    } catch (error) {
      // Log pero no bloquear el logout local
      logger.warn(
        "Logout API call failed, clearing local state anyway",
        error instanceof Error ? error : undefined
      );
    }

    set((state) => {
      state.auth.user = null;
      state.auth.isAuthenticated = false;
      state.auth.error = null;
      state.auth.authMethod = null;
    });

    logger.info("User logged out", { userId });
  },

  /**
   * Registro de nuevo usuario
   */
  register: async (data: RegisterData) => {
    set((state) => {
      state.auth.isLoading = true;
      state.auth.error = null;
    });

    try {
      const { data: response } = await authService.register({
        email: data.email,
        password: data.password,
        username: data.name, // Usar name como username
        first_name: data.name,
      });

      set((state) => {
        state.auth.user = mapAuthUserToUser(response.user);
        state.auth.isAuthenticated = true;
        state.auth.isLoading = false;
        state.auth.authMethod = "credentials";
      });

      logger.info("User registered", { userId: response.user.id });
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.userMessage
          : error instanceof Error
            ? error.message
            : "Registration failed";

      set((state) => {
        state.auth.error = message;
        state.auth.isLoading = false;
      });

      logger.error("Registration failed", error instanceof Error ? error : undefined);
      throw error;
    }
  },

  /**
   * Refresca la sesión usando la refresh cookie
   * Llamado automáticamente cuando el access token expira
   */
  refreshSession: async () => {
    try {
      await authService.refreshTokens();
      logger.debug("Session refreshed");
    } catch (error) {
      logger.warn("Session refresh failed, logging out");
      await get().auth.logout();
    }
  },

  /**
   * Obtiene el usuario actual desde el backend
   * Útil para verificar sesión al cargar la app
   */
  fetchCurrentUser: async () => {
    set((state) => {
      state.auth.isLoading = true;
    });

    try {
      const { data } = await authService.getCurrentUser();

      set((state) => {
        state.auth.user = mapAuthUserToUser(data.user);
        state.auth.isAuthenticated = true;
        state.auth.isLoading = false;
      });

      logger.debug("Current user fetched", { userId: data.user.id });
    } catch (error) {
      // Si falla, el usuario no está autenticado
      set((state) => {
        state.auth.user = null;
        state.auth.isAuthenticated = false;
        state.auth.isLoading = false;
        state.auth.authMethod = null;
      });

      // Solo loggear si no es un error de auth esperado
      if (error instanceof ApiError && !error.requiresReauth()) {
        logger.error(
          "Failed to fetch current user",
          error instanceof Error ? error : undefined
        );
      }
    }
  },

  /**
   * Actualiza datos del usuario en el estado local
   */
  updateUser: (data) => {
    set((state) => {
      if (state.auth.user) {
        state.auth.user = { ...state.auth.user, ...data };
      }
    });
  },

  /**
   * Limpia el error de autenticación
   */
  clearError: () => {
    set((state) => {
      state.auth.error = null;
    });
  },

  /**
   * Establece el estado de carga
   */
  setLoading: (loading) => {
    set((state) => {
      state.auth.isLoading = loading;
    });
  },
});
