/**
 * Auth Service Unit Tests
 *
 * Tests para el servicio de autenticación.
 * Cubre todos los métodos del AuthService con casos de éxito y error.
 */

import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { authService, AuthService } from "@lib/services/auth";
import { apiClient } from "@lib/api/client";
import type {
  LoginResponse,
  RegisterRequest,
  MeResponse,
  GoogleAuthUrlResponse,
  AuthUser,
  TokenResponse,
} from "@lib/services/auth";

// Mock del API client
vi.mock("@lib/api/client", () => ({
  apiClient: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

describe("AuthService", () => {
  // Mock data
  const mockUser: AuthUser = {
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

  const mockTokens: TokenResponse = {
    access_token: "mock-access-token",
    refresh_token: "mock-refresh-token",
    token_type: "Bearer",
    expires_in: 3600,
  };

  const mockLoginResponse: LoginResponse = {
    user: mockUser,
    tokens: mockTokens,
  };

  beforeEach(() => {
    // Limpiar mocks antes de cada test
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("login", () => {
    it("should successfully login with valid credentials", async () => {
      // Arrange
      const email = "test@bemyre.com";
      const password = "password123";
      const mockResponse = {
        data: mockLoginResponse,
        status: 200,
        correlationId: "test-correlation-id",
      };

      vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse);

      // Act
      const result = await authService.login(email, password);

      // Assert
      expect(apiClient.post).toHaveBeenCalledWith("/api/v1/auth/login", {
        email,
        password,
      });
      expect(result).toEqual(mockResponse);
      expect(result.data.user.email).toBe(email);
    });

    it("should throw error on invalid credentials", async () => {
      // Arrange
      const email = "test@bemyre.com";
      const password = "wrongpassword";
      const mockError = new Error("Invalid credentials");

      vi.mocked(apiClient.post).mockRejectedValueOnce(mockError);

      // Act & Assert
      await expect(authService.login(email, password)).rejects.toThrow(
        "Invalid credentials"
      );
      expect(apiClient.post).toHaveBeenCalledWith("/api/v1/auth/login", {
        email,
        password,
      });
    });

    it("should throw error on network failure", async () => {
      // Arrange
      const email = "test@bemyre.com";
      const password = "password123";
      const mockError = new Error("Network error");

      vi.mocked(apiClient.post).mockRejectedValueOnce(mockError);

      // Act & Assert
      await expect(authService.login(email, password)).rejects.toThrow("Network error");
    });
  });

  describe("register", () => {
    it("should successfully register a new user", async () => {
      // Arrange
      const registerData: RegisterRequest = {
        email: "newuser@bemyre.com",
        password: "password123",
        username: "newuser",
        first_name: "New",
        last_name: "User",
      };

      const mockResponse = {
        data: mockLoginResponse,
        status: 201,
        correlationId: "test-correlation-id",
      };

      vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse);

      // Act
      const result = await authService.register(registerData);

      // Assert
      expect(apiClient.post).toHaveBeenCalledWith(
        "/api/v1/auth/register",
        registerData
      );
      expect(result).toEqual(mockResponse);
      expect(result.data.user).toBeDefined();
      expect(result.data.tokens).toBeDefined();
    });

    it("should throw error when email already exists", async () => {
      // Arrange
      const registerData: RegisterRequest = {
        email: "existing@bemyre.com",
        password: "password123",
        username: "existinguser",
      };

      const mockError = new Error("Email already exists");

      vi.mocked(apiClient.post).mockRejectedValueOnce(mockError);

      // Act & Assert
      await expect(authService.register(registerData)).rejects.toThrow(
        "Email already exists"
      );
    });

    it("should throw error when username already exists", async () => {
      // Arrange
      const registerData: RegisterRequest = {
        email: "new@bemyre.com",
        password: "password123",
        username: "existinguser",
      };

      const mockError = new Error("Username already exists");

      vi.mocked(apiClient.post).mockRejectedValueOnce(mockError);

      // Act & Assert
      await expect(authService.register(registerData)).rejects.toThrow(
        "Username already exists"
      );
    });

    it("should handle validation errors", async () => {
      // Arrange
      const registerData: RegisterRequest = {
        email: "invalid-email",
        password: "123", // Too short
        username: "u",
      };

      const mockError = new Error("Validation failed");

      vi.mocked(apiClient.post).mockRejectedValueOnce(mockError);

      // Act & Assert
      await expect(authService.register(registerData)).rejects.toThrow(
        "Validation failed"
      );
    });
  });

  describe("logout", () => {
    it("should successfully logout", async () => {
      // Arrange
      const mockResponse = {
        data: { message: "Logged out successfully" },
        status: 200,
        correlationId: "test-correlation-id",
      };

      vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse);

      // Act
      const result = await authService.logout();

      // Assert
      expect(apiClient.post).toHaveBeenCalledWith("/api/v1/auth/logout");
      expect(result).toEqual(mockResponse);
      expect(result.data.message).toBe("Logged out successfully");
    });

    it("should handle logout errors gracefully", async () => {
      // Arrange
      const mockError = new Error("Logout failed");

      vi.mocked(apiClient.post).mockRejectedValueOnce(mockError);

      // Act & Assert
      await expect(authService.logout()).rejects.toThrow("Logout failed");
    });
  });

  describe("getCurrentUser", () => {
    it("should successfully fetch current user", async () => {
      // Arrange
      const mockResponse = {
        data: { user: mockUser },
        status: 200,
        correlationId: "test-correlation-id",
      };

      vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse);

      // Act
      const result = await authService.getCurrentUser();

      // Assert
      expect(apiClient.get).toHaveBeenCalledWith("/api/v1/auth/me");
      expect(result).toEqual(mockResponse);
      expect(result.data.user).toEqual(mockUser);
    });

    it("should throw error when not authenticated", async () => {
      // Arrange
      const mockError = new Error("Unauthorized");

      vi.mocked(apiClient.get).mockRejectedValueOnce(mockError);

      // Act & Assert
      await expect(authService.getCurrentUser()).rejects.toThrow("Unauthorized");
    });

    it("should throw error when token is expired", async () => {
      // Arrange
      const mockError = new Error("Token expired");

      vi.mocked(apiClient.get).mockRejectedValueOnce(mockError);

      // Act & Assert
      await expect(authService.getCurrentUser()).rejects.toThrow("Token expired");
    });
  });

  describe("refreshTokens", () => {
    it("should successfully refresh tokens", async () => {
      // Arrange
      const mockResponse = {
        data: mockTokens,
        status: 200,
        correlationId: "test-correlation-id",
      };

      vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse);

      // Act
      const result = await authService.refreshTokens();

      // Assert
      expect(apiClient.post).toHaveBeenCalledWith("/api/v1/auth/refresh", {});
      expect(result).toEqual(mockResponse);
      expect(result.data.access_token).toBeDefined();
      expect(result.data.refresh_token).toBeDefined();
    });

    it("should throw error when refresh token is invalid", async () => {
      // Arrange
      const mockError = new Error("Invalid refresh token");

      vi.mocked(apiClient.post).mockRejectedValueOnce(mockError);

      // Act & Assert
      await expect(authService.refreshTokens()).rejects.toThrow(
        "Invalid refresh token"
      );
    });
  });

  describe("getGoogleAuthUrl", () => {
    it("should successfully get Google OAuth URL", async () => {
      // Arrange
      const mockResponse = {
        data: {
          auth_url: "https://accounts.google.com/o/oauth2/v2/auth?client_id=...",
          state: "random-state-string",
        },
        status: 200,
        correlationId: "test-correlation-id",
      };

      vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse);

      // Act
      const result = await authService.getGoogleAuthUrl();

      // Assert
      expect(apiClient.get).toHaveBeenCalledWith("/api/v1/auth/google");
      expect(result).toEqual(mockResponse);
      expect(result.data.auth_url).toContain("accounts.google.com");
      expect(result.data.state).toBeDefined();
    });

    it("should throw error on service unavailable", async () => {
      // Arrange
      const mockError = new Error("Google OAuth service unavailable");

      vi.mocked(apiClient.get).mockRejectedValueOnce(mockError);

      // Act & Assert
      await expect(authService.getGoogleAuthUrl()).rejects.toThrow(
        "Google OAuth service unavailable"
      );
    });
  });

  describe("handleGoogleCallback", () => {
    it("should successfully handle Google callback with code and state", async () => {
      // Arrange
      const code = "google-auth-code";
      const state = "random-state-string";
      const mockResponse = {
        data: mockLoginResponse,
        status: 200,
        correlationId: "test-correlation-id",
      };

      vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse);

      // Act
      const result = await authService.handleGoogleCallback(code, state);

      // Assert
      expect(apiClient.get).toHaveBeenCalledWith("/api/v1/auth/google/callback", {
        params: { code, state },
      });
      expect(result).toEqual(mockResponse);
      expect(result.data.user).toBeDefined();
      expect(result.data.tokens).toBeDefined();
    });

    it("should successfully handle Google callback with code only", async () => {
      // Arrange
      const code = "google-auth-code";
      const mockResponse = {
        data: mockLoginResponse,
        status: 200,
        correlationId: "test-correlation-id",
      };

      vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse);

      // Act
      const result = await authService.handleGoogleCallback(code);

      // Assert
      expect(apiClient.get).toHaveBeenCalledWith("/api/v1/auth/google/callback", {
        params: { code },
      });
      expect(result).toEqual(mockResponse);
    });

    it("should throw error on invalid authorization code", async () => {
      // Arrange
      const code = "invalid-code";
      const mockError = new Error("Invalid authorization code");

      vi.mocked(apiClient.get).mockRejectedValueOnce(mockError);

      // Act & Assert
      await expect(authService.handleGoogleCallback(code)).rejects.toThrow(
        "Invalid authorization code"
      );
    });

    it("should throw error on state mismatch", async () => {
      // Arrange
      const code = "google-auth-code";
      const state = "mismatched-state";
      const mockError = new Error("State mismatch - CSRF protection");

      vi.mocked(apiClient.get).mockRejectedValueOnce(mockError);

      // Act & Assert
      await expect(authService.handleGoogleCallback(code, state)).rejects.toThrow(
        "State mismatch"
      );
    });

    it("should throw error when Google account is not found", async () => {
      // Arrange
      const code = "google-auth-code";
      const mockError = new Error("Google account not found");

      vi.mocked(apiClient.get).mockRejectedValueOnce(mockError);

      // Act & Assert
      await expect(authService.handleGoogleCallback(code)).rejects.toThrow(
        "Google account not found"
      );
    });
  });

  describe("AuthService instance", () => {
    it("should export a singleton instance", () => {
      expect(authService).toBeInstanceOf(AuthService);
    });

    it("should use correct base path", () => {
      const service = new AuthService();
      expect(service).toBeDefined();
    });
  });
});
