# BEMYRE v2 Frontend - Audit Report

> **Fecha:** 2 de Diciembre, 2025
> **Scope:** `/bemyre-v2/client/` > **Stack:** Next.js 16, React 19, TypeScript 5, MUI 7, Zustand 5

---

## Executive Summary

### Architecture Score: 5.9/10 (Fair - Early Foundation Phase)

El frontend tiene **fundamentos sólidos** con excelente manejo de errores, arquitectura clara y buen tooling. Sin embargo, **no está production-ready** debido a integración API incompleta y flujo de autenticación faltante.

### Security Risk: 7.5/10 (HIGH)

La aplicación tiene múltiples vulnerabilidades críticas y de alta severidad que deben resolverse antes del despliegue a producción.

---

## Part 1: Architecture Audit

### Strengths

#### 1. Error Handling Architecture (Excellent)

- Sistema comprehensivo con `AppError`, `ApiError`, y clases especializadas
- Alineación con códigos de error del backend (`ApiErrorCode`)
- Correlation IDs para trazabilidad completa
- Hook `useApiError` para manejo consistente en componentes
- ErrorBoundary con integración Sentry y fallbacks

#### 2. State Management (Well-Designed)

- Zustand store con patrón de slices limpio (auth, ui, search)
- Stack de middleware correcto: Immer, DevTools, Persist, subscribeWithSelector
- Hooks basados en selectores previenen re-renders innecesarios
- Hooks de acciones separados de selectores de estado

#### 3. Logging & Observability (Production-Ready)

- Logger centralizado con múltiples handlers (console, Sentry, remote file logging)
- Hook `useLogger` provee logging con contexto en componentes
- Remote logging con batch processing
- Integración Sentry con scoping y metadata

#### 4. API Client (Well-Structured)

- Clase `ApiClient` custom con timeout, correlation IDs, y parsing de errores
- Interfaces type-safe para request/response
- Detección automática de retry a través de códigos de error

#### 5. Component Architecture

- Atomic Design correctamente implementado
- Barrel exports consistentes
- Documentación JSDoc en props

### Critical Issues

#### 1. API Integration Not Using ApiClient

**Ubicación:** `store/slices/authSlice.ts`, `store/slices/searchSlice.ts`

```typescript
// ❌ PROBLEMA: Usando fetch raw
const response = await fetch("/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});
```

**Impacto:** Sin error handling, sin correlation IDs, sin logging, sin timeout management.

**Fix:** Refactorizar para usar `apiClient` de `@lib/api`.

#### 2. Missing API Service Layer

**Problema:** Store actions llaman directamente a endpoints API; no hay abstracción de servicios.

**Impacto:**

- Difícil de testear (mock APIs en store)
- Acoplamiento fuerte entre estado y API
- Duplicación de código cuando APIs se llaman desde múltiples lugares

**Recomendación:** Crear service layer: `lib/services/auth.ts`, `lib/services/search.ts`

#### 3. Missing Request Authentication

**Problema:** ApiClient no inyecta JWT tokens en headers de requests.

**Impacto:** API calls fallarán para endpoints autenticados.

**Fix:** Implementar inyección de token en ApiClient, posiblemente via middleware pattern.

#### 4. Zustand Type Suppressions (3x @ts-expect-error)

**Ubicación:** `store/index.ts`

```typescript
// @ts-expect-error - Zustand slice pattern requires this
(fn) => set((state) => { fn(state); }),
```

**Impacto:** Type safety comprometido; enmascara posibles issues reales de tipos.

### High Severity Issues

| Issue                                          | Ubicación        | Impacto                              |
| ---------------------------------------------- | ---------------- | ------------------------------------ |
| Theme changes mutan DOM directamente en setter | `uiSlice.ts`     | Side effects en store mutations      |
| No Server Component strategy                   | `providers.tsx`  | Fuerza toda la app a ser client-side |
| AuthSlice re-throws errors sin enhancement     | `authSlice.ts`   | Error context perdido                |
| No token refresh mechanism                     | `authSlice.ts`   | Sessions expirarán sin aviso         |
| Search slice no implementado                   | `searchSlice.ts` | Funcionalidad muerta                 |

### Medium Severity Issues

| Issue                                   | Impacto                                        |
| --------------------------------------- | ---------------------------------------------- |
| No request deduplication                | Race conditions en refetch rápido              |
| Memory leaks en store subscriptions     | Event listeners nunca limpiados                |
| Components sin memoization              | Re-renders innecesarios                        |
| No middleware para request intercepting | Difícil implementar auth/retry global          |
| No error recovery patterns              | Failures transitorios causan failure inmediato |

### Quick Wins

| Task                                | Esfuerzo | Impacto             |
| ----------------------------------- | -------- | ------------------- |
| Agregar `.env.example`              | 15 min   | Claridad en setup   |
| JSDoc en ErrorCode enum             | 30 min   | Developer DX        |
| Extraer Avatar ripple a constante   | 20 min   | Code reuse          |
| Agregar circular dep linting rule   | 30 min   | Architecture safety |
| Memoizar MusicianCard               | 1 hr     | Performance         |
| Fix event listener cleanup en store | 30 min   | Memory safety       |

---

## Part 2: Security Audit

### Critical Vulnerabilities

#### 1. Tokens Stored in localStorage (CVSS 9.1)

**Ubicación:** `store/index.ts` (lines 60-80)

```typescript
// VULNERABLE: Persistiendo tokens sensibles en localStorage
persist(
  immer((set, get, store) => ({...})),
  {
    name: "bemyre-store",
    partialize: (state): PersistedState => ({
      auth: {
        token: state.auth.token,           // JWT en localStorage!
        refreshToken: state.auth.refreshToken,  // Refresh token expuesto!
        user: state.auth.user,
      },
    }),
  }
)
```

**Impacto:**

- XSS en CUALQUIER componente = account takeover completo
- localStorage accesible desde cualquier script
- Tokens persisten entre reinicios del browser
- No protección HTTPOnly posible con localStorage

**Remediación:**

```typescript
// Usar httpOnly cookies via secure HTTP response
// Backend debe setear: Set-Cookie: token=...; HttpOnly; Secure; SameSite=Strict

// Frontend debe:
// 1. Remover tokens de Zustand persistence
// 2. Solo guardar datos no-sensibles (user ID, role)
// 3. Depender de httpOnly cookies para auth
```

#### 2. Sentry Configuration Exposes PII (CVSS 9.0)

**Ubicación:** `sentry.server.config.ts`, `sentry.edge.config.ts`

```typescript
Sentry.init({
  dsn: "https://...",
  sendDefaultPii: true, // CRITICAL: Envía datos de usuario a Sentry!
  enableLogs: true, // Todos los logs enviados
});
```

**Impacto:**

- Email, ID, detalles de auth enviados a Sentry (tercero)
- Violación GDPR: PII transmitido sin consentimiento
- Breach de Sentry = breach de datos de clientes

**Remediación:**

```typescript
Sentry.init({
  dsn: "...",
  sendDefaultPii: false, // DESACTIVAR
  beforeSend(event) {
    if (event.user?.email) {
      event.user.email = "[redacted]";
    }
    return event;
  },
  enableLogs: process.env.NODE_ENV === "development",
});
```

#### 3. Credentials in .env File (CVSS 8.2)

**Ubicación:** `client/.env`

```
SENTRY_AUTH_TOKEN=sntrys_eyJpYXQiOjE3NjQ1Njk1NzAuMzkz...
```

**Impacto:** Token privado expuesto en version control.

**Remediación:**

```bash
# .env debe estar en .gitignore
echo ".env" >> .gitignore

# Usar .env.example para documentación
# SENTRY_AUTH_TOKEN=your_token_here

# En CI/CD: usar repository secrets
```

### High Vulnerabilities

| Severity | Issue                         | CVSS | Remediación                                 |
| -------- | ----------------------------- | ---- | ------------------------------------------- |
| HIGH     | Raw Fetch sin token injection | 7.5  | Usar ApiClient para todas las auth requests |
| HIGH     | No CSP Headers                | 7.2  | Configurar en `next.config.ts`              |
| HIGH     | No GDPR/Consent controls      | 7.0  | Implementar consent banner                  |

### Medium Vulnerabilities

| Issue                           | CVSS | Remediación                              |
| ------------------------------- | ---- | ---------------------------------------- |
| Avatar URL no validado (XSS)    | 6.8  | Validar URLs con whitelist de protocolos |
| No CSRF Token                   | 6.1  | Implementar X-CSRF-Token header          |
| Form input no validado          | 5.9  | Usar Zod schemas                         |
| No Session Timeout              | 5.8  | Implementar inactivity timeout           |
| Correlation IDs enable tracking | 5.5  | Hash IPs en producción                   |

### Security Quick Wins

```typescript
// 1. Agregar headers de seguridad (5 min)
// next.config.ts
async headers() {
  return [{
    source: "/:path*",
    headers: [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "X-XSS-Protection", value: "1; mode=block" },
    ],
  }];
}

// 2. Validar URLs de avatar (10 min)
function isValidImageUrl(url?: string): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return ["http:", "https:"].includes(parsed.protocol);
  } catch {
    return false;
  }
}

// 3. Limitar longitud de input (5 min)
setQuery: (query: string) => {
  set(state => {
    state.search.query = query.trim().slice(0, 200);
  });
};
```

---

## Prioritized Recommendations

### Phase 1: Critical (Week 1-2) - BLOCKS PRODUCTION

| Priority | Task                                  | Esfuerzo | Impacto             |
| -------- | ------------------------------------- | -------- | ------------------- |
| P0.1     | Migrar tokens a httpOnly cookies      | 3-4 días | Account security    |
| P0.2     | Desactivar PII en Sentry              | 1 día    | Privacy compliance  |
| P0.3     | Remover secrets de repo, rotar tokens | 2 horas  | Credential exposure |
| P0.4     | Refactorizar auth para usar ApiClient | 2-3 días | Error handling      |

### Phase 2: High Priority (Week 3-4)

| Priority | Task                              | Esfuerzo | Impacto        |
| -------- | --------------------------------- | -------- | -------------- |
| P1.1     | Agregar CSP Headers               | 1-2 días | XSS protection |
| P1.2     | Crear service layer               | 3-4 días | Testability    |
| P1.3     | Implementar form validation (Zod) | 2-3 días | Input security |
| P1.4     | GDPR consent management           | 2 días   | Compliance     |

### Phase 3: Medium Priority (Week 5-6)

| Priority | Task                                  | Esfuerzo |
| -------- | ------------------------------------- | -------- |
| P2.1     | Session management (timeout, refresh) | 1-2 días |
| P2.2     | CSRF protection                       | 1 día    |
| P2.3     | Memoization strategy                  | 1-2 días |
| P2.4     | Test coverage crítica                 | 3-4 días |

---

## Compliance Checklist

- [ ] GDPR: Consent management implementado
- [ ] GDPR: Data retention policy (30-day log purge)
- [ ] GDPR: User deletion support
- [ ] GDPR: Data export functionality
- [ ] OWASP Top 10: Todos los items addressed

---

## Estimate to Production-Ready

**Total estimado: 4-6 semanas**

- Semana 1-2: Fixes críticos (auth, Sentry, secrets)
- Semana 3-4: High-priority (CSP, service layer, validation)
- Semana 5-6: Compliance y testing

---

_Audit realizado el 2 de Diciembre, 2025_
