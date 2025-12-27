# Page Implementation Example

Este ejemplo muestra el patrón estándar para implementar una nueva página en Ayla Designs.

## Estructura de Archivos

```
page-implementation/
├── README.md           # Esta documentación
├── page.tsx            # Server Component principal (entry point)
├── layout.tsx          # Layout específico de la ruta
├── loading.tsx         # Loading UI (Suspense fallback)
├── error.tsx           # Error boundary de la ruta
├── not-found.tsx       # 404 personalizado
├── actions.ts          # Server Actions
├── types.ts            # Types específicos de la feature
├── hooks/              # Hooks de la feature
│   ├── index.ts
│   └── useFeatureData.ts
├── components/         # Componentes de la feature
│   ├── index.ts
│   ├── FeatureList.tsx
│   ├── FeatureFilters.tsx
│   └── FeatureCard.tsx
└── ui/                 # Estilos específicos (si es necesario)
    └── styles.module.css
```

## Flujo de Datos

```
┌─────────────────────────────────────────────────────────────────┐
│                         page.tsx                                 │
│                    (Server Component)                            │
│                                                                  │
│  ┌─────────────┐    ┌──────────────┐    ┌─────────────────┐     │
│  │   Fetch     │───▶│   Validate   │───▶│  Pass to Client │     │
│  │   Data      │    │   & Transform│    │   Components    │     │
│  └─────────────┘    └──────────────┘    └─────────────────┘     │
│         │                                        │               │
│         ▼                                        ▼               │
│  ┌─────────────┐                      ┌──────────────────┐      │
│  │   loading   │                      │    components/   │      │
│  │   .tsx      │                      │   (Client)       │      │
│  └─────────────┘                      └──────────────────┘      │
│                                                  │               │
│                                                  ▼               │
│                                        ┌──────────────────┐      │
│                                        │     hooks/       │      │
│                                        │   (State, API)   │      │
│                                        └──────────────────┘      │
└─────────────────────────────────────────────────────────────────┘
```

## Principios

### 1. Server Components por Defecto

El `page.tsx` es un Server Component. Obtén datos en el servidor:

```typescript
// ✅ Fetch en Server Component
export default async function Page() {
  const data = await fetchData();
  return <ClientComponent data={data} />;
}

// ❌ No uses hooks de React en page.tsx
export default function Page() {
  const [data, setData] = useState([]); // Error!
}
```

### 2. Separación Client/Server

- **Server**: Fetch inicial, SEO, metadata
- **Client**: Interactividad, estado local, event handlers

```typescript
// page.tsx (Server)
export default async function Page() {
  const initialData = await api.getItems();
  return <ItemsList initialData={initialData} />;
}

// components/ItemsList.tsx (Client)
"use client";
export function ItemsList({ initialData }: Props) {
  const [items, setItems] = useState(initialData);
  // Lógica interactiva aquí
}
```

### 3. Suspense para Loading States

Usa `loading.tsx` o `<Suspense>` explícito:

```typescript
// Con loading.tsx automático
app/musicians/
├── page.tsx
└── loading.tsx  // Se muestra mientras page.tsx carga

// Con Suspense explícito
<Suspense fallback={<Skeleton />}>
  <AsyncComponent />
</Suspense>
```

### 4. Error Boundaries por Ruta

Cada ruta puede tener su `error.tsx`:

```typescript
"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

### 5. Server Actions para Mutaciones

Usa Server Actions en lugar de API routes para formularios:

```typescript
// actions.ts
"use server";

export async function createItem(formData: FormData) {
  const result = await api.create(formData);
  revalidatePath("/items");
  return result;
}

// components/CreateForm.tsx
"use client";
import { createItem } from "../actions";

export function CreateForm() {
  return (
    <form action={createItem}>
      <input name="title" />
      <button type="submit">Create</button>
    </form>
  );
}
```

## Checklist de Implementación

### Antes de Empezar

- [ ] ¿Qué datos necesita la página?
- [ ] ¿Qué es Server-side y qué es Client-side?
- [ ] ¿Necesita layout propio?
- [ ] ¿Tiene estados de loading/error específicos?

### Archivos Obligatorios

- [ ] `page.tsx` - Entry point
- [ ] `loading.tsx` - Loading UI
- [ ] `types.ts` - Types de la feature

### Archivos Opcionales

- [ ] `layout.tsx` - Si necesita layout específico
- [ ] `error.tsx` - Si necesita manejo de error custom
- [ ] `not-found.tsx` - Si tiene lógica 404 específica
- [ ] `actions.ts` - Si tiene formularios/mutaciones

### Componentes

- [ ] Separar Server/Client correctamente
- [ ] Usar Suspense para async components
- [ ] Props tipadas correctamente
- [ ] Accesibilidad (ARIA, keyboard)

### Estado

- [ ] Estado local con useState/useReducer
- [ ] Estado global con Zustand (si aplica)
- [ ] URL state con searchParams (filtros, paginación)

### Testing

- [ ] Unit tests para hooks
- [ ] Integration tests para componentes clave
- [ ] E2E para flujos críticos

## Ejemplo de Uso Real

Para crear una página de "Bandas":

```bash
# Copiar el template
cp -r examples/page-implementation app/\(main\)/bands

# Renombrar y adaptar
# 1. Editar types.ts con los tipos de Band
# 2. Editar page.tsx para fetch de bandas
# 3. Crear componentes específicos (BandCard, BandFilters)
# 4. Implementar hooks si es necesario
```
