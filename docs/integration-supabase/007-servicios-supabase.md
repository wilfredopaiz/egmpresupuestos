# 007 - Capa de servicios Supabase

## Objetivo

Crear funciones de acceso a datos que reemplacen las operaciones del `projectsStore.ts`. Cada servicio encapsula las queries a Supabase.

## Estructura

```
src/services/
  ├── clients.service.ts
  ├── sections.service.ts
  ├── templates.service.ts
  ├── projects.service.ts
  └── projectItems.service.ts
```

## Implementación

### 1. Servicio de clientes

`src/services/clients.service.ts`:

```typescript
import { supabase } from "@/lib/supabase";

export async function getClients() {
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .order("name");
  if (error) throw error;
  return data;
}

export async function getClientById(id: string) {
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

export async function createClient(client: { name: string; phone?: string; email?: string }) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  const { data, error } = await supabase
    .from("clients")
    .insert({ ...client, user_id: user.id })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateClient(id: string, updates: { name?: string; phone?: string; email?: string }) {
  const { data, error } = await supabase
    .from("clients")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteClient(id: string) {
  const { error } = await supabase
    .from("clients")
    .delete()
    .eq("id", id);
  if (error) throw error;
}
```

### 2. Servicio de secciones

`src/services/sections.service.ts`:

```typescript
import { supabase } from "@/lib/supabase";

export async function getSections() {
  const { data, error } = await supabase
    .from("sections")
    .select("*")
    .order("sort_order");
  if (error) throw error;
  return data; // Devuelve globales + propias del usuario (gracias a RLS)
}

export async function getSectionById(id: string) {
  const { data, error } = await supabase
    .from("sections")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

export async function createSection(section: { name: string; icon: string; sort_order?: number }) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  const { data, error } = await supabase
    .from("sections")
    .insert({ ...section, user_id: user.id })
    .select()
    .single();
  if (error) throw error;
  return data;
}
```

### 3. Servicio de plantillas

`src/services/templates.service.ts`:

```typescript
import { supabase } from "@/lib/supabase";

export async function getTemplates() {
  const { data, error } = await supabase
    .from("item_templates")
    .select("*, section:sections(id, name, icon)")
    .order("name");
  if (error) throw error;
  return data;
}

export async function getTemplatesBySection(sectionId: string) {
  const { data, error } = await supabase
    .from("item_templates")
    .select("*")
    .eq("section_id", sectionId)
    .order("name");
  if (error) throw error;
  return data;
}

export async function getTemplateById(id: string) {
  const { data, error } = await supabase
    .from("item_templates")
    .select("*, section:sections(id, name, icon)")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

export async function createTemplate(template: {
  section_id: string;
  name: string;
  unit: string;
  price_installation: number;
  price_supply?: number;
  has_option?: boolean;
  option_label?: string;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  const { data, error } = await supabase
    .from("item_templates")
    .insert({ ...template, user_id: user.id })
    .select()
    .single();
  if (error) throw error;
  return data;
}
```

### 4. Servicio de proyectos

`src/services/projects.service.ts`:

```typescript
import { supabase } from "@/lib/supabase";

export async function getProjects() {
  const { data, error } = await supabase
    .from("projects")
    .select(`
      *,
      client:clients(id, name),
      items:project_items(
        *,
        template:item_templates(
          *,
          section:sections(id, name, icon)
        )
      )
    `)
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getProjectById(id: string) {
  const { data, error } = await supabase
    .from("projects")
    .select(`
      *,
      client:clients(id, name),
      items:project_items(
        *,
        template:item_templates(
          *,
          section:sections(id, name, icon)
        )
      )
    `)
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

export async function createProject(project: {
  name: string;
  client_id?: string;
  client_name?: string;
  notes?: string;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  const { data, error } = await supabase
    .from("projects")
    .insert({
      ...project,
      user_id: user.id,
      status: "en-medicion",
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateProject(id: string, updates: {
  name?: string;
  client_id?: string;
  client_name?: string;
  status?: string;
  notes?: string;
}) {
  const { data, error } = await supabase
    .from("projects")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteProject(id: string) {
  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", id);
  if (error) throw error;
}
```

### 5. Servicio de partidas del proyecto

`src/services/projectItems.service.ts`:

```typescript
import { supabase } from "@/lib/supabase";

export async function addItemToProject(item: {
  project_id: string;
  template_id: string;
  quantity: number;
  include_installation: boolean;
  include_supply: boolean;
  option_enabled?: boolean;
  notes?: string;
}) {
  const { data, error } = await supabase
    .from("project_items")
    .insert(item)
    .select(`
      *,
      template:item_templates(
        *,
        section:sections(id, name, icon)
      )
    `)
    .single();
  if (error) throw error;
  return data;
}

export async function updateProjectItem(id: string, updates: {
  quantity?: number;
  include_installation?: boolean;
  include_supply?: boolean;
  option_enabled?: boolean;
  notes?: string;
}) {
  const { data, error } = await supabase
    .from("project_items")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function removeProjectItem(id: string) {
  const { error } = await supabase
    .from("project_items")
    .delete()
    .eq("id", id);
  if (error) throw error;
}
```

## Archivos creados

- `src/services/clients.service.ts`
- `src/services/sections.service.ts`
- `src/services/templates.service.ts`
- `src/services/projects.service.ts`
- `src/services/projectItems.service.ts`

## Dependencias

- Task 001 (cliente Supabase)
- Task 002 (tablas creadas)
- Task 003 (RLS configurado)
