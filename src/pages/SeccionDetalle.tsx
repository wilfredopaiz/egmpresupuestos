import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Plus, Wrench, Package } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { MEASURE_UNITS } from "@/lib/constants";
import { formatCurrency } from "@/lib/calculations";
import { useSections, useTemplatesBySection } from "@/hooks/useSections";

export default function SeccionDetalle() {
  const { sectionId } = useParams<{ sectionId: string }>();
  const navigate = useNavigate();
  const [addItemOpen, setAddItemOpen] = useState(false);
  const [editItemOpen, setEditItemOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  const [newItemUnit, setNewItemUnit] = useState("ud");
  const [editItemName, setEditItemName] = useState("");
  const [editItemUnit, setEditItemUnit] = useState("");
  const [editItemPriceInstall, setEditItemPriceInstall] = useState("");
  const [editItemPriceSupply, setEditItemPriceSupply] = useState("");

  const { data: sections = [], isLoading: loadingSections } = useSections();
  const { data: templates = [], isLoading: loadingTemplates } = useTemplatesBySection(sectionId ?? null);
  const section = sections.find((s: any) => s.id === sectionId);
  const availableUnits = MEASURE_UNITS.map((unit) => ({ id: unit.id, label: unit.label }));

  const handleAddItem = () => {
    toast({
      title: "Pendiente",
      description: "Creacion de plantillas se conecta en la siguiente fase.",
    });
    setAddItemOpen(false);
    setNewItemUnit("ud");
  };

  const handleEditItem = () => {
    toast({
      title: "Pendiente",
      description: `"${selectedItem?.name}" se actualizara en la siguiente fase.`,
    });
    setEditItemOpen(false);
    setSelectedItem(null);
  };

  const openEditModal = (template: any) => {
    setSelectedItem(template);
    setEditItemName(template.name);
    setEditItemUnit(template.unit);
    setEditItemPriceInstall(String(template.price_installation));
    setEditItemPriceSupply(template.price_supply ? String(template.price_supply) : "");
    setEditItemOpen(true);
  };

  if (loadingSections || loadingTemplates) {
    return (
      <AppLayout title="Partidas">
        <p className="text-muted-foreground">Cargando seccion...</p>
      </AppLayout>
    );
  }

  if (!section) {
    return (
      <AppLayout title="Seccion no encontrada">
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Esta seccion no existe</p>
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
                  <Input id="item-name" placeholder="Ej: Instalacion enchufe" className="h-12" />
                </div>
                <div className="space-y-2">
                  <Label>Unidad</Label>
                  <Select value={newItemUnit} onValueChange={setNewItemUnit}>
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background">
                      {availableUnits.map((unit) => (
                        <SelectItem key={unit.id} value={unit.id}>
                          {unit.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="item-price-install">Instalacion (EUR)</Label>
                    <Input id="item-price-install" type="number" placeholder="0" className="h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="item-price-supply">Suministro (EUR)</Label>
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

        <div className="flex items-center gap-3 pb-2">
          <span className="text-4xl">{section.icon}</span>
          <div>
            <h2 className="text-xl font-bold">{section.name}</h2>
            <p className="text-sm text-muted-foreground">
              {templates.length} {templates.length === 1 ? "partida disponible" : "partidas disponibles"}
            </p>
          </div>
        </div>

        <div className="grid gap-3">
          {templates.map((template: any) => (
            <Card
              key={template.id}
              className="p-4 cursor-pointer active:scale-[0.98] transition-transform"
              onClick={() => openEditModal(template)}
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
                    <span className="text-muted-foreground">Instalacion:</span>
                    <span className="font-medium">{formatCurrency(template.price_installation)}</span>
                  </div>

                  {template.price_supply !== null && (
                    <div className="flex items-center gap-2 text-sm">
                      <Package className="h-4 w-4 text-blue-500" />
                      <span className="text-muted-foreground">Suministro:</span>
                      <span className="font-medium">{formatCurrency(template.price_supply)}</span>
                    </div>
                  )}
                </div>

                {template.has_option && template.option_label && (
                  <div className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded inline-block">
                    Opcion: {template.option_label}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {templates.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No hay partidas en esta seccion</p>
            <p className="text-sm mt-1">Anade la primera partida</p>
          </div>
        )}
      </div>

      <Dialog open={editItemOpen} onOpenChange={setEditItemOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Partida</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-item-name">Nombre</Label>
              <Input id="edit-item-name" value={editItemName} onChange={(e) => setEditItemName(e.target.value)} className="h-12" />
            </div>
            <div className="space-y-2">
              <Label>Unidad</Label>
              <Select value={editItemUnit} onValueChange={setEditItemUnit}>
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background">
                  {availableUnits.map((unit) => (
                    <SelectItem key={unit.id} value={unit.id}>
                      {unit.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="edit-item-price-install">Instalacion (EUR)</Label>
                <Input id="edit-item-price-install" type="number" value={editItemPriceInstall} onChange={(e) => setEditItemPriceInstall(e.target.value)} className="h-12" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-item-price-supply">Suministro (EUR)</Label>
                <Input id="edit-item-price-supply" type="number" value={editItemPriceSupply} onChange={(e) => setEditItemPriceSupply(e.target.value)} className="h-12" />
              </div>
            </div>
            <Button variant="action" className="w-full" onClick={handleEditItem}>
              Guardar cambios
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
