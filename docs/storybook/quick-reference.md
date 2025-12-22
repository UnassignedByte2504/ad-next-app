# Storybook Quick Reference

> Cheatsheet para desarrollo con Storybook en Bemyre

## Comandos

```bash
bun run storybook       # Dev server en :6006
bun run build-storybook # Build estático
```

## Addons habilitados

- `@storybook/addon-docs`: Autodocs/MDX docs
- `@storybook/addon-links`: navegación entre stories

## Crear una Story

### Template Mínimo

```typescript
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MyComponent } from "./MyComponent";

const meta = {
  title: "Atoms/MyComponent",
  component: MyComponent,
  // Autodocs ya viene de .storybook/preview.tsx; usar ["!autodocs"] para excluir
} satisfies Meta<typeof MyComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
```

### Con Args y Controls

```typescript
const meta = {
  title: "Atoms/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["contained", "outlined", "text"],
    },
    size: {
      control: "select",
      options: ["small", "medium", "large"],
    },
    disabled: { control: "boolean" },
  },
  args: {
    onClick: fn(), // Mock function
  },
} satisfies Meta<typeof Button>;
```

### Múltiples Variantes

```typescript
export const Default: Story = {
  args: { children: "Default" },
};

export const Primary: Story = {
  args: { variant: "contained", color: "primary" },
};

export const AllSizes: Story = {
  render: () => (
    <Stack direction="row" spacing={2}>
      <Button size="small">Small</Button>
      <Button size="medium">Medium</Button>
      <Button size="large">Large</Button>
    </Stack>
  ),
};
```

## Parameters Comunes

### Layout

```typescript
parameters: {
  layout: "centered",   // Centrado (default)
  layout: "fullscreen", // Pantalla completa
  layout: "padded",     // Con padding
}
```

### Backgrounds

```typescript
parameters: {
  backgrounds: {
    default: "dark",
    values: [
      { name: "light", value: "#fafafa" },
      { name: "dark", value: "#0a0a0a" },
    ],
  },
}
```

### Next.js Navigation

```typescript
parameters: {
  nextjs: {
    appDirectory: true,
    navigation: {
      pathname: "/profile",
      query: { id: "123" },
    },
  },
}
```

## Decorators

### En una Story

```typescript
export const InCard: Story = {
  decorators: [
    (Story) => (
      <Card sx={{ p: 2 }}>
        <Story />
      </Card>
    ),
  ],
};
```

### En el Meta (todas las stories)

```typescript
const meta = {
  // ...
  decorators: [
    (Story) => (
      <Box sx={{ maxWidth: 400 }}>
        <Story />
      </Box>
    ),
  ],
};
```

## Testing en Stories

### Interactions

```typescript
import { within, userEvent } from "storybook/test";

export const Clicked: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button"));
  },
};
```

### Expectations

```typescript
import { expect, within } from "storybook/test";

export const WithContent: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Hello")).toBeInTheDocument();
  },
};
```

## Categorización

```typescript
// Estructura recomendada
title: "Atoms/Button"
title: "Molecules/SearchBar"
title: "Organisms/MusicianCard"
title: "Templates/MainLayout"
```

## Imports Útiles

```typescript
// Types
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

// Testing utilities
import { fn, within, userEvent, expect } from "storybook/test";

// MUI para layouts en stories
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
```

## Estructura de Archivos

```
Component/
├── Component.tsx
├── Component.stories.tsx  # ← Siempre junto al componente
├── index.ts
└── tests/
    └── unit/
        └── Component.test.tsx
```

## Checklist Nueva Story

- [ ] Import types desde `@storybook/nextjs-vite`
- [ ] `title` con categoría correcta (Atoms/Molecules/etc)
- [ ] Autodocs viene de preview; solo usar `tags: ["!autodocs"]` si se debe excluir
- [ ] Story `Default` como mínimo
- [ ] `argTypes` para props con opciones
- [ ] `fn()` para props que son funciones
- [ ] Variantes importantes como stories separadas

## Troubleshooting Rápido

| Problema | Solución |
|----------|----------|
| `process is not defined` | Usar `@storybook/nextjs-vite` |
| `usePathname` no funciona | Añadir `nextjs.appDirectory: true` |
| Imágenes no cargan | Usar rutas desde `/public` |
| Estilos MUI no aplican | Verificar decorator con ThemeProvider |
| Hot reload no funciona | Reiniciar `bun run storybook` |
