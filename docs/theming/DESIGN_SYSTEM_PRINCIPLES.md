# Ayla Designs - Design System Principles

> **Version:** 1.0.0
> **Last Updated:** 2025-12-17
> **Based on:** Material Design 3 Expressive + Ayla Corporate Identity

## Overview

Este documento define los principios de diseño que guían el desarrollo de componentes en Ayla Designs. Combinamos la filosofía de **Material Design 3 Expressive** con nuestra **Corporate Identity** bohemia para crear una experiencia única, mágica y profesional.

**Documentos relacionados:**
- [Corporate Identity](../branding/CORPORATE_IDENTITY.mdx) - Colores, tipografía, categorías
- [Theming Index](./index.md) - Sistema de temas

---

## Filosofía: "Magia Profesional"

Ayla Designs conecta creatividad y profesionalismo. Nuestra UI debe reflejar la **elegancia bohemia** con la **funcionalidad de un e-commerce**:

| Principio | Expresión en UI |
|-----------|-----------------|
| **Magia** | Animaciones suaves, elementos celestiales sutiles |
| **Calidez** | Paleta amber/gold, esquinas redondeadas, sombras suaves |
| **Elegancia** | Tipografía serif para headings, espaciado generoso |
| **Claridad** | Jerarquía visual clara, CTAs evidentes |

---

## Material Design 3 Expressive

### ¿Qué es M3 Expressive?

Lanzado en Google I/O 2025, M3 Expressive introduce:

- **Motion Physics System** - Animaciones basadas en física de resortes
- **Shape Morphing** - Componentes que cambian de forma dinámicamente
- **Micro-interactions** - Pequeñas animaciones que dan vida a la UI
- **Dynamic Theming** - Personalización basada en contexto

### Principios que Adoptamos

#### 1. Spring Physics (Física de Resortes)

Animaciones orgánicas que evocan suavidad bohemia:

```typescript
// Spring para Ayla - más suave que default
const springConfig = {
  type: "spring",
  stiffness: 200,    // Más bajo = más suave
  damping: 25,       // Más alto = menos rebote
  mass: 1,
};
```

**Cuándo usar springs:**
- Hover states en cards de producto
- Expansión de modales y drawers
- Feedback de añadir al carrito
- Transiciones entre páginas

#### 2. Shape Morphing

Los componentes cambian forma sutilmente según su estado:

```typescript
// Botón CTA que se expande en hover
const buttonVariants = {
  default: {
    borderRadius: '9999px',  // Pill
    scale: 1,
  },
  hover: {
    borderRadius: '9999px',
    scale: 1.05,
    boxShadow: '0 4px 14px rgba(245, 158, 11, 0.25)',
  },
  pressed: {
    scale: 0.98,
  },
};

// Card de producto
const cardVariants = {
  default: {
    borderRadius: '16px',
    y: 0,
  },
  hover: {
    borderRadius: '20px',
    y: -4,
    boxShadow: '0 20px 25px rgba(120, 53, 15, 0.15)',
  },
};
```

#### 3. Micro-interactions

Pequeñas animaciones que comunican estado y dan feedback:

| Acción | Micro-interaction |
|--------|-------------------|
| Añadir al carrito | Check que aparece con bounce suave |
| Favorito | Corazón que late y crece |
| Añadido exitoso | Scale up + fade de verde |
| Error | Shake horizontal muy suave |
| Hover en producto | Card sube y sombra se expande |

#### 4. Niveles de Redondez (Shape Scale)

| Level | Radius | Uso en Ayla |
|-------|--------|-------------|
| `sm` | 8px | Badges pequeños |
| `md` | 12px | Inputs, chips interiores |
| `lg` | 16px | Cards, contenedores |
| `xl` | 24px | Modals, drawers |
| `2xl` | 32px | Hero sections |
| `full` | 9999px | **Buttons, chips, avatars** |

---

## Componentes: Atomic Design + E-commerce

### Arquitectura de Componentes

```
components/
├── atoms/
│   ├── Button/              # Pill buttons con gradiente
│   ├── Input/               # Inputs con focus amber
│   ├── Avatar/              # Avatares redondos
│   ├── Chip/                # Category chips
│   ├── Badge/               # Notification badges
│   ├── Price/               # Precio con formato
│   ├── Rating/              # Estrellas de review
│   └── Spinner/             # Loading
│
├── molecules/
│   ├── ProductPrice/        # Precio + descuento
│   ├── SearchBar/           # Búsqueda con icono
│   ├── CartItem/            # Item en carrito
│   ├── QuantitySelector/    # +/- cantidad
│   ├── CategoryTag/         # Tag de categoría
│   └── DownloadButton/      # Botón de descarga
│
├── organisms/
│   ├── Navbar/              # Navegación principal
│   ├── Footer/              # Footer con links
│   ├── ProductCard/         # Card de producto
│   ├── ProductModal/        # Modal detalle producto
│   ├── CartDrawer/          # Drawer del carrito
│   ├── ReviewCard/          # Testimonio/review
│   ├── CheckoutForm/        # Formulario checkout
│   └── Toast/               # Notificaciones
│
└── templates/
    ├── StorefrontLayout/    # Layout tienda
    ├── AdminLayout/         # Layout admin
    ├── AuthLayout/          # Layout auth
    └── AccountLayout/       # Layout cuenta
```

### Product Card (Ejemplo Principal)

```tsx
// Compound pattern para flexibilidad
<ProductCard variant="default" interactive>
  <ProductCard.Image
    src="/planner.webp"
    fallbackGradient={categoryColors.Planners}
  />
  <ProductCard.Badge category="Planners" />
  <ProductCard.Content>
    <ProductCard.Title>Celestial Planner 2025</ProductCard.Title>
    <ProductCard.Description>
      Planificador digital completo...
    </ProductCard.Description>
    <ProductCard.Price value={24.99} />
  </ProductCard.Content>
  <ProductCard.Actions>
    <Button variant="ghost">Ver más</Button>
    <Button variant="primary">Añadir</Button>
  </ProductCard.Actions>
</ProductCard>
```

---

## Buttons: Estilo Ayla

### Variantes

| Variant | Background | Text | Uso |
|---------|------------|------|-----|
| `primary` | Gradient amber | stone.900 | CTAs principales |
| `secondary` | white/stone.100 | stone.700 | Acciones secundarias |
| `ghost` | transparent | stone.600 | Acciones terciarias |
| `outline` | transparent + border | amber.600 | Filtros, toggles |

### Tamaños

| Size | Height | Padding | Uso |
|------|--------|---------|-----|
| `sm` | 36px | 16px 20px | Cards, listas |
| `md` | 44px | 20px 24px | **Default** |
| `lg` | 52px | 24px 32px | CTAs hero |

### Implementación

```tsx
<Button
  variant="primary"
  size="lg"
  className="bg-gradient-to-r from-amber-500 to-amber-400"
>
  <Sparkles size={18} />
  Explorar Diseños
</Button>
```

---

## Cards: Productos y Reviews

### Product Card States

```typescript
const productCardStyles = {
  default: {
    borderRadius: '16px',
    boxShadow: '0 1px 2px rgba(120, 53, 15, 0.05)',
    transition: 'all 500ms ease-out',
  },
  hover: {
    transform: 'translateY(-4px) scale(1.02)',
    boxShadow: '0 20px 25px rgba(120, 53, 15, 0.15)',
  },
};
```

### Review Card

```tsx
<ReviewCard>
  <ReviewCard.Rating value={5} />
  <ReviewCard.Quote>
    "Los diseños de Ayla son exactamente lo que buscaba..."
  </ReviewCard.Quote>
  <ReviewCard.Author
    name="María González"
    role="Wedding Planner"
    avatarColor="gold"
  />
</ReviewCard>
```

---

## Chips: Categorías de Producto

### Variantes

| Variant | Background | Border | Text | Uso |
|---------|------------|--------|------|-----|
| `soft` | color 30% | none | stone.800 | **Default** |
| `filled` | color 90% | none | stone.900 | Selección activa |
| `outlined` | transparent | color | stone.700 | Filtros |

### Colores por Categoría

```tsx
const categoryColors = {
  Planners: '#C9B8D4',    // Lavender
  Tarjetas: '#D4B896',    // Sand
  'Social Media': '#A855F7', // Purple
  Bodas: '#F2DCDC',       // Blush
  Branding: '#E8D5B0',    // Gold
  'Thank You': '#E1D8EA', // Sage
};

// Uso
<Chip
  label="Planners"
  variant="soft"
  sx={{
    bgcolor: `${categoryColors.Planners}4D`,
    color: 'stone.800',
  }}
/>
```

---

## Motion Tokens

### Spring Configurations

```typescript
export const motionTokens = {
  // Interacciones suaves (hover, botones)
  gentle: {
    type: "spring",
    stiffness: 200,
    damping: 25,
  },

  // Expansión de elementos (modales, drawers)
  smooth: {
    type: "spring",
    stiffness: 250,
    damping: 22,
  },

  // Feedback de éxito (añadir al carrito)
  success: {
    type: "spring",
    stiffness: 400,
    damping: 15,
  },

  // Elementos decorativos (floating stars)
  float: {
    duration: 6,
    ease: "easeInOut",
    repeat: Infinity,
  },
};
```

### Durations (Fallback)

| Token | Duration | Uso |
|-------|----------|-----|
| `instant` | 100ms | Hover backgrounds |
| `fast` | 200ms | Tooltips |
| `normal` | 300ms | Transiciones UI |
| `slow` | 500ms | Modales, drawers |
| `decorative` | 2-6s | Elementos flotantes |

---

## Accesibilidad

### Reduced Motion

Siempre respetar `prefers-reduced-motion`:

```typescript
const motionConfig = {
  reduced: {
    type: "tween",
    duration: 0.1,
  },
};

// Hook
const prefersReducedMotion = useReducedMotion();
```

### Focus States

- Focus ring visible: 2px solid amber.500
- Outline offset: 2px
- No depender solo del color para comunicar estado
- Keyboard navigation completa en cart y checkout

### Color Contrast

- Texto principal sobre fondo: mínimo 4.5:1
- Texto grande (headings): mínimo 3:1
- Nunca usar amber puro como color de texto
- Usar stone.800/900 sobre backgrounds amber

---

## Implementación Técnica

### Dependencias

```json
{
  "framer-motion": "^11.x",  // Spring animations
  "@mui/material": "^7.x",   // Base components
  "lucide-react": "^0.x",    // Iconos
}
```

### Estructura de Archivos

```
app/
├── theme.ts              # MUI theme + Ayla overrides
├── globals.css           # Tailwind + CSS variables
└── ui/
    └── theme/
        ├── index.ts      # Main export
        ├── tokens/
        │   ├── colors.ts
        │   ├── typography.ts
        │   └── motion.ts
        └── components/
            └── index.ts  # MUI overrides
```

---

## Checklist de Componente

Al crear un nuevo componente, verificar:

- [ ] Usa tokens de color de `@/app/ui/theme`
- [ ] Tipografía: Cormorant para headings, Nunito para body
- [ ] Implementa spring animations para estados interactivos
- [ ] Respeta `prefers-reduced-motion`
- [ ] Border radius según escala (pills para botones, 16px+ para cards)
- [ ] Sombras con tinte amber, no negro
- [ ] Focus states accesibles con ring amber
- [ ] Documentado en Storybook
- [ ] Tests unitarios (molecules+)

---

## Referencias

### Material Design 3 Expressive
- [M3 Expressive Overview](https://m3.material.io/styles)
- [M3 Motion System](https://m3.material.io/styles/motion/overview)
- [M3 Components](https://m3.material.io/components)

### Ayla Brand
- [Corporate Identity](../branding/CORPORATE_IDENTITY.mdx)
- [Theming Guide](./index.md)

### E-commerce Best Practices
- [Baymard Institute](https://baymard.com/) - UX Research
- [Shopify Polaris](https://polaris.shopify.com/) - Design System

---

**Maintainer:** Design & Frontend Team
**Review Cycle:** Quarterly
