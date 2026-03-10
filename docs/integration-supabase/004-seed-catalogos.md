# 004 - Seed de datos catálogo

## Objetivo

Insertar los datos de catálogo global (secciones, plantillas de partidas) en Supabase. Estos datos tienen `user_id = NULL` y son visibles para todos los usuarios autenticados.

## Migración SQL

Ejecutar en **Supabase Dashboard → SQL Editor**:

```sql
-- ============================================
-- Seed: Secciones globales
-- ============================================

INSERT INTO public.sections (id, user_id, name, icon, sort_order) VALUES
  (gen_random_uuid(), NULL, 'Albañilería', '🧱', 1),
  (gen_random_uuid(), NULL, 'Pladur', '📐', 2),
  (gen_random_uuid(), NULL, 'Fontanería', '🚿', 3),
  (gen_random_uuid(), NULL, 'Electricidad', '⚡', 4),
  (gen_random_uuid(), NULL, 'Revestimientos', '🪨', 5),
  (gen_random_uuid(), NULL, 'Pintura', '🎨', 6);

-- ============================================
-- Seed: Plantillas de partidas globales
-- Necesitamos referenciar los IDs de las secciones recién creadas
-- ============================================

-- Albañilería
WITH albanileria AS (
  SELECT id FROM public.sections WHERE name = 'Albañilería' AND user_id IS NULL LIMIT 1
)
INSERT INTO public.item_templates (user_id, section_id, name, unit, price_installation, price_supply, has_option, option_label)
SELECT NULL, albanileria.id, t.name, t.unit, t.price_installation, t.price_supply, t.has_option, t.option_label
FROM albanileria, (VALUES
  ('Zanja desagüe',          'ml', 45.00,  NULL,  false, NULL),
  ('Tapiado ventana',        'ud', 120.00, NULL,  false, NULL),
  ('Apertura hueco pared',   'ud', 180.00, NULL,  false, NULL)
) AS t(name, unit, price_installation, price_supply, has_option, option_label);

-- Pladur
WITH pladur AS (
  SELECT id FROM public.sections WHERE name = 'Pladur' AND user_id IS NULL LIMIT 1
)
INSERT INTO public.item_templates (user_id, section_id, name, unit, price_installation, price_supply, has_option, option_label)
SELECT NULL, pladur.id, t.name, t.unit, t.price_installation, t.price_supply, t.has_option, t.option_label
FROM pladur, (VALUES
  ('Tabique pladur sencillo', 'm²', 32.00, NULL, false, NULL),
  ('Falso techo continuo',    'm²', 38.00, NULL, false, NULL)
) AS t(name, unit, price_installation, price_supply, has_option, option_label);

-- Fontanería
WITH fontaneria AS (
  SELECT id FROM public.sections WHERE name = 'Fontanería' AND user_id IS NULL LIMIT 1
)
INSERT INTO public.item_templates (user_id, section_id, name, unit, price_installation, price_supply, has_option, option_label)
SELECT NULL, fontaneria.id, t.name, t.unit, t.price_installation, t.price_supply, t.has_option, t.option_label
FROM fontaneria, (VALUES
  ('Punto de agua',            'ud', 120.00, NULL,   false, NULL),
  ('Punto de desagüe',        'ud', 95.00,  NULL,   false, NULL),
  ('Instalación sanitario',   'ud', 85.00,  150.00, false, NULL)
) AS t(name, unit, price_installation, price_supply, has_option, option_label);

-- Electricidad
WITH electricidad AS (
  SELECT id FROM public.sections WHERE name = 'Electricidad' AND user_id IS NULL LIMIT 1
)
INSERT INTO public.item_templates (user_id, section_id, name, unit, price_installation, price_supply, has_option, option_label)
SELECT NULL, electricidad.id, t.name, t.unit, t.price_installation, t.price_supply, t.has_option, t.option_label
FROM electricidad, (VALUES
  ('Punto de luz',       'ud', 65.00,  NULL, false, NULL),
  ('Toma de corriente',  'ud', 55.00,  NULL, false, NULL),
  ('Cuadro eléctrico',   'ud', 450.00, NULL, false, NULL)
) AS t(name, unit, price_installation, price_supply, has_option, option_label);

-- Revestimientos
WITH revestimientos AS (
  SELECT id FROM public.sections WHERE name = 'Revestimientos' AND user_id IS NULL LIMIT 1
)
INSERT INTO public.item_templates (user_id, section_id, name, unit, price_installation, price_supply, has_option, option_label)
SELECT NULL, revestimientos.id, t.name, t.unit, t.price_installation, t.price_supply, t.has_option, t.option_label
FROM revestimientos, (VALUES
  ('Colocación suelo cerámico', 'm²', 28.00, 22.00, true,  'Incluye escalera'),
  ('Alicatado paredes',         'm²', 30.00, 24.00, false, NULL),
  ('Rodapié cerámico',          'ml', 12.00, 8.00,  false, NULL)
) AS t(name, unit, price_installation, price_supply, has_option, option_label);

-- Pintura
WITH pintura AS (
  SELECT id FROM public.sections WHERE name = 'Pintura' AND user_id IS NULL LIMIT 1
)
INSERT INTO public.item_templates (user_id, section_id, name, unit, price_installation, price_supply, has_option, option_label)
SELECT NULL, pintura.id, t.name, t.unit, t.price_installation, t.price_supply, t.has_option, t.option_label
FROM pintura, (VALUES
  ('Pintura techos y paredes', 'm²', 9.00,  NULL, true,  'Altura > 2.30 m'),
  ('Lacado puertas/marcos',    'ud', 85.00, NULL, false, NULL)
) AS t(name, unit, price_installation, price_supply, has_option, option_label);
```

## Verificación

Verificar en **Table Editor**:

```sql
-- Debe devolver 6 secciones
SELECT * FROM public.sections WHERE user_id IS NULL;

-- Debe devolver 15 plantillas
SELECT it.name, s.name as section_name, it.unit, it.price_installation
FROM public.item_templates it
JOIN public.sections s ON s.id = it.section_id
WHERE it.user_id IS NULL
ORDER BY s.sort_order, it.name;
```

## Nota sobre unidades de medida

Las unidades de medida (`ud`, `m²`, `ml`, `m³`, `kg`, `l`, `h`, `pa`) se mantienen como constantes en el frontend ya que son un catálogo fijo y pequeño. No necesitan tabla propia. Se definen en un archivo de constantes:

```typescript
// src/lib/constants.ts
export const MEASURE_UNITS = [
  { id: "ud", label: "Unidades (ud)" },
  { id: "m2", label: "Metros cuadrados (m²)" },
  { id: "ml", label: "Metros lineales (ml)" },
  { id: "m3", label: "Metros cúbicos (m³)" },
  { id: "kg", label: "Kilogramos (kg)" },
  { id: "l", label: "Litros (l)" },
  { id: "h", label: "Horas (h)" },
  { id: "pa", label: "Partida alzada (pa)" },
] as const;
```

## Archivos creados

- `src/lib/constants.ts` (nuevo - constantes que no van a BD)

## Dependencias

- Task 003 completada (RLS configurado - necesario para que los INSERT funcionen con `user_id IS NULL`)

> **Nota**: Para el seed con `user_id = NULL`, se necesita ejecutar como service_role o temporalmente desactivar RLS en las tablas de catálogo durante el seed. Las políticas RLS requieren `authenticated` para SELECT, pero el seed se ejecuta desde el SQL Editor que usa service_role por defecto, así que funcionará sin problemas.
