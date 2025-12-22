# Middleware Quick Reference

## Rutas Protegidas

```typescript
// middleware/config.ts
export const PROTECTED_ROUTES = [
  "/dashboard/**",
  "/profile/**",
  "/settings/**",
  "/messages/**",
];
```

Para añadir una ruta protegida, agregar el pattern al array.

## Rutas Públicas

```typescript
export const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/register",
  "/auth/**",
];
```

## Headers de Tracing

| Header             | Descripción                                |
| ------------------ | ------------------------------------------ |
| `X-Correlation-ID` | ID persistente entre requests relacionados |
| `X-Request-ID`     | ID único por request                       |
| `X-Process-Time`   | Tiempo de procesamiento del middleware     |

## Usar Correlation ID

### En Server Actions

```typescript
import { headers } from "next/headers";
import { HEADERS, createCorrelationHeaders } from "@/middleware";

export async function myServerAction() {
  const headersList = headers();
  const correlationId = headersList.get(HEADERS.CORRELATION_ID);

  // Propagar al backend
  const response = await fetch("https://api.example.com/data", {
    headers: createCorrelationHeaders(correlationId),
  });
}
```

### En API Routes

```typescript
import { type NextRequest } from "next/server";
import { getCorrelationId } from "@/middleware";

export async function GET(request: NextRequest) {
  const correlationId = getCorrelationId(request);

  // Usar para logging o propagar
  console.log(`[${correlationId}] Processing request...`);
}
```

## CSRF Protection

### Frontend (fetch con CSRF)

```typescript
// El token se expone en el header X-CSRF-Token de la response inicial
async function mutateData(data: unknown) {
  // Obtener token del meta tag o cookie
  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;

  const response = await fetch("/api/data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": csrfToken,
    },
    body: JSON.stringify(data),
  });
}
```

## Auth Check Manual

```typescript
import { isAuthenticated, checkAuth } from "@/middleware";

// Simple check
if (isAuthenticated(request)) {
  // Usuario tiene cookie
}

// Check completo
const authResult = checkAuth(request);
if (authResult.shouldRedirect) {
  // Redirect a login
}
```

## Pattern Matching

```typescript
import { matchRoute, isProtectedRoute } from "@/middleware";

// Check específico
matchRoute("/dashboard/settings", "/dashboard/**"); // true
matchRoute("/profile/123", "/profile/*"); // true

// Check si ruta requiere auth
isProtectedRoute("/dashboard/settings"); // true
isProtectedRoute("/about"); // false
```
