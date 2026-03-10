-- ============================================
-- EGM Presupuestos - Adjuntos por proyecto (Task 008)
-- ============================================

CREATE TABLE public.project_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id),
  storage_path text NOT NULL,
  filename text NOT NULL,
  mime_type text NOT NULL,
  size_bytes int NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_project_attachments_project_id
  ON public.project_attachments(project_id);

ALTER TABLE public.project_attachments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "attachments_select_authenticated"
  ON public.project_attachments FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "attachments_insert_authenticated"
  ON public.project_attachments FOR INSERT
  TO authenticated WITH CHECK (true);

CREATE POLICY "attachments_delete_authenticated"
  ON public.project_attachments FOR DELETE
  TO authenticated USING (true);

COMMENT ON TABLE public.project_attachments IS 'Metadatos de archivos adjuntos por proyecto. El archivo fisico vive en el bucket "adjuntos" de Storage.';
