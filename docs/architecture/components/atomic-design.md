# Atomic Design

> Sistema de diseño atómico para componentes.

## Niveles

### Atoms

Componentes indivisibles, sin lógica de negocio.

- Button, Avatar, Input, Chip, Icon, Typography
- Sin estado interno
- Solo props

```typescript
// Solo renderiza lo que recibe
export function Avatar({ src, alt, size }: AvatarProps) {
  return <img src={src} alt={alt} className={`avatar-${size}`} />;
}
```

### Molecules

Combinaciones de atoms con mínima lógica.

- SearchBar, FormField, UserChip, GenreTag
- Puede tener estado local (useState)
- No accede al store global

```typescript
// Combina atoms, lógica local mínima
export function FormField({ label, error, ...inputProps }: FormFieldProps) {
  return (
    <div>
      <Typography variant="label">{label}</Typography>
      <Input {...inputProps} />
      {error && <Typography color="error">{error}</Typography>}
    </div>
  );
}
```

### Organisms

Secciones completas con lógica de negocio.

- Header, MusicianCard, BandCard, SearchResults
- Puede usar store global
- Puede hacer API calls vía hooks

```typescript
// Accede al store, lógica de negocio
export function MusicianCard({ musician }: MusicianCardProps) {
  const currentUser = useAuth((s) => s.user);
  const { follow } = useFollowActions();

  const handleFollow = () => follow(musician.id);

  return (
    <Card>
      <Avatar src={musician.avatar} />
      <Typography>{musician.name}</Typography>
      {currentUser?.id !== musician.id && (
        <Button onClick={handleFollow}>Seguir</Button>
      )}
    </Card>
  );
}
```

### Templates

Layouts de página, estructura.

- MainLayout, AuthLayout, ProfileLayout
- Siempre Server Components
- Composición de organisms

```typescript
// Layout estructural
export function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container">{children}</main>
      <Footer />
    </div>
  );
}
```

## Reglas de Dependencia

```text
Templates → Organisms → Molecules → Atoms
   ↓            ↓           ↓         ↓
 (puede usar niveles inferiores, nunca superiores)
```

## Estructura de Carpeta

```text
ComponentName/
├── ComponentName.tsx        # Componente principal
├── ComponentName.stories.tsx # Storybook
├── ComponentName.test.tsx   # Tests (molecules+)
├── ComponentName.types.ts   # Types (opcional)
└── index.ts                 # Re-export
```

## Related

- [Component Patterns](./patterns.md)
- [UI Layer](../layers/ui.md)
- [Quick Reference](../quick-reference.md)
