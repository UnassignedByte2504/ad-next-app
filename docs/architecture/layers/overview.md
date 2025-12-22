# Layers Overview

> Las 4 capas del sistema y sus responsabilidades.

## Diagrama

```text
┌─────────────────────────────────────────────────────────────┐
│                        UI Layer                              │
│  (Components: Atoms → Molecules → Organisms → Templates)     │
├─────────────────────────────────────────────────────────────┤
│                      State Layer                             │
│  (Zustand Store: Slices + Selectors + Actions)               │
├─────────────────────────────────────────────────────────────┤
│                    Service Layer                             │
│  (API Clients + WebSocket + Event Handlers)                  │
├─────────────────────────────────────────────────────────────┤
│                  Infrastructure Layer                        │
│  (HTTP Client + Logger + Error Handling + Storage)           │
└─────────────────────────────────────────────────────────────┘
```

## Responsabilidades

| Capa               | Responsabilidad         | Ejemplos                        |
| ------------------ | ----------------------- | ------------------------------- |
| **UI**             | Presentación y UX       | Componentes React, Storybook    |
| **State**          | Estado de la aplicación | Zustand slices, selectores      |
| **Service**        | Lógica de negocio       | API clients, WebSocket handlers |
| **Infrastructure** | Servicios base          | Logger, HTTP client, storage    |

## Estructura de Directorios

```text
├── components/       # UI Layer
│   ├── atoms/
│   ├── molecules/
│   ├── organisms/
│   └── templates/
│
├── store/            # State Layer
│   ├── slices/
│   ├── hooks.ts
│   └── types.ts
│
├── lib/              # Service + Infrastructure
│   ├── api/          # Service Layer
│   ├── websocket/    # Service Layer
│   ├── logger/       # Infrastructure
│   └── errors/       # Infrastructure
```

## Reglas de Dependencia

```text
UI → State → Service → Infrastructure
     ↓         ↓           ↓
   (puede usar capas inferiores, nunca superiores)
```

- **UI** puede usar State, Service, Infrastructure
- **State** puede usar Service, Infrastructure
- **Service** puede usar Infrastructure
- **Infrastructure** no depende de nada superior

## Related

- [UI Layer](./ui.md)
- [State Layer](./state.md)
- [Service Layer](./service.md)
- [Infrastructure](./infrastructure.md)
