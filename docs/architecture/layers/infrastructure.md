# Infrastructure Layer

> Servicios base: logger, errors, storage.

## Estructura

```text
lib/
├── logger/          # Sistema de logging
│   ├── index.ts
│   ├── init.ts
│   ├── sentry.ts
│   └── server/
│       └── file-logger.ts
│
├── errors/          # Manejo de errores
│   ├── index.ts
│   ├── codes.ts
│   └── api.ts
│
└── config/          # Configuración
    └── env.ts
```

## Logger

```typescript
import { logger, initLogger } from "@lib/logger";

// Inicializar
initLogger({
  sentry: true,
  remoteLogging: true,
});

// Uso
logger.info("Acción completada", { userId: "123" });
logger.error("Error al cargar", error, { component: "Profile" });
logger.debug("Debug info", { data });
logger.warn("Advertencia", { reason });
```

## Error Handling

```typescript
import { ApiError, parseApiError } from "@/errors";

try {
  const { data } = await apiClient.get<User>("/users/me");
} catch (error) {
  if (error instanceof ApiError) {
    console.log(error.apiCode); // "USER_NOT_FOUND"
    console.log(error.userMessage); // Mensaje localizado
    console.log(error.correlationId); // Para debugging
  }
}
```

## Storage

Para localStorage/sessionStorage con type safety:

```typescript
// lib/storage.ts
export const storage = {
  get: <T>(key: string): T | null => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  },

  set: <T>(key: string, value: T): void => {
    localStorage.setItem(key, JSON.stringify(value));
  },

  remove: (key: string): void => {
    localStorage.removeItem(key);
  },
};
```

## Related

- [Layers Overview](./overview.md)
- [Error Codes](../../CLAUDE.md) - Sección de API Errors
