# Decision Guide

> Cuándo usar Server Components vs Client Components.

## Decision Tree

```text
¿El componente usa hooks (useState, useEffect, etc)?
├── SÍ → "use client" requerido
└── NO ↓

¿El componente tiene event handlers (onClick, onChange)?
├── SÍ → ¿Puedo extraer solo esa parte?
│        ├── SÍ → Extraer a Client Component pequeño (✅ óptimo)
│        └── NO → "use client" requerido
└── NO ↓

¿El componente usa browser APIs (window, localStorage)?
├── SÍ → "use client" requerido
└── NO ↓

¿El componente usa Zustand/Context?
├── SÍ → "use client" requerido
└── NO ↓

Server Component (sin directive) ✅
```

## Tabla de Decisión Rápida

| Necesitas...                 | Server   | Client         |
| ---------------------------- | -------- | -------------- |
| useState, useEffect, hooks   | ❌        | ✅ "use client" |
| onClick, onChange handlers   | ❌        | ✅ "use client" |
| Zustand store (useAuth, etc) | ❌        | ✅ "use client" |
| Browser APIs (window, etc)   | ❌        | ✅ "use client" |
| Fetch data (async/await)     | ✅ Server | ❌              |
| MUI components (sin eventos) | ✅ Server | ✅ Client       |
| Display props                | ✅ Server | ✅ Client       |

## Server Components ✅

### Siempre deben ser Server:

- Page routes (`app/**/page.tsx`)
- Layouts (`app/**/layout.tsx`)
- Componentes de data fetching
- Secciones de contenido estático
- Contenido crítico para SEO
- Database queries
- API calls al backend

### Ejemplos

```tsx
// ✅ Page route
export default async function MusiciansPage() {
  const musicians = await fetchMusicians();
  return <MusicianList musicians={musicians} />;
}

// ✅ Layout
export default function RootLayout({ children }) {
  return <html><body>{children}</body></html>;
}

// ✅ Static display
export function UserProfile({ user }) {
  return (
    <Card>
      <Typography>{user.name}</Typography>
    </Card>
  );
}
```

## Client Components ⚠️

### Deben ser Client:

- UI interactiva (forms, buttons con estado)
- Consumers de hooks
- Event handlers
- Browser API usage
- Third-party components que requieren "use client"
- Zustand store consumers
- Real-time updates (WebSocket)

### Ejemplos

```tsx
// ⚠️ Necesita estado
"use client";
export function Counter() {
  const [count, setCount] = useState(0);
  return <Button onClick={() => setCount(count + 1)}>{count}</Button>;
}

// ⚠️ Necesita event handlers
"use client";
export function SearchBar() {
  const [query, setQuery] = useState("");
  return <TextField onChange={e => setQuery(e.target.value)} />;
}

// ⚠️ Necesita Zustand
"use client";
export function UserMenu() {
  const user = useAuth(state => state.user);
  return <Menu>{user.name}</Menu>;
}
```

## MUI Guidelines

MUI components funcionan en **ambos** Server y Client:

```tsx
// ✅ Server Component con MUI
export function StaticCard({ data }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5">{data.title}</Typography>
        <Chip label={data.category} />
      </CardContent>
    </Card>
  );
}

// ⚠️ Solo "use client" si es interactivo
"use client";
export function InteractiveCard({ data }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <Card onClick={() => setExpanded(!expanded)}>
      {/* ... */}
    </Card>
  );
}
```

## Checklist Pre-"use client"

Antes de añadir "use client", pregúntate:

- [ ] ¿Este componente REALMENTE necesita estado?
- [ ] ¿Puedo extraer la parte interactiva a un componente más pequeño?
- [ ] ¿Estoy fetching datos? (Debería ser Server Component)
- [ ] ¿Es una ruta de página? (Debería ser Server Component)
- [ ] ¿Puedo usar el patrón de composición?

## Ejemplo de Refactoring

### Antes (Todo Client)

```tsx
"use client";  // ❌ Componente entero es client
export function ProfilePage({ user }) {
  const [editing, setEditing] = useState(false);

  return (
    <Container>
      <ProfileHeader user={user} />      {/* Innecesariamente client */}
      <ProfileBio user={user} />         {/* Innecesariamente client */}
      <ProfileStats user={user} />       {/* Innecesariamente client */}
      <Button onClick={() => setEditing(true)}>Edit</Button>
    </Container>
  );
}
```

### Después (Optimizado)

```tsx
// ProfilePage.tsx (Server Component)
export function ProfilePage({ user }) {
  return (
    <Container>
      <ProfileHeader user={user} />  {/* Server */}
      <ProfileBio user={user} />     {/* Server */}
      <ProfileStats user={user} />   {/* Server */}
      <EditButton />                 {/* Client - solo lo interactivo */}
    </Container>
  );
}

// EditButton.tsx (Client Component)
"use client";
export function EditButton() {
  const [editing, setEditing] = useState(false);
  return <Button onClick={() => setEditing(true)}>Edit</Button>;
}
```

## Related

- [Performance](./performance.md)
- [Common Mistakes](./common-mistakes.md)
- [Quick Reference](../quick-reference.md)

