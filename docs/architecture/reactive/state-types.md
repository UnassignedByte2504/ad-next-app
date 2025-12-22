# State Types

> Los diferentes tipos de estado y dónde ubicarlos.

## Overview

| Tipo             | Ubicación                       | Ejemplo                |
| ---------------- | ------------------------------- | ---------------------- |
| **Server State** | Server Components / React Query | Datos de API, caché    |
| **Client State** | Zustand                         | Auth, UI, preferencias |
| **Local State**  | useState/useReducer             | Form inputs, toggles   |
| **URL State**    | Next.js Router                  | Filtros, paginación    |

## Reglas de Estado

```typescript
// ✅ Server state → fetch en Server Components
const musicians = await fetchMusicians(); // Server Component

// ✅ Client state global → Zustand
const { user, login } = useAuth((s) => ({ user: s.user, login: s.login }));

// ✅ Estado local de UI → useState
const [isOpen, setIsOpen] = useState(false);

// ✅ Estado de formulario → React Hook Form o useState
const { register, handleSubmit } = useForm<FormData>();

// ✅ Estado derivado de URL → useSearchParams
const searchParams = useSearchParams();
const page = parseInt(searchParams.get("page") ?? "1");
```

## Anti-Patterns

```typescript
// ❌ Estado global para datos que solo usa un componente
// Un modal simple no necesita Zustand

// ❌ Props drilling de más de 2 niveles
// Usar contexto o store

// ❌ Mutar estado directamente
state.user.name = "New"; // ❌
setState({ ...state, user: { ...state.user, name: "New" } }); // ✅
```

## Cuándo Usar Cada Tipo

### Server State

- Datos que vienen del backend
- Listas de entidades (musicians, bands)
- Datos que necesitan caché/revalidación
- SEO-critical content

```typescript
// app/musicians/page.tsx (Server Component)
export default async function MusiciansPage() {
  const musicians = await fetchMusicians();
  return <MusiciansList data={musicians} />;
}
```

### Client State (Zustand)

- Autenticación (user, token)
- Preferencias de UI (theme, sidebar)
- Estado de búsqueda global
- Notificaciones

```typescript
// Acceso al estado
const user = useAuth((s) => s.user);
const theme = useUI((s) => s.theme);
```

### Local State

- Estado de formularios
- Toggles y modals locales
- Estado temporal de UI
- Animaciones

```typescript
const [isOpen, setIsOpen] = useState(false);
const [formData, setFormData] = useState({ name: "", email: "" });
```

### URL State

- Filtros de búsqueda
- Paginación
- Tabs activos (si necesita ser compartible)
- Estado que debe persistir en navegación

```typescript
const searchParams = useSearchParams();
const router = useRouter();

// Leer
const page = searchParams.get("page");

// Escribir
router.push(`/musicians?page=${newPage}`);
```

## Related

- [Data Flow](./data-flow.md)
- [Zustand](../state/zustand.md)
- [Component Patterns](../components/patterns.md)
