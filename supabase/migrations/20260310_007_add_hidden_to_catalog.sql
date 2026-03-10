-- ============================================
-- EGM Presupuestos - Ocultar secciones/plantillas (Task 006)
-- ============================================

ALTER TABLE public.sections
  ADD COLUMN hidden boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN public.sections.hidden IS 'Si true, la seccion no aparece en la UI pero no se borra';

ALTER TABLE public.item_templates
  ADD COLUMN hidden boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN public.item_templates.hidden IS 'Si true, la plantilla no aparece en la UI pero no se borra';
