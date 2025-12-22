# Architecture Overview

> Cómo funciona la arquitectura de Server Components en BEMYRE.

## Layout Structure

```text
app/
├── layout.tsx           ← Server Component (RSC)
│   └── providers.tsx    ← Client Component ("use client")
│       └── {children}   ← Pueden ser Server o Client
│           ├── page.tsx ← Server Component (default)
│           └── Components → RSC o Client según necesidad
```

## How It Works

### 1. Root Layout (`layout.tsx`) - Server Component

- Genera metadata (SEO)
- Configura estructura HTML
- Renderiza fuentes y contenido estático

### 2. Providers (`providers.tsx`) - Client Component

- Wraps la app con MUI ThemeProvider
- Provee ErrorBoundary
- Inicializa servicios client-side (Sentry, Logger)
- **NO fuerza a que los children sean client components**

### 3. Pages & Components - Server por defecto

- Solo añadir "use client" cuando sea necesario
- La mayoría de páginas pueden ser Server Components
- Los componentes interactivos se convierten en Client Components

## Why This Works

El modelo de React Server Components permite:

- Client Components pueden tener Server Component children (via `{children}` prop)
- Patrón de composición: RSC pasan a través de Client Component boundaries
- Hydration selectiva: Solo Client Components envían JS al browser

## Current Implementation

### Root Layout (Server Component)

```tsx
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <Providers>{children}</Providers> {/* Client boundary */}
      </body>
    </html>
  );
}
```

### Providers (Client Component - Requerido)

```tsx
// app/providers.tsx
"use client";

export function Providers({ children }) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ErrorBoundary>
          {children} {/* Children pueden ser RSC! */}
        </ErrorBoundary>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
```

## Why Providers Must Be Client-Side

| Provider                 | Razón                                           |
| ------------------------ | ----------------------------------------------- |
| `ThemeProvider`          | Usa React Context (client-only)                 |
| `AppRouterCacheProvider` | Emotion cache para MUI (client-only)            |
| `ErrorBoundary`          | Usa `componentDidCatch` lifecycle (client-only) |
| `useEffect` para Sentry  | Inicializa en mount (client-only)               |

**Verdict:** Esta es la implementación **correcta** para apps MUI. No requiere cambios.

## Key Insight

```text
┌─────────────────────────────────────────┐
│ Client Boundary ≠ All Children Client   │
│                                         │
│ {children} prop permite pasar           │
│ Server Components a través de           │
│ Client Components                       │
└─────────────────────────────────────────┘
```

## Related

- [Diagrams](./diagrams.md) - Visualización de la arquitectura
- [Composition Pattern](../patterns/composition.md) - El patrón clave
- [Implementation Summary](../implementation/summary.md) - Estado actual

