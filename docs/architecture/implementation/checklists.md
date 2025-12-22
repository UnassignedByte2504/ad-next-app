# Implementation Checklists

> Checklists completos por tipo de tarea.

## Nueva Feature (Página Completa)

```markdown
### 1. Planificación
- [ ] User Story definida con criterios de aceptación
- [ ] Diseño/mockup disponible
- [ ] API endpoints documentados

### 2. Estructura
- [ ] Crear carpeta en `app/(grupo)/feature/`
- [ ] `page.tsx` como Server Component
- [ ] `layout.tsx` si necesita layout propio
- [ ] `loading.tsx` para Suspense
- [ ] `error.tsx` para error boundary
- [ ] `actions.ts` para Server Actions

### 3. Componentes
- [ ] Identificar atoms necesarios
- [ ] Identificar molecules necesarios
- [ ] Crear organisms en `components/organisms/`
- [ ] Tipos en `types/` o colocados

### 4. Estado (si aplica)
- [ ] Crear slice en `store/slices/`
- [ ] Registrar en `store/index.ts`
- [ ] Selectores granulares
- [ ] Hooks de alto nivel en `store/hooks.ts`

### 5. API (si aplica)
- [ ] Servicio en `lib/services/`
- [ ] Tipos de request/response
- [ ] Manejo de errores

### 6. Tests
- [ ] Unit tests de componentes
- [ ] Integration tests del flujo
- [ ] E2E test del happy path
- [ ] Coverage check

### 7. Documentación
- [ ] Storybook para componentes nuevos
- [ ] README si es complejo
- [ ] Actualizar docs si cambia arquitectura
```

## Nuevo Componente Organism

```markdown
### Setup
- [ ] Carpeta `ComponentName/` en `components/organisms/`
- [ ] `ComponentName.tsx` (componente principal)
- [ ] `ComponentName.types.ts` (tipos)
- [ ] `ComponentName.stories.tsx` (Storybook)
- [ ] `ComponentName.test.tsx` (tests)
- [ ] `index.ts` (re-export)

### Implementación
- [ ] Props tipadas con interface
- [ ] `"use client"` si es necesario
- [ ] Memo si es costoso de renderizar
- [ ] Accesibilidad (aria, roles)
- [ ] Responsive design

### Calidad
- [ ] Lint sin errores
- [ ] Tests pasando
- [ ] Storybook funcional
- [ ] Export en `components/index.ts`
```

## Nuevo Slice de Zustand

```markdown
### Setup
- [ ] Archivo `featureSlice.ts` en `store/slices/`
- [ ] Interface del slice con estado y acciones
- [ ] StateCreator tipado correctamente

### Implementación
- [ ] Estado inicial definido
- [ ] Acciones con immer
- [ ] Async actions con try/catch
- [ ] Loading/error states

### Integración
- [ ] Agregar al store combinado
- [ ] Crear hook useFeature
- [ ] Crear useFeatureActions
- [ ] Selectores en store/hooks.ts

### Tests
- [ ] Test del slice aislado
- [ ] Test de acciones async
```

## Bug Fix

```markdown
### Diagnóstico
- [ ] Reproducir el bug
- [ ] Identificar archivos afectados
- [ ] Entender la causa raíz

### Corrección
- [ ] Implementar fix
- [ ] Verificar que no rompe otros features
- [ ] Agregar test de regresión

### Validación
- [ ] Tests pasando
- [ ] Bug no se reproduce
- [ ] PR con descripción del fix
```

## Related

- [User Stories](./user-stories.md)
- [Quick Reference](../quick-reference.md)
- [Component Patterns](../components/patterns.md)
