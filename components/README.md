# Atomic Design - Ayla Designs Components

Estructura de componentes siguiendo el patrón Atomic Design.

## 🔬 Atoms (Átomos)

Componentes más pequeños e indivisibles. Elementos básicos de UI.

- Button, Input, Icon, Avatar, Badge, Chip, Typography, Logo, Card

## 🧬 Molecules (Moléculas)

Combinación de átomos que forman componentes funcionales simples.

- SearchBar, FormField, CategoryChips, CardHeader, SectionHeader

## 🦠 Organisms (Organismos)

Combinaciones de moléculas que forman secciones de UI complejas.

- Header, Footer, Hero, ProductCard, CartDrawer, FAQAccordion, Carousel

## 📄 Templates

Layouts y estructuras de página sin datos reales.

- StorefrontLayout, AdminLayout, AuthLayout, AccountLayout

## 📱 Pages

Templates con datos reales. Implementados en `/app`.

---

## Convenciones

### Nombrado de archivos

```
components/
  atoms/
    Button/
      Button.tsx        # Componente
      Button.stories.tsx # Stories
      index.ts          # Export
      tests/
        unit/
          Button.test.tsx # Tests unitarios
        integration/
          Button.integration.test.tsx # Tests de integración
```

### Props

- Usar interfaces con sufijo `Props`
- Extender de props nativas cuando sea posible
- Documentar con JSDoc
