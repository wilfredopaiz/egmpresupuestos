-- ============================================
-- EGM Presupuestos - Migracion completa (Task 002)
-- ============================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Enum para estados de proyecto
CREATE TYPE public.project_status AS ENUM (
  'en-medicion',
  'presupuestado',
  'aprobado',
  'en-obra',
  'finalizado'
);

-- 2. Tabla de perfiles (extiende auth.users)
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  email text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- 3. Tabla de clientes
CREATE TABLE public.clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  phone text,
  email text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- 4. Tabla de secciones
-- user_id NULL = catalogo global, user_id NOT NULL = seccion personalizada del usuario
CREATE TABLE public.sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  icon text NOT NULL DEFAULT '🔧',
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- 5. Tabla de plantillas de partidas
-- user_id NULL = catalogo global, user_id NOT NULL = plantilla personalizada
CREATE TABLE public.item_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  section_id uuid NOT NULL REFERENCES public.sections(id) ON DELETE CASCADE,
  name text NOT NULL,
  unit text NOT NULL DEFAULT 'ud',
  price_installation numeric(10,2) NOT NULL DEFAULT 0,
  price_supply numeric(10,2),
  has_option boolean DEFAULT false,
  option_label text,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- 6. Tabla de proyectos
CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  client_id uuid REFERENCES public.clients(id) ON DELETE SET NULL,
  client_name text,
  status public.project_status NOT NULL DEFAULT 'en-medicion',
  notes text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- 7. Tabla de partidas del proyecto
CREATE TABLE public.project_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  template_id uuid NOT NULL REFERENCES public.item_templates(id) ON DELETE RESTRICT,
  quantity numeric(10,2) NOT NULL DEFAULT 0,
  include_installation boolean NOT NULL DEFAULT true,
  include_supply boolean NOT NULL DEFAULT false,
  option_enabled boolean DEFAULT false,
  notes text,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- ============================================
-- Indices
-- ============================================
CREATE INDEX idx_clients_user_id ON public.clients(user_id);
CREATE INDEX idx_sections_user_id ON public.sections(user_id);
CREATE INDEX idx_item_templates_section_id ON public.item_templates(section_id);
CREATE INDEX idx_item_templates_user_id ON public.item_templates(user_id);
CREATE INDEX idx_projects_user_id ON public.projects(user_id);
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_project_items_project_id ON public.project_items(project_id);
CREATE INDEX idx_project_items_template_id ON public.project_items(template_id);

-- ============================================
-- Funcion para updated_at automatico
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers de updated_at
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.clients
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.project_items
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- Trigger para crear perfil automaticamente al registrarse
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
