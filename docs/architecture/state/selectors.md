# Selectors

> Selectores óptimos para Zustand.

## Selectores Granulares

```typescript
// ✅ Selector granular - re-render solo cuando cambia el nombre
const userName = useAuth((s) => s.user?.name);

// ✅ Selector múltiple con shallow compare
import { useShallow } from "zustand/react/shallow";

const { user, isLoading } = useAuth(
  useShallow((s) => ({ user: s.user, isLoading: s.isLoading }))
);

// ✅ Selector derivado
const isAdmin = useAuth((s) => s.user?.role === "admin");
```

## Anti-Patterns

```typescript
// ❌ Selector que selecciona todo (re-render en cualquier cambio)
const auth = useAuth((s) => s);

// ❌ Crear objetos en el selector sin shallow
const data = useAuth((s) => ({ user: s.user, token: s.token }));
// ^ Esto crea un objeto nuevo cada vez = re-render siempre
```

## Patrón: Acciones Separadas

```typescript
// ✅ Acciones no causan re-render
const { login, logout } = useAuthActions();

// Implementación
export function useAuthActions() {
  return useStore(
    useShallow((s) => ({
      login: s.login,
      logout: s.logout,
      updateUser: s.updateUser,
    }))
  );
}
```

## Selectores Pre-definidos

```typescript
// store/index.ts
export const useCurrentUser = () => useAuth((s) => s.user);
export const useIsAuthenticated = () => useAuth((s) => s.isAuthenticated);
export const useTheme = () => useUI((s) => s.theme);
```

## Related

- [Zustand](./zustand.md)
- [Hooks](./hooks.md)
- [State Types](../reactive/state-types.md)
