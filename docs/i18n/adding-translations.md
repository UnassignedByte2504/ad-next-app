# Agregar Traducciones

## Estructura Modular

Las traducciones están organizadas en archivos separados por namespace:

```
messages/
  es/
    common.json      → Common (botones, loading, errors)
    home.json        → Home (página principal)
    auth.json        → Auth (login, registro)
    navigation.json  → Navigation (menús)
    metadata.json    → Metadata (SEO, títulos)
  en/
    common.json
    home.json
    auth.json
    navigation.json
    metadata.json
```

## Proceso

### 1. Crear o Identificar el Namespace

Si el namespace ya existe, edita el archivo correspondiente.
Si es nuevo, crea los archivos en ambos locales.

Namespaces existentes:
- `Metadata` - SEO y meta tags
- `Home` - Página principal
- `Common` - Elementos reutilizables
- `Auth` - Autenticación
- `Navigation` - Menús y navegación

### 2. Agregar Nuevo Namespace

```bash
# 1. Crear archivos para el nuevo namespace
touch messages/es/musicians.json
touch messages/en/musicians.json
```

```json
// messages/es/musicians.json
{
  "title": "Buscar Músicos",
  "filters": {
    "instrument": "Instrumento",
    "genre": "Género",
    "location": "Ubicación"
  },
  "card": {
    "connect": "Conectar",
    "viewProfile": "Ver perfil"
  },
  "empty": "No se encontraron músicos"
}
```

```json
// messages/en/musicians.json
{
  "title": "Find Musicians",
  "filters": {
    "instrument": "Instrument",
    "genre": "Genre",
    "location": "Location"
  },
  "card": {
    "connect": "Connect",
    "viewProfile": "View profile"
  },
  "empty": "No musicians found"
}
```

### 3. Registrar el Namespace

Agrega el nuevo namespace al array en `i18n/messages.ts`:

```typescript
export const NAMESPACES = [
  "metadata",
  "home",
  "common",
  "auth",
  "navigation",
  "musicians", // ← Agregar aquí
] as const;
```

### 4. Usar en Componentes

```tsx
// Server Component
import { getTranslations } from "next-intl/server";

export default async function MusiciansPage() {
  const t = await getTranslations("Musicians");

  return (
    <div>
      <h1>{t("title")}</h1>
      <p>{t("empty")}</p>
    </div>
  );
}

// Client Component
"use client";
import { useTranslations } from "next-intl";

export function MusicianCard() {
  const t = useTranslations("Musicians.card");

  return (
    <div>
      <button>{t("connect")}</button>
      <button>{t("viewProfile")}</button>
    </div>
  );
}
```

## Parámetros Dinámicos

```json
{
  "greeting": "Hola {name}",
  "items": "{count, plural, =0 {Sin items} one {# item} other {# items}}"
}
```

```tsx
t("greeting", { name: "Carlos" }); // "Hola Carlos"
t("items", { count: 5 }); // "5 items"
```

## Formateo de Fechas y Números

```tsx
import { useFormatter } from "next-intl";

function MyComponent() {
  const format = useFormatter();

  return (
    <div>
      {format.dateTime(new Date(), { dateStyle: "long" })}
      {format.number(1234.56, { style: "currency", currency: "EUR" })}
    </div>
  );
}
```

## Checklist

- [ ] Archivos JSON creados en `messages/es/` y `messages/en/`
- [ ] Namespace registrado en `i18n/messages.ts` (NAMESPACES array)
- [ ] Misma estructura de keys en ambos idiomas
- [ ] Sin hardcoded strings en componentes
