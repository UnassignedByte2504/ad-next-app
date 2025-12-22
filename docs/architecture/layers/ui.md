# UI Layer

> Atomic Design y estructura de componentes.

## Estructura

```text
components/
├── atoms/           # Indivisibles, sin lógica de negocio
│   ├── Button/
│   ├── Avatar/
│   ├── Input/
│   ├── Chip/
│   ├── Icon/
│   └── Typography/
│
├── molecules/       # Combinan atoms, mínima lógica
│   ├── SearchBar/
│   ├── FormField/
│   ├── UserChip/
│   ├── GenreTag/
│   └── InstrumentBadge/
│
├── organisms/       # Secciones completas, pueden tener estado
│   ├── Header/
│   ├── MusicianCard/
│   ├── BandCard/
│   ├── VenueCard/
│   ├── SearchResults/
│   └── ErrorBoundary/
│
└── templates/       # Layouts de página, estructura
    ├── MainLayout/
    ├── AuthLayout/
    ├── ProfileLayout/
    └── DashboardLayout/
```

## Reglas por Nivel

| Nivel         | Puede usar        | Estado           | Store | API calls             |
| ------------- | ----------------- | ---------------- | ----- | --------------------- |
| **Atoms**     | Solo props        | ❌                | ❌     | ❌                     |
| **Molecules** | Atoms + props     | Local (useState) | ❌     | ❌                     |
| **Organisms** | Atoms + Molecules | Local + Global   | ✅     | Vía hooks             |
| **Templates** | Todos             | Global           | ✅     | Vía Server Components |

## Estructura de Carpeta de Componente

```text
components/atoms/Button/
├── Button.tsx           # Componente principal
├── Button.stories.tsx   # Storybook stories
├── Button.test.tsx      # Tests (opcional para atoms)
└── index.ts             # Re-export
```

## Requisitos por Nivel

| Nivel     | Story | Test | Coverage |
| --------- | ----- | ---- | -------- |
| Atoms     | ✅     | ❌    | -        |
| Molecules | ✅     | ✅    | 70%      |
| Organisms | ✅     | ✅    | 80%      |
| Templates | ✅     | ✅    | 70%      |

## Related

- [Component Patterns](../components/patterns.md)
- [Atomic Design](../components/atomic-design.md)
- [Layers Overview](./overview.md)
