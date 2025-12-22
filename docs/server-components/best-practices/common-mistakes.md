# Common Mistakes

> Errores frecuentes y cómo evitarlos.

## ❌ Mistake 1: Adding "use client" to Pages

```tsx
// ❌ MAL
"use client";
export default function HomePage() {
  return <div>Home</div>;
}

// ✅ BIEN
export default function HomePage() {
  return <div>Home</div>;
}
```

**Impacto:** +20-50 KB de JS innecesario por página.

**Solución:** Nunca añadir "use client" a `page.tsx`. Extraer interactividad a componentes hijos.

---

## ❌ Mistake 2: Entire Page Client for One Button

```tsx
// ❌ MAL: Toda la página es client por un botón
"use client";
export default function ArticlePage({ article }) {
  const [liked, setLiked] = useState(false);

  return (
    <article>
      <h1>{article.title}</h1>
      <p>{article.content}</p>          {/* Innecesariamente client */}
      <p>{article.description}</p>      {/* Innecesariamente client */}
      <button onClick={() => setLiked(true)}>Like</button>
    </article>
  );
}

// ✅ BIEN: Solo el botón es client
export default function ArticlePage({ article }) {
  return (
    <article>
      <h1>{article.title}</h1>
      <p>{article.content}</p>          {/* Server */}
      <p>{article.description}</p>      {/* Server */}
      <LikeButton articleId={article.id} />  {/* Client */}
    </article>
  );
}

// LikeButton.tsx
"use client";
export function LikeButton({ articleId }) {
  const [liked, setLiked] = useState(false);
  return <button onClick={() => setLiked(true)}>Like</button>;
}
```

**Impacto:** +100-200 KB de JS que podrían evitarse.

---

## ❌ Mistake 3: Fetching Data in Client Components

```tsx
// ❌ MAL: Fetch en Client Component
"use client";
export default function UsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("/api/users")
      .then(r => r.json())
      .then(setUsers);
  }, []);

  return <UserList users={users} />;
}

// ✅ BIEN: Fetch en Server Component
export default async function UsersPage() {
  const users = await fetchUsers();  // Server-side
  return <UserList users={users} />;
}
```

**Impacto:** Waterfall requests, mayor tiempo de First Contentful Paint.

---

## ❌ Mistake 4: Importing RSC in Client Component

```tsx
// ❌ MAL: Importar RSC en Client Component
"use client";
import { ServerComponent } from "./ServerComponent";

export function ClientComponent() {
  return <ServerComponent />;  // ¡Fuerza a ServerComponent a ser Client!
}

// ✅ BIEN: Pasar como children
"use client";
export function ClientComponent({ children }) {
  return <div>{children}</div>;
}

// Uso
<ClientComponent>
  <ServerComponent />  {/* Sigue siendo Server */}
</ClientComponent>
```

**Impacto:** Convierte accidentalmente Server Components en Client Components.

---

## ❌ Mistake 5: Unnecessary "use client" for MUI

```tsx
// ❌ MAL: MUI no necesita "use client" para display
"use client";
export function UserCard({ user }) {
  return (
    <Card>
      <Typography>{user.name}</Typography>
      <Chip label={user.role} />
    </Card>
  );
}

// ✅ BIEN: MUI funciona en Server Components
export function UserCard({ user }) {
  return (
    <Card>
      <Typography>{user.name}</Typography>
      <Chip label={user.role} />
    </Card>
  );
}
```

**Impacto:** JS innecesario enviado al browser.

**Nota:** MUI solo necesita "use client" cuando hay interactividad (onClick, onChange, etc.).

---

## ❌ Mistake 6: Not Using Suspense

```tsx
// ❌ MAL: Toda la página espera por datos lentos
export default async function Page() {
  const slowData = await fetchSlowData();  // Bloquea todo
  const fastData = await fetchFastData();
  
  return (
    <Container>
      <FastSection data={fastData} />
      <SlowSection data={slowData} />
    </Container>
  );
}

// ✅ BIEN: Usar Suspense para streaming
export default async function Page() {
  const fastData = await fetchFastData();
  
  return (
    <Container>
      <FastSection data={fastData} />
      <Suspense fallback={<Skeleton />}>
        <SlowSection />  {/* Fetch interno */}
      </Suspense>
    </Container>
  );
}

async function SlowSection() {
  const data = await fetchSlowData();
  return <div>{/* ... */}</div>;
}
```

**Impacto:** Mayor Time to First Byte y peor UX.

---

## ❌ Mistake 7: Waterfall Fetches

```tsx
// ❌ MAL: Fetch secuencial (waterfall)
export default async function Page({ params }) {
  const user = await fetchUser(params.id);      // 200ms
  const posts = await fetchPosts(params.id);    // 300ms (espera a user)
  const comments = await fetchComments(params.id); // 200ms (espera a posts)
  // Total: 700ms

  return (/* ... */);
}

// ✅ BIEN: Fetch paralelo
export default async function Page({ params }) {
  const [user, posts, comments] = await Promise.all([
    fetchUser(params.id),      // 200ms
    fetchPosts(params.id),     // 300ms  } Paralelo
    fetchComments(params.id),  // 200ms  }
  ]);
  // Total: 300ms (el más lento)

  return (/* ... */);
}
```

**Impacto:** Puede duplicar o triplicar el tiempo de carga.

---

## Summary Table

| Mistake                           | Impact               | Solution                       |
| --------------------------------- | -------------------- | ------------------------------ |
| "use client" en pages             | +20-50 KB/page       | Extraer a child components     |
| Página entera client por un botón | +100-200 KB          | Componentes client pequeños    |
| Fetch en Client Components        | Waterfall, FCP lento | Fetch en Server Components     |
| Importar RSC en Client            | RSC se vuelve Client | Usar children prop             |
| "use client" innecesario con MUI  | JS extra             | Solo cuando hay interactividad |
| No usar Suspense                  | TTFB lento           | Suspense boundaries            |
| Fetch waterfall                   | 2-3x más lento       | Promise.all paralelo           |

## Related

- [Decision Guide](./decision-guide.md)
- [Performance](./performance.md)
- [Quick Reference](../quick-reference.md)

