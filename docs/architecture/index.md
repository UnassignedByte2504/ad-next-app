# Architecture

> **Status:** Active
> **Last Updated:** 2025-12-04

## Overview

Documentación de la arquitectura del cliente BEMYRE. Define los principios, patrones y convenciones que guían el desarrollo.

## Quick Links

- [Quick Reference](./quick-reference.md) - Comandos, imports y checklists
- [Principios](./principles.md) - Fundamentos de la arquitectura
- [Componentes](./components/) - Atomic Design y patrones

## Contents

### 📐 Foundations

- [Principles](./principles.md) - Reactive First, Separation of Concerns, Ports & Adapters

### 🔄 Reactive Architecture

- [Data Flow](./reactive/data-flow.md) - Flujo unidireccional
- [State Types](./reactive/state-types.md) - Server, Client, Local, URL state

### 🏗️ Layers

- [Overview](./layers/overview.md) - Las 4 capas del sistema
- [UI Layer](./layers/ui.md) - Atomic Design
- [State Layer](./layers/state.md) - Zustand store
- [Service Layer](./layers/service.md) - API clients
- [Infrastructure](./layers/infrastructure.md) - Logger, errors, storage

### 🧩 Components

- [Patterns](./components/patterns.md) - Presentational, Container, Feature, Compound
- [Atomic Design](./components/atomic-design.md) - Atoms, Molecules, Organisms, Templates

### 📦 State Management

- [Zustand](./state/zustand.md) - Store structure y slices
- [Selectors](./state/selectors.md) - Selectores óptimos
- [Hooks](./state/hooks.md) - Hooks de alto nivel

### 🔌 API Integration

- [HTTP Client](./api/client.md) - Cliente base
- [Services](./api/services.md) - APIs por dominio

### 📋 Implementation

- [User Stories](./implementation/user-stories.md) - Template y estructura
- [Checklists](./implementation/checklists.md) - Antes, durante, después

## TL;DR

```text
Principio         → Reactive First (unidireccional, inmutable, declarativo)
Capas             → UI → State → Service → Infrastructure
Componentes       → Atoms → Molecules → Organisms → Templates
Estado Global     → Zustand con slices
Estado Servidor   → Fetch en Server Components
Estado Local      → useState/useReducer
```

## Golden Rules

1. **Reactive First** - Datos fluyen en una dirección: state → view → action → state
2. **Separation of Concerns** - Cada capa tiene una responsabilidad única
3. **Composición > Herencia** - Funcionalidad mediante composición de piezas pequeñas
4. **TypeScript Estricto** - No `any`, todo tipado

## Related

- [Server Components](../server-components/) - Estrategia RSC
- [CLAUDE.md](../../CLAUDE.md) - Contexto para Claude
- [Examples](../../examples/) - Implementaciones de referencia
