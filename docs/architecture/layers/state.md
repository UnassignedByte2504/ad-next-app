# State Layer

> Estructura del estado global con Zustand.

## Estructura

```text
store/
├── index.ts         # Store principal + selectores
├── types.ts         # Interfaces de estado
├── hooks.ts         # Hooks de alto nivel
└── slices/
    ├── authSlice.ts
    ├── uiSlice.ts
    ├── searchSlice.ts
    └── index.ts
```

## Slices Disponibles

### AuthSlice

Estado de autenticación.

- `user`, `token`, `isAuthenticated`, `isLoading`, `error`
- Actions: `login`, `logout`, `updateUser`

### UISlice

Estado de interfaz.

- `theme`, `sidebarOpen`, `notifications`, `isOnline`
- Actions: `setTheme`, `toggleSidebar`, `addNotification`

### SearchSlice

Estado de búsqueda.

- `query`, `filters`, `results`, `isSearching`
- Actions: `setQuery`, `setFilters`, `search`

## Uso Básico

```typescript
import { useAuth, useUI, useSearch } from "@store";
import { useAuthActions, useUIActions } from "@store";

// Obtener estado (causa re-render cuando cambia)
const user = useAuth((state) => state.user);
const theme = useUI((state) => state.theme);

// Obtener acciones (NO causa re-render)
const { login, logout } = useAuthActions();
const { addNotification, setTheme } = useUIActions();
```

## Related

- [Zustand Details](../state/zustand.md)
- [Selectors](../state/selectors.md)
- [Hooks](../state/hooks.md)
