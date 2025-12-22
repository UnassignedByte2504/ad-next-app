# API Client

> Cliente HTTP base y configuración.

## Base Client

```typescript
// infrastructure/adapters/apiClient.ts
import type { ApiResponse, ApiError } from "@types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface RequestConfig extends RequestInit {
  params?: Record<string, string>;
}

/**
 * Cliente HTTP base con interceptores.
 */
export const apiClient = {
  async request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const { params, ...init } = config;

    // Construir URL con query params
    const url = new URL(endpoint, BASE_URL);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, value);
      });
    }

    // Headers por defecto
    const headers = new Headers(init.headers);
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    // Token de auth (si existe)
    const token = getStoredToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(url.toString(), {
      ...init,
      headers,
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new ApiException(error);
    }

    return response.json();
  },

  get<T>(endpoint: string, params?: Record<string, string>) {
    return this.request<T>(endpoint, { method: "GET", params });
  },

  post<T>(endpoint: string, data?: unknown) {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  put<T>(endpoint: string, data?: unknown) {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  patch<T>(endpoint: string, data?: unknown) {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: "DELETE" });
  },
};
```

## Error Handling

```typescript
// errors/api.ts
export class ApiException extends Error {
  constructor(
    public readonly error: ApiError,
    public readonly statusCode: number = 500
  ) {
    super(error.message);
    this.name = "ApiException";
  }

  get code() {
    return this.error.code;
  }

  get isUnauthorized() {
    return this.statusCode === 401;
  }

  get isNotFound() {
    return this.statusCode === 404;
  }
}
```

## Related

- [Services](./services.md)
- [Infrastructure Layer](../layers/infrastructure.md)
- [State Types](../reactive/state-types.md)
