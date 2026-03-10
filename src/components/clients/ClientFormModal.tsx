import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useCreateClient, useUpdateClient } from "@/hooks/useClients";
import type { Client } from "@/types";

interface ClientFormModalProps {
  open: boolean;
  onClose: () => void;
  client?: Client | null;
}

export function ClientFormModal({ open, onClose, client }: ClientFormModalProps) {
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();
  const isEditMode = !!client;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!open) return;
    setName(client?.name ?? "");
    setPhone(client?.phone ?? "");
    setEmail(client?.email ?? "");
  }, [open, client]);

  const handleSubmit = () => {
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "El nombre es obligatorio",
        variant: "destructive",
      });
      return;
    }

    const payload = {
      name: name.trim(),
      phone: phone.trim() || null,
      email: email.trim() || null,
    };

    if (isEditMode && client) {
      updateClient.mutate(
        { id: client.id, updates: payload },
        {
          onSuccess: () => {
            toast({
              title: "Cliente actualizado",
              description: `"${payload.name}" se ha actualizado correctamente`,
            });
            onClose();
          },
          onError: () => {
            toast({
              title: "Error",
              description: "No se pudo actualizar el cliente",
              variant: "destructive",
            });
          },
        },
      );
      return;
    }

    createClient.mutate(payload, {
      onSuccess: () => {
        toast({
          title: "Cliente creado",
          description: `"${payload.name}" se ha creado correctamente`,
        });
        onClose();
      },
      onError: () => {
        toast({
          title: "Error",
          description: "No se pudo crear el cliente",
          variant: "destructive",
        });
      },
    });
  };

  const isPending = createClient.isPending || updateClient.isPending;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Editar cliente" : "Nuevo cliente"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="client-name">Nombre *</Label>
            <Input
              id="client-name"
              placeholder="Ej: Juan Garcia"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="client-phone">Telefono</Label>
            <Input
              id="client-phone"
              placeholder="Ej: 600 123 456"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-12"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="client-email">Email</Label>
            <Input
              id="client-email"
              type="email"
              placeholder="Ej: juan@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12"
            />
          </div>
          <Button variant="action" className="w-full" onClick={handleSubmit} disabled={isPending}>
            {isPending ? "Guardando..." : isEditMode ? "Guardar cambios" : "Crear cliente"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
