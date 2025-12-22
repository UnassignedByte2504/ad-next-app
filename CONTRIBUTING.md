# Contributing to BEMYRE v2 Client

Thank you for contributing to BEMYRE! This guide will help you understand our development process and how to contribute effectively to the frontend application.

> **📚 Architecture Guide**: For detailed information about patterns, state management, and reactive architecture, see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Table of Contents

1. [Getting Started](#getting-started)
2. [Development Environment](#development-environment)
3. [Git Workflow](#git-workflow)
4. [Code Style & Standards](#code-style--standards)
5. [Component Development](#component-development)
6. [State Management](#state-management)
7. [Testing Requirements](#testing-requirements)
8. [Pull Request Process](#pull-request-process)
9. [Commit Message Format](#commit-message-format)
10. [For AI Agents](#for-ai-agents)

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 10+
- Git

### Initial Setup

```bash
# Clone the repository
git clone https://github.com/bemyre/bemyre.git
cd bemyre/bemyre-v2/client

# Install dependencies
pnpm install

# Copy environment file
cp .env.example .env.local

# Start development server
pnpm dev
```

## Development Environment

### Project Structure

```
client/
├── app/                    # Next.js App Router
│   ├── api/                # API routes (server-side)
│   ├── (auth)/             # Auth route group
│   ├── (main)/             # Main app route group
│   ├── layout.tsx          # Root layout
│   ├── providers.tsx       # Client providers
│   └── globals.css         # Global styles + Tailwind
├── components/             # Atomic Design components
│   ├── atoms/              # Basic UI elements
│   ├── molecules/          # Combinations of atoms
│   ├── organisms/          # Complex sections
│   ├── templates/          # Page layouts
│   └── index.ts            # Barrel export
├── hooks/                  # Custom React hooks
├── lib/                    # Library configurations
│   └── logger/             # Logging system
├── utils/                  # Utility functions
├── types/                  # TypeScript definitions
├── tests/                  # Test files
│   ├── unit/               # Unit tests
│   ├── integration/        # Integration tests
│   ├── e2e/                # End-to-end tests
│   └── mocks/              # MSW handlers
├── public/                 # Static assets
└── .storybook/             # Storybook configuration
```

### Running Locally

```bash
# Development server (port 3000)
pnpm dev

# Production build
pnpm build
pnpm start

# Linting
pnpm lint

# Type checking
pnpm exec tsc --noEmit

# Storybook (port 6006)
pnpm storybook

# Run all tests
pnpm test

# Run with coverage
pnpm test:coverage

# Run E2E tests
pnpm test:e2e
```

## Git Workflow

### Branch Naming Conventions

```
main                          # Production-ready code
dev                           # Development integration branch

feature/{issue-id}-{name}     # New features: feature/123-musician-profile
bugfix/{issue-id}-{name}      # Bug fixes: bugfix/456-button-loading-state
hotfix/{issue-id}-{name}      # Production hotfixes: hotfix/789-auth-redirect
refactor/{issue-id}-{name}    # Refactoring: refactor/234-component-structure
docs/{issue-id}-{name}        # Documentation: docs/567-storybook-docs
test/{issue-id}-{name}        # Tests: test/890-integration-tests
ui/{issue-id}-{name}          # UI/UX changes: ui/111-responsive-cards
```

### Workflow Steps

1. Create a feature branch from `main`
2. Make changes following code style guidelines
3. Write or update tests for your changes
4. Create/update Storybook stories for components
5. Ensure all tests pass locally
6. Run linting and type checking
7. Create a Pull Request
8. Address code review comments
9. Merge when approved

## Code Style & Standards

### TypeScript Style Guide

We use **ESLint** with Next.js configuration. Always use TypeScript:

```typescript
// Good - Explicit types
interface ButtonProps {
  variant?: "contained" | "outlined" | "text";
  loading?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

// Avoid - Any types
const handleClick = (event: any) => { ... }
```

### Import Organization

Imports are organized in this order:

1. React/Next.js imports
2. Third-party packages
3. Application imports (using path aliases)
4. Types (with `type` keyword)

```typescript
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@mui/material";
import { motion } from "framer-motion";

import { useLogger } from "@hooks";
import { cn } from "@utils";
import { MusicianCard } from "@organisms";

import type { Musician } from "@types";
```

### Path Aliases

Always use path aliases instead of relative imports:

```typescript
// Good
import { Button } from "@atoms";
import { useLogger } from "@hooks";
import { cn } from "@utils";

// Avoid
import { Button } from "../../../components/atoms";
import { useLogger } from "../../hooks";
```

Available aliases:
- `@/*` - Root
- `@components`, `@atoms`, `@molecules`, `@organisms`, `@templates`
- `@hooks`, `@lib`, `@utils`, `@types`, `@styles`
- `@tests` - Test utilities

### Naming Conventions

```typescript
// Files and folders: kebab-case or PascalCase for components
musician-card/
  MusicianCard.tsx
  MusicianCard.stories.tsx
  MusicianCard.test.tsx
  index.ts

// Components: PascalCase
export const MusicianCard: React.FC<MusicianCardProps> = () => { ... }

// Hooks: camelCase with "use" prefix
export function useLogger(component: string) { ... }

// Utilities: camelCase
export function formatDate(date: Date): string { ... }

// Constants: UPPER_SNAKE_CASE
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Types/Interfaces: PascalCase with descriptive suffix
interface MusicianCardProps { ... }
type ButtonVariant = "contained" | "outlined" | "text";
```

## Component Development

### Atomic Design Pattern

We follow Atomic Design methodology:

| Level         | Description           | Examples                            |
| ------------- | --------------------- | ----------------------------------- |
| **Atoms**     | Basic UI elements     | Button, Avatar, Chip, Input         |
| **Molecules** | Combinations of atoms | SearchBar, FormField, UserChip      |
| **Organisms** | Complex sections      | MusicianCard, Header, ErrorBoundary |
| **Templates** | Page layouts          | MainLayout, AuthLayout              |

### Component Structure

Each component should have:

```
components/atoms/Button/
├── Button.tsx           # Component implementation
├── Button.stories.tsx   # Storybook stories
├── Button.test.tsx      # Unit tests (optional for atoms)
└── index.ts             # Re-export
```

### Component Template

```typescript
"use client";

import { forwardRef } from "react";
import { cn } from "@utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button variant */
  variant?: "contained" | "outlined" | "text";
  /** Loading state */
  loading?: boolean;
}

/**
 * Primary button component for user actions.
 *
 * @example
 * ```tsx
 * <Button variant="contained" onClick={handleSubmit}>
 *   Submit
 * </Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "contained", loading = false, className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn("btn", `btn-${variant}`, className)}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading ? <Spinner /> : children}
      </button>
    );
  }
);

Button.displayName = "Button";
```

### Storybook Stories

Every component needs Storybook documentation:

```typescript
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "Atoms/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["contained", "outlined", "text"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: "Click me",
  },
};

export const Loading: Story = {
  args: {
    children: "Loading...",
    loading: true,
  },
};
```

### Styling Guidelines

We use MUI + Tailwind CSS:

```typescript
// Use Tailwind for layout and spacing
<div className="flex items-center gap-4 p-6">

// Use MUI components for interactive elements
<MuiButton variant="contained" color="primary">

// Combine both when needed
<MuiButton className="px-8 hover:scale-105">

// Use cn() utility for conditional classes
<div className={cn("card", isActive && "card-active", className)}>
```

## Testing Requirements

> ⚠️ **MANDATORY**: Tests and Storybook stories are required for all new components and must be updated during refactoring.

### Test Types

| Type        | Tool         | Location             | Purpose                           |
| ----------- | ------------ | -------------------- | --------------------------------- |
| Unit        | Vitest + RTL | `tests/unit/`        | Isolated component/function tests |
| Integration | Vitest + MSW | `tests/integration/` | API integration tests             |
| E2E         | Playwright   | `tests/e2e/`         | Full user flow tests              |

### Test File Location and Naming

```
tests/
├── setup.tsx              # Global test setup
├── utils.tsx              # Custom render with providers
├── mocks/                 # MSW handlers
│   ├── handlers.ts
│   └── server.ts
├── unit/
│   ├── components/
│   │   └── Button.test.tsx
│   └── utils/
│       └── helpers.test.ts
├── integration/
│   └── api.test.ts
└── e2e/
    └── homepage.spec.ts
```

### Minimum Requirements by Component Type

| Level         | Story Required | Test Required | Coverage Target |
| ------------- | -------------- | ------------- | --------------- |
| **Atoms**     | ✅ Yes          | Optional      | -               |
| **Molecules** | ✅ Yes          | ✅ Yes         | 70%             |
| **Organisms** | ✅ Yes          | ✅ Yes         | 80%             |
| **Templates** | ✅ Yes          | ✅ Yes         | 70%             |
| **Hooks**     | N/A            | ✅ Yes         | 90%             |
| **Utils**     | N/A            | ✅ Yes         | 90%             |
| **API calls** | N/A            | ✅ Yes (MSW)   | 80%             |

### Storybook Stories (MANDATORY)

Every component **MUST** have a Storybook story file:

```
components/atoms/Button/
├── Button.tsx
├── Button.stories.tsx   # ⚠️ REQUIRED
├── Button.test.tsx      # Required for molecules+
└── index.ts
```

**Story Requirements:**

1. **Default story** - Component with default props
2. **All variants** - One story per visual variant
3. **States** - Loading, disabled, error states
4. **Interactive** - If applicable, interaction tests
5. **Responsive** - Viewport decorators for responsive components

```typescript
// Example: Complete story file
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "Atoms/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Primary action button with multiple variants.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["contained", "outlined", "text"],
      description: "Visual style of the button",
    },
    loading: {
      control: "boolean",
      description: "Shows loading spinner",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// ✅ Default story
export const Default: Story = {
  args: { children: "Click me" },
};

// ✅ All variants
export const Contained: Story = {
  args: { variant: "contained", children: "Contained" },
};

export const Outlined: Story = {
  args: { variant: "outlined", children: "Outlined" },
};

export const Text: Story = {
  args: { variant: "text", children: "Text" },
};

// ✅ States
export const Loading: Story = {
  args: { loading: true, children: "Loading..." },
};

export const Disabled: Story = {
  args: { disabled: true, children: "Disabled" },
};
```

### Writing Tests

```typescript
// Unit test example
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@tests/utils";
import { Button } from "@atoms";

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button")).toHaveTextContent("Click me");
  });

  it("calls onClick when clicked", async () => {
    const handleClick = vi.fn();
    const { user } = render(<Button onClick={handleClick}>Click</Button>);
    
    await user.click(screen.getByRole("button"));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Running Tests

```bash
# All unit + integration tests
pnpm test

# Watch mode
pnpm test:watch

# With UI
pnpm test:ui

# Coverage report
pnpm test:coverage

# E2E tests
pnpm test:e2e

# E2E with UI
pnpm test:e2e:ui
```

### Refactoring Requirements

When refactoring existing components, you **MUST**:

1. **Update existing tests** to reflect new behavior
2. **Update Storybook stories** if props/variants change
3. **Add missing tests** if coverage is below target
4. **Add missing stories** if they don't exist
5. **Run full test suite** before creating PR

```bash
# Before submitting refactoring PR:
pnpm test              # All tests pass
pnpm test:coverage     # Coverage maintained/improved
pnpm build-storybook   # Stories build correctly
```

**Refactoring Checklist:**

- [ ] All existing tests still pass
- [ ] New edge cases have tests
- [ ] Stories reflect current component API
- [ ] No decrease in code coverage
- [ ] Visual regression tests pass (if applicable)

## Pull Request Process

### Before Creating a PR

1. Ensure your branch is up-to-date with `main`:
   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. Run all checks locally:
   ```bash
   pnpm lint
   pnpm exec tsc --noEmit
   pnpm test
   pnpm build
   ```

3. Verify Storybook builds (for component changes):
   ```bash
   pnpm build-storybook
   ```

### PR Template

```markdown
## Description
Brief description of changes.

## Type of Change
- [ ] Feature (new component/functionality)
- [ ] Bug Fix
- [ ] Refactoring (existing code improvement)
- [ ] UI/UX Improvement
- [ ] Documentation

## Related Issues
Closes #123

## Screenshots/Videos
(For UI changes, include before/after screenshots)

## Testing (MANDATORY)
- [ ] Unit tests added (for new components molecules+)
- [ ] Unit tests updated (for refactoring)
- [ ] Integration tests added/updated (for API changes)
- [ ] E2E tests added/updated (for user flows)
- [ ] Manual testing completed

## Storybook (MANDATORY for components)
- [ ] Stories added for new component
- [ ] Stories updated for refactored component
- [ ] All variants documented
- [ ] Interactive states covered
- [ ] `pnpm build-storybook` succeeds

## Code Quality
- [ ] Code follows style guidelines
- [ ] TypeScript strict (no `any`)
- [ ] All tests pass (`pnpm test`)
- [ ] Coverage maintained or improved
- [ ] Responsive design verified
- [ ] Accessibility checked (ARIA, keyboard)
- [ ] Documentation updated (if needed)
```

## Commit Message Format

We follow conventional commits for clear project history.

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting)
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Build, dependency updates
- **ui**: UI/UX changes

### Scopes

- **atoms**: Atom components
- **molecules**: Molecule components
- **organisms**: Organism components
- **templates**: Template components
- **hooks**: Custom hooks
- **utils**: Utility functions
- **tests**: Test infrastructure
- **storybook**: Storybook configuration
- **deps**: Dependencies

### Examples

```bash
# Feature
feat(organisms): add MusicianCard component with genre chips

# Bug fix
fix(atoms): correct Button loading spinner alignment

# UI improvement
ui(molecules): improve SearchBar responsive behavior

# Tests
test(organisms): add MusicianCard unit tests

# Documentation
docs(storybook): add usage examples for Button variants
```

## Code Review Checklist

Reviewers should verify:

- [ ] Code follows TypeScript best practices
- [ ] Components follow Atomic Design pattern
- [ ] Proper use of path aliases
- [ ] Tests cover new functionality
- [ ] Storybook stories are complete
- [ ] No console errors or warnings
- [ ] Responsive design works
- [ ] Accessibility (keyboard navigation, ARIA)
- [ ] No hardcoded strings (use i18n when implemented)
- [ ] Performance considerations (memoization, lazy loading)

## Accessibility Guidelines

- Use semantic HTML elements
- Include proper ARIA labels
- Ensure keyboard navigation works
- Maintain color contrast ratios
- Test with screen readers

```typescript
// Good
<button aria-label="Close dialog" onClick={onClose}>
  <CloseIcon />
</button>

// Avoid
<div onClick={onClose}>
  <CloseIcon />
</div>
```

## State Management

We use **Zustand** for global state with the slices pattern. See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for detailed patterns.

### Quick Reference

```typescript
// Selectors (cause re-renders when state changes)
import { useAuth, useUI, useSearch } from "@store";

const user = useAuth((s) => s.user);
const theme = useUI((s) => s.theme);

// Actions (don't cause re-renders)
import { useAuthActions, useUIActions } from "@store";

const { login, logout } = useAuthActions();
const { addNotification } = useUIActions();

// High-level hooks
import { useNotify, useAuthentication } from "@store/hooks";

const notify = useNotify();
notify.success("Saved!");
```

### State Location Rules

| Type                   | Where                           | Example                   |
| ---------------------- | ------------------------------- | ------------------------- |
| Server data            | Server Components / React Query | API responses             |
| Auth, theme, global UI | Zustand                         | User session, preferences |
| Form inputs            | useState / React Hook Form      | Input values              |
| URL-derived            | useSearchParams                 | Filters, pagination       |

## For AI Agents

This section provides guidelines specifically for AI coding agents (GitHub Copilot, Claude, etc.) working on this codebase.

### Before Making Changes

1. **Read context files first**:
   - `CLAUDE.md` - Project overview and current state
   - `docs/ARCHITECTURE.md` - Patterns and conventions
   - Check existing similar components in the codebase

2. **Understand the requirement**:
   - What level of Atomic Design? (atom/molecule/organism)
   - Does it need global state or local state?
   - What's the API integration pattern?

### Implementation Checklist

When creating a new component:

```text
□ Correct Atomic Design level
□ TypeScript strict (no `any`)
□ Props documented with JSDoc
□ Uses path aliases (@atoms, @hooks, etc.)
□ Follows reactive patterns (unidirectional data flow)
□ Accessible (ARIA labels, keyboard nav)
□ Responsive design considered
□ ⚠️ Storybook story created (MANDATORY)
□ ⚠️ Tests created (MANDATORY for molecules+)
```

When refactoring a component:

```text
□ Existing tests still pass
□ New edge cases have tests
□ ⚠️ Stories updated to reflect changes
□ ⚠️ Tests updated for new behavior
□ Coverage not decreased
□ API changes documented
```

### Common Patterns

#### Creating a Component

```typescript
// 1. Define types first
interface MyComponentProps {
  /** Description of the prop */
  value: string;
  /** Optional callback */
  onChange?: (value: string) => void;
}

// 2. Use forwardRef if needed
export const MyComponent = forwardRef<HTMLDivElement, MyComponentProps>(
  ({ value, onChange, ...props }, ref) => {
    // 3. Hooks at the top
    const log = useLogger("MyComponent");
    
    // 4. Handlers
    const handleChange = useCallback((newValue: string) => {
      log.debug("Value changed", { newValue });
      onChange?.(newValue);
    }, [onChange, log]);
    
    // 5. Render
    return (
      <div ref={ref} {...props}>
        {/* content */}
      </div>
    );
  }
);

MyComponent.displayName = "MyComponent";
```

#### Using the Store

```typescript
// ✅ Granular selectors
const userName = useAuth((s) => s.user?.name);

// ✅ Actions don't cause re-renders
const { login } = useAuthActions();

// ❌ Don't select everything
const auth = useAuth((s) => s); // Bad!
```

#### Error Handling

```typescript
// Use logger, not console
import { logger } from "@lib";

try {
  await api.call();
} catch (error) {
  logger.error("API call failed", error, { context: "MyComponent" });
  notify.error("Something went wrong");
}
```

### File Organization

When adding a feature:

```
app/(main)/feature-name/
├── page.tsx                 # Server Component entry
├── components/              # Feature-specific components
│   ├── FeatureList.tsx
│   └── FeatureFilters.tsx
├── hooks/                   # Feature-specific hooks
│   └── useFeatureData.ts
└── actions.ts              # Server Actions
```

### Testing Quick Reference

- **Atoms**: Storybook stories (tests optional)
- **Molecules**: Storybook + interaction tests
- **Organisms**: Unit tests required (80% coverage)
- **Hooks**: Unit tests required
- **API integration**: Use MSW for mocking

### Do NOT

- Use `any` type
- Use `console.log` (use `logger`)
- Create god components (split into atoms/molecules)
- Put business logic in atoms
- Mutate state directly
- Skip accessibility attributes
- Ignore TypeScript errors
- **Create components without Storybook stories**
- **Create molecules/organisms without tests**
- **Refactor without updating tests and stories**
- **Submit PRs with failing tests**
- **Decrease code coverage**

## Questions?

- Check `CLAUDE.md` for project context
- Check `docs/ARCHITECTURE.md` for patterns
