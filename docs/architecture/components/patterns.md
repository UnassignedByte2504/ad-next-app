# Component Patterns

> Patrones de componentes por tipo y nivel.

## Pattern 1: Presentational Component (Atoms/Molecules)

Sin estado interno, totalmente controlado por props.

```typescript
// components/atoms/Button/Button.tsx
"use client";

import { forwardRef } from "react";
import { cn } from "@utils";
import type { ButtonProps } from "./Button.types";

/**
 * Botón base de la aplicación.
 *
 * - Sin estado interno
 * - Sin side effects
 * - Totalmente controlado por props
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "contained", size = "md", loading, className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn("btn", `btn-${variant}`, `btn-${size}`, loading && "btn-loading", className)}
        disabled={loading || props.disabled}
        aria-busy={loading}
        {...props}
      >
        {loading ? <Spinner size="sm" /> : children}
      </button>
    );
  }
);

Button.displayName = "Button";
```

## Pattern 2: Container Component (Organisms)

Puede acceder al store global y manejar eventos.

```typescript
// components/organisms/MusicianCard/MusicianCard.tsx
"use client";

import { memo } from "react";
import { Avatar, Chip, Typography } from "@atoms";
import { GenreTag, InstrumentBadge } from "@molecules";
import { useAuth } from "@store";
import { useLogger } from "@hooks";
import type { Musician } from "@types";

interface MusicianCardProps {
  musician: Musician;
  onConnect?: (id: string) => void;
}

export const MusicianCard = memo<MusicianCardProps>(({ musician, onConnect }) => {
  const currentUser = useAuth((s) => s.user);
  const log = useLogger("MusicianCard");

  const handleConnect = () => {
    log.info("Connect clicked", { musicianId: musician.id });
    onConnect?.(musician.id);
  };

  const isOwnProfile = currentUser?.id === musician.id;

  return (
    <article className="card">
      <Avatar src={musician.avatar} alt={musician.name} size="lg" />
      <Typography variant="h3">{musician.name}</Typography>

      <div className="flex gap-2">
        {musician.instruments.map((inst) => (
          <InstrumentBadge key={inst.id} instrument={inst} />
        ))}
      </div>

      {!isOwnProfile && <Button onClick={handleConnect}>Conectar</Button>}
    </article>
  );
});

MusicianCard.displayName = "MusicianCard";
```

## Pattern 3: Feature Component (Páginas)

Server Component por defecto, usa Suspense.

```typescript
// app/(main)/musicians/page.tsx
import { Suspense } from "react";
import { MusiciansList } from "./components/MusiciansList";
import { MusiciansFilters } from "./components/MusiciansFilters";
import { MusiciansSkeleton } from "./components/MusiciansSkeleton";

export default function MusiciansPage() {
  return (
    <main className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Buscar Músicos</h1>

      <MusiciansFilters />

      <Suspense fallback={<MusiciansSkeleton />}>
        <MusiciansList />
      </Suspense>
    </main>
  );
}
```

## Pattern 4: Compound Component

Componentes que trabajan juntos con contexto compartido.

```typescript
// components/organisms/Tabs/Tabs.tsx
"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs() {
  const context = useContext(TabsContext);
  if (!context) throw new Error("useTabs must be used within Tabs");
  return context;
}

export function Tabs({ defaultTab, children }: { defaultTab: string; children: ReactNode }) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}

export function Tab({ value, children }: { value: string; children: ReactNode }) {
  const { activeTab, setActiveTab } = useTabs();

  return (
    <button
      role="tab"
      aria-selected={activeTab === value}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
  );
}

export function TabPanel({ value, children }: { value: string; children: ReactNode }) {
  const { activeTab } = useTabs();
  if (activeTab !== value) return null;
  return <div role="tabpanel">{children}</div>;
}

// Uso:
// <Tabs defaultTab="musicians">
//   <Tab value="musicians">Músicos</Tab>
//   <Tab value="bands">Bandas</Tab>
//   <TabPanel value="musicians"><MusiciansList /></TabPanel>
//   <TabPanel value="bands"><BandsList /></TabPanel>
// </Tabs>
```

## Related

- [Atomic Design](./atomic-design.md)
- [UI Layer](../layers/ui.md)
- [Data Flow](../reactive/data-flow.md)
