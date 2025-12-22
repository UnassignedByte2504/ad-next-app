# Server Components

> **Status:** Active Architecture Pattern  
> **Framework:** Next.js 16 with App Router  
> **Last Updated:** 2025-12-04

## Overview

Documentación completa sobre la estrategia de React Server Components (RSC) en BEMYRE v2.

**Key Insight:** La arquitectura actual es correcta. `providers.tsx` con "use client" es *requerido* para MUI, pero esto NO impide el uso efectivo de Server Components en el resto de la aplicación.

## Quick Links

- [Quick Reference](./quick-reference.md) - Cheatsheet y decisiones rápidas
- [Overview de Arquitectura](./architecture/overview.md) - Cómo funciona todo
- [Errores Comunes](./best-practices/common-mistakes.md) - Qué evitar

## Contents

### 📐 Architecture

Entiende cómo funciona la arquitectura de RSC.

- [Overview](./architecture/overview.md) - Estructura general y cómo funciona
- [Diagrams](./architecture/diagrams.md) - Diagramas visuales y flujos

### 🎯 Patterns

Patrones de uso comunes.

- [Composition Pattern](./patterns/composition.md) - El patrón más importante
- [Data Fetching](./patterns/data-fetching.md) - Cómo obtener datos
- [Common Patterns](./patterns/common-patterns.md) - Filtros, modales, cards, etc.

### ✅ Best Practices

Guías y recomendaciones.

- [Decision Guide](./best-practices/decision-guide.md) - Cuándo usar Server vs Client
- [Performance](./best-practices/performance.md) - Optimización y métricas
- [Common Mistakes](./best-practices/common-mistakes.md) - Errores a evitar

### 🔧 Implementation

Detalles de implementación.

- [Summary](./implementation/summary.md) - Estado actual de la implementación
- [Migration Guide](./implementation/migration-guide.md) - Cómo migrar componentes

## TL;DR

```text
Por defecto → Server Component (sin directive)
useState/useEffect → "use client"
onClick/onChange → "use client"
Zustand store → "use client"
Fetch de datos → Server Component (async)
```

## Golden Rules

1. **Default a Server** - No añadas "use client" a menos que sea necesario
2. **Push Client Down** - Haz el componente más pequeño posible Client Component
3. **Pages siempre Server** - `page.tsx` NUNCA debe tener "use client"
4. **Fetch en Server** - Los datos se obtienen en Server Components

## Related

- [Architecture General](../ARCHITECTURE.md)
- [Example Implementation](../../examples/page-implementation/)
- [CLAUDE.md](../../CLAUDE.md) - Sección de Server Components

