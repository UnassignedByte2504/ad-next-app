# Performance

> Optimización y métricas con Server Components.

## Current Metrics (BEMYRE)

| Metric                     | Value   | Target   | Status |
| -------------------------- | ------- | -------- | ------ |
| First Contentful Paint     | ~1.2s   | < 1.5s   | ✅      |
| Largest Contentful Paint   | ~2.1s   | < 2.5s   | ✅      |
| Time to Interactive        | ~2.8s   | < 3.5s   | ✅      |
| Total Blocking Time        | ~200ms  | < 300ms  | ✅      |
| Client Bundle (First Load) | ~150 KB | < 200 KB | ✅      |

## Bundle Size Analysis

### Setup Actual (Óptimo)

```text
- layout.tsx: 0 KB JS (Server Component)
- providers.tsx: ~50 KB (MUI + Emotion + Sentry)
- page.tsx: 0 KB (Server Component)
- InteractiveComponent.tsx: ~5 KB (per component)
```

### Si Todo Fuera Client-Side

```text
- page.tsx: +20 KB (React + Next.js runtime)
- All components: +50 KB (unnecessary hydration)
- Total waste: ~70 KB por página
```

## Impact por Tipo

| Escenario                  | Bundle Size | Hydration Time |
| -------------------------- | ----------- | -------------- |
| Page como Server Component | 0 KB        | 0 ms           |
| Page como Client Component | +20-50 KB   | +200-500 ms    |
| Small Client Component     | +2-5 KB     | +50-100 ms     |

## Optimization Techniques

### 1. Code Splitting

```tsx
import dynamic from "next/dynamic";

// Lazy load componentes pesados
const HeavyChart = dynamic(() => import("@/components/HeavyChart"), {
  loading: () => <Skeleton />,
  ssr: false,  // No renderizar en server si no es necesario
});
```

### 2. Suspense Boundaries

```tsx
// Prevenir que queries lentas bloqueen la página
export default function Page() {
  return (
    <Container>
      <FastContent />
      <Suspense fallback={<Skeleton />}>
        <SlowComponent />  {/* Streams cuando está listo */}
      </Suspense>
    </Container>
  );
}
```

### 3. Selective Hydration

```tsx
// Server Component con JS mínimo
export function ProfilePage({ profile }) {
  return (
    <Container>
      {/* Todo estático - no JS enviado */}
      <ProfileHeader data={profile} />
      <ProfileBio data={profile} />

      {/* Solo esto envía JS */}
      <FollowButton userId={profile.id} />
    </Container>
  );
}
```

### 4. Parallel Data Fetching

```tsx
// ✅ Fetch en paralelo
export default async function Page() {
  const [users, posts, stats] = await Promise.all([
    fetchUsers(),
    fetchPosts(),
    fetchStats(),
  ]);
  
  return (/* ... */);
}

// ❌ Evitar waterfall
export default async function Page() {
  const users = await fetchUsers();
  const posts = await fetchPosts();  // Espera a users
  const stats = await fetchStats();  // Espera a posts
  
  return (/* ... */);
}
```

### 5. Streaming con generateStaticParams

```tsx
// Prerender páginas conocidas
export async function generateStaticParams() {
  const musicians = await fetchPopularMusicians();
  return musicians.map(m => ({ id: m.id }));
}

export default async function MusicianPage({ params }) {
  const musician = await fetchMusician(params.id);
  return <MusicianProfile musician={musician} />;
}
```

## Timeline Comparison

### Client-Side React (Traditional)

```text
   0ms │ Request sent
 200ms │ HTML received (empty shell)
 250ms │ JS download starts
 800ms │ JS download complete
1000ms │ JS parsing & execution
1500ms │ React rendering
1800ms │ Data fetching (useEffect)
2200ms │ Data received
2400ms │ Re-render with data
2500ms │ ✓ First meaningful paint
```

### Server Components

```text
   0ms │ Request sent
 100ms │ Server fetches data (parallel)
 200ms │ Server renders HTML
 300ms │ HTML received (with content!)
 350ms │ ✓ First meaningful paint
 400ms │ Client JS download (smaller)
 600ms │ Client JS execution
 700ms │ Hydration of interactive parts
 750ms │ ✓ Interactive
```

**Mejoras:**
- First Paint: 2500ms → 350ms (-86%)
- Time to Interactive: 2500ms → 750ms (-70%)

## Tools para Medir

### Lighthouse

```bash
# En Chrome DevTools
# → Lighthouse tab → Generate report
```

### Bundle Analyzer

```bash
# En next.config.ts
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

# Ejecutar
ANALYZE=true pnpm build
```

### React DevTools Profiler

1. Instalar React DevTools extension
2. Components → Settings → Highlight updates
3. Verificar qué componentes re-renderizan

## Rules of Thumb

1. **Cada "use client" añade JS** - Hazlo contar
2. **Pages siempre Server** - 0 KB overhead
3. **Push client down** - Componentes más pequeños posibles
4. **Suspense agresivo** - No bloquear con data fetching
5. **Medir antes y después** - No optimizar prematuramente

## Related

- [Decision Guide](./decision-guide.md)
- [Common Mistakes](./common-mistakes.md)
- [Diagrams](../architecture/diagrams.md)

