# Examples

Esta carpeta contiene ejemplos de referencia para implementar features en Ayla Designs.

## Contenido

### [page-implementation/](./page-implementation/)

Ejemplo completo de cómo implementar una nueva página siguiendo los patrones de Next.js App Router y nuestra arquitectura reactiva.

**Incluye:**

- `page.tsx` - Server Component principal
- `layout.tsx` - Layout específico de la ruta
- `loading.tsx` - Loading UI con Suspense
- `error.tsx` - Error boundary de la ruta
- `not-found.tsx` - 404 personalizado
- `hooks/` - Hooks específicos de la feature
- `components/` - Componentes de la feature
- `actions.ts` - Server Actions
- `types.ts` - Types específicos

## Cómo Usar

1. Copia la estructura de `page-implementation/` a tu nueva ruta en `app/`
2. Renombra los archivos y adapta el código
3. Sigue los comentarios `// TODO:` para personalizar

## Referencia

- [docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md) - Patrones y arquitectura
- [CONTRIBUTING.md](../CONTRIBUTING.md) - Guía de contribución
