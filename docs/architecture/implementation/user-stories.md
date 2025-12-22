# User Story Template

> Plantilla para especificación de features.

## Template

```markdown
# US-XXX: [Título corto]

## 📝 Descripción

**Como** [rol de usuario],
**quiero** [acción/funcionalidad],
**para** [beneficio/valor].

## ✅ Criterios de Aceptación

- [ ] Criterio 1
- [ ] Criterio 2
- [ ] Criterio 3

## 🔗 Dependencias

- US-YYY (opcional)
- API endpoint: `POST /api/xxx`

## 📁 Archivos a Crear/Modificar

### Nuevos
- `app/(main)/feature/page.tsx`
- `components/organisms/FeatureComponent/`
- `store/slices/featureSlice.ts`

### Modificar
- `store/index.ts` - Agregar slice
- `types/index.ts` - Agregar tipos

## 🧪 Casos de Test

### Unit
- FeatureComponent renderiza correctamente
- Actions del store funcionan

### Integration
- Flujo completo funciona

### E2E
- Usuario puede completar feature

## 📋 Notas Técnicas

- Usar Server Component para la página
- Client Component para interactividad
- Zustand para estado de formulario
```

## Ejemplo Real

```markdown
# US-001: Registro de Músico

## 📝 Descripción

**Como** visitante,
**quiero** registrarme como músico,
**para** poder buscar otros músicos y formar bandas.

## ✅ Criterios de Aceptación

- [ ] Formulario con campos: nombre, email, password, instrumentos
- [ ] Validación en tiempo real
- [ ] Mensaje de éxito/error
- [ ] Redirección a perfil tras registro exitoso

## 🔗 Dependencias

- API endpoint: `POST /api/auth/register`
- Servicio: `authService.register()`

## 📁 Archivos a Crear/Modificar

### Nuevos
- `app/(auth)/register/page.tsx`
- `app/(auth)/register/actions.ts`
- `components/organisms/RegisterForm/`

### Modificar
- `store/slices/authSlice.ts` - Acción de registro

## 🧪 Casos de Test

### Unit
- RegisterForm valida campos vacíos
- RegisterForm muestra errores de validación

### Integration
- Flujo register → login → redirect funciona

### E2E
- Usuario completa registro exitosamente
```

## Related

- [Checklists](./checklists.md)
- [Quick Reference](../quick-reference.md)
- [Component Patterns](../components/patterns.md)

