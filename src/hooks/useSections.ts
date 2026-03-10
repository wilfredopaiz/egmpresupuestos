import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";
import * as sectionsService from "@/services/sections.service";
import * as templatesService from "@/services/templates.service";

export function useSections(includeHidden = false) {
  return useQuery({
    queryKey: [...queryKeys.sections.all, { includeHidden }],
    queryFn: () => sectionsService.getSections(includeHidden),
  });
}

export function useTemplates(includeHidden = false) {
  return useQuery({
    queryKey: [...queryKeys.templates.all, { includeHidden }],
    queryFn: () => templatesService.getTemplates(includeHidden),
  });
}

export function useTemplatesBySection(sectionId: string | null, includeHidden = false) {
  return useQuery({
    queryKey: [...queryKeys.templates.bySection(sectionId ?? ""), { includeHidden }],
    queryFn: () => templatesService.getTemplatesBySection(sectionId!, includeHidden),
    enabled: !!sectionId,
  });
}

export function useCreateSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sectionsService.createSection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sections.all });
    },
  });
}

export function useUpdateSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: sectionsService.SectionUpdate }) =>
      sectionsService.updateSection(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sections.all });
    },
  });
}

export function useToggleSectionHidden() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, hidden }: { id: string; hidden: boolean }) =>
      sectionsService.toggleSectionHidden(id, hidden),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sections.all });
    },
  });
}

export function useCreateTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: templatesService.createTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.templates.all });
      queryClient.invalidateQueries({ queryKey: ["templates", "section"] });
    },
  });
}

export function useUpdateTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: templatesService.ItemTemplateUpdate }) =>
      templatesService.updateTemplate(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.templates.all });
      queryClient.invalidateQueries({ queryKey: ["templates", "section"] });
    },
  });
}

export function useToggleTemplateHidden() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, hidden }: { id: string; hidden: boolean }) =>
      templatesService.toggleTemplateHidden(id, hidden),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.templates.all });
      queryClient.invalidateQueries({ queryKey: ["templates", "section"] });
    },
  });
}
