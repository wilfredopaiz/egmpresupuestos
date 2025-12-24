import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { AddItemModal } from "@/components/partidas/AddItemModal";
import {
  getTemplateById,
  getSectionById,
  calculateItemTotal,
  formatCurrency,
  projectStatuses,
  ProjectItem,
} from "@/data/mockData";
import { useProject, useProjectActions } from "@/hooks/useProjects";
import { Plus, Calculator, ArrowLeft, Trash2, Pencil } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function ProyectoDetalle() {
  const { id } = useParams();
  const { project } = useProject(id || null);
  const { updateProject } = useProjectActions();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ProjectItem | null>(null);
  const [includeIVA, setIncludeIVA] = useState(true);
  const [margin, setMargin] = useState(15);

  const currentItems = project?.items || [];
  const subtotal = currentItems.reduce((sum, item) => sum + calculateItemTotal(item), 0);
  const marginAmount = subtotal * ((margin || 0) / 100);
  const subtotalWithMargin = subtotal + marginAmount;
  const ivaAmount = includeIVA ? subtotalWithMargin * 0.21 : 0;
  const total = subtotalWithMargin + ivaAmount;

  if (!project) {
    return (
      <AppLayout title="Proyecto no encontrado">
        <div className="text-center py-16 px-4">
          <p className="text-body text-muted-foreground mb-6">
            El proyecto que buscas no existe
          </p>
          <Button variant="action" asChild>
            <Link to="/proyectos">
              <ArrowLeft className="h-5 w-5" />
              Volver a proyectos
            </Link>
          </Button>
        </div>
      </AppLayout>
    );
  }

  const status = projectStatuses[project.status];

  const handleAddItem = (data: {
    templateId: string;
    quantity: number;
    includeInstallation: boolean;
    includeSupply: boolean;
    optionEnabled: boolean;
    notes: string;
    customPriceInstallation?: number;
    customPriceSupply?: number;
  }) => {
    if (editingItem) {
      // Update existing item
      const updatedItems = currentItems.map((item) =>
        item.id === editingItem.id
          ? {
              ...item,
              templateId: data.templateId,
              quantity: data.quantity,
              includeInstallation: data.includeInstallation,
              includeSupply: data.includeSupply,
              optionEnabled: data.optionEnabled,
              notes: data.notes,
            }
          : item
      );
      updateProject(project.id, { items: updatedItems });
      setEditingItem(null);
    } else {
      // Add new item
      const newItem: ProjectItem = {
        id: `item-${Date.now()}`,
        templateId: data.templateId,
        quantity: data.quantity,
        includeInstallation: data.includeInstallation,
        includeSupply: data.includeSupply,
        optionEnabled: data.optionEnabled,
        notes: data.notes,
      };
      updateProject(project.id, { items: [...currentItems, newItem] });
    }
  };

  const handleEditItem = (item: ProjectItem) => {
    setEditingItem(item);
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditingItem(null);
  };

  const handleDeleteItem = (itemId: string) => {
    const updatedItems = currentItems.filter((item) => item.id !== itemId);
    updateProject(project.id, { items: updatedItems });
    toast({
      title: "Partida eliminada",
      description: "La partida se ha eliminado del proyecto",
    });
  };

  return (
    <AppLayout title={project.name}>
      <div className="flex flex-col gap-6 overflow-hidden">
        {/* Cabecera del proyecto */}
        <Card className="flex-shrink-0">
          <CardContent className="p-5">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
              <div className="min-w-0 flex-1">
                <h2 className="text-heading font-bold break-words">{project.name}</h2>
                <p className="text-body text-muted-foreground">{project.client}</p>
              </div>
              <Badge className={`${status.color} text-small shrink-0 self-start`}>
                {status.label}
              </Badge>
            </div>

            {project.notes && (
              <p className="text-body text-muted-foreground mb-4 break-words">
                {project.notes}
              </p>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t gap-4">
              <div className="min-w-0">
                <p className="text-small text-muted-foreground">Total estimado</p>
                <p className="text-heading font-bold text-primary">
                  {formatCurrency(total)}
                </p>
              </div>
              <Button variant="action" asChild size="sm" className="shrink-0 w-full sm:w-auto">
                <Link to={`/presupuesto?proyecto=${project.id}`}>
                  <Calculator className="h-4 w-4" />
                  Ver presupuesto
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Lista de partidas */}
        <Card className="flex-shrink-0">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-base">
                Partidas ({currentItems.length})
              </CardTitle>
              <Button variant="action" size="sm" onClick={() => setIsAddModalOpen(true)} className="shrink-0">
                <Plus className="h-4 w-4" />
                Añadir
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {currentItems.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-body text-muted-foreground mb-4">
                  Sin partidas todavía
                </p>
                <Button variant="outline" onClick={() => setIsAddModalOpen(true)}>
                  <Plus className="h-5 w-5" />
                  Añadir primera partida
                </Button>
              </div>
            ) : (
              currentItems.map((item) => {
                const template = getTemplateById(item.templateId);
                if (!template) return null;
                const section = getSectionById(template.sectionId);
                const itemTotal = calculateItemTotal(item);

                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-muted/50 space-y-2"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-small text-muted-foreground">
                          {section?.icon} {section?.name}
                        </p>
                        <p className="text-body-lg font-semibold break-words">
                          {template.name}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0 self-end sm:self-start">
                        <span className="text-body-lg font-bold mr-2">
                          {formatCurrency(itemTotal)}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleEditItem(item)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Prices breakdown */}
                    <div className="flex flex-wrap gap-2 text-small text-muted-foreground">
                      <span>
                        {item.quantity.toLocaleString("es-ES")} {template.unit}
                      </span>
                      {item.includeInstallation && (
                        <span>
                          • Inst: {formatCurrency(template.priceInstallation)}/{template.unit}
                        </span>
                      )}
                      {item.includeSupply && template.priceSupply && (
                        <span>
                          • Sum: {formatCurrency(template.priceSupply)}/{template.unit}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 text-small">
                      {item.includeInstallation && (
                        <span className="px-2 py-1 rounded-md bg-primary/10 text-primary">
                          Instalación
                        </span>
                      )}
                      {item.includeSupply && (
                        <span className="px-2 py-1 rounded-md bg-primary/10 text-primary">
                          Suministro
                        </span>
                      )}
                      {item.optionEnabled && template.optionLabel && (
                        <span className="px-2 py-1 rounded-md bg-accent text-accent-foreground">
                          {template.optionLabel}
                        </span>
                      )}
                    </div>

                    {item.notes && (
                      <p className="text-small text-muted-foreground italic pt-1 break-words">
                        "{item.notes}"
                      </p>
                    )}
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* Botón fijo inferior en móvil */}
        {/* Ajustes y resumen del presupuesto */}
        <div className="flex flex-col gap-4">
          <Card className="bg-white border border-border shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Ajustes del presupuesto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-white shadow-sm border border-border">
                <Label htmlFor="iva" className="text-body font-medium cursor-pointer">
                  Incluir IVA (21%)
                </Label>
                <Switch
                  id="iva"
                  checked={includeIVA}
                  onCheckedChange={setIncludeIVA}
                  className="scale-110"
                />
              </div>

              <div className="p-4 rounded-xl bg-white shadow-sm border border-border space-y-2">
                <Label htmlFor="margin" className="text-body font-medium">
                  Margen de beneficio (%)
                </Label>
                <Input
                  id="margin"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  max="100"
                  step={0.5}
                  value={margin}
                  onChange={(e) => {
                    const next = parseFloat(e.target.value);
                    setMargin(Number.isNaN(next) ? 0 : next);
                  }}
                  className="text-center text-heading font-semibold"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#2f3941] text-white border-none shadow-lg">
            <CardContent className="p-6 space-y-3">
              <div className="flex items-center justify-between text-body">
                <span>Subtotal partidas</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>

              {marginAmount > 0 && (
                <div className="flex items-center justify-between text-body">
                  <span>Margen ({margin || 0}%)</span>
                  <span>+ {formatCurrency(marginAmount)}</span>
                </div>
              )}

              {includeIVA && (
                <div className="flex items-center justify-between text-body">
                  <span>IVA (21%)</span>
                  <span>+ {formatCurrency(ivaAmount)}</span>
                </div>
              )}

              <div className="pt-4 mt-2 border-t border-white/20 flex items-center justify-between">
                <span className="text-subheading font-semibold">TOTAL</span>
                <span className="text-display font-bold">{formatCurrency(total)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Boton fijo inferior en movil */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur border-t md:hidden z-50">
          <Button
            variant="action"
            size="xl"
            className="w-full"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus className="h-5 w-5" />
            Añadir partida
          </Button>
        </div>

        {/* Spacer for fixed button on mobile */}
        <div className="h-20 md:hidden flex-shrink-0" />
      </div>

      <AddItemModal
        open={isAddModalOpen}
        onClose={handleCloseModal}
        onAdd={handleAddItem}
        editData={
          editingItem
            ? {
                templateId: editingItem.templateId,
                quantity: editingItem.quantity,
                includeInstallation: editingItem.includeInstallation,
                includeSupply: editingItem.includeSupply,
                optionEnabled: editingItem.optionEnabled,
                notes: editingItem.notes,
              }
            : undefined
        }
      />
    </AppLayout>
  );
}
