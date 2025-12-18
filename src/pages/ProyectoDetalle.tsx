import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AddItemModal } from "@/components/partidas/AddItemModal";
import {
  mockProjects,
  getTemplateById,
  getSectionById,
  calculateItemTotal,
  formatCurrency,
  projectStatuses,
  ProjectItem,
} from "@/data/mockData";
import { Plus, Calculator, ArrowLeft, Trash2, Pencil } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function ProyectoDetalle() {
  const { id } = useParams();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ProjectItem | null>(null);
  const [items, setItems] = useState<ProjectItem[]>([]);

  // Buscar proyecto (mock)
  const project = mockProjects.find((p) => p.id === id);
  
  // Usar items del estado si existen, sino los del proyecto mock
  const currentItems = items.length > 0 ? items : project?.items || [];
  
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
  const total = currentItems.reduce((sum, item) => sum + calculateItemTotal(item), 0);

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
      setItems(
        currentItems.map((item) =>
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
        )
      );
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
      setItems([...currentItems, newItem]);
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
    setItems(currentItems.filter((item) => item.id !== itemId));
    toast({
      title: "Partida eliminada",
      description: "La partida se ha eliminado del proyecto",
    });
  };

  return (
    <AppLayout title={project.name}>
      <div className="space-y-6">
        {/* Cabecera del proyecto */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="min-w-0 flex-1">
                <h2 className="text-heading font-bold truncate">{project.name}</h2>
                <p className="text-body text-muted-foreground">{project.client}</p>
              </div>
              <Badge className={`${status.color} text-small shrink-0`}>
                {status.label}
              </Badge>
            </div>

            {project.notes && (
              <p className="text-body text-muted-foreground mb-4">
                {project.notes}
              </p>
            )}

            <div className="flex items-center justify-between pt-4 border-t gap-4">
              <div className="min-w-0">
                <p className="text-small text-muted-foreground">Total estimado</p>
                <p className="text-heading font-bold text-primary">
                  {formatCurrency(total)}
                </p>
              </div>
              <Button variant="action" asChild size="sm">
                <Link to={`/presupuesto?proyecto=${project.id}`}>
                  <Calculator className="h-4 w-4" />
                  Ver presupuesto
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Lista de partidas */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-base">
                Partidas ({currentItems.length})
              </CardTitle>
              <Button variant="action" size="sm" onClick={() => setIsAddModalOpen(true)}>
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
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-small text-muted-foreground">
                          {section?.icon} {section?.name}
                        </p>
                        <p className="text-body-lg font-semibold truncate">
                          {template.name}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
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
                      <p className="text-small text-muted-foreground italic pt-1">
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
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur border-t md:hidden safe-bottom">
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
        <div className="h-20 md:hidden" />
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