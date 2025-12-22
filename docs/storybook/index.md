# Storybook

> **Version:** 10.1.4
> **Framework:** @storybook/nextjs-vite
> **Last Updated:** 2025-12-05

## Overview

Storybook es la herramienta de documentación y desarrollo de componentes de Bemyre. Permite desarrollar, probar y documentar componentes de forma aislada sin necesidad de levantar la aplicación completa.

## Quick Links

- [Quick Reference](./quick-reference.md) - Comandos y patrones comunes
- [Atomic Design](/components/README.md) - Estructura de componentes
- [Testing Requirements](/CLAUDE.md#requisitos-obligatorios-testing--stories) - Requisitos por nivel

## Stack

| Package | Version | Propósito |
|---------|---------|-----------|
| `storybook` | 10.1.4 | Core de Storybook |
| `@storybook/nextjs-vite` | 10.1.4 | Framework para Next.js + Vite |
| `@storybook/addon-docs` | 10.1.4 | Documentación automática (MDX/Autodocs) |
| `@storybook/addon-links` | 10.1.4 | Links entre stories |

## Comandos

```bash
# Desarrollo (puerto 6006)
bun run storybook

# Build estático
bun run build-storybook
```

## Configuración

### Archivos

```
.storybook/
├── main.ts      # Configuración principal (addons, framework, aliases)
└── preview.tsx  # Decorators globales (ThemeProvider, CssBaseline)
```

### Framework: @storybook/nextjs-vite

Usamos `@storybook/nextjs-vite` en lugar de `@storybook/react-vite` porque:

- **Mocks automáticos** para hooks de Next.js (`usePathname`, `useRouter`, etc.)
- **Soporte para `next/image`** sin configuración adicional
- **Soporte para `next/link`** con navegación simulada
- **Más rápido** que la versión Webpack
- **Compatible con Next.js 16** y React 19

### Addons

- `@storybook/addon-docs` (Autodocs/MDX docs)
- `@storybook/addon-links` (navegación entre stories)

### Autodocs global

Autodocs ahora se habilita de forma global con `tags: ["autodocs"]` en `.storybook/preview.tsx`. Para excluir un componente o story usa `tags: ["!autodocs"]` en el meta o en la story.

```typescript
// .storybook/preview.tsx
const preview: Preview = {
  tags: ["autodocs"],
  parameters: { ... },
};
```

En `.storybook/main.ts` se refuerza la generación automática:

```typescript
docs: {
  autodocs: "tag",
  defaultName: "Docs",
},
```

### Path Aliases

Los aliases de `tsconfig.json` están configurados en `viteFinal`:

```typescript
// .storybook/main.ts
viteFinal: async (config) => {
  config.resolve.alias = {
    "@": path.resolve(__dirname, ".."),
    "@atoms": path.resolve(__dirname, "../components/atoms"),
    "@molecules": path.resolve(__dirname, "../components/molecules"),
    // ... etc
  };
  return config;
}
```

### Next.js App Router

La configuración de `preview.tsx` incluye:

```typescript
parameters: {
  nextjs: {
    appDirectory: true,  // Habilita App Router
    navigation: {
      pathname: "/",     // Pathname por defecto
    },
  },
}
```

Para cambiar el pathname en una story específica:

```typescript
export const ActiveLink: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/profile",
      },
    },
  },
};
```

## Estructura de Stories

### Ubicación

Las stories se ubican junto al componente:

```
components/atoms/Button/
├── Button.tsx
├── Button.stories.tsx  # ← Story aquí
└── index.ts
```

### Patrón Base

```typescript
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { MyComponent } from "./MyComponent";

const meta = {
  title: "Atoms/MyComponent",  // Categoría/Nombre
  component: MyComponent,
  parameters: {
    layout: "centered",
  },
  // Autodocs viene de preview.tsx; usa tags: ["!autodocs"] para excluir
  argTypes: {
    // Controles para props
  },
  args: {
    onClick: fn(),  // Mock de funciones
  },
} satisfies Meta<typeof MyComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Default",
  },
};
```

## Decorators Globales

En `preview.tsx` tenemos decorators que envuelven todas las stories:

```typescript
decorators: [
  (Story) => (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Story />
    </ThemeProvider>
  ),
],
```

Esto asegura que todos los componentes tengan acceso al tema de MUI.

## Requisitos por Nivel

| Nivel | Story Requerida | Tests Requeridos |
|-------|-----------------|------------------|
| Atoms | ✅ Sí | ❌ No |
| Molecules | ✅ Sí | ✅ 70% coverage |
| Organisms | ✅ Sí | ✅ 80% coverage |
| Templates | ✅ Sí | ✅ 70% coverage |

## Troubleshooting

### "process is not defined"

Si ves este error, asegúrate de usar `@storybook/nextjs-vite` y no `@storybook/react-vite`.

### Hooks de Next.js no funcionan

Verifica que `nextjs.appDirectory: true` está en los parameters de `preview.tsx`.

### Imágenes no cargan

Las imágenes deben estar en `public/` y usar rutas absolutas (`/images/logo.png`).

## Related

- [Atomic Design](../architecture/components/atomic-design.md)
- [Component Patterns](../architecture/components/patterns.md)
- [Testing Guidelines](../architecture/implementation/checklists.md)

---

**Maintainer:** Frontend Team
**Review Cycle:** Per major Storybook update
