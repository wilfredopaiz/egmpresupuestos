# 008 - Hooks con TanStack Query

## Objetivo

Reescribir los hooks de datos usando TanStack Query (ya instalado) + los servicios de Supabase. Esto reemplaza el `projectsStore.ts` y los hooks actuales en `useProjects.ts`.

## Por qué TanStack Query

- Ya está instalado en el proyecto (`@tanstack/react-query`)
- Cache automática con invalidación
- Loading y error states
- Refetch automático
- Mutations con callbacks

## Implementación

### 1. Verificar QueryClientProvider

En `src/App.tsx` o `src/main.tsx`, verificar que ya existe:

```typescript
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

// Envolver la app
<QueryClientProvider client={queryClient}>
  <AuthProvider>
    {/* ... */}
  </AuthProvider>
</QueryClientProvider>
```

### 2. Query keys centralizadas

Crear `src/hooks/queryKeys.ts`:

```typescript
export const queryKeys = {
  projects: {
    all: ["projects"] as const,
    detail: (id: string) => ["projects", id] as const,
  },
  clients: {
    all: ["clients"] as const,
  },
  sections: {
    all: ["sections"] as const,
  },
  templates: {
    all: ["templates"] as const,
    bySection: (sectionId: string) => ["templates", "section", sectionId] as const,
  },
};
```

### 3. Hook de proyectos

Crear `src/hooks/useProjects.ts` (reemplaza el actual):

```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";
import * as projectsService from "@/services/projects.service";
import * as projectItemsService from "@/services/projectItems.service";

export function useProjects() {
  return useQuery({
    queryKey: queryKeys.projects.all,
    queryFn: projectsService.getProjects,
  });
}

export function useProject(id: string | null) {
  return useQuery({
    queryKey: queryKeys.projects.detail(id!),
    queryFn: () => projectsService.getProjectById(id!),
    enabled: !!id,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: projectsService.createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Parameters<typeof projectsService.updateProject>[1] }) =>
      projectsService.updateProject(id, updates),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.detail(id) });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: projectsService.deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
    },
  });
}

export function useAddProjectItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: projectItemsService.addItemToProject,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.detail(variables.project_id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
    },
  });
}

export function useUpdateProjectItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Parameters<typeof projectItemsService.updateProjectItem>[1] }) =>
      projectItemsService.updateProjectItem(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
    },
  });
}

export function useRemoveProjectItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: projectItemsService.removeProjectItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
    },
  });
}
```

### 4. Hook de clientes

Crear `src/hooks/useClients.ts`:

```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";
import * as clientsService from "@/services/clients.service";

export function useClients() {
  return useQuery({
    queryKey: queryKeys.clients.all,
    queryFn: clientsService.getClients,
  });
}

export function useCreateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clientsService.createClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.all });
    },
  });
}

export function useUpdateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Parameters<typeof clientsService.updateClient>[1] }) =>
      clientsService.updateClient(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.all });
    },
  });
}

export function useDeleteClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clientsService.deleteClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.all });
    },
  });
}
```

### 5. Hook de secciones y plantillas

Crear `src/hooks/useSections.ts`:

```typescript
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";
import * as sectionsService from "@/services/sections.service";
import * as templatesService from "@/services/templates.service";

export function useSections() {
  return useQuery({
    queryKey: queryKeys.sections.all,
    queryFn: sectionsService.getSections,
  });
}

export function useTemplates() {
  return useQuery({
    queryKey: queryKeys.templates.all,
    queryFn: templatesService.getTemplates,
  });
}

export function useTemplatesBySection(sectionId: string | null) {
  return useQuery({
    queryKey: queryKeys.templates.bySection(sectionId!),
    queryFn: () => templatesService.getTemplatesBySection(sectionId!),
    enabled: !!sectionId,
  });
}
```

## Cambios en la API de los hooks

### Antes (store reactivo)

```typescript
const { projects } = useProjects();
const { project } = useProject(id);
const { createProject, updateProject } = useProjectActions();

createProject({ name, client, notes });
updateProject(id, { status: "aprobado" });
```

### Después (TanStack Query)

```typescript
const { data: projects, isLoading, error } = useProjects();
const { data: project, isLoading } = useProject(id);
const createProject = useCreateProject();
const updateProject = useUpdateProject();

createProject.mutate({ name, client_name, notes });
updateProject.mutate({ id, updates: { status: "aprobado" } });
```

> **Nota**: Las páginas necesitarán actualizarse para usar la nueva API (loading states, error handling, `.mutate()`, etc.). Esto se hace en la task 009.

## Archivos creados/modificados

- `src/hooks/queryKeys.ts` (nuevo)
- `src/hooks/useProjects.ts` (reescrito completamente)
- `src/hooks/useClients.ts` (nuevo)
- `src/hooks/useSections.ts` (nuevo)

## Dependencias

- Task 007 completada (servicios Supabase)
