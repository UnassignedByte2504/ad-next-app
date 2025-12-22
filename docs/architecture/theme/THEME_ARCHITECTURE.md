# Theme Architecture

## Overview

The theme system in BEMYRE v2 client follows a clean separation of concerns pattern that separates state management from DOM side effects.

## Architecture

### State Management (Pure)

The theme state is managed by Zustand in `/store/slices/uiSlice.ts`:

```typescript
setTheme: (theme: ThemeMode) => {
  set((state) => {
    state.ui.theme = theme;
  });
  // No DOM manipulation here - kept pure
}
```

**Responsibilities:**
- Store theme preference ("light" | "dark" | "system")
- Provide theme getter/setter
- Persist theme to localStorage

**Does NOT:**
- Manipulate DOM
- Subscribe to system preferences
- Apply CSS classes

### Side Effect Handling (Reactive)

DOM mutations are handled by the `useThemeSync` hook in `/hooks/useThemeSync.ts`:

```typescript
export function useThemeSync() {
  useEffect(() => {
    // Subscribe to theme changes from Zustand
    const unsubscribe = useStore.subscribe(
      (state) => state.ui.theme,
      (theme) => applyTheme(theme)
    );

    // Listen to system preference changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", handleMediaChange);

    return () => {
      unsubscribe();
      mediaQuery.removeEventListener("change", handleMediaChange);
    };
  }, []);
}
```

**Responsibilities:**
- Subscribe to Zustand theme changes
- Apply "dark" class to `document.documentElement`
- Listen to system preference changes
- Handle initial theme application

**Usage:**
Called once in the root `Providers` component (`/app/providers.tsx`).

## Data Flow

```
User Action (setTheme)
  ↓
Zustand Store (state update)
  ↓
useThemeSync subscription (reactive)
  ↓
DOM Update (document.documentElement.classList)
  ↓
Tailwind CSS (dark:* classes apply)
```

## Benefits

1. **Pure Store**: Store mutations have no side effects, making them predictable and testable
2. **Separation of Concerns**: State logic separate from DOM manipulation
3. **Single Responsibility**: Each module has one clear purpose
4. **Testability**: Can test store and sync logic independently
5. **Performance**: Uses Zustand's `subscribeWithSelector` for efficient updates
6. **SSR Safe**: DOM manipulation only happens in client components

## Why This Pattern?

### Before (Anti-pattern)

```typescript
setTheme: (theme: ThemeMode) => {
  set((state) => {
    state.ui.theme = theme;
  });

  // ❌ Side effect during state mutation
  document.documentElement.classList.toggle("dark", theme === "dark");
}
```

**Problems:**
- Mixed concerns (state + side effects)
- Hard to test
- Violates functional programming principles
- Can cause issues with middleware (persist, devtools)

### After (Clean Architecture)

```typescript
// Store: Pure state management
setTheme: (theme: ThemeMode) => {
  set((state) => {
    state.ui.theme = theme;
  });
}

// Hook: Reactive side effects
useThemeSync(); // Subscribe and react to changes
```

**Benefits:**
- Clear separation of concerns
- Easy to test each part independently
- Follows React/Zustand best practices
- Side effects are explicit and contained

## Testing

### Store Testing

```typescript
it("updates theme state", () => {
  const { result } = renderHook(() => useUIActions());
  act(() => result.current.setTheme("dark"));
  expect(useStore.getState().ui.theme).toBe("dark");
  // No DOM checks needed - pure state test
});
```

### Sync Testing

```typescript
it("applies dark class when theme changes", () => {
  renderHook(() => useThemeSync());
  act(() => useStore.getState().ui.setTheme("dark"));
  expect(document.documentElement.classList.contains("dark")).toBe(true);
});
```

## System Preference Changes

The hook automatically detects and responds to OS theme changes:

```typescript
const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
mediaQuery.addEventListener("change", (e) => {
  const theme = useStore.getState().ui.theme;
  if (theme === "system") {
    document.documentElement.classList.toggle("dark", e.matches);
  }
});
```

This ensures the app respects the user's system preferences when theme is set to "system".

## Migration Notes

### Changed Files

1. `/store/slices/uiSlice.ts` - Removed DOM manipulation
2. `/store/index.ts` - Removed system preference listener
3. `/hooks/useThemeSync.ts` - New hook for side effects
4. `/app/providers.tsx` - Added useThemeSync call

### Behavior

The end-user experience is **identical** - only the internal architecture changed. All theme functionality works exactly as before:

- Manual theme switching (light/dark/system)
- System preference detection
- Persistence across sessions
- SSR/hydration safety
