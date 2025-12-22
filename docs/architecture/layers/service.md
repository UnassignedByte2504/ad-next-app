# Service Layer

> API clients y servicios de dominio.

## Estructura

```text
lib/
├── api/             # Clientes de API
│   ├── client.ts    # HTTP client base
│   ├── musicians.ts # Endpoints de músicos
│   ├── bands.ts     # Endpoints de bandas
│   └── auth.ts      # Endpoints de autenticación
│
├── websocket/       # Cliente WebSocket
│   ├── client.ts
│   └── handlers.ts
│
└── adapters/        # Implementaciones de ports
    ├── auth-adapter.ts
    └── search-adapter.ts
```

## API Service por Dominio

```typescript
// lib/api/musicians.ts
import { apiClient } from "./client";
import type { Musician, MusicianFilters, CreateMusicianDto } from "@types";

export const musiciansApi = {
  getAll: (filters?: MusicianFilters) =>
    apiClient.get<Musician[]>(`/musicians${toQueryString(filters)}`),

  getById: (id: string) => apiClient.get<Musician>(`/musicians/${id}`),

  create: (data: CreateMusicianDto) =>
    apiClient.post<Musician>("/musicians", data),

  update: (id: string, data: Partial<Musician>) =>
    apiClient.put<Musician>(`/musicians/${id}`, data),

  delete: (id: string) => apiClient.delete<void>(`/musicians/${id}`),

  connect: (musicianId: string, targetId: string) =>
    apiClient.post<void>(`/musicians/${musicianId}/connect`, { targetId }),
};
```

## Related

- [HTTP Client](../api/client.md)
- [Services Detail](../api/services.md)
- [Layers Overview](./overview.md)
