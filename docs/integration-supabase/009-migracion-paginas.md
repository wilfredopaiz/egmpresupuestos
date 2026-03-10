# 009 - Migración de páginas

## Objetivo

Actualizar todas las páginas para usar los nuevos hooks de TanStack Query en vez de los mocks. Adaptar a la nueva API (loading/error states, mutations).

## Páginas a migrar

### 1. Dashboard.tsx (`/`)

**Cambios:**
- Reemplazar `useProjects()` → nuevo `useProjects()` con `{ data, isLoading }`
- Añadir skeleton/loading state
- Las funciones de cálculo (`calculateProjectTotal`, etc.) ahora trabajan con datos de Supabase
- Adaptar los campos: `project.items` ahora viene con nested data de Supabase

```typescript
// Antes
const { projects } = useProjects();

// Después
const { data: projects, isLoading } = useProjects();
if (isLoading) return <DashboardSkeleton />;
```

**Helper functions**: Las funciones `calculateItemTotal`, `calculateProjectTotal`, etc. necesitan adaptarse para usar los campos de Supabase (`price_installation` en vez de acceder al template por ID).

Crear `src/lib/calculations.ts`:

```typescript
// Funciones de cálculo que trabajan con datos de Supabase
export function calculateItemTotal(item: {
  quantity: number;
  include_installation: boolean;
  include_supply: boolean;
  template: {
    price_installation: number;
    price_supply: number | null;
  };
}): number {
  let total = 0;
  if (item.include_installation) {
    total += item.template.price_installation * item.quantity;
  }
  if (item.include_supply && item.template.price_supply) {
    total += item.template.price_supply * item.quantity;
  }
  return total;
}

export function calculateProjectTotal(project: { items: Array<Parameters<typeof calculateItemTotal>[0]> }): number {
  return project.items.reduce((sum, item) => sum + calculateItemTotal(item), 0);
}

export function calculateProjectTotalBySection(project: {
  items: Array<Parameters<typeof calculateItemTotal>[0] & { template: { section: { id: string } } }>;
}): Record<string, number> {
  const totals: Record<string, number> = {};
  project.items.forEach((item) => {
    const sectionId = item.template.section.id;
    totals[sectionId] = (totals[sectionId] || 0) + calculateItemTotal(item);
  });
  return totals;
}

// formatCurrency y formatQuantity se mantienen igual, mover aquí desde mockData
```

### 2. Proyectos.tsx (`/proyectos`)

**Cambios:**
- `useProjects()` → nuevo hook con loading state
- `mockClients` → `useClients()` para filtrado
- El campo `project.client` (string) → `project.client?.name` o `project.client_name`

```typescript
// Antes
const { projects } = useProjects();
const filteredByClient = projects.filter(p => p.client === selectedClient);

// Después
const { data: projects, isLoading } = useProjects();
const { data: clients } = useClients();
const filteredByClient = projects?.filter(p =>
  p.client?.name === selectedClient || p.client_name === selectedClient
);
```

### 3. NuevaObra.tsx (`/nueva-obra`)

**Cambios:**
- `useProjectActions()` → `useCreateProject()` mutation
- `mockClients` → `useClients()` para selector
- Adaptar `createProject()` al nuevo formato

```typescript
// Antes
const { createProject } = useProjectActions();
createProject({ name, client: selectedClient, notes });

// Después
const createProject = useCreateProject();
const { data: clients } = useClients();

createProject.mutate(
  { name, client_id: selectedClientId, client_name: clientName, notes },
  { onSuccess: (project) => navigate(`/proyecto/${project.id}`) }
);
```

### 4. ProyectoDetalle.tsx (`/proyecto/:id`)

**Cambios:**
- `useProject(id)` → nuevo hook con loading
- `useProjectActions()` → `useUpdateProject()`, `useAddProjectItem()`, `useRemoveProjectItem()`
- Adaptar acceso a items: `project.items` viene con template nested

```typescript
// Antes
const { project } = useProject(id);
const { updateProject } = useProjectActions();
addItemToProject(id, { templateId, quantity, ... });

// Después
const { data: project, isLoading } = useProject(id);
const updateProject = useUpdateProject();
const addItem = useAddProjectItem();

addItem.mutate({
  project_id: id,
  template_id: templateId,
  quantity,
  include_installation: true,
  include_supply: false,
});
```

### 5. Presupuesto.tsx (`/presupuesto`)

**Cambios:**
- Mismo patrón que ProyectoDetalle
- Cálculos usando `calculateItemTotal` y `calculateProjectTotal` de `calculations.ts`
- Items ya vienen con template data (no necesita `getTemplateById`)

### 6. Partidas.tsx (`/partidas`)

**Cambios:**
- `sections` (import directo) → `useSections()` hook
- `itemTemplates` (import directo) → `useTemplates()` hook
- Añadir loading state

```typescript
// Antes
import { sections, itemTemplates } from "@/data/mockData";

// Después
const { data: sections, isLoading: loadingSections } = useSections();
const { data: templates, isLoading: loadingTemplates } = useTemplates();
```

### 7. SeccionDetalle.tsx (`/partidas/:sectionId`)

**Cambios:**
- `getTemplatesBySection()` → `useTemplatesBySection(sectionId)` hook
- `getSectionById()` → buscar en `useSections()` o hacer query individual

### 8. Ajustes.tsx (`/ajustes`)

**Cambios:**
- Mostrar info del usuario autenticado (`useAuth()`)
- Posibilidad de editar perfil

### 9. AddItemModal (componente)

**Cambios:**
- `sections`, `itemTemplates` → hooks de Supabase
- Adaptar fields al formato de Supabase

## Patrón de loading/error

Usar un componente reutilizable:

```typescript
// En cada página
const { data, isLoading, error } = useProjects();

if (isLoading) return <PageSkeleton />;
if (error) return <ErrorMessage error={error} />;
if (!data) return null;

// ... render normal con data
```

## Archivos creados/modificados

- `src/lib/calculations.ts` (nuevo - funciones de cálculo)
- `src/pages/Dashboard.tsx` (modificado)
- `src/pages/Proyectos.tsx` (modificado)
- `src/pages/NuevaObra.tsx` (modificado)
- `src/pages/ProyectoDetalle.tsx` (modificado)
- `src/pages/Presupuesto.tsx` (modificado)
- `src/pages/Partidas.tsx` (modificado)
- `src/pages/SeccionDetalle.tsx` (modificado)
- `src/pages/Ajustes.tsx` (modificado)
- `src/components/partidas/AddItemModal.tsx` (modificado)

## Dependencias

- Task 008 completada (hooks con TanStack Query)
