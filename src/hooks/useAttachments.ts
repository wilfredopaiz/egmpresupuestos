import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";
import * as attachmentsService from "@/services/attachments.service";

export function useAttachments(projectId: string | null) {
  return useQuery({
    queryKey: queryKeys.attachments.byProject(projectId ?? ""),
    queryFn: () => attachmentsService.getAttachments(projectId!),
    enabled: !!projectId,
  });
}

export function useUploadAttachment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, file }: { projectId: string; file: File }) =>
      attachmentsService.uploadAttachment(projectId, file),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.attachments.byProject(variables.projectId) });
    },
  });
}

export function useDeleteAttachment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, attachment }: { projectId: string; attachment: attachmentsService.ProjectAttachment }) =>
      attachmentsService.deleteAttachment(attachment),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.attachments.byProject(variables.projectId) });
    },
  });
}
