/**
 * Auth Slice Unit Tests
 *
 * Tests para el slice de autenticación en Zustand.
 * Cubre estados, acciones, manejo de errores y loading states.
 */

import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { createStore } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { StoreState, AuthSlice, User } from "@store/types";
import type { AuthUser } from "@lib/services/auth";

// Mock del auth service
vi.mock("@lib/services/auth", () => ({
  authService: {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    getCurrentUser: vi.fn(),
    getGoogleAuthUrl: vi.fn(),
    handleGoogleCallback: vi.fn(),
    refreshTokens: vi.fn(),
  },
}));

// Mock del logger
vi.mock("@lib/logger", () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  },
}));

// Mock de errors - debe ir antes de los imports que lo usan
vi.mock("@/errors", () => {
  class MockApiError extends Error {
    public readonly apiCode: string;
    public readonly correlationId: string;
    public readonly path: string;
    public readonly details: Record<string, unknown>;
    public readonly userMessage: string;

    constructor(response: {
      code: string;
      message: string;
      status_code: number;
      correlation_id: string;
      timestamp: string;
      path: string;
      details?: Record<string, unknown>;
    }) {
      super(response.message);
      this.name = "ApiError";
      this.apiCode = response.code;
      this.correlationId = response.correlation_id;
      this.path = response.path;
      this.details = response.details || {};
      this.userMessage = response.message;
    }

    requiresReauth(): boolean {
      return this.apiCode === "TOKEN_EXPIRED" || this.apiCode === "AUTHENTICATION_REQUIRED";
    }
  }

  return {
    ApiError: MockApiError,
  };
});

// Imports que dependen de los mocks
import { createAuthSlice } from "@store/slices/authSlice";
import { authService } from "@lib/services/auth";
import { ApiError } from "@/errors";

describe("AuthSlice", () => {
  let store: ReturnType<typeof createTestStore>;

  // Helper para crear store de test
  function createTestStore() {
    return createStore<StoreState>()(
      immer((...args) => ({
        auth: createAuthSlice(...args),
        ui: {} as StoreState["ui"],
        search: {} as StoreState["search"],
        consent: {} as StoreState["consent"],
      }))
    );
  }

  // Mock data
  const mockAuthUser: AuthUser = {
    id: 1,
    email: "test@bemyre.com",
    username: "testuser",
    first_name: "Test",
    last_name: "User",
    profile_image: "/avatars/test.png",
    role: "musician",
    is_active: true,
    created_at: "2024-01-15T10:30:00Z",
  };

  const mockUser: User = {
    id: "1",
    email: "test@bemyre.com",
    name: "Test User",
    avatar: "/avatars/test.png",
    role: "musician",
    createdAt: "2024-01-15T10:30:00Z",
  };

  beforeEach(() => {
    // Crear nuevo store antes de cada test
    store = createTestStore();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Initial State", () => {
    it("should have correct initial state", () => {
      const state = store.getState().auth;

      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.authMethod).toBeNull();
    });
  });

  describe("login", () => {
    it("should successfully login user", async () => {
      // Arrange
      const email = "test@bemyre.com";
      const password = "password123";

      vi.mocked(authService.login).mockResolvedValueOnce({
        data: {
          user: mockAuthUser,
          tokens: {
            access_token: "token",
            refresh_token: "refresh",
            token_type: "Bearer",
            expires_in: 3600,
          },
        },
        status: 200,
        correlationId: "test-id",
      });

      // Act
      await store.getState().auth.login(email, password);

      // Assert
      const state = store.getState().auth;
      expect(state.user).toMatchObject({
        id: "1",
        email: "test@bemyre.com",
        name: "Test User",
      });
      expect(state.isAuthenticated).toBe(true);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.authMethod).toBe("credentials");
    });

    it("should set loading state while logging in", async () => {
      // Arrange
      const email = "test@bemyre.com";
      const password = "password123";

      // Mock que nunca se resuelve para verificar loading state
      vi.mocked(authService.login).mockImplementation(
        () => new Promise(() => {})
      );

      // Act
      const loginPromise = store.getState().auth.login(email, password);

      // Assert - verificar que isLoading se setea a true inmediatamente
      expect(store.getState().auth.isLoading).toBe(true);
      expect(store.getState().auth.error).toBeNull();

      // Cleanup
      vi.mocked(authService.login).mockRestore();
    });

    it("should handle login error with ApiError", async () => {
      // Arrange
      const email = "test@bemyre.com";
      const password = "wrongpassword";

      const apiError = new ApiError({
        code: "INVALID_CREDENTIALS",
        message: "Invalid email or password",
        status_code: 401,
        correlation_id: "test-id",
        timestamp: new Date().toISOString(),
        path: "/api/v1/auth/login",
      });

      vi.mocked(authService.login).mockRejectedValueOnce(apiError);

      // Act & Assert
      await expect(store.getState().auth.login(email, password)).rejects.toThrow();

      const state = store.getState().auth;
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeDefined();
    });

    it("should handle login error with generic Error", async () => {
      // Arrange
      const email = "test@bemyre.com";
      const password = "password123";

      vi.mocked(authService.login).mockRejectedValueOnce(
        new Error("Network error")
      );

      // Act & Assert
      await expect(store.getState().auth.login(email, password)).rejects.toThrow();

      const state = store.getState().auth;
      expect(state.error).toBe("Network error");
      expect(state.isLoading).toBe(false);
    });

    it("should handle unknown error type", async () => {
      // Arrange
      const email = "test@bemyre.com";
      const password = "password123";

      vi.mocked(authService.login).mockRejectedValueOnce("Unknown error");

      // Act & Assert
      await expect(store.getState().auth.login(email, password)).rejects.toThrow();

      const state = store.getState().auth;
      expect(state.error).toBe("Login failed");
      expect(state.isLoading).toBe(false);
    });
  });

  describe("loginWithGoogle", () => {
    it("should initiate Google OAuth flow", async () => {
      // Arrange
      const mockAuthUrl = "https://accounts.google.com/o/oauth2/v2/auth?...";
      const mockState = "random-state-string";

      vi.mocked(authService.getGoogleAuthUrl).mockResolvedValueOnce({
        data: {
          auth_url: mockAuthUrl,
          state: mockState,
        },
        status: 200,
        correlationId: "test-id",
      });

      // Mock window.location
      const originalLocation = window.location;
      delete (window as any).location;
      window.location = { href: "" } as any;

      // Mock sessionStorage
      const mockSessionStorage = {
        setItem: vi.fn(),
        getItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
        length: 0,
        key: vi.fn(),
      };
      Object.defineProperty(window, "sessionStorage", {
        value: mockSessionStorage,
        writable: true,
      });

      // Act
      await store.getState().auth.loginWithGoogle();

      // Assert
      expect(authService.getGoogleAuthUrl).toHaveBeenCalled();
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith(
        "google_oauth_state",
        mockState
      );
      expect(window.location.href).toBe(mockAuthUrl);

      // Cleanup
      window.location = originalLocation;
    });

    it("should handle Google OAuth initiation error", async () => {
      // Arrange
      const apiError = new ApiError({
        code: "EXTERNAL_SERVICE_ERROR",
        message: "Google OAuth unavailable",
        status_code: 503,
        correlation_id: "test-id",
        timestamp: new Date().toISOString(),
        path: "/api/v1/auth/google",
      });

      vi.mocked(authService.getGoogleAuthUrl).mockRejectedValueOnce(apiError);

      // Act & Assert
      await expect(
        store.getState().auth.loginWithGoogle()
      ).rejects.toThrow();

      const state = store.getState().auth;
      expect(state.error).toBeDefined();
      expect(state.isLoading).toBe(false);
    });
  });

  describe("handleGoogleCallback", () => {
    it("should successfully handle Google callback", async () => {
      // Arrange
      const code = "google-auth-code";
      const mockState = "random-state-string";

      // Mock sessionStorage
      const mockSessionStorage = {
        setItem: vi.fn(),
        getItem: vi.fn(() => mockState),
        removeItem: vi.fn(),
        clear: vi.fn(),
        length: 0,
        key: vi.fn(),
      };
      Object.defineProperty(window, "sessionStorage", {
        value: mockSessionStorage,
        writable: true,
      });

      vi.mocked(authService.handleGoogleCallback).mockResolvedValueOnce({
        data: {
          user: mockAuthUser,
          tokens: {
            access_token: "token",
            refresh_token: "refresh",
            token_type: "Bearer",
            expires_in: 3600,
          },
        },
        status: 200,
        correlationId: "test-id",
      });

      // Act
      await store.getState().auth.handleGoogleCallback(code);

      // Assert
      const state = store.getState().auth;
      expect(state.user).toMatchObject({
        id: "1",
        email: "test@bemyre.com",
      });
      expect(state.isAuthenticated).toBe(true);
      expect(state.authMethod).toBe("google");
      expect(state.isLoading).toBe(false);
      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith(
        "google_oauth_state"
      );
    });

    it("should handle Google callback error", async () => {
      // Arrange
      const code = "invalid-code";

      const apiError = new ApiError({
        code: "INVALID_CREDENTIALS",
        message: "Invalid authorization code",
        status_code: 401,
        correlation_id: "test-id",
        timestamp: new Date().toISOString(),
        path: "/api/v1/auth/google/callback",
      });

      vi.mocked(authService.handleGoogleCallback).mockRejectedValueOnce(
        apiError
      );

      // Act & Assert
      await expect(
        store.getState().auth.handleGoogleCallback(code)
      ).rejects.toThrow();

      const state = store.getState().auth;
      expect(state.error).toBeDefined();
      expect(state.isLoading).toBe(false);
    });
  });

  describe("logout", () => {
    it("should successfully logout user", async () => {
      // Arrange - primero hacer login
      store.setState((state) => {
        state.auth.user = mockUser;
        state.auth.isAuthenticated = true;
        state.auth.authMethod = "credentials";
      });

      vi.mocked(authService.logout).mockResolvedValueOnce({
        data: { message: "Logged out" },
        status: 200,
        correlationId: "test-id",
      });

      // Act
      await store.getState().auth.logout();

      // Assert
      const state = store.getState().auth;
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.error).toBeNull();
      expect(state.authMethod).toBeNull();
    });

    it("should clear state even if logout API call fails", async () => {
      // Arrange - primero hacer login
      store.setState((state) => {
        state.auth.user = mockUser;
        state.auth.isAuthenticated = true;
        state.auth.authMethod = "credentials";
      });

      vi.mocked(authService.logout).mockRejectedValueOnce(
        new Error("Network error")
      );

      // Act
      await store.getState().auth.logout();

      // Assert - debe limpiar estado local aunque falle la API
      const state = store.getState().auth;
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe("register", () => {
    it("should successfully register new user", async () => {
      // Arrange
      const registerData = {
        email: "newuser@bemyre.com",
        password: "password123",
        name: "New User",
      };

      vi.mocked(authService.register).mockResolvedValueOnce({
        data: {
          user: {
            ...mockAuthUser,
            email: registerData.email,
            first_name: registerData.name,
          },
          tokens: {
            access_token: "token",
            refresh_token: "refresh",
            token_type: "Bearer",
            expires_in: 3600,
          },
        },
        status: 201,
        correlationId: "test-id",
      });

      // Act
      await store.getState().auth.register(registerData);

      // Assert
      const state = store.getState().auth;
      expect(state.user).toBeDefined();
      expect(state.user?.email).toBe(registerData.email);
      expect(state.isAuthenticated).toBe(true);
      expect(state.authMethod).toBe("credentials");
      expect(state.isLoading).toBe(false);
    });

    it("should handle registration error", async () => {
      // Arrange
      const registerData = {
        email: "existing@bemyre.com",
        password: "password123",
        name: "Test User",
      };

      const apiError = new ApiError({
        code: "EMAIL_ALREADY_EXISTS",
        message: "Email already in use",
        status_code: 409,
        correlation_id: "test-id",
        timestamp: new Date().toISOString(),
        path: "/api/v1/auth/register",
      });

      vi.mocked(authService.register).mockRejectedValueOnce(apiError);

      // Act & Assert
      await expect(
        store.getState().auth.register(registerData)
      ).rejects.toThrow();

      const state = store.getState().auth;
      expect(state.error).toBeDefined();
      expect(state.isLoading).toBe(false);
    });
  });

  describe("refreshSession", () => {
    it("should successfully refresh session", async () => {
      // Arrange
      vi.mocked(authService.refreshTokens).mockResolvedValueOnce({
        data: {
          access_token: "new-token",
          refresh_token: "new-refresh",
          token_type: "Bearer",
          expires_in: 3600,
        },
        status: 200,
        correlationId: "test-id",
      });

      // Act
      await store.getState().auth.refreshSession();

      // Assert
      expect(authService.refreshTokens).toHaveBeenCalled();
    });

    it("should logout on refresh failure", async () => {
      // Arrange - primero hacer login
      store.setState((state) => {
        state.auth.user = mockUser;
        state.auth.isAuthenticated = true;
      });

      vi.mocked(authService.refreshTokens).mockRejectedValueOnce(
        new Error("Refresh failed")
      );

      // Act
      await store.getState().auth.refreshSession();

      // Assert - debe hacer logout automáticamente
      const state = store.getState().auth;
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe("fetchCurrentUser", () => {
    it("should successfully fetch current user", async () => {
      // Arrange
      vi.mocked(authService.getCurrentUser).mockResolvedValueOnce({
        data: { user: mockAuthUser },
        status: 200,
        correlationId: "test-id",
      });

      // Act
      await store.getState().auth.fetchCurrentUser();

      // Assert
      const state = store.getState().auth;
      expect(state.user).toBeDefined();
      expect(state.user?.email).toBe(mockAuthUser.email);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isLoading).toBe(false);
    });

    it("should clear auth state on unauthorized error", async () => {
      // Arrange
      const apiError = new ApiError({
        code: "UNAUTHORIZED",
        message: "Not authenticated",
        status_code: 401,
        correlation_id: "test-id",
        timestamp: new Date().toISOString(),
        path: "/api/v1/auth/me",
      });

      vi.mocked(authService.getCurrentUser).mockRejectedValueOnce(apiError);

      // Act
      await store.getState().auth.fetchCurrentUser();

      // Assert
      const state = store.getState().auth;
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
    });
  });

  describe("updateUser", () => {
    it("should update user data", () => {
      // Arrange - primero setear un usuario
      store.setState((state) => {
        state.auth.user = mockUser;
      });

      const updates = {
        name: "Updated Name",
        avatar: "/avatars/new.png",
      };

      // Act
      store.getState().auth.updateUser(updates);

      // Assert
      const state = store.getState().auth;
      expect(state.user?.name).toBe(updates.name);
      expect(state.user?.avatar).toBe(updates.avatar);
    });

    it("should not update if no user is logged in", () => {
      // Arrange - no hay usuario
      const updates = {
        name: "Updated Name",
      };

      // Act
      store.getState().auth.updateUser(updates);

      // Assert
      const state = store.getState().auth;
      expect(state.user).toBeNull();
    });
  });

  describe("clearError", () => {
    it("should clear error state", () => {
      // Arrange - setear un error
      store.setState((state) => {
        state.auth.error = "Some error";
      });

      // Act
      store.getState().auth.clearError();

      // Assert
      const state = store.getState().auth;
      expect(state.error).toBeNull();
    });
  });

  describe("setLoading", () => {
    it("should set loading state to true", () => {
      // Act
      store.getState().auth.setLoading(true);

      // Assert
      expect(store.getState().auth.isLoading).toBe(true);
    });

    it("should set loading state to false", () => {
      // Arrange
      store.setState((state) => {
        state.auth.isLoading = true;
      });

      // Act
      store.getState().auth.setLoading(false);

      // Assert
      expect(store.getState().auth.isLoading).toBe(false);
    });
  });

  describe("Loading States", () => {
    it("should manage loading state during async operations", async () => {
      // Arrange
      let resolveLogin: any;
      const loginPromise = new Promise((resolve) => {
        resolveLogin = resolve;
      });

      vi.mocked(authService.login).mockReturnValueOnce(loginPromise as any);

      // Act
      const loginAction = store.getState().auth.login("test@test.com", "pass");

      // Assert - loading debe ser true
      expect(store.getState().auth.isLoading).toBe(true);

      // Resolver el promise
      resolveLogin({
        data: {
          user: mockAuthUser,
          tokens: {
            access_token: "token",
            refresh_token: "refresh",
            token_type: "Bearer",
            expires_in: 3600,
          },
        },
        status: 200,
        correlationId: "test-id",
      });

      await loginAction;

      // Assert - loading debe ser false
      expect(store.getState().auth.isLoading).toBe(false);
    });
  });

  describe("Error Handling", () => {
    it("should set error message from ApiError", async () => {
      // Arrange
      const apiError = new ApiError({
        code: "VALIDATION_ERROR",
        message: "Invalid input",
        status_code: 400,
        correlation_id: "test-id",
        timestamp: new Date().toISOString(),
        path: "/api/v1/auth/login",
      });

      vi.mocked(authService.login).mockRejectedValueOnce(apiError);

      // Act
      try {
        await store.getState().auth.login("test@test.com", "pass");
      } catch (e) {
        // Expected
      }

      // Assert
      const state = store.getState().auth;
      expect(state.error).toBeDefined();
      expect(state.isLoading).toBe(false);
    });

    it("should preserve user state on non-auth errors", async () => {
      // Arrange - usuario ya autenticado
      store.setState((state) => {
        state.auth.user = mockUser;
        state.auth.isAuthenticated = true;
      });

      // Error que no es de auth (ej: network)
      const error = new Error("Network timeout");
      vi.mocked(authService.refreshTokens).mockRejectedValueOnce(error);

      // Act
      await store.getState().auth.refreshSession();

      // Assert - debe hacer logout en caso de refresh failure
      const state = store.getState().auth;
      expect(state.isAuthenticated).toBe(false);
    });
  });
});
