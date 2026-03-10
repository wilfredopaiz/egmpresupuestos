# 001 - IVA y Margen por proyecto

## Problema

`includeIVA` y `margin` son estados locales en `Presupuesto.tsx` y `ProyectoDetalle.tsx`. Al guardar un proyecto y volver a abrirlo, estos valores se resetean a los defaults (IVA: true/21%, margen: 15%). El usuario no puede desactivar el IVA ni ajustar el margen de forma persistente por proyecto.

## Solución

Añadir campos `include_iva`, `iva_percentage` y `margin_percentage` a la tabla `projects`.

---

## 1. Migración SQL

```sql
-- 001_add_iva_margin_to_projects.sql

ALTER TABLE projects
  ADD COLUMN include_iva boolean NOT NULL DEFAULT true,
  ADD COLUMN iva_percentage numeric(5,2) NOT NULL DEFAULT 21.00,
  ADD COLUMN margin_percentage numeric(5,2) NOT NULL DEFAULT 15.00;

-- Comentarios
COMMENT ON COLUMN projects.include_iva IS 'Si el proyecto incluye IVA en el total';
COMMENT ON COLUMN projects.iva_percentage IS 'Porcentaje de IVA aplicado (ej: 21.00)';
COMMENT ON COLUMN projects.margin_percentage IS 'Porcentaje de margen de beneficio (ej: 15.00)';
```

> No necesita cambios en RLS — la tabla `projects` ya permite CRUD a todos los autenticados.

---

## 2. Cambios en tipos

**`src/types/database.types.ts`** — Añadir a la interfaz de `projects`:

```typescript
// En Row, Insert y Update de projects:
include_iva: boolean        // default true
iva_percentage: number      // default 21
margin_percentage: number   // default 15
```

---

## 3. Cambios en servicios

**`src/services/projects.service.ts`**:

- `createProject()` → incluir los 3 campos nuevos (opcionales, toman defaults de DB).
- `updateProject()` → permitir actualizar `include_iva`, `iva_percentage`, `margin_percentage`.

---

## 4. Cambios en hooks

**`src/hooks/useProjects.ts`**:

- Las mutations de create/update ya deberían funcionar si los tipos están actualizados.
- Verificar que el `invalidateQueries` refresca correctamente al cambiar estos valores.

---

## 5. Cambios en UI

### `src/pages/ProyectoDetalle.tsx`

- Eliminar los `useState` locales de `includeIVA` y `margin`.
- Leer estos valores del proyecto cargado: `project.include_iva`, `project.iva_percentage`, `project.margin_percentage`.
- Al cambiar el toggle de IVA o el input de margen → llamar a `updateProject` mutation para persistir inmediatamente (o con debounce).

### `src/pages/Presupuesto.tsx`

- Eliminar los `useState` locales de `includeIVA` y `margin`.
- Leer del proyecto: `project.include_iva`, `project.iva_percentage`, `project.margin_percentage`.
- La vista de presupuesto es de solo lectura (o con modo "editar"), así que estos valores ya vienen guardados del proyecto.

### `src/lib/calculations.ts`

- `calculateProjectTotal()` → recibir `ivaPercentage` como parámetro en vez de hardcodear 21%.
- `calculateProjectWithMargin()` (o equivalente) → recibir `marginPercentage` como parámetro.

---

## 6. Verificación

- [ ] Crear un proyecto nuevo → IVA y margen toman defaults (true, 21%, 15%)
- [ ] Desactivar IVA → guardar → recargar página → IVA sigue desactivado
- [ ] Cambiar margen a 20% → guardar → ir a `/presupuesto` → muestra 20%
- [ ] Cambiar IVA a 10% → guardar → el total refleja el 10%
