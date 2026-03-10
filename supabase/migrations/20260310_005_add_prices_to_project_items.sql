-- ============================================
-- EGM Presupuestos - Precios snapshot por partida (Task 002)
-- ============================================

ALTER TABLE public.project_items
  ADD COLUMN price_installation numeric(10,2) NOT NULL DEFAULT 0,
  ADD COLUMN price_supply numeric(10,2);

COMMENT ON COLUMN public.project_items.price_installation IS 'Precio de instalacion snapshot al momento de anadir la partida';
COMMENT ON COLUMN public.project_items.price_supply IS 'Precio de material snapshot al momento de anadir la partida (null si no aplica)';

UPDATE public.project_items pi
SET
  price_installation = it.price_installation,
  price_supply = it.price_supply
FROM public.item_templates it
WHERE pi.template_id = it.id;
