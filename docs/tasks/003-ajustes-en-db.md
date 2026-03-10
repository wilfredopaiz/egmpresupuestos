# 003 - Persistir ajustes en base de datos

## Problema

La página de Ajustes (`/ajustes`) muestra campos editables para datos de empresa, valores por defecto y unidades de medida. Pero todo es demo: el botón "Guardar" solo muestra un toast. Nada se persiste.

## Solución

Crear una tabla `app_settings` con una **única fila global** (single-tenant). Los ajustes de empresa, defaults de IVA/margen y unidades personalizadas se guardan ahí y son compartidos por todos los usuarios.

---

## 1. Migración SQL

```sql
-- 003_create_app_settings.sql

CREATE TABLE app_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  settings jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- RLS: cualquier autenticado puede leer y escribir
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "app_settings_select_authenticated"
  ON app_settings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "app_settings_update_authenticated"
  ON app_settings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Solo insert si no hay filas (protección contra duplicados)
CREATE POLICY "app_settings_insert_authenticated"
  ON app_settings FOR INSERT
  TO authenticated
  WITH CHECK (
    NOT EXISTS (SELECT 1 FROM app_settings)
  );

-- Trigger updated_at
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON app_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Insertar fila inicial con defaults
INSERT INTO app_settings (settings) VALUES ('{
  "company": {
    "name": "",
    "cif": "",
    "address": "",
    "phone": "",
    "email": ""
  },
  "defaults": {
    "iva_percentage": 21,
    "margin_percentage": 15,
    "budget_validity_days": 30
  },
  "custom_units": []
}'::jsonb);

COMMENT ON TABLE app_settings IS 'Ajustes globales de la app (single-tenant): datos empresa, defaults, unidades';
```

---

## 2. Estructura del JSON `settings`

```jsonc
{
  "company": {
    "name": "EGM Reformas S.L.",
    "cif": "B12345678",
    "address": "C/ Valencia, 45 - 46001 Valencia",
    "phone": "600 123 456",
    "email": "info@egmreformas.es"
  },
  "defaults": {
    "iva_percentage": 21,
    "margin_percentage": 15,
    "budget_validity_days": 30
  },
  "custom_units": [
    // Unidades extra además de las base (ud, m2, ml...) de constants.ts
    { "id": "rollo", "label": "Rollos" }
  ]
}
```

> Se usa JSONB para flexibilidad. Si en el futuro se necesitan más ajustes, se añaden al JSON sin migración.

---

## 3. Cambios en tipos

**`src/types/database.types.ts`** — Nueva interfaz:

```typescript
interface AppSettings {
  id: string;
  settings: {
    company?: {
      name?: string;
      cif?: string;
      address?: string;
      phone?: string;
      email?: string;
    };
    defaults?: {
      iva_percentage?: number;
      margin_percentage?: number;
      budget_validity_days?: number;
    };
    custom_units?: Array<{ id: string; label: string }>;
  };
  created_at: string;
  updated_at: string;
}
```

---

## 4. Nuevo servicio

**`src/services/settings.service.ts`**:

```typescript
// getAppSettings() → SELECT la única fila de app_settings
// updateAppSettings(settings) → UPDATE la única fila
```

No necesita `upsert` — la fila se crea con la migración. Solo `UPDATE`.

---

## 5. Nuevo hook

**`src/hooks/useAppSettings.ts`**:

```typescript
// useAppSettings() → { data, isLoading }
//   Query: getAppSettings()
//
// useUpdateAppSettings() → mutation
//   Mutate: updateAppSettings(newSettings)
//   onSuccess: invalidate query
```

---

## 6. Cambios en UI

### `src/pages/Ajustes.tsx`

- Al montar → cargar `useAppSettings()`.
- Rellenar los inputs con los valores de DB (fallback a defaults hardcoded).
- Botón "Guardar" → llamar `useUpdateAppSettings()` con los valores del formulario.
- Eliminar los toasts de "demo".
- Para unidades personalizadas: añadir/editar/eliminar modifica `settings.custom_units` y hace update.

### `src/pages/ProyectoDetalle.tsx` (o donde se cree un proyecto nuevo)

- Al crear un proyecto → leer `appSettings.defaults.iva_percentage` y `appSettings.defaults.margin_percentage` para usar como valores iniciales de `include_iva`, `iva_percentage` y `margin_percentage` del proyecto (de la task 001).

### `src/components/partidas/AddItemModal.tsx`

- Las unidades disponibles = `BASE_UNITS` de constants.ts + `appSettings.custom_units`.

---

## 7. Verificación

- [ ] Primera carga → la fila ya existe con defaults → la UI muestra IVA 21%, margen 15%
- [ ] Guardar datos de empresa → recargar → los datos persisten
- [ ] Cambiar IVA default a 10% → crear proyecto nuevo → el proyecto se crea con IVA 10%
- [ ] Añadir unidad personalizada "Rollos" → aparece en el selector de unidades al crear plantilla
- [ ] Eliminar unidad personalizada → desaparece del selector
- [ ] Segundo usuario ve los mismos ajustes (son globales)
