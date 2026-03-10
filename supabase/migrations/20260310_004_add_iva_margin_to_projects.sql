-- ============================================
-- EGM Presupuestos - IVA y margen por proyecto (Task 001)
-- ============================================

ALTER TABLE public.projects
  ADD COLUMN include_iva boolean NOT NULL DEFAULT true,
  ADD COLUMN iva_percentage numeric(5,2) NOT NULL DEFAULT 21.00,
  ADD COLUMN margin_percentage numeric(5,2) NOT NULL DEFAULT 15.00;

COMMENT ON COLUMN public.projects.include_iva IS 'Si el proyecto incluye IVA en el total';
COMMENT ON COLUMN public.projects.iva_percentage IS 'Porcentaje de IVA aplicado (ej: 21.00)';
COMMENT ON COLUMN public.projects.margin_percentage IS 'Porcentaje de margen de beneficio (ej: 15.00)';
