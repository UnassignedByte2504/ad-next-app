# Zustand Store

> Estructura y configuración del estado global.

## Anatomía de un Slice

```typescript
// store/slices/authSlice.ts
import type { StateCreator } from "zustand";
import type { StoreState, AuthState } from "../types";

export interface AuthSlice extends AuthState {
  // Acciones
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

export const createAuthSlice: StateCreator<
  StoreState, // Estado completo del store
  [["zustand/immer", never]], // Middleware
  [],
  AuthSlice // Este slice
> = (set, get) => ({
  // Estado inicial
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Acciones (usan immer para mutaciones)
  login: async (email, password) => {
    set((state) => {
      state.auth.isLoading = true;
      state.auth.error = null;
    });

    try {
      const result = await authApi.login({ email, password });

      set((state) => {
        state.auth.user = result.user;
        state.auth.token = result.token;
        state.auth.isAuthenticated = true;
        state.auth.isLoading = false;
      });
    } catch (error) {
      set((state) => {
        state.auth.error = error.message;
        state.auth.isLoading = false;
      });
    }
  },

  logout: () => {
    set((state) => {
      state.auth.user = null;
      state.auth.token = null;
      state.auth.isAuthenticated = false;
    });
  },

  updateUser: (data) => {
    set((state) => {
      if (state.auth.user) {
        Object.assign(state.auth.user, data);
      }
    });
  },
});
```

## Middleware

- **Immer**: Mutaciones inmutables con sintaxis mutable
- **DevTools**: Redux DevTools en desarrollo
- **Persist**: Persistencia en localStorage (auth + theme)
- **SubscribeWithSelector**: Subscripciones granulares

## Buenas Prácticas

```typescript
// ✅ Seleccionar solo lo que necesitas (menos re-renders)
const name = useAuth((s) => s.user?.name);

// ❌ Evitar seleccionar todo el estado
const auth = useAuth((s) => s); // Re-render en cualquier cambio
```

## Related

- [Selectors](./selectors.md)
- [Hooks](./hooks.md)
- [State Layer](../layers/state.md)
