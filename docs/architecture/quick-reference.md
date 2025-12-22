# Quick Reference - Architecture

> Comandos, imports y checklists rápidos.

## Imports Recomendados

```typescript
// React
import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { forwardRef, type ReactNode, type ComponentPropsWithoutRef } from "react";

// Next.js
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

// Store
import { useAuth, useUI, useSearch } from "@store";
import { useAuthActions, useUIActions, useSearchActions } from "@store";
import { useNotify, useAuthentication, useAppUI } from "@store/hooks";

// Components
import { Button, Avatar, Input, Chip } from "@atoms";
import { SearchBar, FormField, UserChip } from "@molecules";
import { MusicianCard, Header, ErrorBoundary } from "@organisms";
import { MainLayout, AuthLayout } from "@templates";

// Utils & Hooks
import { cn, formatDate, debounce } from "@utils";
import { useLogger, useDebounce, useMediaQuery } from "@hooks";
import { logger, captureError } from "@lib";

// Types
import type { Musician, Band, Venue, Genre, Instrument } from "@types";
```

## Comandos Útiles

```bash
# Desarrollo
pnpm dev                    # Next.js dev server
pnpm storybook              # Storybook

# Testing
pnpm test                   # Vitest (unit + integration)
pnpm test:e2e               # Playwright

# Calidad
pnpm lint                   # ESLint
pnpm exec tsc --noEmit      # Type check

# Build
pnpm build                  # Production build
pnpm build-storybook        # Storybook build
```

## Checklist Rápido

### Antes de Escribir Código

- [ ] ¿Entiendo completamente el requisito?
- [ ] ¿Hay componentes existentes que pueda reusar?
- [ ] ¿En qué nivel de Atomic Design va?
- [ ] ¿Necesita estado global o local es suficiente?

### Durante el Desarrollo

- [ ] TypeScript estricto (no `any`)
- [ ] Props documentadas con JSDoc
- [ ] Path aliases (`@atoms`, `@hooks`, etc.)
- [ ] Memoización donde tenga sentido

### Después de Escribir Código

- [ ] Story de Storybook creada
- [ ] Tests (si es organism o superior)
- [ ] Sin console.log (usar `logger`)
- [ ] Sin errores de TypeScript/ESLint

## Reglas por Nivel de Componente

| Nivel     | Puede usar        | Estado           | Store | API calls |
| --------- | ----------------- | ---------------- | ----- | --------- |
| Atoms     | Solo props        | ❌                | ❌     | ❌         |
| Molecules | Atoms + props     | Local (useState) | ❌     | ❌         |
| Organisms | Atoms + Molecules | Local + Global   | ✅     | Vía hooks |
| Templates | Todos             | Global           | ✅     | Via RSC   |

## Tipos de Estado

| Tipo         | Ubicación         | Ejemplo                |
| ------------ | ----------------- | ---------------------- |
| Server State | Server Components | Datos de API           |
| Client State | Zustand           | Auth, UI, preferencias |
| Local State  | useState          | Form inputs, toggles   |
| URL State    | Next.js Router    | Filtros, paginación    |

## Related

- [Full Checklists](./implementation/checklists.md)
- [Component Patterns](./components/patterns.md)
- [State Management](./state/zustand.md)
