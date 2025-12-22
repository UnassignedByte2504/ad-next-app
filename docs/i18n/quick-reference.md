# i18n Quick Reference

## Configuración

| Archivo                  | Propósito                           |
| ------------------------ | ----------------------------------- |
| `i18n/routing.ts`        | Locales, default, prefix mode       |
| `i18n/request.ts`        | Carga de mensajes                   |
| `proxy.ts`               | Middleware para detección de locale |
| `messages/{locale}.json` | Traducciones                        |

## Locales Soportados

- `es` - Español (default)
- `en` - English

## APIs

### Server Components

```tsx
import { getTranslations, getLocale } from "next-intl/server";

// Obtener traducciones
const t = await getTranslations("Namespace");
t("key");
t("nested.key");
t("withParams", { name: "John" });

// Obtener locale actual
const locale = await getLocale();
```

### Client Components

```tsx
import { useTranslations, useLocale } from "next-intl";

const t = useTranslations("Namespace");
const locale = useLocale();
```

### Navegación

```tsx
import { Link, useRouter, usePathname, redirect } from "@i18n/navigation";

// Link con locale automático
<Link href="/musicians">...</Link>

// Router
const router = useRouter();
router.push("/musicians");

// Pathname sin locale prefix
const pathname = usePathname(); // "/musicians" no "/es/musicians"

// Redirect server-side
redirect("/login");
```

## Estructura de Mensajes

```json
{
  "Namespace": {
    "key": "Valor",
    "nested": {
      "key": "Valor anidado"
    },
    "withParams": "Hola {name}",
    "withPlural": "{count, plural, =0 {Sin items} one {# item} other {# items}}"
  }
}
```

## Namespaces Comunes

| Namespace    | Uso                               |
| ------------ | --------------------------------- |
| `Metadata`   | Títulos y descripciones de página |
| `Home`       | Página principal                  |
| `Common`     | Botones, acciones comunes         |
| `Auth`       | Login, registro                   |
| `Navigation` | Menús de navegación               |

## Agregar Traducciones

1. Añadir keys en `messages/es.json`
2. Añadir mismas keys en `messages/en.json`
3. Usar con `t("namespace.key")`

## Cambiar Locale

```tsx
import { useRouter, usePathname } from "@i18n/navigation";
import { useLocale } from "next-intl";

function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <button onClick={() => switchLocale(locale === "es" ? "en" : "es")}>
      {locale === "es" ? "EN" : "ES"}
    </button>
  );
}
```
