import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";
import * as settingsService from "@/services/settings.service";

export function useAppSettings() {
  return useQuery({
    queryKey: queryKeys.appSettings.one,
    queryFn: settingsService.getAppSettings,
  });
}

export function useUpdateAppSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: settingsService.updateAppSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.appSettings.one });
    },
  });
}
