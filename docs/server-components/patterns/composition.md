# Composition Pattern

> El patrón más importante para Server Components.

## Concepto Clave

**Client Components pueden recibir Server Components como children.**

```tsx
// Client Component (wrapper)
"use client";
export function ClientWrapper({ children }) {
  return (
    <div className="interactive">
      {children}  {/* ← children pueden ser Server Components! */}
    </div>
  );
}

// Uso en Server Component
<ClientWrapper>
  <ServerComponent />  {/* Sigue siendo Server! */}
</ClientWrapper>
```

## Por Qué Funciona

React Server Components permiten:

1. Props de tipo `children` pasan a través de boundaries
2. El Server renderiza el RSC y pasa el resultado al Client Component
3. El Client Component solo ve el HTML/resultado, no el código

## Ejemplo: Providers

```tsx
// layout.tsx (Server Component)
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>  {/* Client boundary */}
      </body>
    </html>
  );
}

// providers.tsx (Client Component)
"use client";
export function Providers({ children }) {
  return (
    <ThemeProvider>
      {children}  {/* ← Page puede ser Server Component! */}
    </ThemeProvider>
  );
}

// page.tsx (Server Component ✅)
export default async function Page() {
  const data = await fetchData();  // Server-side
  return <Content data={data} />;
}
```

## Ejemplo: Tabs

```tsx
// Tabs.tsx (Client Component)
"use client";
import { useState } from "react";

export function Tabs({ children }) {
  const [activeTab, setActiveTab] = useState(0);
  
  return (
    <div>
      <TabButtons onChange={setActiveTab} />
      {children[activeTab]}  {/* Children son RSC */}
    </div>
  );
}

// Usage (Server Component)
<Tabs>
  <TabPanelOne />   {/* Server Component */}
  <TabPanelTwo />   {/* Server Component */}
  <TabPanelThree /> {/* Server Component */}
</Tabs>
```

## Ejemplo: Modal

```tsx
// Modal.tsx (Client Component)
"use client";
import { useState } from "react";

export function Modal({ trigger, children }) {
  const [open, setOpen] = useState(false);
  
  return (
    <>
      <span onClick={() => setOpen(true)}>{trigger}</span>
      {open && (
        <Dialog onClose={() => setOpen(false)}>
          {children}  {/* Children son RSC */}
        </Dialog>
      )}
    </>
  );
}

// Usage (Server Component)
export async function ProductPage({ id }) {
  const product = await fetchProduct(id);
  
  return (
    <div>
      <ProductDetails product={product} />
      <Modal trigger={<Button>See Details</Button>}>
        <ProductSpecs product={product} />  {/* Server Component */}
      </Modal>
    </div>
  );
}
```

## Anti-Pattern: Importar RSC en Client

```tsx
// ❌ MAL: Importar RSC en Client Component
"use client";
import { ServerComponent } from "./ServerComponent";

export function ClientComponent() {
  return <ServerComponent />;  // Fuerza a ServerComponent a ser Client!
}

// ✅ BIEN: Pasar como children
"use client";
export function ClientComponent({ children }) {
  return <div>{children}</div>;
}

// Usage
<ClientComponent>
  <ServerComponent />  {/* Sigue siendo Server */}
</ClientComponent>
```

## Regla de Oro

> **Nunca importes un Server Component dentro de un Client Component.**
> **Siempre pásalo como `children` o una prop.**

## Visual

```text
┌─────────────────────────────────────────┐
│ Server Component (parent)              │
│                                        │
│  <ClientWrapper>                       │
│    <ServerChild />  ← Sigue siendo RSC │
│  </ClientWrapper>                      │
│                                        │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Render Flow:                            │
│                                         │
│ 1. Server renderiza ServerChild → HTML  │
│ 2. HTML se pasa a ClientWrapper         │
│ 3. ClientWrapper solo ve el HTML        │
│ 4. No JS de ServerChild en browser      │
└─────────────────────────────────────────┘
```

## Related

- [Data Fetching](./data-fetching.md)
- [Common Patterns](./common-patterns.md)
- [Architecture Overview](../architecture/overview.md)

