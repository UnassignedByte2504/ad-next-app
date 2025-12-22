# Domain Services

> Servicios por dominio de negocio.

## Estructura de Servicio

```typescript
// lib/services/musicianService.ts
import { apiClient } from "@infrastructure/adapters/apiClient";
import type { Musician, SearchParams, PaginatedResponse } from "@types";

/**
 * Servicio para operaciones de músicos.
 *
 * - Endpoints específicos del dominio
 * - Transformación de datos
 * - Cache hints
 */
export const musicianService = {
  /**
   * Buscar músicos con filtros.
   */
  async search(params: SearchParams): Promise<PaginatedResponse<Musician>> {
    return apiClient.get("/musicians", {
      q: params.query,
      instruments: params.instruments?.join(","),
      genres: params.genres?.join(","),
      location: params.location,
      page: String(params.page ?? 1),
      limit: String(params.limit ?? 20),
    });
  },

  /**
   * Obtener músico por ID.
   */
  async getById(id: string): Promise<Musician> {
    return apiClient.get(`/musicians/${id}`);
  },

  /**
   * Actualizar perfil de músico.
   */
  async update(id: string, data: Partial<Musician>): Promise<Musician> {
    return apiClient.patch(`/musicians/${id}`, data);
  },

  /**
   * Seguir a un músico.
   */
  async follow(id: string): Promise<void> {
    return apiClient.post(`/musicians/${id}/follow`);
  },

  /**
   * Dejar de seguir a un músico.
   */
  async unfollow(id: string): Promise<void> {
    return apiClient.delete(`/musicians/${id}/follow`);
  },
};
```

## Servicios Disponibles

| Servicio          | Dominio       | Ubicación                         |
| ----------------- | ------------- | --------------------------------- |
| `authService`     | Autenticación | `lib/services/authService.ts`     |
| `musicianService` | Músicos       | `lib/services/musicianService.ts` |
| `bandService`     | Bandas        | `lib/services/bandService.ts`     |
| `eventService`    | Eventos       | `lib/services/eventService.ts`    |
| `messageService`  | Mensajes      | `lib/services/messageService.ts`  |

## Uso con Server Components

```typescript
// app/(main)/musicians/[id]/page.tsx
import { musicianService } from "@lib/services/musicianService";

export default async function MusicianPage({ params }: Props) {
  const musician = await musicianService.getById(params.id);

  return <MusicianProfile musician={musician} />;
}
```

## Uso con Client Components

```typescript
// hooks/useMusician.ts
export function useMusician(id: string) {
  const [musician, setMusician] = useState<Musician | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setIsLoading(true);
    musicianService
      .getById(id)
      .then(setMusician)
      .catch(setError)
      .finally(() => setIsLoading(false));
  }, [id]);

  return { musician, isLoading, error };
}
```

## Related

- [API Client](./client.md)
- [Service Layer](../layers/service.md)
- [Data Fetching](../reactive/data-flow.md)

