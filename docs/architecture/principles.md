# Principios Fundamentales

> Los fundamentos que guían toda decisión de arquitectura.

## 1. Reactive First

Todo el desarrollo sigue el paradigma reactivo:

- **Unidireccional**: Los datos fluyen en una sola dirección (state → view → action → state)
- **Inmutable**: El estado nunca se muta directamente, se crean nuevas referencias
- **Declarativo**: Describimos QUÉ queremos, no CÓMO hacerlo
- **Composable**: Funcionalidad construida mediante composición de piezas pequeñas

## 2. Separation of Concerns

Cada capa tiene una responsabilidad única:

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

## 3. Ports & Adapters (Hexagonal Lite)

Para servicios externos, aplicamos un patrón simplificado:

```typescript
// Port (Interfaz) - types/ports/auth.ts
interface AuthPort {
  login(credentials: Credentials): Promise<AuthResult>;
  logout(): Promise<void>;
  refreshToken(): Promise<string>;
}

// Adapter (Implementación) - lib/adapters/auth-api.ts
class AuthApiAdapter implements AuthPort {
  async login(credentials: Credentials): Promise<AuthResult> {
    return await apiClient.post("/auth/login", credentials);
  }
}

// Uso en componentes - siempre a través del port
const authService = useAuthService(); // Inyecta el adapter
```

## Beneficios

| Principio              | Beneficio                              |
| ---------------------- | -------------------------------------- |
| Reactive First         | Predecible, debuggeable, testeable     |
| Separation of Concerns | Mantenible, escalable                  |
| Ports & Adapters       | Desacoplado, testeable, intercambiable |

## Anti-Patterns

```typescript
// ❌ Mutar estado directamente
state.user.name = "New Name";

// ✅ Crear nueva referencia
setState({ ...state, user: { ...state.user, name: "New Name" } });

// ❌ Lógica de negocio en componentes UI
function Button({ onClick }) {
  const handleClick = () => {
    // Lógica de negocio compleja aquí ❌
    apiClient.post("/action");
    analytics.track("click");
    // ...
  };
}

// ✅ Lógica en servicios/hooks, componente solo presenta
function Button({ onClick }) {
  return <button onClick={onClick}>Click</button>;
}
```

## Related

- [Data Flow](./reactive/data-flow.md)
- [Layers Overview](./layers/overview.md)
- [Component Patterns](./components/patterns.md)
