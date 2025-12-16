import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { HardHat } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function NuevaObra() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [cliente, setCliente] = useState("");
  const [notas, setNotas] = useState("");

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

    navigate("/");
  };

  return (
    <AppLayout title="Nueva obra">
      <div className="max-w-lg mx-auto">
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
                <Label htmlFor="cliente" className="text-body font-medium">
                  Cliente
                </Label>
                <Input
                  id="cliente"
                  placeholder="Ej: Juan García"
                  value={cliente}
                  onChange={(e) => setCliente(e.target.value)}
                />
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
    </AppLayout>
  );
}
