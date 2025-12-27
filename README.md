# Ayla Designs Client

Tienda e-commerce de productos digitales con estética bohemia - Cliente web con Next.js 16 y Bun.

## Stack

- **Runtime**: [Bun](https://bun.sh) 1.3.x
- **Framework**: [Next.js](https://nextjs.org) 16.x con App Router
- **UI**: React 19, MUI 7, Tailwind CSS 4
- **State**: Zustand 5
- **Testing**: Vitest, Playwright, Storybook 10

## Getting Started

```bash
# Instalar dependencias
bun install

# Desarrollo (con Bun runtime)
bun dev

# Build de producción
bun build
bun start
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Scripts Disponibles

| Comando         | Descripción              |
| --------------- | ------------------------ |
| `bun dev`       | Servidor de desarrollo   |
| `bun build`     | Build de producción      |
| `bun start`     | Servir build             |
| `bun lint`      | ESLint                   |
| `bun test`      | Tests unitarios          |
| `bun test:e2e`  | Tests E2E                |
| `bun storybook` | Storybook en puerto 6006 |

## Documentación

- [CLAUDE.md](./CLAUDE.md) - Contexto para AI assistants
- [docs/architecture/](./docs/architecture/) - Arquitectura del proyecto
- [docs/server-components/](./docs/server-components/) - Guía de Server Components

## Deploy

Compatible con [Vercel](https://vercel.com) con soporte nativo para Bun runtime.

