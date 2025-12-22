# Repository Guidelines for AI Agents

> **Purpose**: Quick reference for AI coding agents (Copilot, Claude, Cursor, etc.) working on BEMYRE v2 Client.
> **Runtime**: Bun 1.3.x | **Framework**: Next.js 16 | **Language**: TypeScript 5.x

## Quick Links to Documentation

| Resource              | Path                              | Purpose                                     |
| --------------------- | --------------------------------- | ------------------------------------------- |
| **CLAUDE.md**         | `/CLAUDE.md`                      | Project context, current state, active work |
| **CONTRIBUTING.md**   | `/CONTRIBUTING.md`                | Full contribution guidelines                |
| **Architecture**      | `/docs/architecture/`             | Patterns, layers, state management          |
| **Server Components** | `/docs/server-components/`        | RSC patterns and best practices             |
| **Middleware**        | `/docs/middleware/`               | Auth, correlation IDs, security             |
| **i18n**              | `/docs/i18n/`                     | Internationalization with next-intl         |
| **Documenting**       | `/docs/DOCUMENTING_GUIDELINES.md` | How to write docs                           |

---

## Project Structure

```text
app/                    # Next.js App Router, routes, layouts, server actions
├── [locale]/           # i18n dynamic segment (es, en)
├── api/                # API routes
components/             # Atomic Design: atoms → molecules → organisms → templates
├── atoms/              # Button, Avatar, Chip, Input
├── molecules/          # SearchBar, FormField, GoogleOAuthButton
├── organisms/          # MusicianCard, ErrorBoundary, ConsentBanner
├── templates/          # Page layouts
hooks/                  # Custom React hooks (useLogger, useApiError, etc.)
lib/                    # Service wrappers, utilities
├── api/                # Fetch wrapper with error handling
├── date/               # Zero-dep date utilities (Intl-based)
├── logger/             # Structured logging system
├── validation/         # Zod schemas
store/                  # Zustand state slices
├── slices/             # auth, ui, search slices
middleware/             # Next.js middleware modules
├── auth.ts             # Protected routes, cookie check
├── correlation.ts      # X-Correlation-ID, X-Request-ID
├── security.ts         # Security headers, CSRF
i18n/                   # next-intl configuration
messages/               # Modular i18n messages
├── {locale}/           # es/, en/
│   ├── common.json
│   ├── home.json
│   └── ...
errors/                 # Error types and codes
types/                  # Shared TypeScript definitions
tests/                  # Vitest + Playwright
├── unit/
├── integration/
├── e2e/
└── mocks/              # MSW handlers
docs/                   # Documentation (modular structure)
```

---

## Build & Development Commands

All commands use **Bun** from repo root:

```bash
bun dev              # Dev server at http://localhost:3000
bun build            # Production build
bun start            # Serve production build
bun lint             # ESLint
bun test             # Vitest (unit + integration)
bun test:watch       # TDD mode
bun test:coverage    # Coverage report
bun test:e2e         # Playwright E2E
bun storybook        # Component docs at http://localhost:6006
```

---

## Coding Patterns & Conventions

### TypeScript

- **Strict mode** - No `any`, no `@ts-ignore`
- **Explicit types** for props, returns, and exports
- **Path aliases** always (never relative `../../../`)

```typescript
// ✅ Use path aliases
import { Button } from "@atoms";
import { useLogger } from "@hooks";
import { formatDate } from "@date";
import type { User } from "@types";

// ❌ Never relative imports across boundaries
import { Button } from "../../../components/atoms";
```

### Available Path Aliases

```typescript
@/*           // Root
@components   // components/
@atoms        // components/atoms/
@molecules    // components/molecules/
@organisms    // components/organisms/
@templates    // components/templates/
@hooks        // hooks/
@lib          // lib/
@date         // lib/date/
@utils        // utils/
@types        // types/
@store        // store/
@errors       // errors/
@i18n         // i18n/
@middleware   // middleware/
@tests        // tests/
@styles       // styles/
```

### Naming Conventions

| Type             | Convention               | Example                             |
| ---------------- | ------------------------ | ----------------------------------- |
| Components       | PascalCase               | `MusicianCard.tsx`                  |
| Hooks            | camelCase + use          | `useLogger.ts`                      |
| Utils            | camelCase                | `formatDate.ts`                     |
| Constants        | UPPER_SNAKE              | `MAX_FILE_SIZE`                     |
| Types/Interfaces | PascalCase               | `MusicianCardProps`                 |
| Files/Folders    | kebab-case or PascalCase | `musician-card/` or `MusicianCard/` |

---

## Component Development

### Atomic Design Levels

| Level         | Description       | Test Required | Story Required |
| ------------- | ----------------- | ------------- | -------------- |
| **Atoms**     | Basic UI elements | Optional      | ✅ Yes          |
| **Molecules** | Atom combinations | ✅ Yes (70%)   | ✅ Yes          |
| **Organisms** | Complex sections  | ✅ Yes (80%)   | ✅ Yes          |
| **Templates** | Page layouts      | ✅ Yes (70%)   | ✅ Yes          |

### Component Structure

```text
components/organisms/MusicianCard/
├── MusicianCard.tsx           # Component
├── MusicianCard.stories.tsx   # Storybook (MANDATORY)
├── MusicianCard.test.tsx      # Tests (MANDATORY for molecules+)
└── index.ts                   # Re-export
```

### Component Template

```typescript
"use client"; // Only if needed

import { forwardRef } from "react";
import { cn } from "@utils";
import { useLogger } from "@hooks";

export interface MyComponentProps {
  /** Description */
  value: string;
  /** Optional callback */
  onChange?: (value: string) => void;
}

/**
 * Component description.
 * @example
 * <MyComponent value="test" onChange={handleChange} />
 */
export const MyComponent = forwardRef<HTMLDivElement, MyComponentProps>(
  ({ value, onChange, ...props }, ref) => {
    const log = useLogger("MyComponent");
    
    return (
      <div ref={ref} {...props}>
        {value}
      </div>
    );
  }
);

MyComponent.displayName = "MyComponent";
```

---

## State Management (Zustand)

### Pattern: Granular Selectors + Separate Actions

```typescript
// ✅ Granular selectors (cause re-renders)
import { useAuth, useUI } from "@store";
const user = useAuth((s) => s.user);
const theme = useUI((s) => s.theme);

// ✅ Actions (don't cause re-renders)
import { useAuthActions, useUIActions } from "@store";
const { login, logout } = useAuthActions();
const { setTheme } = useUIActions();

// ❌ Never select entire slice
const auth = useAuth((s) => s); // Bad!
```

### State Location Rules

| Type                   | Location                   | Example       |
| ---------------------- | -------------------------- | ------------- |
| Server data            | Server Components / fetch  | API responses |
| Auth, theme, global UI | Zustand                    | User session  |
| Form inputs            | useState / React Hook Form | Input values  |
| URL-derived            | useSearchParams            | Filters       |

---

## Error Handling

### Use Structured Logger

```typescript
import { logger } from "@lib";

// ✅ Use logger
logger.info("Action completed", { userId: 123 });
logger.error("Failed to fetch", error, { context: "MyComponent" });

// ❌ Never console.log
console.log("debug"); // Bad!
```

### Error Boundary Pattern

```typescript
import { ErrorBoundary } from "@organisms";

<ErrorBoundary fallback={<ErrorFallback />}>
  <MyComponent />
</ErrorBoundary>
```

### API Error Handling

```typescript
import { useApiError } from "@hooks";
import { ApiError } from "@errors";

const { handleError } = useApiError();

try {
  await apiCall();
} catch (error) {
  if (error instanceof ApiError) {
    handleError(error);
  }
}
```

---

## i18n (Internationalization)

### Message Structure

```text
messages/
├── es/
│   ├── common.json     # Common: {...}
│   ├── home.json       # Home: {...}
│   ├── auth.json       # Auth: {...}
│   └── metadata.json   # Metadata: {...}
└── en/
    └── ... (same structure)
```

### Usage

```typescript
import { useTranslations } from "next-intl";

const t = useTranslations("Common");
return <h1>{t("welcome")}</h1>;
```

### Adding Translations

1. Add to `i18n/messages.ts` NAMESPACES array
2. Create `messages/{locale}/{namespace}.json`
3. Use `useTranslations("Namespace")`

---

## Date/Time Utilities

Zero-dependency, native Intl-based utilities at `@date`:

```typescript
import { 
  formatDate,      // "4 dic 2025"
  formatDateTime,  // "4 dic 2025, 14:30"
  timeAgo,         // "hace 2 horas"
  smartTimeAgo,    // Recent: relative, old: absolute
  add,             // add(date, { days: 7 })
  isToday,         // boolean
  isBetween,       // date in range
  getRange,        // getRange("thisWeek")
} from "@date";

// i18n support
formatDate(new Date(), "medium", "es"); // "4 dic 2025"
formatDate(new Date(), "medium", "en"); // "Dec 4, 2025"
```

---

## Middleware

### Protected Routes

```typescript
// middleware/config.ts
PROTECTED_ROUTES: ["/dashboard/**", "/profile/**", "/settings/**"]
PUBLIC_ROUTES: ["/", "/login", "/register", "/auth/**"]
```

### Correlation IDs

```typescript
import { getCorrelationId, createCorrelationHeaders } from "@middleware";

// In Server Actions
const correlationId = headers().get("X-Correlation-ID");

// Propagate to backend
fetch(url, { headers: createCorrelationHeaders(correlationId) });
```

---

## Testing

### Test Files Location

```text
tests/
├── unit/components/     # Component tests
├── unit/hooks/          # Hook tests
├── unit/utils/          # Utility tests
├── integration/         # API integration (MSW)
└── e2e/                 # Playwright specs
```

### Testing Pattern

```typescript
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@tests/utils";

describe("MyComponent", () => {
  it("renders correctly", () => {
    render(<MyComponent value="test" />);
    expect(screen.getByText("test")).toBeInTheDocument();
  });
});
```

---

## Implementation Checklist

### New Component

- [ ] Correct Atomic Design level
- [ ] TypeScript strict (no `any`)
- [ ] Props documented with JSDoc
- [ ] Uses path aliases
- [ ] Accessible (ARIA, keyboard)
- [ ] Responsive design
- [ ] **Storybook story** (MANDATORY)
- [ ] **Tests** (MANDATORY for molecules+)

### Refactoring

- [ ] Existing tests pass
- [ ] Tests updated for new behavior
- [ ] Stories updated
- [ ] Coverage not decreased
- [ ] No regressions

### Before Commit

- [ ] `bun lint` passes
- [ ] `bun test` passes
- [ ] `bun build` succeeds
- [ ] Meaningful commit message (conventional commits)

---

## Do NOT

| ❌ Don't                      | ✅ Do Instead                      |
| ---------------------------- | --------------------------------- |
| Use `any` type               | Define proper types               |
| Use `console.log`            | Use `logger` from `@lib`          |
| Relative imports across dirs | Use path aliases                  |
| Skip Storybook stories       | Create stories for all components |
| Skip tests for molecules+    | Write tests with 70%+ coverage    |
| Mutate state directly        | Use Zustand actions               |
| Hardcode strings             | Use i18n translations             |
| Ignore accessibility         | Add ARIA labels, keyboard nav     |

---

## Commit Message Format

```text
<type>(<scope>): <subject>

# Types: feat, fix, docs, style, refactor, perf, test, chore, ui
# Scopes: atoms, molecules, organisms, hooks, store, i18n, middleware, etc.

# Examples:
feat(organisms): add MusicianCard component
fix(atoms): correct Button loading state
docs(i18n): add translation guide
test(hooks): add useLogger tests
```

---

## Need More Context?

1. **Project state**: Read `CLAUDE.md`
2. **Full guidelines**: Read `CONTRIBUTING.md`
3. **Architecture patterns**: Check `docs/architecture/`
4. **Specific feature**: Check `docs/<feature>/index.md`
