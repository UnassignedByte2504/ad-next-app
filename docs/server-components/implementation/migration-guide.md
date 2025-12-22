# Migration Guide

> Cómo migrar componentes existentes a Server Components.

## Identifying Candidates

### Audit Checklist

Para cada componente existente:

- [ ] ¿Usa hooks? → Mantener como Client o refactorizar
- [ ] ¿Tiene event handlers? → Extraer a Client Component más pequeño
- [ ] ¿Hace fetch de datos? → Mover fetch a Server, pasar como props
- [ ] ¿Es puramente presentacional? → Convertir a Server Component
- [ ] ¿Usa MUI? → Puede ser Server (MUI funciona en ambos)

### Find "use client" Directives

```bash
# Buscar todos los archivos con "use client"
grep -r "use client" components/
```

### Analyze Dependencies

```tsx
// Verificar qué realmente necesita el componente
- useState → Client
- useEffect → Client
- onClick → Client (pero puede extraerse)
- Solo props → Puede ser Server
```

## Migration Steps

### Step 1: Evaluate Component

```tsx
// Componente actual
"use client";

export function MusicianCard({ musician }) {
  const [liked, setLiked] = useState(false);

  return (
    <Card>
      <Avatar src={musician.avatar} />
      <Typography>{musician.name}</Typography>
      <Typography>{musician.instrument}</Typography>
      <IconButton onClick={() => setLiked(!liked)}>
        <FavoriteIcon color={liked ? "error" : "default"} />
      </IconButton>
    </Card>
  );
}
```

**Análisis:**
- Avatar, Typography → Solo display (Server OK)
- IconButton con onClick + useState → Necesita Client

### Step 2: Split Interactive Parts

```tsx
// MusicianCard.tsx (Server Component)
export function MusicianCard({ musician }) {
  return (
    <Card>
      <Avatar src={musician.avatar} />
      <Typography>{musician.name}</Typography>
      <Typography>{musician.instrument}</Typography>
      <LikeButton musicianId={musician.id} />  {/* Client */}
    </Card>
  );
}

// LikeButton.tsx (Client Component)
"use client";

export function LikeButton({ musicianId }) {
  const [liked, setLiked] = useState(false);

  return (
    <IconButton onClick={() => setLiked(!liked)}>
      <FavoriteIcon color={liked ? "error" : "default"} />
    </IconButton>
  );
}
```

### Step 3: Move Data Fetching to Server

**Before:**
```tsx
"use client";

export function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(r => r.json())
      .then(setUser);
  }, [userId]);

  if (!user) return <Skeleton />;

  return <ProfileDisplay user={user} />;
}
```

**After:**
```tsx
// page.tsx (Server Component)
export default async function UserPage({ params }) {
  const user = await fetchUser(params.userId);
  return <UserProfile user={user} />;
}

// UserProfile.tsx (Server Component)
export function UserProfile({ user }) {
  return <ProfileDisplay user={user} />;
}
```

## Common Refactoring Patterns

### Pattern 1: Extract Interactive Button

**Before:**
```tsx
"use client";
export function ProductCard({ product }) {
  const [inCart, setInCart] = useState(false);
  
  return (
    <Card>
      <Typography>{product.name}</Typography>
      <Typography>{product.price}</Typography>
      <Button onClick={() => setInCart(true)}>Add to Cart</Button>
    </Card>
  );
}
```

**After:**
```tsx
// ProductCard.tsx (Server)
export function ProductCard({ product }) {
  return (
    <Card>
      <Typography>{product.name}</Typography>
      <Typography>{product.price}</Typography>
      <AddToCartButton productId={product.id} />
    </Card>
  );
}

// AddToCartButton.tsx (Client)
"use client";
export function AddToCartButton({ productId }) {
  const [inCart, setInCart] = useState(false);
  return <Button onClick={() => setInCart(true)}>Add to Cart</Button>;
}
```

### Pattern 2: Convert List Page

**Before:**
```tsx
"use client";
export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/users')
      .then(r => r.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <Skeleton />;
  return <UserList users={users} />;
}
```

**After:**
```tsx
// page.tsx (Server)
export default async function UsersPage() {
  const users = await fetchUsers();
  return <UserList users={users} />;
}

// loading.tsx (Next.js automatic)
export default function Loading() {
  return <Skeleton />;
}
```

### Pattern 3: Form with Client Interaction

**Before:**
```tsx
"use client";
export function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  return (
    <section>
      <h1>Contact Us</h1>
      <p>We'd love to hear from you!</p>
      <form>
        <input value={name} onChange={e => setName(e.target.value)} />
        <input value={email} onChange={e => setEmail(e.target.value)} />
        <textarea value={message} onChange={e => setMessage(e.target.value)} />
        <button type="submit">Send</button>
      </form>
    </section>
  );
}
```

**After:**
```tsx
// ContactSection.tsx (Server)
export function ContactSection() {
  return (
    <section>
      <h1>Contact Us</h1>
      <p>We'd love to hear from you!</p>
      <ContactForm />  {/* Client */}
    </section>
  );
}

// ContactForm.tsx (Client)
"use client";
export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  return (
    <form>
      <input value={name} onChange={e => setName(e.target.value)} />
      <input value={email} onChange={e => setEmail(e.target.value)} />
      <textarea value={message} onChange={e => setMessage(e.target.value)} />
      <button type="submit">Send</button>
    </form>
  );
}
```

## Verification

### After Migration

1. **Test functionality** - Asegurar que todo sigue funcionando
2. **Check bundle size** - Verificar reducción de JS
3. **Measure performance** - Comparar métricas antes/después
4. **Run Lighthouse** - Verificar mejoras en scores

### Common Issues

| Issue                                              | Solution                                   |
| -------------------------------------------------- | ------------------------------------------ |
| "useState cannot be used in Server Component"      | Añadir "use client" o extraer a componente |
| "Cannot pass function as prop to Client Component" | Server Actions o callback pattern          |
| "Module not found: 'fs'"                           | Marcar como server-only import             |

## Related

- [Decision Guide](../best-practices/decision-guide.md)
- [Common Mistakes](../best-practices/common-mistakes.md)
- [Implementation Summary](./summary.md)

