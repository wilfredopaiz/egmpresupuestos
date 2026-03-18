-- ============================================
-- EGM Presupuestos - Corregir RLS a single-tenant
-- ============================================

-- Profiles sigue aislado por usuario; el resto de tablas
-- se comparte entre todos los usuarios autenticados.

-- CLIENTS
DROP POLICY IF EXISTS "clients_select_own" ON public.clients;
DROP POLICY IF EXISTS "clients_insert_own" ON public.clients;
DROP POLICY IF EXISTS "clients_update_own" ON public.clients;
DROP POLICY IF EXISTS "clients_delete_own" ON public.clients;

CREATE POLICY "clients_select_authenticated"
  ON public.clients FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "clients_insert_authenticated"
  ON public.clients FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "clients_update_authenticated"
  ON public.clients FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "clients_delete_authenticated"
  ON public.clients FOR DELETE
  TO authenticated
  USING (true);

-- SECTIONS
DROP POLICY IF EXISTS "sections_select" ON public.sections;
DROP POLICY IF EXISTS "sections_insert_own" ON public.sections;
DROP POLICY IF EXISTS "sections_update_own" ON public.sections;
DROP POLICY IF EXISTS "sections_delete_own" ON public.sections;

CREATE POLICY "sections_select_authenticated"
  ON public.sections FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "sections_insert_authenticated"
  ON public.sections FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "sections_update_authenticated"
  ON public.sections FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "sections_delete_authenticated"
  ON public.sections FOR DELETE
  TO authenticated
  USING (true);

-- ITEM_TEMPLATES
DROP POLICY IF EXISTS "item_templates_select" ON public.item_templates;
DROP POLICY IF EXISTS "item_templates_insert_own" ON public.item_templates;
DROP POLICY IF EXISTS "item_templates_update_own" ON public.item_templates;
DROP POLICY IF EXISTS "item_templates_delete_own" ON public.item_templates;

CREATE POLICY "item_templates_select_authenticated"
  ON public.item_templates FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "item_templates_insert_authenticated"
  ON public.item_templates FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "item_templates_update_authenticated"
  ON public.item_templates FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "item_templates_delete_authenticated"
  ON public.item_templates FOR DELETE
  TO authenticated
  USING (true);

-- PROJECTS
DROP POLICY IF EXISTS "projects_select_own" ON public.projects;
DROP POLICY IF EXISTS "projects_insert_own" ON public.projects;
DROP POLICY IF EXISTS "projects_update_own" ON public.projects;
DROP POLICY IF EXISTS "projects_delete_own" ON public.projects;

CREATE POLICY "projects_select_authenticated"
  ON public.projects FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "projects_insert_authenticated"
  ON public.projects FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "projects_update_authenticated"
  ON public.projects FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "projects_delete_authenticated"
  ON public.projects FOR DELETE
  TO authenticated
  USING (true);

-- PROJECT_ITEMS
DROP POLICY IF EXISTS "project_items_select_own" ON public.project_items;
DROP POLICY IF EXISTS "project_items_insert_own" ON public.project_items;
DROP POLICY IF EXISTS "project_items_update_own" ON public.project_items;
DROP POLICY IF EXISTS "project_items_delete_own" ON public.project_items;

CREATE POLICY "project_items_select_authenticated"
  ON public.project_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "project_items_insert_authenticated"
  ON public.project_items FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "project_items_update_authenticated"
  ON public.project_items FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "project_items_delete_authenticated"
  ON public.project_items FOR DELETE
  TO authenticated
  USING (true);
