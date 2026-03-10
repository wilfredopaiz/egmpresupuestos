# 003 - Row Level Security (RLS)

## Objetivo

Habilitar RLS en todas las tablas y crear las políticas de acceso. Cada usuario solo puede ver y modificar sus propios datos.

## Principios

- **Todo bloqueado por defecto** - RLS habilitado = sin políticas = sin acceso
- **Datos catálogo** (sections, item_templates con `user_id IS NULL`) - lectura para todos los autenticados
- **Datos privados** (clients, projects, project_items) - solo el propietario
- **profiles** - cada usuario solo ve/edita su perfil

## Migración SQL

Ejecutar en **Supabase Dashboard → SQL Editor**:

```sql
-- ============================================
-- RLS - Row Level Security
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

-- Cada usuario puede ver su propio perfil
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- Cada usuario puede actualizar su propio perfil
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- ============================================
-- CLIENTS
-- ============================================

-- Ver solo mis clientes
CREATE POLICY "clients_select_own"
  ON public.clients FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Insertar clientes con mi user_id
CREATE POLICY "clients_insert_own"
  ON public.clients FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Actualizar solo mis clientes
CREATE POLICY "clients_update_own"
  ON public.clients FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Eliminar solo mis clientes
CREATE POLICY "clients_delete_own"
  ON public.clients FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================
-- SECTIONS (catálogo global + personalizadas)
-- ============================================

-- Todos los autenticados pueden ver secciones globales (user_id IS NULL) y las suyas
CREATE POLICY "sections_select"
  ON public.sections FOR SELECT
  TO authenticated
  USING (user_id IS NULL OR user_id = auth.uid());

-- Insertar solo secciones propias
CREATE POLICY "sections_insert_own"
  ON public.sections FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Actualizar solo secciones propias (no las globales)
CREATE POLICY "sections_update_own"
  ON public.sections FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Eliminar solo secciones propias
CREATE POLICY "sections_delete_own"
  ON public.sections FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================
-- ITEM_TEMPLATES (catálogo global + personalizadas)
-- ============================================

-- Ver plantillas globales y propias
CREATE POLICY "item_templates_select"
  ON public.item_templates FOR SELECT
  TO authenticated
  USING (user_id IS NULL OR user_id = auth.uid());

-- Insertar solo plantillas propias
CREATE POLICY "item_templates_insert_own"
  ON public.item_templates FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Actualizar solo plantillas propias
CREATE POLICY "item_templates_update_own"
  ON public.item_templates FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Eliminar solo plantillas propias
CREATE POLICY "item_templates_delete_own"
  ON public.item_templates FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================
-- PROJECTS
-- ============================================

-- Ver solo mis proyectos
CREATE POLICY "projects_select_own"
  ON public.projects FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Insertar proyectos con mi user_id
CREATE POLICY "projects_insert_own"
  ON public.projects FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Actualizar solo mis proyectos
CREATE POLICY "projects_update_own"
  ON public.projects FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Eliminar solo mis proyectos
CREATE POLICY "projects_delete_own"
  ON public.projects FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================
-- PROJECT_ITEMS
-- ============================================

-- Ver partidas de mis proyectos
CREATE POLICY "project_items_select_own"
  ON public.project_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_items.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Insertar partidas en mis proyectos
CREATE POLICY "project_items_insert_own"
  ON public.project_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_items.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Actualizar partidas de mis proyectos
CREATE POLICY "project_items_update_own"
  ON public.project_items FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_items.project_id
      AND projects.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_items.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Eliminar partidas de mis proyectos
CREATE POLICY "project_items_delete_own"
  ON public.project_items FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_items.project_id
      AND projects.user_id = auth.uid()
    )
  );
```

## Verificación

1. En **Authentication → Policies**, verificar que cada tabla tiene sus políticas
2. Intentar hacer un SELECT desde el SQL Editor sin estar autenticado → debe devolver vacío
3. Crear un usuario de prueba y verificar que solo ve sus datos

## Archivos modificados

- Ninguno (solo cambios en Supabase)

## Dependencias

- Task 002 completada (tablas creadas)
