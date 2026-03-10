import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
