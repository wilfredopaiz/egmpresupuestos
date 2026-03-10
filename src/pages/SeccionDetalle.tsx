import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Plus, Wrench, Package, EyeOff, Pencil } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { MEASURE_UNITS } from "@/lib/constants";
import { formatCurrency } from "@/lib/calculations";
import {
  useSections,
  useTemplatesBySection,
  useCreateTemplate,
  useUpdateTemplate,
  useToggleTemplateHidden,
} from "@/hooks/useSections";

export default function SeccionDetalle() {
  const { sectionId } = useParams<{ sectionId: string }>();
  const navigate = useNavigate();

  const [showHidden, setShowHidden] = useState(false);
  const [addItemOpen, setAddItemOpen] = useState(false);
  const [editItemOpen, setEditItemOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  const [newItemName, setNewItemName] = useState("");
  const [newItemUnit, setNewItemUnit] = useState("ud");
  const [newItemPriceInstall, setNewItemPriceInstall] = useState("");
  const [newItemPriceSupply, setNewItemPriceSupply] = useState("");

  const [editItemName, setEditItemName] = useState("");
  const [editItemUnit, setEditItemUnit] = useState("");
  const [editItemPriceInstall, setEditItemPriceInstall] = useState("");
  const [editItemPriceSupply, setEditItemPriceSupply] = useState("");

  const { data: sections = [], isLoading: loadingSections } = useSections(showHidden);
  const { data: templates = [], isLoading: loadingTemplates } = useTemplatesBySection(sectionId ?? null, showHidden);
  const createTemplate = useCreateTemplate();
  const updateTemplate = useUpdateTemplate();
  const toggleTemplateHidden = useToggleTemplateHidden();

  const section = sections.find((s: any) => s.id === sectionId);
  const availableUnits = MEASURE_UNITS.map((unit) => ({ id: unit.id, label: unit.label }));

  const handleAddItem = () => {
    if (!sectionId) return;

    if (!newItemName.trim()) {
      toast({
        title: "Error",
        description: "El nombre es obligatorio",
        variant: "destructive",
      });
      return;
    }

    const installation = parseFloat(newItemPriceInstall);
    if (Number.isNaN(installation) || installation < 0) {
      toast({
        title: "Error",
        description: "El precio de instalacion debe ser valido",
        variant: "destructive",
      });
      return;
    }

    const parsedSupply = parseFloat(newItemPriceSupply);

    createTemplate.mutate(
      {
        section_id: sectionId,
        name: newItemName.trim(),
        unit: newItemUnit,
        price_installation: installation,
        price_supply: Number.isNaN(parsedSupply) ? null : parsedSupply,
        has_option: false,
        option_label: null,
      },
      {
        onSuccess: () => {
          toast({
            title: "Partida creada",
            description: `"${newItemName.trim()}" se ha creado correctamente`,
          });
          setAddItemOpen(false);
          setNewItemName("");
          setNewItemUnit("ud");
          setNewItemPriceInstall("");
          setNewItemPriceSupply("");
        },
        onError: () => {
          toast({
            title: "Error",
            description: "No se pudo crear la partida",
            variant: "destructive",
          });
        },
      },
    );
  };

  const handleEditItem = () => {
    if (!selectedItem) return;

    if (!editItemName.trim()) {
      toast({
        title: "Error",
        description: "El nombre es obligatorio",
        variant: "destructive",
      });
      return;
    }

    const installation = parseFloat(editItemPriceInstall);
    if (Number.isNaN(installation) || installation < 0) {
      toast({
        title: "Error",
        description: "El precio de instalacion debe ser valido",
        variant: "destructive",
      });
      return;
    }

    const parsedSupply = parseFloat(editItemPriceSupply);

    updateTemplate.mutate(
      {
        id: selectedItem.id,
        updates: {
          name: editItemName.trim(),
          unit: editItemUnit,
          price_installation: installation,
          price_supply: Number.isNaN(parsedSupply) ? null : parsedSupply,
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "Partida actualizada",
            description: `"${editItemName.trim()}" se ha actualizado`,
          });
          setEditItemOpen(false);
          setSelectedItem(null);
        },
        onError: () => {
          toast({
            title: "Error",
            description: "No se pudo actualizar la partida",
            variant: "destructive",
          });
        },
      },
    );
  };

  const handleToggleHidden = (template: any, hidden: boolean) => {
    toggleTemplateHidden.mutate(
      {
        id: template.id,
        hidden,
      },
      {
        onSuccess: () => {
          toast({
            title: hidden ? "Partida oculta" : "Partida visible",
            description: `"${template.name}" ${hidden ? "se ha ocultado" : "se ha reactivado"}`,
          });
        },
        onError: () => {
          toast({
            title: "Error",
            description: "No se pudo actualizar la partida",
            variant: "destructive",
          });
        },
      },
    );
  };

  const openEditModal = (template: any) => {
    setSelectedItem(template);
    setEditItemName(template.name);
    setEditItemUnit(template.unit);
    setEditItemPriceInstall(String(template.price_installation));
    setEditItemPriceSupply(template.price_supply !== null ? String(template.price_supply) : "");
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
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <Button variant="ghost" size="sm" onClick={() => navigate("/partidas")} className="gap-2 -ml-2">
            <ArrowLeft className="h-4 w-4" />
            Secciones
          </Button>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Switch id="show-hidden-templates" checked={showHidden} onCheckedChange={setShowHidden} />
              <Label htmlFor="show-hidden-templates" className="text-sm text-muted-foreground">
                Mostrar ocultas
              </Label>
            </div>

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
                    <Input
                      id="item-name"
                      placeholder="Ej: Instalacion enchufe"
                      className="h-12"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                    />
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
                      <Input
                        id="item-price-install"
                        type="number"
                        value={newItemPriceInstall}
                        onChange={(e) => setNewItemPriceInstall(e.target.value)}
                        placeholder="0"
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="item-price-supply">Suministro (EUR)</Label>
                      <Input
                        id="item-price-supply"
                        type="number"
                        value={newItemPriceSupply}
                        onChange={(e) => setNewItemPriceSupply(e.target.value)}
                        placeholder="0"
                        className="h-12"
                      />
                    </div>
                  </div>
                  <Button variant="action" className="w-full" onClick={handleAddItem}>
                    {createTemplate.isPending ? "Creando..." : "Crear Partida"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
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
              className={`p-4 transition-transform cursor-pointer active:scale-[0.98] ${template.hidden ? "opacity-60" : ""}`}
              onClick={() => openEditModal(template)}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-base">{template.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
                        {template.unit}
                      </span>
                      {template.hidden && (
                        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                          Oculta
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => openEditModal(template)}
                      title="Editar partida"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleToggleHidden(template, !template.hidden)}
                      title={template.hidden ? "Mostrar partida" : "Ocultar partida"}
                      className={template.hidden ? "" : "text-destructive hover:text-destructive"}
                    >
                      <EyeOff className="h-4 w-4" />
                    </Button>
                  </div>
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
                <Input
                  id="edit-item-price-install"
                  type="number"
                  value={editItemPriceInstall}
                  onChange={(e) => setEditItemPriceInstall(e.target.value)}
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-item-price-supply">Suministro (EUR)</Label>
                <Input
                  id="edit-item-price-supply"
                  type="number"
                  value={editItemPriceSupply}
                  onChange={(e) => setEditItemPriceSupply(e.target.value)}
                  className="h-12"
                />
              </div>
            </div>
            <Button variant="action" className="w-full" onClick={handleEditItem}>
              {updateTemplate.isPending ? "Guardando..." : "Guardar cambios"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
