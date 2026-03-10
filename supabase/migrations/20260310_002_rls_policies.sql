-- ============================================
-- EGM Presupuestos - RLS policies (Task 003)
-- ============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.item_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_items ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PROFILES
-- ============================================
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- ============================================
-- CLIENTS
-- ============================================
CREATE POLICY "clients_select_own"
  ON public.clients FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "clients_insert_own"
  ON public.clients FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "clients_update_own"
  ON public.clients FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "clients_delete_own"
  ON public.clients FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================
-- SECTIONS (catalogo global + personalizadas)
-- ============================================
CREATE POLICY "sections_select"
  ON public.sections FOR SELECT
  TO authenticated
  USING (user_id IS NULL OR user_id = auth.uid());

CREATE POLICY "sections_insert_own"
  ON public.sections FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "sections_update_own"
  ON public.sections FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "sections_delete_own"
  ON public.sections FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================
-- ITEM_TEMPLATES (catalogo global + personalizadas)
-- ============================================
CREATE POLICY "item_templates_select"
  ON public.item_templates FOR SELECT
  TO authenticated
  USING (user_id IS NULL OR user_id = auth.uid());

CREATE POLICY "item_templates_insert_own"
  ON public.item_templates FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "item_templates_update_own"
  ON public.item_templates FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "item_templates_delete_own"
  ON public.item_templates FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================
-- PROJECTS
-- ============================================
CREATE POLICY "projects_select_own"
  ON public.projects FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "projects_insert_own"
  ON public.projects FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "projects_update_own"
  ON public.projects FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "projects_delete_own"
  ON public.projects FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================
-- PROJECT_ITEMS
-- ============================================
CREATE POLICY "project_items_select_own"
  ON public.project_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.projects
      WHERE projects.id = project_items.project_id
        AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "project_items_insert_own"
  ON public.project_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.projects
      WHERE projects.id = project_items.project_id
        AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "project_items_update_own"
  ON public.project_items FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.projects
      WHERE projects.id = project_items.project_id
        AND projects.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.projects
      WHERE projects.id = project_items.project_id
        AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "project_items_delete_own"
  ON public.project_items FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.projects
      WHERE projects.id = project_items.project_id
        AND projects.user_id = auth.uid()
    )
  );
