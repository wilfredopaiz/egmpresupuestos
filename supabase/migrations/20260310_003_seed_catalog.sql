-- ============================================
-- EGM Presupuestos - Seed catalogo global (Task 004)
-- ============================================
-- Nota: este seed esta pensado para ejecutarse desde SQL Editor (service_role).
-- Es idempotente: no duplica filas si se ejecuta varias veces.

-- ============================================
-- Seed: Secciones globales (user_id IS NULL)
-- ============================================
INSERT INTO public.sections (user_id, name, icon, sort_order)
SELECT v.user_id, v.name, v.icon, v.sort_order
FROM (
  VALUES
    (NULL::uuid, 'Albañilería', '🧱', 1),
    (NULL::uuid, 'Pladur', '📐', 2),
    (NULL::uuid, 'Fontanería', '🚿', 3),
    (NULL::uuid, 'Electricidad', '⚡', 4),
    (NULL::uuid, 'Revestimientos', '🪨', 5),
    (NULL::uuid, 'Pintura', '🎨', 6)
) AS v(user_id, name, icon, sort_order)
WHERE NOT EXISTS (
  SELECT 1
  FROM public.sections s
  WHERE s.user_id IS NULL
    AND s.name = v.name
);

-- ============================================
-- Seed: Plantillas de partidas globales
-- ============================================
WITH template_seed AS (
  SELECT *
  FROM (
    VALUES
      ('Albañilería', 'Zanja desagüe', 'ml', 45.00::numeric, NULL::numeric, false, NULL::text),
      ('Albañilería', 'Tapiado ventana', 'ud', 120.00::numeric, NULL::numeric, false, NULL::text),
      ('Albañilería', 'Apertura hueco pared', 'ud', 180.00::numeric, NULL::numeric, false, NULL::text),
      ('Pladur', 'Tabique pladur sencillo', 'm²', 32.00::numeric, NULL::numeric, false, NULL::text),
      ('Pladur', 'Falso techo continuo', 'm²', 38.00::numeric, NULL::numeric, false, NULL::text),
      ('Fontanería', 'Punto de agua', 'ud', 120.00::numeric, NULL::numeric, false, NULL::text),
      ('Fontanería', 'Punto de desagüe', 'ud', 95.00::numeric, NULL::numeric, false, NULL::text),
      ('Fontanería', 'Instalación sanitario', 'ud', 85.00::numeric, 150.00::numeric, false, NULL::text),
      ('Electricidad', 'Punto de luz', 'ud', 65.00::numeric, NULL::numeric, false, NULL::text),
      ('Electricidad', 'Toma de corriente', 'ud', 55.00::numeric, NULL::numeric, false, NULL::text),
      ('Electricidad', 'Cuadro eléctrico', 'ud', 450.00::numeric, NULL::numeric, false, NULL::text),
      ('Revestimientos', 'Colocación suelo cerámico', 'm²', 28.00::numeric, 22.00::numeric, true, 'Incluye escalera'::text),
      ('Revestimientos', 'Alicatado paredes', 'm²', 30.00::numeric, 24.00::numeric, false, NULL::text),
      ('Revestimientos', 'Rodapié cerámico', 'ml', 12.00::numeric, 8.00::numeric, false, NULL::text),
      ('Pintura', 'Pintura techos y paredes', 'm²', 9.00::numeric, NULL::numeric, true, 'Altura > 2.30 m'::text),
      ('Pintura', 'Lacado puertas/marcos', 'ud', 85.00::numeric, NULL::numeric, false, NULL::text)
  ) AS t(section_name, name, unit, price_installation, price_supply, has_option, option_label)
)
INSERT INTO public.item_templates (
  user_id,
  section_id,
  name,
  unit,
  price_installation,
  price_supply,
  has_option,
  option_label
)
SELECT
  NULL AS user_id,
  s.id AS section_id,
  t.name,
  t.unit,
  t.price_installation,
  t.price_supply,
  t.has_option,
  t.option_label
FROM template_seed t
JOIN public.sections s
  ON s.user_id IS NULL
 AND s.name = t.section_name
LEFT JOIN public.item_templates it
  ON it.user_id IS NULL
 AND it.section_id = s.id
 AND it.name = t.name
WHERE it.id IS NULL;
