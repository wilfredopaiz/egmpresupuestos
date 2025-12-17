import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getSectionById, getTemplatesBySection, formatCurrency, sections } from "@/data/mockData";
import { ArrowLeft, Plus, Wrench, Package } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function SeccionDetalle() {
  const { sectionId } = useParams<{ sectionId: string }>();
  const navigate = useNavigate();
  const [addItemOpen, setAddItemOpen] = useState(false);
  
  const section = getSectionById(sectionId || "");
  const templates = getTemplatesBySection(sectionId || "");

  const handleAddItem = () => {
    toast({
      title: "Partida creada",
      description: "Nueva partida añadida (demo)",
    });
    setAddItemOpen(false);
  };

  const handleEditItem = (name: string) => {
    toast({
      title: "Editar partida",
      description: `Editando "${name}" (demo)`,
    });
  };

  if (!section) {
    return (
      <AppLayout title="Sección no encontrada">
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Esta sección no existe</p>
          <Button variant="action" onClick={() => navigate("/partidas")}>
            Volver a Partidas
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title={section.name}>
      <div className="space-y-4 w-full">
        {/* Header con navegación */}
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate("/partidas")}
            className="gap-2 -ml-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Secciones
          </Button>
          
          <Dialog open={addItemOpen} onOpenChange={setAddItemOpen}>
            <DialogTrigger asChild>
              <Button variant="action" size="sm">
                <Plus className="h-4 w-4" />
                Nueva partida
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Nueva Partida en {section.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="item-name">Nombre</Label>
                  <Input id="item-name" placeholder="Ej: Instalación enchufe" className="h-12" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="item-unit">Unidad</Label>
                  <Input id="item-unit" placeholder="Ej: ud, m², ml" className="h-12" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="item-price-install">Instalación (€)</Label>
                    <Input id="item-price-install" type="number" placeholder="0" className="h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="item-price-supply">Suministro (€)</Label>
                    <Input id="item-price-supply" type="number" placeholder="0" className="h-12" />
                  </div>
                </div>
                <Button variant="action" className="w-full" onClick={handleAddItem}>
                  Crear Partida
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Icono y título de sección */}
        <div className="flex items-center gap-3 pb-2">
          <span className="text-4xl">{section.icon}</span>
          <div>
            <h2 className="text-xl font-bold">{section.name}</h2>
            <p className="text-sm text-muted-foreground">
              {templates.length} {templates.length === 1 ? 'partida disponible' : 'partidas disponibles'}
            </p>
          </div>
        </div>

        {/* Lista de partidas */}
        <div className="grid gap-3">
          {templates.map((template) => (
            <Card
              key={template.id}
              className="p-4 cursor-pointer active:scale-[0.98] transition-transform"
              onClick={() => handleEditItem(template.name)}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-base">{template.name}</h3>
                  <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
                    {template.unit}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Wrench className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">Instalación:</span>
                    <span className="font-medium">{formatCurrency(template.priceInstallation)}</span>
                  </div>
                  
                  {template.priceSupply !== undefined && (
                    <div className="flex items-center gap-2 text-sm">
                      <Package className="h-4 w-4 text-blue-500" />
                      <span className="text-muted-foreground">Suministro:</span>
                      <span className="font-medium">{formatCurrency(template.priceSupply)}</span>
                    </div>
                  )}
                </div>

                {template.hasOption && template.optionLabel && (
                  <div className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded inline-block">
                    ⚙️ Opción: {template.optionLabel}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {templates.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No hay partidas en esta sección</p>
            <p className="text-sm mt-1">Añade la primera partida</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
