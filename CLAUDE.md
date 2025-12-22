# CLAUDE.md - Ayla Designs Client

Este archivo proporciona contexto para Claude al trabajar en el cliente de Ayla Designs.

> **📚 Documentación Completa**:
>
> - [docs/plans/](docs/plans/) - Diseños y planes de arquitectura
> - [docs/architecture/](docs/architecture/) - Arquitectura del proyecto (índice)
> - [docs/server-components/](docs/server-components/) - Server Components (índice)
> - [docs/i18n/](docs/i18n/) - Internacionalización (índice)
> - [docs/middleware/](docs/middleware/) - Middleware layer (índice)
> - [docs/theming/](docs/theming/) - Sistema de temas y design tokens
> - [docs/branding/](docs/branding/) - Corporate Identity y guía de marca
> - [docs/storybook/](docs/storybook/) - Storybook y desarrollo de componentes
> - [docs/DOCUMENTING_GUIDELINES.md](docs/DOCUMENTING_GUIDELINES.md) - Guía de documentación
> - [CONTRIBUTING.md](CONTRIBUTING.md) - Guía de contribución

## 📖 Cómo Usar la Documentación

### Para Consultar

La documentación está organizada en directorios temáticos. Cada tema tiene:

- `index.md` - Overview y tabla de contenidos
- `quick-reference.md` - Cheatsheet (opcional)
- Subdirectorios con archivos específicos

**Rutas principales:**

| Tema              | Ruta                                              | Cuándo consultar                     |
| ----------------- | ------------------------------------------------- | ------------------------------------ |
| Arquitectura Ayla | `docs/plans/2025-12-17-ayla-designs-architecture.md` | Diseño completo del producto      |
| Arquitectura      | `docs/architecture/`                              | Patrones, capas, estado, componentes |
| Server Components | `docs/server-components/`                         | RSC, "use client", patrones          |
| i18n              | `docs/i18n/`                                      | Traducciones, locales, navegación    |
| Middleware        | `docs/middleware/`                                | Auth, CSRF, correlation IDs          |
| Theming           | `docs/theming/`                                   | Colores, tipografía, design tokens   |
| Branding          | `docs/branding/`                                  | Corporate Identity, guía de marca    |
| Storybook         | `docs/storybook/`                                 | Desarrollo de componentes, stories   |

**Búsqueda rápida:**

```text
Arquitectura Ayla       → docs/plans/2025-12-17-ayla-designs-architecture.md
Arquitectura general    → docs/architecture/index.md
Patrones de estado      → docs/architecture/state/
Atomic Design           → docs/architecture/components/
Cuándo usar RSC         → docs/server-components/quick-reference.md
Agregar traducciones    → docs/i18n/adding-translations.md
Rutas protegidas        → docs/middleware/quick-reference.md
Sistema de temas        → docs/theming/index.md
Colores de marca        → docs/branding/CORPORATE_IDENTITY.mdx
Colores de categorías   → app/ui/theme/tokens/colors.ts
Crear stories           → docs/storybook/quick-reference.md
```

## ⚠️ Requisitos Obligatorios (Testing & Stories)

| Nivel         | Story | Test | Coverage |
| ------------- | ----- | ---- | -------- |
| **Atoms**     | ✅     | ❌    | -        |
| **Molecules** | ✅     | ✅    | 70%      |
| **Organisms** | ✅     | ✅    | 80%      |
| **Templates** | ✅     | ✅    | 70%      |
| **Hooks**     | N/A   | ✅    | 90%      |
| **Utils**     | N/A   | ✅    | 90%      |

**Al crear componentes:**

- Atoms: Story obligatoria
- Molecules+: Story + Tests obligatorios

## ✨ Descripción del Proyecto

**Ayla Designs** es una plataforma e-commerce para productos digitales de diseño con estética bohemia:

- Venta de plantillas digitales (planners, tarjetas, kits de branding)
- Carrito de compras y checkout (Stripe + PayPal)
- Descargas digitales con URLs firmadas y versionado
- Panel de administración para gestión de productos
- Sistema de automatizaciones y segmentación de clientes

**Dominio**: `ayladesigns.me` (storefront) + `admin.ayladesigns.me` (admin panel)

### Categorías de Productos

| Categoría      | Color     | Descripción                      |
| -------------- | --------- | -------------------------------- |
| Planners       | `#C9B8D4` | Planificadores digitales         |
| Tarjetas       | `#D4B896` | Tarjetas de visita, thank you    |
| Social Media   | `#A855F7` | Kits para Instagram, posts       |
| Bodas          | `#F2DCDC` | Invitaciones, RSVP, menús        |
| Branding       | `#E8D5B0` | Logos, paletas, guías de marca   |
| Thank You      | `#E1D8EA` | Tarjetas de agradecimiento       |

### Roles de Usuario

| Rol            | Alcance                                           |
| -------------- | ------------------------------------------------- |
| **Super Admin** | Todo: config de app, API keys, devops, sistema   |
| **Admin**       | Productos, pedidos, clientes, contenido, promos  |
| **Customer**    | Navegar, carrito, comprar, ver pedidos, descargas |

## 🛠️ Stack Tecnológico

| Tecnología   | Versión | Propósito                         |
| ------------ | ------- | --------------------------------- |
| Bun          | 1.3.x   | Runtime, package manager, bundler |
| Next.js      | 16.x    | Framework React con App Router    |
| React        | 19.x    | UI Library (Server Components)    |
| TypeScript   | 5.x     | Type safety                       |
| Material UI  | 7.x     | Componentes UI                    |
| Tailwind CSS | 4.x     | Utility-first CSS                 |
| Zustand      | 5.x     | Estado global                     |
| next-intl    | 4.x     | Internacionalización (ES + EN)    |
| Storybook    | 10.x    | Documentación de componentes      |

## 🏗️ Server Components (React Server Components)

**Patrón por defecto:** Server Components (RSC)

```tsx
// ✅ Por defecto: Server Component (no directive)
export function ProductList() {
  return <div>Server rendered!</div>;
}

// ⚠️ Solo cuando se necesita: Client Component
"use client";
export function AddToCartButton() {
  const [added, setAdded] = useState(false);
  return <Button onClick={() => setAdded(true)}>Añadir</Button>;
}
```

### Cuándo usar "use client"

| Necesitas...                 | Server   | Client         |
| ---------------------------- | -------- | -------------- |
| useState, useEffect, hooks   | ❌        | ✅ "use client" |
| onClick, onChange handlers   | ❌        | ✅ "use client" |
| Zustand store (useCart, etc) | ❌        | ✅ "use client" |
| Browser APIs (window, etc)   | ❌        | ✅ "use client" |
| Fetch data (async/await)     | ✅ Server | ❌              |
| MUI components (sin eventos) | ✅ Server | ✅ Client       |
| Display props                | ✅ Server | ✅ Client       |

### Reglas de Oro

1. **Default a Server** - No añadas "use client" a menos que sea necesario
2. **Push Client Down** - Haz el componente más pequeño posible Client Component
3. **Pages siempre Server** - `page.tsx` NUNCA debe tener "use client"
4. **Fetch en Server** - Los datos se obtienen en Server Components

📖 **Ver:** [docs/server-components/](docs/server-components/) para la guía completa

## 📁 Estructura del Proyecto

```bash
ayla-designs/client/
├── app/                    # Next.js App Router
│   ├── [locale]/           # Rutas con i18n (es, en)
│   │   ├── page.tsx        # Landing page
│   │   ├── products/       # Catálogo de productos
│   │   ├── cart/           # Carrito
│   │   ├── checkout/       # Checkout
│   │   ├── account/        # Cuenta del cliente
│   │   └── auth/           # Login, register
│   ├── admin/              # Panel de administración (subdomain)
│   │   └── [locale]/       # Rutas admin con i18n
│   ├── api/                # API routes
│   ├── providers.tsx       # Client providers (MUI, ErrorBoundary)
│   ├── theme.ts            # Re-export del tema
│   ├── globals.css         # Estilos globales + Tailwind
│   └── ui/theme/           # Sistema modular de temas
├── components/             # Atomic Design
│   ├── atoms/              # Button, Avatar, Chip, Card, Input, etc.
│   ├── molecules/          # CardHeader, CardContent, SectionHeader
│   ├── organisms/          # Navbar, Footer, Hero, ErrorBoundary
│   ├── templates/          # SettingsLayout
│   └── index.ts            # Barrel export
├── hooks/                  # Custom React hooks
├── lib/                    # Configuraciones de librerías
│   ├── logger/             # Sistema de logging
│   └── api/                # Cliente HTTP
├── store/                  # Zustand state management
│   └── slices/             # auth, ui, search, cart (TODO)
├── utils/                  # Funciones helper
├── types/                  # TypeScript types/interfaces
├── messages/               # Traducciones (en/, es/)
└── tests/                  # Unit, integration, e2e tests
```

## 🎯 Path Aliases

Configurados en `tsconfig.json`:

```typescript
// Componentes (Atomic Design)
import { Button, Avatar } from "@atoms";
import { CardHeader, SectionHeader } from "@molecules";
import { Navbar, Footer, ErrorBoundary } from "@organisms";
import { SettingsLayout } from "@templates";

// Hooks
import { useLogger } from "@hooks";

// Librerías
import { logger, initLogger, captureError } from "@lib";

// Store
import { useAuth, useUI, useCart } from "@store";

// Utilidades
import { cn, formatDate, formatPrice } from "@utils";

// Tipos
import type { Product, Variant, Order, Customer } from "@types";
```

## 🧩 Patrón Atomic Design

### Atoms (`@atoms`)

Componentes indivisibles: Button, Avatar, Chip, Card, Input, Logo, NavLink, SearchInput, ThemeToggle

### Molecules (`@molecules`)

Combinaciones de átomos: CardHeader, CardContent, CardActions, CardChipGroup, SectionHeader, CallToAction, NavbarBrand, NavbarLinks

**TODO Ayla-específicos:** ProductPrice, CartItem, QuantitySelector, CategoryTag, DownloadButton

### Organisms (`@organisms`)

Secciones complejas: Navbar, Footer, Hero, ErrorBoundary, SessionWarningModal, ConsentBanner, FAQAccordion, Carousel

**TODO Ayla-específicos:** ProductCard, ProductModal, CartDrawer, ReviewCard, CheckoutForm, OrderSummary

### Templates (`@templates`)

Layouts: SettingsLayout

**TODO Ayla-específicos:** StorefrontLayout, AdminLayout, AuthLayout, AccountLayout

## 🎨 Sistema de Temas

### Filosofía de Marca

**Concepto:** "Magia Profesional" - Diseños bohemios con elegancia corporativa

### Colores de Marca

| Token       | Color    | Hex       | Uso                           |
| ----------- | -------- | --------- | ----------------------------- |
| `primary`   | Amber    | `#F59E0B` | CTAs, acciones principales    |
| `secondary` | Lavender | `#A855F7` | Acentos, highlights místicos  |
| `accent`    | Rose     | `#F43F5E` | Contraste, elementos terciarios |

### Neutrales (Stone)

Ayla usa **stone** en lugar de gray para sensación más cálida:

| Token       | Hex       | Uso Light Mode        |
| ----------- | --------- | --------------------- |
| `stone.50`  | `#FAFAF9` | Background default    |
| `stone.100` | `#F5F5F4` | Background paper      |
| `stone.700` | `#44403C` | Primary text          |
| `stone.900` | `#1C1917` | Emphasis text         |

### Tipografía

| Uso      | Fuente             | Variable                |
| -------- | ------------------ | ----------------------- |
| Headings | Cormorant Garamond | `fontFamilies.heading`  |
| Body     | Nunito Sans        | `fontFamilies.body`     |
| Code     | JetBrains Mono     | `fontFamilies.mono`     |

### Uso Básico

```typescript
import { theme, primary, categoryColors, fontFamilies } from "@/app/ui/theme";

// Colores de marca
primary.main;      // #F59E0B - Amber Gold
secondary.main;    // #A855F7 - Lavender
accent.main;       // #F43F5E - Rose

// Colores de categorías
categoryColors.Planners;     // #C9B8D4
categoryColors.Bodas;        // #F2DCDC
categoryColors.Branding;     // #E8D5B0

// Tipografía
fontFamilies.heading;  // Cormorant Garamond - para títulos
fontFamilies.body;     // Nunito Sans - para texto
```

### Chips de Categoría

```tsx
import { categoryColors } from "@/app/ui/theme";

<Chip
  label="Planners"
  sx={{
    bgcolor: `${categoryColors.Planners}4D`, // 30% opacity
    color: 'stone.800',
  }}
/>
```

### Reglas de Uso

1. **Nunca hardcodear colores** - Usar tokens de `@/app/ui/theme`
2. **Light mode por defecto** - La app usa light mode (mejor para e-commerce)
3. **Cormorant para headings** - Usar `fontFamilies.heading` para títulos
4. **Nunito para body** - Usar `fontFamilies.body` para texto general
5. **Botones pill** - Border radius full (9999px) para botones
6. **Sombras con tinte amber** - No usar negro puro en sombras

📖 **Ver:** [docs/theming/](docs/theming/) y [docs/branding/CORPORATE_IDENTITY.mdx](docs/branding/CORPORATE_IDENTITY.mdx)

## 🚨 CRÍTICO: Directrices de Theming Centralizado

> **IMPORTANTE**: Todos los componentes DEBEN usar el sistema de temas centralizado.
> NO hardcodear valores de colores, tipografía o espaciado.

### Imports Obligatorios para Componentes

```typescript
// ✅ CORRECTO - Siempre importar del tema centralizado
import {
  primary,
  secondary,
  accent,
  neutral,
  semantic,
  categoryColors,
  fontFamilies,
  shadows,
  springs,
} from "@/app/ui/theme";

// ❌ INCORRECTO - NUNCA hardcodear valores
sx={{ color: "#F59E0B" }}           // ❌ NO
sx={{ color: primary.main }}        // ✅ SÍ

sx={{ fontFamily: "'Nunito Sans'" }} // ❌ NO
sx={{ fontFamily: fontFamilies.body }} // ✅ SÍ

sx={{ bgcolor: "#FAFAF9" }}         // ❌ NO
sx={{ bgcolor: neutral[50] }}       // ✅ SÍ
```

### Checklist de Nuevo Componente

Al crear o modificar un componente, verificar:

- [ ] **Colores**: Usar `primary`, `secondary`, `neutral`, `semantic` del tema
- [ ] **Tipografía**: Usar `fontFamilies.heading` (Cormorant) / `fontFamilies.body` (Nunito)
- [ ] **Categorías**: Usar `categoryColors` para chips de categoría de producto
- [ ] **Sombras**: Usar `shadows` del tema (tinte amber, no negro puro)
- [ ] **Animaciones**: Usar `springs` para física de animación M3
- [ ] **Border Radius**: Usar `9999px` para botones (pill shape), `16px` para cards
- [ ] **Light Mode**: Diseñar para light mode primero (fondo stone.50: `#FAFAF9`)

### Tokens Disponibles en `@/app/ui/theme`

| Token            | Uso                                      |
| ---------------- | ---------------------------------------- |
| `primary`        | Colores amber (main: #F59E0B)            |
| `secondary`      | Colores lavender (main: #A855F7)         |
| `accent`         | Colores rose (main: #F43F5E)             |
| `neutral`        | Escala stone (50-950)                    |
| `semantic`       | success, warning, error, info            |
| `categoryColors` | Planners, Tarjetas, Bodas, Branding, etc |
| `fontFamilies`   | heading, body, mono                      |
| `shadows`        | sm, md, lg, xl, amber                    |
| `springs`        | snappy, smooth, bouncy                   |

### Patrón de Estilos en Componentes

```tsx
// ✅ Patrón correcto para componentes Ayla
import { primary, neutral, fontFamilies, shadows } from "@/app/ui/theme";

export function MyComponent() {
  return (
    <Box
      sx={{
        bgcolor: neutral[50],           // Background cálido
        color: neutral[800],            // Texto legible
        fontFamily: fontFamilies.body,  // Nunito Sans
        borderRadius: "16px",           // Cards
        boxShadow: shadows.md,          // Sombra con tinte amber
      }}
    >
      <Typography
        sx={{
          fontFamily: fontFamilies.heading,  // Cormorant Garamond
          color: neutral[900],
        }}
      >
        Título
      </Typography>
      <Button
        sx={{
          borderRadius: "9999px",                                    // Pill
          background: `linear-gradient(to right, ${primary.main}, ${primary.light})`,
          boxShadow: shadows.amber,
        }}
      >
        Acción
      </Button>
    </Box>
  );
}
```

### Documentación de Referencia

Antes de diseñar nuevos componentes, SIEMPRE consultar:

1. **[docs/branding/CORPORATE_IDENTITY.mdx](docs/branding/CORPORATE_IDENTITY.mdx)** - Guía visual completa
2. **[docs/theming/DESIGN_SYSTEM_PRINCIPLES.md](docs/theming/DESIGN_SYSTEM_PRINCIPLES.md)** - Principios de diseño
3. **[app/ui/theme/tokens/colors.ts](app/ui/theme/tokens/colors.ts)** - Tokens de color
4. **Storybook Brand/** - Ejemplos visuales de la marca

## 🚀 Comandos

```bash
bun dev              # Desarrollo Next.js (puerto 3000)
bun build            # Build de producción
bun start            # Servir build de producción
bun lint             # ESLint
bun test             # Tests con Vitest
bun storybook        # Storybook (puerto 6006)
bun build-storybook  # Build de Storybook
```

## 🔗 Integración con Backend

El backend está en `ayla-designs/server/` (FastAPI + Python):

- API REST en `/api/v1/`
- Neo4j para datos (productos, clientes, segmentos)
- Redis para cache y sesiones
- Kafka para eventos y automaciones
- Meilisearch para búsqueda de productos

## 📝 Tipos del Dominio

Definidos en `@types` (TODO - crear):

```typescript
// Productos
interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: Category;
  variants: Variant[];
  images: string[];
  status: 'active' | 'draft' | 'archived';
}

interface Variant {
  id: string;
  name: string;
  price: number;
  features: string[];
  files: ProductFile[];
}

interface Bundle {
  id: string;
  name: string;
  products: Product[];
  discountType: 'percentage' | 'fixed';
  discountValue: number;
}

// Pedidos
interface Order {
  id: string;
  customerId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'completed' | 'refunded';
  paymentMethod: 'stripe' | 'paypal';
}

interface OrderItem {
  productId: string;
  variantId: string;
  price: number;
  downloadToken: string;
  downloadsRemaining: number;
}

// Clientes
interface Customer {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'admin' | 'super_admin';
  orders: Order[];
  favorites: Product[];
}
```

## 🛡️ Error Handling & Logging

### Logger (`@lib/logger`)

**NUNCA usar `console.log` directamente.** Usar el logger:

```typescript
import { logger } from "@lib/logger";
import { useLogger } from "@hooks";

// Uso directo
logger.info("Producto añadido al carrito", { productId: "123" });
logger.error("Error en checkout", error, { orderId: "456" });

// Con contexto (en componentes)
const log = useLogger("ProductCard");
log.debug("Renderizando card", { productId });
```

### Error Boundary (`@organisms/ErrorBoundary`)

```tsx
<ErrorBoundary componentName="Checkout" onError={handleError}>
  <CheckoutContent />
</ErrorBoundary>
```

📖 **Ver sección completa de logging en docs anteriores**

## 🗃️ Estado Global (Zustand)

### Slices Actuales

- `authSlice` - Autenticación (user, token, login/logout)
- `uiSlice` - UI (theme, sidebar, notifications)
- `searchSlice` - Búsqueda global

### Slices TODO (Ayla-específicos)

- `cartSlice` - Carrito de compras
- `productSlice` - Cache de productos, filtros
- `checkoutSlice` - Estado del checkout

```typescript
import { useAuth, useUI } from "@store";
import { useAuthActions, useUIActions } from "@store";

const user = useAuth((state) => state.user);
const { login, logout } = useAuthActions();
```

## 🧪 Testing

```bash
bun test             # Unit + integration tests
bun test:unit        # Solo unit tests
bun test:e2e         # E2E con Playwright
bun test:coverage    # Coverage report
```

Tests en `tests/unit/components/`, `tests/unit/hooks/`, etc.

## ⚠️ Notas Importantes

1. **Next.js 16 + React 19** - Usar nuevas APIs cuando sea posible
2. **Light mode por defecto** - Diferente a Bemyre que usaba dark mode
3. **Fuentes serif** - Cormorant Garamond para headings (elegancia bohemia)
4. **Botones pill** - Siempre border-radius full en botones
5. **Sombras amber** - Usar tinte amber en sombras, no negro puro
6. **NUNCA usar console.log** - Usar `logger` o `useLogger`
7. **page.tsx NUNCA "use client"** - Pages siempre Server Components

## 🎯 Roadmap de Implementación

### Fase 1: MVP Storefront
- [ ] Reestructurar landing page monolítica en Atomic Design
- [ ] Crear ProductCard, ProductModal organisms
- [ ] Crear CartDrawer organism
- [ ] Implementar cartSlice en Zustand
- [ ] Integrar Stripe checkout

### Fase 2: Admin Panel
- [ ] Rutas admin con subdomain routing
- [ ] Products CRUD
- [ ] Orders management
- [ ] Customer list

### Fase 3: Features Avanzadas
- [ ] PayPal integration
- [ ] Bundles y promociones
- [ ] Customer segments (Neo4j)
- [ ] Downloads center con versionado

### Fase 4: Automations
- [ ] Abandoned cart emails
- [ ] Post-purchase sequences
- [ ] Segment-based automations

📖 **Ver:** [docs/plans/2025-12-17-ayla-designs-architecture.md](docs/plans/2025-12-17-ayla-designs-architecture.md) para el diseño completo
