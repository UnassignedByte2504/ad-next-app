# Common Patterns

> Patrones de uso frecuente con Server Components.

## Pattern 1: Page with Filters

**Escenario:** Lista con filtros client-side.

```tsx
// app/musicians/page.tsx (Server Component)
export default async function MusiciansPage({ searchParams }) {
  const params = await searchParams;
  const initialData = await fetchMusicians(params);

  return (
    <Container>
      <MusicianFilters />  {/* Client Component */}
      <Suspense fallback={<Skeleton />}>
        <MusicianList initialData={initialData} />  {/* Client */}
      </Suspense>
    </Container>
  );
}

// MusicianFilters.tsx (Client)
"use client";
import { useRouter } from "next/navigation";

export function MusicianFilters() {
  const router = useRouter();
  const [filters, setFilters] = useState({});

  const applyFilters = () => {
    const params = new URLSearchParams(filters);
    router.push(`/musicians?${params}`);  // Triggers re-render
  };

  return (/* Filter UI */);
}
```

## Pattern 2: Interactive Card

**Escenario:** Cards con elementos interactivos.

```tsx
// MusicianGrid.tsx (Server Component)
export function MusicianGrid({ musicians }) {
  return (
    <Grid>
      {musicians.map(musician => (
        <MusicianCard key={musician.id} musician={musician} />
      ))}
    </Grid>
  );
}

// MusicianCard.tsx (Server Component)
export function MusicianCard({ musician }) {
  return (
    <Card>
      {/* Contenido estático - Server */}
      <Typography>{musician.name}</Typography>
      <Typography>{musician.instrument}</Typography>
      
      {/* Solo parte interactiva - Client */}
      <FollowButton userId={musician.id} />
    </Card>
  );
}

// FollowButton.tsx (Client Component)
"use client";
export function FollowButton({ userId }) {
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleFollow = async () => {
    setLoading(true);
    await fetch(`/api/users/${userId}/follow`, { method: 'POST' });
    setFollowing(!following);
    setLoading(false);
  };

  return (
    <Button onClick={toggleFollow} disabled={loading}>
      {following ? 'Following' : 'Follow'}
    </Button>
  );
}
```

## Pattern 3: Modal/Dialog

**Escenario:** Modal disparado por botón.

```tsx
// ProfilePage.tsx (Server Component)
export function ProfilePage({ user }) {
  return (
    <Container>
      <ProfileContent user={user} />  {/* Server */}
      <EditProfileModal user={user} />  {/* Client */}
    </Container>
  );
}

// EditProfileModal.tsx (Client Component)
"use client";
export function EditProfileModal({ user }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Edit</Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <ProfileForm initialData={user} />
      </Dialog>
    </>
  );
}
```

## Pattern 4: Zustand Store Consumer

**Escenario:** Componente que necesita estado global.

```tsx
// UserMenu.tsx (Client Component)
"use client";
import { useAuth, useAuthActions } from "@/store";

export function UserMenu() {
  const user = useAuth(state => state.user);
  const { logout } = useAuthActions();

  if (!user) return <LoginButton />;

  return (
    <Menu>
      <MenuItem onClick={logout}>Logout</MenuItem>
    </Menu>
  );
}
```

## Pattern 5: Dashboard with Streaming

**Escenario:** Dashboard con datos de diferentes velocidades.

```tsx
// app/dashboard/page.tsx (Server Component)
export default async function DashboardPage() {
  return (
    <Container>
      <Typography variant="h3">Dashboard</Typography>

      {/* Static stats - Server Component */}
      <Suspense fallback={<StatsSkeleton />}>
        <Stats />
      </Suspense>

      {/* Real-time chart - Client Component */}
      <RealtimeActivityChart />

      {/* Async data */}
      <Suspense fallback={<GigsSkeleton />}>
        <UpcomingGigs />
      </Suspense>
    </Container>
  );
}

// Stats.tsx (Async Server Component)
async function Stats() {
  const stats = await fetchStats();
  return <StatsDisplay data={stats} />;
}

// RealtimeActivityChart.tsx (Client Component)
"use client";
function RealtimeActivityChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL!);
    ws.onmessage = (e) => setData(prev => [...prev, JSON.parse(e.data)]);
    return () => ws.close();
  }, []);

  return <LineChart data={data} />;
}
```

## Pattern 6: Form with Server Action

**Escenario:** Formulario que ejecuta acción en el servidor.

```tsx
// app/contact/page.tsx (Server Component)
export default function ContactPage() {
  return (
    <Container>
      <h1>Contact Us</h1>
      <ContactForm />
    </Container>
  );
}

// ContactForm.tsx (Client Component)
"use client";
import { submitContact } from './actions';

export function ContactForm() {
  const [pending, setPending] = useState(false);
  
  async function handleSubmit(formData: FormData) {
    setPending(true);
    await submitContact(formData);
    setPending(false);
  }

  return (
    <form action={handleSubmit}>
      <TextField name="email" required />
      <TextField name="message" multiline required />
      <Button type="submit" disabled={pending}>
        {pending ? 'Sending...' : 'Send'}
      </Button>
    </form>
  );
}

// actions.ts (Server Action)
"use server";
export async function submitContact(formData: FormData) {
  const email = formData.get('email');
  const message = formData.get('message');
  await db.contacts.create({ email, message });
  revalidatePath('/contact');
}
```

## Related

- [Composition Pattern](./composition.md)
- [Data Fetching](./data-fetching.md)
- [Decision Guide](../best-practices/decision-guide.md)

