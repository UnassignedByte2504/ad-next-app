# Atomic Design - Componentes Bemyre

Estructura de componentes siguiendo el patrón Atomic Design.

## 🔬 Atoms (Átomos)

Componentes más pequeños e indivisibles. Elementos básicos de UI.

- Button, Input, Icon, Avatar, Badge, Chip, Typography

## 🧬 Molecules (Moléculas)

Combinación de átomos que forman componentes funcionales simples.

- SearchBar, FormField, UserChip, GenreTag, InstrumentBadge

## 🦠 Organisms (Organismos)

Combinaciones de moléculas que forman secciones de UI complejas.

- Header, Footer, MusicianCard, BandCard, VenueCard, SearchResults

## 📄 Templates

Layouts y estructuras de página sin datos reales.

- MainLayout, AuthLayout, ProfileLayout, DashboardLayout

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
