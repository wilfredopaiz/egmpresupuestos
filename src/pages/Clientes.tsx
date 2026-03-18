import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { ClientCard } from "@/components/clients/ClientCard";
import { ClientFormModal } from "@/components/clients/ClientFormModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useClients } from "@/hooks/useClients";
import { useProjects } from "@/hooks/useProjects";
import { PlusCircle, Search, Users } from "lucide-react";
import type { Client } from "@/types";

export default function Clientes() {
  const navigate = useNavigate();
  const { data: clients = [], isLoading, error } = useClients();
  const { projects } = useProjects();

  const [searchTerm, setSearchTerm] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  // const [deletingClient, setDeletingClient] = useState<Client | null>(null);

  const projectCountByClient = useMemo(() => {
    return projects.reduce((acc, project: any) => {
      if (project.client_id) acc[project.client_id] = (acc[project.client_id] ?? 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [projects]);

  const filteredClients = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return clients;

    return clients.filter((client) => {
      const name = client.name?.toLowerCase() ?? "";
      const phone = client.phone?.toLowerCase() ?? "";
      const email = client.email?.toLowerCase() ?? "";
      return name.includes(term) || phone.includes(term) || email.includes(term);
    });
  }, [clients, searchTerm]);

  const openCreateModal = () => {
    setEditingClient(null);
    setFormOpen(true);
  };

  const openEditModal = (client: Client) => {
    setEditingClient(client);
    setFormOpen(true);
  };

  // const confirmDelete = () => {
  //   if (!deletingClient) return;
  //
  //   deleteClient.mutate(deletingClient.id, {
  //     onSuccess: () => {
  //       toast({
  //         title: "Cliente eliminado",
  //         description: `"${deletingClient.name}" se ha eliminado correctamente`,
  //       });
  //       setDeletingClient(null);
  //     },
  //     onError: () => {
  //       toast({
  //         title: "Error",
  //         description: "No se pudo eliminar el cliente",
  //         variant: "destructive",
  //       });
  //     },
  //   });
  // };

  if (isLoading) {
    return (
      <AppLayout title="Clientes">
        <p className="text-muted-foreground">Cargando clientes...</p>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout title="Clientes">
        <p className="text-destructive">No se pudieron cargar los clientes.</p>
      </AppLayout>
    );
  }

  const hasClients = clients.length > 0;
  const hasResults = filteredClients.length > 0;

  return (
    <AppLayout title="Clientes">
      <div className="space-y-4 w-full">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold">Clientes</h2>
            <p className="text-sm text-muted-foreground">
              {filteredClients.length} cliente{filteredClients.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Button variant="action" size="sm" onClick={openCreateModal}>
            <PlusCircle className="h-4 w-4" />
            Nuevo cliente
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Buscar por nombre, teléfono o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12"
          />
        </div>

        {hasResults && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClients.map((client) => (
              <ClientCard
                key={client.id}
                client={client}
                projectCount={projectCountByClient[client.id] ?? 0}
                onViewProjects={() => navigate(`/proyectos?client_id=${client.id}`)}
                onEdit={() => openEditModal(client)}
                // onDelete={() => setDeletingClient(client)}
              />
            ))}
          </div>
        )}

        {!hasClients && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-subheading font-semibold mb-2">No hay clientes</h3>
            <p className="text-body text-muted-foreground mb-6 max-w-sm">
              Crea tu primer cliente para asociarlo despues a tus proyectos.
            </p>
            <Button variant="action" onClick={openCreateModal}>
              <PlusCircle className="h-5 w-5" />
              Crear primer cliente
            </Button>
          </div>
        )}

        {hasClients && !hasResults && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-subheading font-semibold mb-2">Sin resultados</h3>
            <p className="text-body text-muted-foreground mb-6 max-w-sm">
              No hay clientes que coincidan con tu busqueda.
            </p>
            <Button variant="outline" onClick={() => setSearchTerm("")}>
              Limpiar busqueda
            </Button>
          </div>
        )}
      </div>

      <ClientFormModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingClient(null);
        }}
        client={editingClient}
      />

      {/* <AlertDialog open={!!deletingClient} onOpenChange={(open) => !open && setDeletingClient(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar cliente?</AlertDialogTitle>
            <AlertDialogDescription>
              {deletingClient && (
                <>
                  Se eliminara "{deletingClient.name}".
                  {(projectCountByClient[deletingClient.id] ?? 0) > 0 &&
                    ` Tiene ${projectCountByClient[deletingClient.id]} proyecto(s) asociado(s), que quedaran sin cliente.`}
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog> */}
    </AppLayout>
  );
}
