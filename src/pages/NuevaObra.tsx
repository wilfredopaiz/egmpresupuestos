import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { HardHat, Plus, User, ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { mockClients } from "@/data/mockData";

export default function NuevaObra() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [clienteId, setClienteId] = useState("");
  const [notas, setNotas] = useState("");
  const [addClientOpen, setAddClientOpen] = useState(false);
  const [newClientName, setNewClientName] = useState("");
  const [newClientPhone, setNewClientPhone] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim()) {
      toast({
        title: "Error",
        description: "El nombre del proyecto es obligatorio",
        variant: "destructive",
      });
      return;
    }

    // En una app real, aquí guardaríamos el proyecto
    toast({
      title: "Obra creada",
      description: `"${nombre}" se ha creado correctamente`,
    });

    navigate("/proyectos");
  };

  const handleAddClient = () => {
    if (!newClientName.trim()) {
      toast({
        title: "Error",
        description: "El nombre del cliente es obligatorio",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Cliente creado",
      description: `"${newClientName}" se ha añadido (demo)`,
    });
    
    setAddClientOpen(false);
    setNewClientName("");
    setNewClientPhone("");
  };

  const selectedClient = mockClients.find(c => c.id === clienteId);

  return (
    <AppLayout title="Nueva obra">
      <div className="w-full max-w-lg mx-auto space-y-4">
        {/* Back button */}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate("/proyectos")}
          className="gap-2 -ml-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Proyectos
        </Button>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <HardHat className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-subheading font-semibold">Datos del proyecto</h2>
                <p className="text-small text-muted-foreground">
                  Información básica de la obra
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="nombre" className="text-body font-medium">
                  Nombre del proyecto *
                </Label>
                <Input
                  id="nombre"
                  placeholder="Ej: Reforma cocina García"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <Label className="text-body font-medium">
                  Cliente
                </Label>
                <div className="flex gap-2">
                  <Select value={clienteId} onValueChange={setClienteId}>
                    <SelectTrigger className="flex-1 h-14">
                      <SelectValue placeholder="Seleccionar cliente">
                        {selectedClient && (
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span>{selectedClient.name}</span>
                          </div>
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-background">
                      {mockClients.map((client) => (
                        <SelectItem key={client.id} value={client.id} className="py-3">
                          <div className="flex flex-col">
                            <span className="font-medium">{client.name}</span>
                            {client.phone && (
                              <span className="text-xs text-muted-foreground">{client.phone}</span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon"
                    className="h-14 w-14 shrink-0"
                    onClick={() => setAddClientOpen(true)}
                  >
                    <Plus className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notas" className="text-body font-medium">
                  Notas
                </Label>
                <Textarea
                  id="notas"
                  placeholder="Detalles adicionales del proyecto..."
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  rows={4}
                />
              </div>

              <Button 
                type="submit" 
                variant="action" 
                size="xl" 
                className="w-full mt-8"
              >
                <HardHat className="h-5 w-5" />
                Crear obra
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Modal de nuevo cliente */}
      <Dialog open={addClientOpen} onOpenChange={setAddClientOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nuevo Cliente</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-client-name">Nombre *</Label>
              <Input 
                id="new-client-name" 
                placeholder="Ej: Juan García"
                value={newClientName}
                onChange={(e) => setNewClientName(e.target.value)}
                className="h-12" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-client-phone">Teléfono</Label>
              <Input 
                id="new-client-phone" 
                type="tel"
                placeholder="Ej: 600 123 456"
                value={newClientPhone}
                onChange={(e) => setNewClientPhone(e.target.value)}
                className="h-12" 
              />
            </div>
            <Button variant="action" className="w-full" onClick={handleAddClient}>
              Crear Cliente
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}