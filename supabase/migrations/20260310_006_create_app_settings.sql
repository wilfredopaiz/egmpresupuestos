-- ============================================
-- EGM Presupuestos - Persistir ajustes en DB (Task 003)
-- ============================================

CREATE TABLE public.app_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  settings jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "app_settings_select_authenticated"
  ON public.app_settings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "app_settings_update_authenticated"
  ON public.app_settings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "app_settings_insert_authenticated"
  ON public.app_settings FOR INSERT
  TO authenticated
  WITH CHECK (
    NOT EXISTS (SELECT 1 FROM public.app_settings)
  );

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.app_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

INSERT INTO public.app_settings (settings) VALUES ('{
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

COMMENT ON TABLE public.app_settings IS 'Ajustes globales de la app (single-tenant): datos empresa, defaults, unidades';
