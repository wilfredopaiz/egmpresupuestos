import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";
import * as projectsService from "@/services/projects.service";
import * as projectItemsService from "@/services/projectItems.service";

export function useProjects() {
  const query = useQuery({
    queryKey: queryKeys.projects.all,
    queryFn: projectsService.getProjects,
  });

  return {
    ...query,
    projects: query.data ?? [],
  };
}

export function useProject(id: string | null) {
  const query = useQuery({
    queryKey: queryKeys.projects.detail(id ?? ""),
    queryFn: () => projectsService.getProjectById(id!),
    enabled: !!id,
  });

  return {
    ...query,
    project: query.data,
  };
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

// Wrapper temporal para no romper imports actuales antes de la task 009.
export function useProjectActions() {
  const createProjectMutation = useCreateProject();
  const updateProjectMutation = useUpdateProject();

  const createProject = (data: { name: string; client: string; notes?: string }): any =>
    createProjectMutation.mutateAsync({
      name: data.name,
      client_name: data.client,
      notes: data.notes,
    });

  const updateProject = (id: string, updates: any): any =>
    updateProjectMutation.mutateAsync({
      id,
      updates,
    });

  return { createProject, updateProject };
}
