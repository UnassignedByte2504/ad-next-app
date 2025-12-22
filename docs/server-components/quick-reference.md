# Quick Reference - Server Components

> **TL;DR:** Default a Server Components. Solo añade "use client" cuando necesites interactividad.

## Decision Chart

```text
¿Necesitas useState/useEffect/hooks?    → "use client"
¿Necesitas onClick/onChange handlers?   → "use client"
¿Necesitas browser APIs (window, etc)?  → "use client"
¿Necesitas Zustand store?               → "use client"
¿Todo lo demás?                         → Server Component (sin directive)
```

## Escenarios Comunes

### ✅ Server Component (Sin directive)

```tsx
// ✅ Display estático
export function UserProfile({ user }) {
  return (
    <Card>
      <Typography>{user.name}</Typography>
      <Avatar src={user.avatar} />
    </Card>
  );
}

// ✅ Fetch de datos
export default async function UsersPage() {
  const users = await fetchUsers();
  return <UserList users={users} />;
}

// ✅ Contenido SEO
export function BlogPost({ post }) {
  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  );
}
```

### ⚠️ Client Component (Añadir "use client")

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
  return <TextField value={query} onChange={e => setQuery(e.target.value)} />;
}

// ⚠️ Necesita Zustand
"use client";
export function UserMenu() {
  const user = useAuth(state => state.user);
  return <Menu>{user.name}</Menu>;
}
```

## Componentes MUI

MUI funciona en **ambos** Server y Client Components.

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

// ⚠️ Solo necesita "use client" si es interactivo
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

## Checklist Antes de "use client"

- [ ] ¿Este componente REALMENTE necesita estado?
- [ ] ¿Puedo extraer la parte interactiva a un componente más pequeño?
- [ ] ¿Estoy fetching datos? (Debería ser Server Component)
- [ ] ¿Es una ruta de página? (Debería ser Server Component)
- [ ] ¿Puedo usar el patrón de composición?

## Impacto en Performance

| Escenario                  | Bundle Size | Hydration Time |
| -------------------------- | ----------- | -------------- |
| Page como Server Component | 0 KB        | 0 ms           |
| Page como Client Component | +20-50 KB   | +200-500 ms    |
| Small Client Component     | +2-5 KB     | +50-100 ms     |

## Pro Tips

### Composition Pattern

```tsx
// ✅ Pasar Server Components como children
"use client";
export function Tabs({ children }) {
  const [tab, setTab] = useState(0);
  return <div>{children[tab]}</div>;
}

// Uso (Server Component)
<Tabs>
  <ServerRenderedTab1 />
  <ServerRenderedTab2 />
</Tabs>
```

### Initial Data Pattern

```tsx
// ✅ Fetch en server, pasar a client
export default async function Page() {
  const initialData = await fetchData();
  return <ClientComponent initialData={initialData} />;
}
```

### Suspense para Streaming

```tsx
// ✅ Stream componentes lentos
export default function Page() {
  return (
    <>
      <FastComponent />
      <Suspense fallback={<Skeleton />}>
        <SlowAsyncComponent />
      </Suspense>
    </>
  );
}
```

## Regla de Oro

> **Server Components son el default. Client Components son la excepción.**

## Related

- [Decision Guide](./best-practices/decision-guide.md) - Guía completa de decisiones
- [Common Patterns](./patterns/common-patterns.md) - Más patrones
- [Common Mistakes](./best-practices/common-mistakes.md) - Errores a evitar

