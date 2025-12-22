# State Hooks

> Hooks de alto nivel para estado.

## Hooks de Alto Nivel

```typescript
// store/hooks.ts

/**
 * Hook para sistema de notificaciones.
 * Abstrae la complejidad del store.
 */
export function useNotify() {
  const addNotification = useUIActions().addNotification;

  return useMemo(
    () => ({
      success: (message: string) => addNotification({ type: "success", message }),
      error: (message: string) => addNotification({ type: "error", message }),
      warning: (message: string) => addNotification({ type: "warning", message }),
      info: (message: string) => addNotification({ type: "info", message }),
    }),
    [addNotification]
  );
}

/**
 * Hook que combina estado y acciones de autenticación.
 */
export function useAuthentication() {
  const state = useAuth(
    useShallow((s) => ({
      user: s.user,
      isAuthenticated: s.isAuthenticated,
      isLoading: s.isLoading,
      error: s.error,
    }))
  );

  const actions = useAuthActions();

  return { ...state, ...actions };
}

/**
 * Hook para estado de UI completo.
 */
export function useAppUI() {
  return useUI(
    useShallow((s) => ({
      theme: s.theme,
      isOnline: s.isOnline,
      isMobile: s.isMobile,
      sidebarOpen: s.sidebarOpen,
      notifications: s.notifications,
    }))
  );
}
```

## Custom Hooks por Responsabilidad

```typescript
// hooks/useDebounce.ts - Utilidad
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// hooks/useMediaQuery.ts - UI
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
}
```

## Composición de Hooks

```typescript
// hooks/useMusicianSearch.ts
export function useMusicianSearch() {
  // Combina múltiples hooks
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  const { setQuery: setStoreQuery, setFilters } = useSearchActions();
  const filters = useSearch((s) => s.filters);
  const { musicians, isLoading, error } = useMusicians({
    query: debouncedQuery,
    ...filters,
  });

  // Sincroniza con el store
  useEffect(() => {
    setStoreQuery(debouncedQuery);
  }, [debouncedQuery, setStoreQuery]);

  return {
    query,
    setQuery,
    filters,
    setFilters,
    musicians,
    isLoading,
    error,
  };
}
```

## Related

- [Zustand](./zustand.md)
- [Selectors](./selectors.md)
- [Data Flow](../reactive/data-flow.md)
