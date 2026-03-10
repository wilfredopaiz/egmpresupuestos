# 004 - Corregir RLS a modelo single-tenant

## Problema

Las políticas RLS actuales filtran por `user_id = auth.uid()` en todas las tablas (clients, projects, sections, item_templates, project_items). Esto hace que cada usuario solo vea sus propios datos, como si fuera multi-tenant.

El proyecto es **single-tenant**: una sola empresa, varios usuarios que comparten todo. `user_id` es solo auditoría ("quién lo creó"), no un filtro de acceso.

## Solución

Reemplazar las políticas existentes por políticas `USING (true)` para todos los autenticados. Solo `profiles` mantiene acceso restringido al propio perfil.

---

## 1. Migración SQL

```sql
-- 004_fix_rls_single_tenant.sql

-- ============================================
-- Eliminar políticas antiguas (multi-tenant)
-- ============================================

-- CLIENTS
DROP POLICY IF EXISTS "clients_select_own" ON public.clients;
DROP POLICY IF EXISTS "clients_insert_own" ON public.clients;
DROP POLICY IF EXISTS "clients_update_own" ON public.clients;
DROP POLICY IF EXISTS "clients_delete_own" ON public.clients;

-- SECTIONS
DROP POLICY IF EXISTS "sections_select" ON public.sections;
DROP POLICY IF EXISTS "sections_insert_own" ON public.sections;
DROP POLICY IF EXISTS "sections_update_own" ON public.sections;
DROP POLICY IF EXISTS "sections_delete_own" ON public.sections;

-- ITEM_TEMPLATES
DROP POLICY IF EXISTS "item_templates_select" ON public.item_templates;
DROP POLICY IF EXISTS "item_templates_insert_own" ON public.item_templates;
DROP POLICY IF EXISTS "item_templates_update_own" ON public.item_templates;
DROP POLICY IF EXISTS "item_templates_delete_own" ON public.item_templates;

-- PROJECTS
DROP POLICY IF EXISTS "projects_select_own" ON public.projects;
DROP POLICY IF EXISTS "projects_insert_own" ON public.projects;
DROP POLICY IF EXISTS "projects_update_own" ON public.projects;
DROP POLICY IF EXISTS "projects_delete_own" ON public.projects;

-- PROJECT_ITEMS
DROP POLICY IF EXISTS "project_items_select_own" ON public.project_items;
DROP POLICY IF EXISTS "project_items_insert_own" ON public.project_items;
DROP POLICY IF EXISTS "project_items_update_own" ON public.project_items;
DROP POLICY IF EXISTS "project_items_delete_own" ON public.project_items;

-- ============================================
-- Crear políticas nuevas (single-tenant)
-- Autenticado = acceso total
-- ============================================

-- CLIENTS
CREATE POLICY "clients_select_authenticated"
  ON public.clients FOR SELECT TO authenticated USING (true);
CREATE POLICY "clients_insert_authenticated"
  ON public.clients FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "clients_update_authenticated"
  ON public.clients FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "clients_delete_authenticated"
  ON public.clients FOR DELETE TO authenticated USING (true);

-- SECTIONS
CREATE POLICY "sections_select_authenticated"
  ON public.sections FOR SELECT TO authenticated USING (true);
CREATE POLICY "sections_insert_authenticated"
  ON public.sections FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "sections_update_authenticated"
  ON public.sections FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "sections_delete_authenticated"
  ON public.sections FOR DELETE TO authenticated USING (true);

-- ITEM_TEMPLATES
CREATE POLICY "item_templates_select_authenticated"
  ON public.item_templates FOR SELECT TO authenticated USING (true);
CREATE POLICY "item_templates_insert_authenticated"
  ON public.item_templates FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "item_templates_update_authenticated"
  ON public.item_templates FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "item_templates_delete_authenticated"
  ON public.item_templates FOR DELETE TO authenticated USING (true);

-- PROJECTS
CREATE POLICY "projects_select_authenticated"
  ON public.projects FOR SELECT TO authenticated USING (true);
CREATE POLICY "projects_insert_authenticated"
  ON public.projects FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "projects_update_authenticated"
  ON public.projects FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "projects_delete_authenticated"
  ON public.projects FOR DELETE TO authenticated USING (true);

-- PROJECT_ITEMS
CREATE POLICY "project_items_select_authenticated"
  ON public.project_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "project_items_insert_authenticated"
  ON public.project_items FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "project_items_update_authenticated"
  ON public.project_items FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "project_items_delete_authenticated"
  ON public.project_items FOR DELETE TO authenticated USING (true);

-- NOTA: profiles NO se toca — cada usuario sigue viendo solo su propio perfil
```

> No hay cambios en código frontend. Solo SQL en Supabase.

---

## 2. Verificación

- [ ] Crear usuario A y usuario B
- [ ] Usuario A crea un cliente y un proyecto
- [ ] Usuario B puede ver el cliente y el proyecto de usuario A
- [ ] Usuario B puede editar el proyecto de usuario A
- [ ] Cada usuario solo ve su propio perfil en `profiles`
- [ ] Un request sin autenticar no ve nada (RLS sigue activo)
