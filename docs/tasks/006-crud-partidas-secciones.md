# 006 - CRUD completo de secciones y plantillas de partidas

## Contexto

La página de Partidas (`/partidas`) y el detalle de sección (`/partidas/:sectionId`) ya tienen toda la UI construida: dialogs de crear, editar y eliminar para secciones y plantillas. Sin embargo, **todos los handlers están stubbed** — muestran un toast "Pendiente" y no hacen nada.

La tarea consiste en conectar esa UI existente con la base de datos.

### Estado actual por operación

| Operación | UI | Servicio | Handler |
|-----------|-----|---------|---------|
| Crear sección | ✅ Dialog | ✅ `createSection()` | ❌ Stub |
| Editar sección | ✅ Dialog | ❌ Falta | ❌ Stub |
| Ocultar sección | ❌ No existe | ❌ Falta | ❌ No existe |
| Crear plantilla | ✅ Dialog | ✅ `createTemplate()` | ❌ Stub |
| Editar plantilla | ✅ Dialog | ❌ Falta | ❌ Stub |
| Ocultar plantilla | ❌ No existe | ❌ Falta | ❌ No existe |

---

## Ocultar en vez de eliminar

Las secciones y plantillas **no se eliminan** — solo se ocultan. Ocultar = no aparece en la UI ni en los selectores, pero el dato se conserva en DB. Esto protege la integridad de los presupuestos existentes que referencian esas plantillas.

Implementar con un campo `hidden boolean DEFAULT false` en `sections` e `item_templates`. Las queries filtran por `hidden = false` por defecto.

---

## 1. Migración SQL

```sql
-- 006_add_hidden_to_catalog.sql

-- Campo hidden en sections
ALTER TABLE public.sections
  ADD COLUMN hidden boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN public.sections.hidden IS 'Si true, la sección no aparece en la UI pero no se borra';

-- Campo hidden en item_templates
ALTER TABLE public.item_templates
  ADD COLUMN hidden boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN public.item_templates.hidden IS 'Si true, la plantilla no aparece en la UI pero no se borra';
```

> No necesita cambios en RLS.

---

## 2. Cambios en tipos

**`src/types/database.types.ts`** — Añadir a `sections` e `item_templates`:

```typescript
// En Row, Insert y Update de sections:
hidden: boolean  // default false

// En Row, Insert y Update de item_templates:
hidden: boolean  // default false
```

---

## 3. Cambios en servicios

### `src/services/sections.service.ts`

```typescript
// MODIFICAR: getSections() → filtrar hidden = false por defecto

// AÑADIR:
updateSection(id: string, updates: SectionUpdate) → Promise<SectionRow>
toggleSectionHidden(id: string, hidden: boolean) → Promise<SectionRow>
```

### `src/services/templates.service.ts`

```typescript
// MODIFICAR: getTemplates() y getTemplatesBySection() → filtrar hidden = false

// AÑADIR:
updateTemplate(id: string, updates: TemplateUpdate) → Promise<TemplateRow>
toggleTemplateHidden(id: string, hidden: boolean) → Promise<TemplateRow>
```

---

## 4. Cambios en hooks

**`src/hooks/useSections.ts`** — Añadir mutations:

```typescript
useCreateSection()       → mutation → invalidate sections.all
useUpdateSection()       → mutation → invalidate sections.all
useToggleSectionHidden() → mutation → invalidate sections.all
```

**`src/hooks/useSections.ts` o nuevo `src/hooks/useTemplates.ts`** — Añadir mutations:

```typescript
useCreateTemplate()       → mutation → invalidate templates.all + templates.bySection
useUpdateTemplate()       → mutation → invalidate templates.all + templates.bySection
useToggleTemplateHidden() → mutation → invalidate templates.all + templates.bySection
```

---

## 5. Cambios en UI

### `src/pages/Partidas.tsx`

Reemplazar los handlers stub por llamadas reales a los hooks:

- **`handleCreateSection(data)`** → `useCreateSection().mutate(data)`
- **`handleEditSection(data)`** → `useUpdateSection().mutate({ id, ...data })`
- **Eliminar el dialog de eliminar** — reemplazarlo por opción "Ocultar" en el dropdown
- **Añadir**: opción "Ocultar" en el dropdown → `useToggleSectionHidden().mutate({ id, hidden: true })`
- **Añadir**: si la sección está oculta, mostrar opción "Mostrar" en vez de "Ocultar"
- **Añadir**: toggle o filtro para ver secciones ocultas (opcional, simple checkbox "Mostrar ocultas")

### `src/pages/SeccionDetalle.tsx`

- **`handleCreateTemplate(data)`** → `useCreateTemplate().mutate({ ...data, section_id })`
- **`handleEditTemplate(data)`** → `useUpdateTemplate().mutate({ id, ...data })`
- **Añadir**: botón/opción "Ocultar" en cada plantilla → `useToggleTemplateHidden()`
- Plantillas ocultas: mostrarlas con estilo apagado (opacidad reducida) cuando se activa "Mostrar ocultas", con opción "Mostrar" para reactivarlas

---

## 6. Verificación

**Secciones:**
- [ ] Crear sección con nombre e icono → aparece en la lista
- [ ] Editar nombre/icono de sección → se actualiza
- [ ] Ocultar sección → desaparece de la lista y de los selectores al añadir partidas
- [ ] Mostrar sección oculta → vuelve a aparecer
- [ ] Secciones del catálogo global (`user_id IS NULL`) no deben poder editarse ni ocultarse desde la UI

**Plantillas:**
- [ ] Crear plantilla en una sección → aparece en el detalle de sección
- [ ] Editar nombre, precio, unidad → se actualiza
- [ ] Ocultar plantilla → desaparece de la lista y del modal de añadir partidas
- [ ] Mostrar plantilla oculta → vuelve a aparecer
- [ ] Plantillas del catálogo global (`user_id IS NULL`) no deben poder editarse ni ocultarse desde la UI

---

## Nota sobre catálogo global

Las secciones y plantillas con `user_id IS NULL` son el catálogo base (seed). No deben modificarse.

En la UI: detectar `item.user_id === null` y deshabilitar los botones de editar/eliminar/ocultar en esos items, mostrando un tooltip o badge "Catálogo global".
