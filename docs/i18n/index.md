# Internacionalización (i18n)

> Guía de internacionalización con next-intl.

## Estructura

```text
i18n/
├── routing.ts      # Configuración de locales y rutas
├── navigation.ts   # APIs de navegación con locale
├── request.ts      # Carga de mensajes por request
└── index.ts        # Barrel export

messages/
├── es.json         # Traducciones en español (default)
└── en.json         # Traducciones en inglés

app/
└── [locale]/       # Todas las páginas bajo este segmento
    ├── layout.tsx  # Layout con NextIntlClientProvider
    └── page.tsx    # Páginas con useTranslations
```

## Quick Reference

### Server Components

```tsx
import { getTranslations } from "next-intl/server";

export default async function Page() {
  const t = await getTranslations("Home");
  return <h1>{t("title")}</h1>;
}
```

### Client Components

```tsx
"use client";
import { useTranslations } from "next-intl";

export function MyComponent() {
  const t = useTranslations("Home");
  return <h1>{t("title")}</h1>;
}
```

### Navegación

```tsx
// ✅ Usar APIs de @i18n/navigation
import { Link, useRouter } from "@i18n/navigation";

<Link href="/musicians">Músicos</Link>

// ❌ NO usar next/navigation directamente para links
import { Link } from "next/link"; // Perderá el locale
```

### Metadata

```tsx
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: t("title"),
    description: t("description"),
  };
}
```

## Related

- [Quick Reference](./quick-reference.md)
- [Adding Translations](./adding-translations.md)
- [Routing Configuration](./routing.md)
