# Ayla Designs Theme System

> Sistema modular de temas para MUI 7 con soporte para dark/light mode y CSS variables.

## Arquitectura

```
app/ui/theme/
├── index.ts              # Main theme export + utilities
├── tokens/
│   ├── index.ts          # Barrel export
│   ├── colors.ts         # Color tokens (brand, semantic, category)
│   ├── typography.ts     # Font families, sizes, weights
│   └── motion.ts         # Spring configs, animations
├── dark/
│   └── index.ts          # Dark palette configuration
├── light/
│   └── index.ts          # Light palette configuration (default)
└── components/
    └── index.ts          # MUI component overrides
```

## Quick Reference

### Importar Tema

```typescript
// En componentes (recomendado)
import { theme, categoryColors, fontFamilies } from "@/app/ui/theme";

// En providers
import { theme } from "@/app/ui/theme";
```

### Design Tokens

```typescript
import {
  // Brand colors
  primary,      // Amber Gold #F59E0B
  secondary,    // Lavender #A855F7
  accent,       // Rose Pink #F43F5E
  stone,        // Stone scale 50-950

  // Semantic
  semantic,     // error, warning, info, success

  // Domain colors
  categoryColors,   // Record<string, string> - 6 categorías
  gradients,        // Brand gradients

  // Typography
  fontFamilies,     // heading (Cormorant), body (Nunito Sans), mono
  fontWeights,      // light, regular, medium, semibold, bold
  fontSizes,        // xs to 6xl
} from "@/app/ui/theme";
```

### Usar Colores de Categoría

```tsx
import { categoryColors } from "@/app/ui/theme";

// Obtener color de una categoría
const plannersColor = categoryColors.Planners; // "#C9B8D4"

// En un Chip
<Chip
  label="Planners"
  sx={{
    bgcolor: `${categoryColors.Planners}4D`, // 30% opacity
    color: 'stone.800',
  }}
/>
```

## Paleta de Colores

### Brand Colors

| Token       | Color    | Hex       | Uso                           |
|-------------|----------|-----------|-------------------------------|
| `primary`   | Amber    | `#F59E0B` | CTAs, acciones principales    |
| `secondary` | Lavender | `#A855F7` | Acentos, highlights místicos  |
| `accent`    | Rose     | `#F43F5E` | Contraste, elementos terciarios |

### Stone Scale (Neutral)

| Token         | Hex       | Uso en Light Mode       | Uso en Dark Mode        |
|---------------|-----------|-------------------------|-------------------------|
| `stone[50]`   | `#FAFAF9` | **Background default**  | Highlight text          |
| `stone[100]`  | `#F5F5F4` | **Background paper**    | Emphasis text           |
| `stone[200]`  | `#E7E5E4` | Borders, dividers       | Primary text            |
| `stone[400]`  | `#A8A29E` | Placeholder text        | Secondary text          |
| `stone[600]`  | `#57534E` | Icons, secondary text   | Disabled text           |
| `stone[800]`  | `#292524` | Headers                 | Cards, modals           |
| `stone[900]`  | `#1C1917` | **Emphasis text**       | **Background paper**    |
| `stone[950]`  | `#0C0A09` | -                       | **Background default**  |

### Semantic Colors

| Token     | Main      | Light     | Dark      |
|-----------|-----------|-----------|-----------|
| `error`   | `#EF4444` | `#FEE2E2` | `#DC2626` |
| `warning` | `#F59E0B` | `#FEF3C7` | `#D97706` |
| `info`    | `#3B82F6` | `#DBEAFE` | `#2563EB` |
| `success` | `#10B981` | `#D1FAE5` | `#059669` |

## Tipografía

### Font Stack

| Uso       | Familia            | Variable CSS              |
|-----------|--------------------|---------------------------|
| Headings  | Cormorant Garamond | `fontFamilies.heading`    |
| Body      | Nunito Sans        | `fontFamilies.body`       |
| Code      | JetBrains Mono     | `fontFamilies.mono`       |

### Uso en Componentes

```tsx
import { fontFamilies } from "@/app/ui/theme";

// En sx prop
<Typography sx={{ fontFamily: fontFamilies.heading }}>
  Título con Cormorant Garamond
</Typography>

// Clase font-serif de Tailwind
<h1 className="font-serif text-4xl">
  Diseños con magia
</h1>
```

## Light vs Dark Mode

### Default: Light Mode

Ayla Designs usa **light mode por defecto** para:
- Mejor visualización de productos (colores y detalles)
- Sensación cálida y acogedora
- Coherencia con aesthetic bohemio
- Mejor experiencia de e-commerce

### Cambiar Tema en Runtime

```tsx
import { useUI, useUIActions } from '@store';

function ThemeToggle() {
  const currentTheme = useUI(s => s.theme);
  const { setTheme } = useUIActions();

  return (
    <Button onClick={() => setTheme(currentTheme === 'dark' ? 'light' : 'dark')}>
      Toggle Theme
    </Button>
  );
}
```

### CSS Variables

```css
/* Generado automáticamente por MUI */
:root.light {
  --mui-palette-primary-main: #F59E0B;
  --mui-palette-background-default: #FAFAF9;
}

:root.dark {
  --mui-palette-primary-main: #FBBF24;
  --mui-palette-background-default: #1C1917;
}
```

## Component Overrides

Los componentes MUI están customizados en `app/ui/theme/components/index.ts`:

- **Buttons**: Border radius full (pill), sin uppercase, gradiente amber
- **Cards**: Border radius 16px, sombras con tinte amber
- **Chips**: Border radius full, variantes soft/filled/outlined
- **Inputs**: Border radius 12px, focus con amber
- **Dialogs**: Border radius 24px

## Extended Palette

```tsx
import { getExtendedPalette } from "@/app/ui/theme";

const extended = getExtendedPalette('light');

// Surface levels
extended.surface.level0  // #FAFAF9
extended.surface.level1  // #FFFFFF

// Category colors
extended.category.Planners   // #C9B8D4
extended.category.Bodas      // #F2DCDC

// Brand gradients
extended.gradient.primary    // linear-gradient(to right, #F59E0B, #FBBF24)
extended.gradient.celestial  // linear-gradient(135deg, #F59E0B, #A855F7)
```

## Crear Shadows con Brand Color

```tsx
import { createBrandShadow } from "@/app/ui/theme";

// Shadow con tinte amber
const shadow = createBrandShadow(2, 'light');
// → "0 4px 16px rgba(120, 53, 15, 0.1)"

// Shadow para hover especial
const hoverShadow = createBrandShadow(3, 'light', 'amber');
// → "0 10px 25px rgba(245, 158, 11, 0.25)"
```

## Checklist: Usar Tema Correctamente

- [ ] Importar desde `@/app/ui/theme`, no hardcodear colores
- [ ] Usar `theme.palette.primary.main` en vez de `"#F59E0B"`
- [ ] Usar `fontFamilies.heading` para títulos (Cormorant), `fontFamilies.body` para texto (Nunito)
- [ ] Respetar la escala stone para backgrounds y textos
- [ ] Usar `categoryColors` para chips de categoría de producto
- [ ] Probar componentes en ambos temas (light y dark)
- [ ] Usar border-radius generosos (pills para botones, 16px+ para cards)

## Documentación Relacionada

- [CORPORATE_IDENTITY.mdx](../branding/CORPORATE_IDENTITY.mdx) - Guía completa de marca
- [DESIGN_SYSTEM_PRINCIPLES.md](./DESIGN_SYSTEM_PRINCIPLES.md) - Principios de diseño
- [MUI Theming Docs](https://mui.com/material-ui/customization/theming/)
