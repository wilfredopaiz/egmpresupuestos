# 002 - Precios snapshot por partida de proyecto

## Problema

`project_items` solo almacena `template_id`, `quantity` y flags (`include_installation`, `include_supply`). Los precios se leen siempre de `item_templates` en tiempo real.

Esto causa dos problemas:

1. **El usuario puede cambiar precios en el modal de añadir/editar partida**, pero ese cambio no se guarda — al recargar vuelve al precio de la plantilla.
2. **Si se modifica el precio de una plantilla en el futuro**, todos los presupuestos existentes se verían afectados retroactivamente, rompiendo la integridad de presupuestos ya entregados.

## Solución

Añadir `price_installation` y `price_supply` a `project_items`. Al insertar una partida, se copian los precios de la plantilla (o los precios personalizados que el usuario haya puesto en el modal). Los cálculos usan siempre los precios de `project_items`, no los de `item_templates`.

---

## 1. Migración SQL

```sql
-- 002_add_prices_to_project_items.sql

ALTER TABLE project_items
  ADD COLUMN price_installation numeric(10,2) NOT NULL DEFAULT 0,
  ADD COLUMN price_supply numeric(10,2);

COMMENT ON COLUMN project_items.price_installation IS 'Precio de instalación snapshot al momento de añadir la partida';
COMMENT ON COLUMN project_items.price_supply IS 'Precio de material snapshot al momento de añadir la partida (null si no aplica)';

-- Migrar datos existentes: copiar precios actuales de las plantillas
UPDATE project_items pi
SET
  price_installation = it.price_installation,
  price_supply = it.price_supply
FROM item_templates it
WHERE pi.template_id = it.id;
```

> No necesita cambios en RLS — `project_items` ya permite CRUD a todos los autenticados.

---

## 2. Cambios en tipos

**`src/types/database.types.ts`** — Añadir a `project_items`:

```typescript
// Row
price_installation: number
price_supply: number | null

// Insert (obligatorio price_installation, opcional price_supply)
price_installation: number
price_supply?: number | null

// Update (opcionales)
price_installation?: number
price_supply?: number | null
```

---

## 3. Cambios en servicios

**`src/services/projectItems.service.ts`**:

- `addItemToProject()` → debe recibir `price_installation` y `price_supply` y guardarlos.
- Lógica al insertar:
  1. Si el usuario personalizó precios en el modal → usar esos.
  2. Si no → copiar de `item_templates` como snapshot.

---

## 4. Cambios en cálculos

**`src/lib/calculations.ts`**:

- `calculateItemTotal(item)` → usar `item.price_installation` y `item.price_supply` directamente en vez de acceder a `item.template.price_*`.
- Esto simplifica el cálculo: ya no necesita hacer join con la plantilla.

```typescript
function calculateItemTotal(item: ProjectItem): number {
  let total = 0;
  if (item.include_installation) {
    total += item.price_installation * item.quantity;
  }
  if (item.include_supply && item.price_supply) {
    total += item.price_supply * item.quantity;
  }
  return total;
}
```

---

## 5. Cambios en UI

### `src/components/partidas/AddItemModal.tsx`

- Al seleccionar una plantilla → cargar sus precios en los inputs (ya lo hace).
- Al guardar → enviar `price_installation` y `price_supply` (los valores del input, sean originales o personalizados).
- En modo edición → cargar los precios guardados en `project_items`, NO los de la plantilla.

### `src/pages/ProyectoDetalle.tsx`

- Las partidas ya no necesitan hacer join con `item_templates` para obtener precios.
- Los precios se leen directamente de cada `project_item`.
- El nombre y unidad de la partida sí se siguen leyendo de la plantilla (o se podrían desnormalizar en el futuro si se necesita).

---

## 6. Verificación

- [ ] Añadir una partida sin cambiar precios → los precios se copian de la plantilla
- [ ] Añadir una partida cambiando el precio de instalación a 999 → guardar → recargar → muestra 999
- [ ] Editar una partida existente → cambiar precio → guardar → precio persiste
- [ ] Cambiar el precio de una plantilla en secciones → los presupuestos existentes NO se ven afectados
- [ ] El total del presupuesto usa los precios de `project_items`, no de `item_templates`
