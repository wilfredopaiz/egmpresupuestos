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
    queryKey: queryKeys.templates.bySection(sectionId ?? ""),
    queryFn: () => templatesService.getTemplatesBySection(sectionId!),
    enabled: !!sectionId,
  });
}
