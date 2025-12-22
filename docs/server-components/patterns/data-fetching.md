# Data Fetching Patterns

> Cómo obtener datos eficientemente con Server Components.

## Regla Principal

> **Fetch datos en Server Components, pasa como props a Client Components.**

## Fetch Básico en Server Component

```tsx
// app/musicians/page.tsx (Server Component)
export default async function MusiciansPage() {
  // ✅ Fetch directo - ejecuta en el servidor
  const musicians = await fetch('https://api.bemyre.com/musicians')
    .then(res => res.json());

  return (
    <Container>
      <h1>Musicians</h1>
      <MusicianList musicians={musicians} />
    </Container>
  );
}
```

## Con searchParams

```tsx
// app/musicians/page.tsx
export default async function MusiciansPage({ searchParams }) {
  const params = await searchParams;
  
  const musicians = await fetchMusicians({
    query: params.query || '',
    genre: params.genre || '',
    page: parseInt(params.page || '1', 10),
  });
  
  return (
    <Container>
      <MusicianFilters initialFilters={params} />  {/* Client */}
      <MusicianGrid musicians={musicians} />
    </Container>
  );
}
```

## Patrón: Initial Data

```tsx
// Server Component
export default async function Page() {
  const initialData = await fetchData();  // Server fetch
  
  return (
    <ClientComponent 
      initialData={initialData}  // Pass to client
    />
  );
}

// Client Component
"use client";
export function ClientComponent({ initialData }) {
  const [data, setData] = useState(initialData);
  
  // Puede refetch si necesario
  const refetch = async () => {
    const fresh = await fetch('/api/data').then(r => r.json());
    setData(fresh);
  };
  
  return (/* UI */);
}
```

## Patrón: Suspense Streaming

```tsx
// Server Component
export default async function DashboardPage() {
  return (
    <Container>
      {/* Renderiza inmediatamente */}
      <Header />
      
      {/* Streams cuando está listo */}
      <Suspense fallback={<StatsSkeleton />}>
        <Stats />  {/* Async Server Component */}
      </Suspense>
      
      <Suspense fallback={<ChartSkeleton />}>
        <Chart />  {/* Otro async */}
      </Suspense>
    </Container>
  );
}

// Async Server Component
async function Stats() {
  const stats = await fetchStats();  // Puede ser lento
  return <StatsDisplay data={stats} />;
}
```

## Patrón: Parallel Fetching

```tsx
// Server Component
export default async function ProfilePage({ params }) {
  // ✅ Fetch en paralelo
  const [user, posts, followers] = await Promise.all([
    fetchUser(params.id),
    fetchPosts(params.id),
    fetchFollowers(params.id),
  ]);
  
  return (
    <Container>
      <ProfileHeader user={user} />
      <PostList posts={posts} />
      <FollowerList followers={followers} />
    </Container>
  );
}
```

## ❌ Anti-Pattern: Fetch en Client Component

```tsx
// ❌ MAL: Fetch en Client Component
"use client";
export function UserList() {
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    fetch('/api/users')
      .then(r => r.json())
      .then(setUsers);
  }, []);
  
  return <List data={users} />;
}

// ✅ BIEN: Fetch en Server, pasar a Client
// page.tsx (Server)
export default async function UsersPage() {
  const users = await fetchUsers();
  return <UserList initialData={users} />;
}

// UserList.tsx (Client)
"use client";
export function UserList({ initialData }) {
  const [users, setUsers] = useState(initialData);
  // Puede refetch si necesario...
}
```

## Caché y Revalidación

```tsx
// Con Next.js fetch caching
const data = await fetch('https://api.example.com/data', {
  cache: 'force-cache',  // Default: cached
  // o
  cache: 'no-store',  // No cache
  // o
  next: { revalidate: 3600 },  // Revalidate cada hora
});

// Con tags para revalidación on-demand
const data = await fetch('https://api.example.com/data', {
  next: { tags: ['musicians'] },
});

// Revalidar desde Server Action
import { revalidateTag } from 'next/cache';
revalidateTag('musicians');
```

## Real-time Data

Para datos en tiempo real, usa Client Components:

```tsx
// Server Component (initial)
export default async function ChatPage({ roomId }) {
  const initialMessages = await fetchMessages(roomId);
  return <ChatRoom roomId={roomId} initialMessages={initialMessages} />;
}

// Client Component (real-time)
"use client";
export function ChatRoom({ roomId, initialMessages }) {
  const [messages, setMessages] = useState(initialMessages);
  
  useEffect(() => {
    const ws = new WebSocket(`ws://api.bemyre.com/chat/${roomId}`);
    ws.onmessage = (e) => {
      setMessages(prev => [...prev, JSON.parse(e.data)]);
    };
    return () => ws.close();
  }, [roomId]);
  
  return <MessageList messages={messages} />;
}
```

## Related

- [Composition Pattern](./composition.md)
- [Common Patterns](./common-patterns.md)
- [Performance](../best-practices/performance.md)

