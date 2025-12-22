# Middleware Layer

> Documentación del layer de middleware para Next.js 16.

## Estructura

```text
middleware/
├── index.ts        # Barrel exports
├── types.ts        # Tipos y constantes
├── config.ts       # Configuración de rutas
├── correlation.ts  # Tracing con Correlation IDs
├── auth.ts         # Autenticación y rutas protegidas
└── security.ts     # Headers de seguridad y CSRF

proxy.ts            # Middleware principal (Next.js 16)
```

## Funcionalidades

| Feature              | Descripción                                              |
| -------------------- | -------------------------------------------------------- |
| **Correlation IDs**  | Tracing end-to-end con X-Correlation-ID y X-Request-ID   |
| **Auth Check**       | Verifica cookies para rutas protegidas, redirect a login |
| **Security Headers** | Headers adicionales de seguridad                         |
| **CSRF Protection**  | Token en cookie validado en mutaciones                   |
| **i18n Integration** | Integrado con next-intl para locale detection            |

## Cadena de Middlewares

```
Request → Skip Check → Auth → i18n → Correlation → Security → Response
```

1. **Skip Check**: Salta rutas como `/api`, `/_next`, archivos estáticos
2. **Auth**: Verifica autenticación, redirige si es necesario
3. **i18n**: Detecta locale, maneja routing
4. **Correlation**: Añade IDs para tracing
5. **Security**: Headers y CSRF protection

## Related

- [Quick Reference](./quick-reference.md)
- [Configuration](./configuration.md)
- [Auth Patterns](./auth-patterns.md)
