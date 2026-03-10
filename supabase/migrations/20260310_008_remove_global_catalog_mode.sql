-- ============================================
-- EGM Presupuestos - Eliminar modo catalogo global
-- ============================================

-- El modelo pasa a "secciones y partidas" sin catalogo global.
-- Migramos filas legacy con user_id NULL asignandolas al primer perfil disponible.
DO $$
DECLARE
  v_owner uuid;
BEGIN
  SELECT id
  INTO v_owner
  FROM public.profiles
  ORDER BY created_at ASC
  LIMIT 1;

  IF v_owner IS NOT NULL THEN
    UPDATE public.sections
    SET user_id = v_owner
    WHERE user_id IS NULL;

    UPDATE public.item_templates
    SET user_id = v_owner
    WHERE user_id IS NULL;
  END IF;
END;
$$;

COMMENT ON COLUMN public.sections.user_id IS 'Usuario creador de la seccion (auditoria)';
COMMENT ON COLUMN public.item_templates.user_id IS 'Usuario creador de la plantilla (auditoria)';
