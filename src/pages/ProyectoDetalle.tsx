import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AddItemModal } from "@/components/partidas/AddItemModal";
import { AttachmentUploader } from "@/components/attachments/AttachmentUploader";
import { AttachmentGrid } from "@/components/attachments/AttachmentGrid";
import { calculateItemTotal, formatCurrency } from "@/lib/calculations";
import { PROJECT_STATUSES } from "@/lib/constants";
import type { ProjectStatus } from "@/types";
import {
  useProject,
  useAddProjectItem,
  useUpdateProjectItem,
  useRemoveProjectItem,
  useUpdateProject,
} from "@/hooks/useProjects";
import { useAttachments, useDeleteAttachment } from "@/hooks/useAttachments";
import { useClients } from "@/hooks/useClients";
import { Plus, Calculator, ArrowLeft, Trash2, Pencil, Paperclip } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function ProyectoDetalle() {
  const { id } = useParams();
  const { project, isLoading, error } = useProject(id || null);
  const addItem = useAddProjectItem();
  const updateItem = useUpdateProjectItem();
  const removeItem = useRemoveProjectItem();
  const updateProject = useUpdateProject();
  const { data: clients = [] } = useClients();
  const { data: attachments = [] } = useAttachments(id || null);
  const deleteAttachment = useDeleteAttachment();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [marginInput, setMarginInput] = useState<string | null>(null);
  const [ivaInput, setIvaInput] = useState<string | null>(null);
  const [showUploader, setShowUploader] = useState(false);

  const [editMetaOpen, setEditMetaOpen] = useState(false);
  const [projectNameInput, setProjectNameInput] = useState("");
  const [projectNotesInput, setProjectNotesInput] = useState("");
  const [projectClientIdInput, setProjectClientIdInput] = useState("__none__");
  const [projectStatusInput, setProjectStatusInput] = useState<ProjectStatus>("en-medicion");

  if (isLoading) {
    return (
      <AppLayout title="Proyecto">
        <p className="text-muted-foreground">Cargando proyecto...</p>
      </AppLayout>
    );
  }

  if (error || !project) {
    return (
      <AppLayout title="Proyecto no encontrado">
        <div className="text-center py-16 px-4">
          <p className="text-body text-muted-foreground mb-6">El proyecto que buscas no existe</p>
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

  const currentItems = project.items || [];
  const subtotal = currentItems.reduce((sum: number, item: any) => sum + calculateItemTotal(item), 0);
  const marginPercentage = project.margin_percentage ?? 15;
  const ivaPercentage = project.iva_percentage ?? 21;
  const includeIVA = project.include_iva ?? true;
  const marginAmount = subtotal * (marginPercentage / 100);
  const subtotalWithMargin = subtotal + marginAmount;
  const ivaAmount = includeIVA ? subtotalWithMargin * (ivaPercentage / 100) : 0;
  const total = subtotalWithMargin + ivaAmount;
  const status = PROJECT_STATUSES[project.status];

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
      updateItem.mutate(
        {
          id: editingItem.id,
          updates: {
            template_id: data.templateId,
            quantity: data.quantity,
            include_installation: data.includeInstallation,
            include_supply: data.includeSupply,
            option_enabled: data.optionEnabled,
            notes: data.notes || null,
            price_installation: data.customPriceInstallation ?? editingItem.price_installation,
            price_supply: data.customPriceSupply ?? editingItem.price_supply,
          },
        },
        {
          onSuccess: () => {
            setEditingItem(null);
          },
        },
      );
      return;
    }

    addItem.mutate({
      project_id: project.id,
      template_id: data.templateId,
      quantity: data.quantity,
      include_installation: data.includeInstallation,
      include_supply: data.includeSupply,
      option_enabled: data.optionEnabled,
      notes: data.notes || null,
      price_installation: data.customPriceInstallation ?? 0,
      price_supply: data.customPriceSupply ?? null,
    });
  };

  const handleEditItem = (item: any) => {
    setEditingItem(item);
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditingItem(null);
  };

  const handleDeleteItem = (itemId: string) => {
    removeItem.mutate(itemId, {
      onSuccess: () => {
        toast({
          title: "Partida eliminada",
          description: "La partida se ha eliminado del proyecto",
        });
      },
    });
  };

  const handleDeleteAttachment = (attachment: any) => {
    if (!id) return;
    const confirmed = window.confirm(`Eliminar \"${attachment.filename}\"?`);
    if (!confirmed) return;

    deleteAttachment.mutate(
      { projectId: id, attachment },
      {
        onSuccess: () => {
          toast({
            title: "Adjunto eliminado",
            description: "La imagen se ha eliminado correctamente",
          });
        },
        onError: () => {
          toast({
            title: "Error",
            description: "No se pudo eliminar la imagen",
            variant: "destructive",
          });
        },
      },
    );
  };

  const openEditMeta = () => {
    setProjectNameInput(project.name ?? "");
    setProjectNotesInput(project.notes ?? "");
    setProjectClientIdInput(project.client_id ?? "__none__");
    setProjectStatusInput(project.status);
    setEditMetaOpen(true);
  };

  const handleSaveProjectMeta = () => {
    const selectedClient = clients.find((client) => client.id === projectClientIdInput);

    updateProject.mutate(
      {
        id: project.id,
        updates: {
          name: projectNameInput.trim() || project.name,
          notes: projectNotesInput.trim() || null,
          status: projectStatusInput,
          client_id: projectClientIdInput === "__none__" ? null : projectClientIdInput,
          client_name: selectedClient?.name ?? null,
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "Datos actualizados",
            description: "Se guardaron los datos del proyecto",
          });
          setEditMetaOpen(false);
        },
        onError: () => {
          toast({
            title: "Error",
            description: "No se pudieron guardar los datos",
            variant: "destructive",
          });
        },
      },
    );
  };

  return (
    <AppLayout
      title={`Editar obra: ${project.name}`}
      headerActions={
        <Button variant="outline" size="sm" onClick={openEditMeta} className="gap-2">
          <Pencil className="h-4 w-4" />
          Editar datos
        </Button>
      }
    >
      <div className="flex flex-col gap-6 overflow-hidden">
        <Card className="flex-shrink-0">
          <CardContent className="p-5">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
              <div className="min-w-0 flex-1">
                <h2 className="text-heading font-bold break-words">{project.name}</h2>
                <p className="text-body text-muted-foreground">{project.client?.name ?? project.client_name ?? "Sin cliente"}</p>
              </div>
              <Badge className={`${status.color} text-small shrink-0 self-start`}>{status.label}</Badge>
            </div>

            {project.notes && <p className="text-body text-muted-foreground mb-4 break-words">{project.notes}</p>}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t gap-4">
              <div className="min-w-0">
                <p className="text-small text-muted-foreground">Total estimado</p>
                <p className="text-heading font-bold text-primary">{formatCurrency(total)}</p>
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

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Paperclip className="h-4 w-4 text-primary" />
                Adjuntos ({attachments.length})
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => setShowUploader((prev) => !prev)}>
                <Plus className="h-4 w-4" />
                {showUploader ? "Cerrar" : "Anadir"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {showUploader && id && <AttachmentUploader projectId={id} />}
            <AttachmentGrid attachments={attachments} onDelete={handleDeleteAttachment} />
          </CardContent>
        </Card>

        <Card className="flex-shrink-0">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-base">Partidas ({currentItems.length})</CardTitle>
              <Button variant="action" size="sm" onClick={() => setIsAddModalOpen(true)} className="shrink-0">
                <Plus className="h-4 w-4" />
                Anadir
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {currentItems.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-body text-muted-foreground mb-4">Sin partidas todavia</p>
                <Button variant="outline" onClick={() => setIsAddModalOpen(true)}>
                  <Plus className="h-5 w-5" />
                  Anadir primera partida
                </Button>
              </div>
            ) : (
              currentItems.map((item: any) => {
                const template = item.template;
                if (!template) return null;
                const section = template.section;
                const itemTotal = calculateItemTotal(item);

                return (
                  <div key={item.id} className="p-4 rounded-xl bg-muted/50 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-small text-muted-foreground">
                          {section?.icon} {section?.name}
                        </p>
                        <p className="text-body-lg font-semibold break-words">{template.name}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0 self-end sm:self-start">
                        <span className="text-body-lg font-bold mr-2">{formatCurrency(itemTotal)}</span>
                        <Button variant="ghost" size="icon-sm" onClick={() => handleEditItem(item)} className="text-muted-foreground hover:text-foreground">
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

                    <div className="flex flex-wrap gap-2 text-small text-muted-foreground">
                      <span>
                        {item.quantity.toLocaleString("es-ES")} {template.unit}
                      </span>
                      {item.include_installation && (
                        <span>
                          Inst: {formatCurrency(item.price_installation)}/{template.unit}
                        </span>
                      )}
                      {item.include_supply && item.price_supply && (
                        <span>
                          Sum: {formatCurrency(item.price_supply)}/{template.unit}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 text-small">
                      {item.include_installation && <span className="px-2 py-1 rounded-md bg-primary/10 text-primary">Instalación</span>}
                      {item.include_supply && <span className="px-2 py-1 rounded-md bg-primary/10 text-primary">Suministro</span>}
                      {item.option_enabled && template.option_label && (
                        <span className="px-2 py-1 rounded-md bg-accent text-accent-foreground">{template.option_label}</span>
                      )}
                    </div>

                    {item.notes && <p className="text-small text-muted-foreground italic pt-1 break-words">"{item.notes}"</p>}
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          <Card className="bg-white border border-border shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Ajustes del presupuesto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-white shadow-sm border border-border">
                <Label htmlFor="iva" className="text-body font-medium cursor-pointer">
                  Incluir IVA ({ivaPercentage}%)
                </Label>
                <Switch
                  id="iva"
                  checked={includeIVA}
                  onCheckedChange={(checked) => {
                    updateProject.mutate({
                      id: project.id,
                      updates: { include_iva: checked },
                    });
                  }}
                  className="scale-110"
                />
              </div>

              {includeIVA && (
                <div className="p-4 rounded-xl bg-white shadow-sm border border-border space-y-2">
                  <Label htmlFor="iva-percentage" className="text-body font-medium">
                    IVA (%)
                  </Label>
                  <Input
                    id="iva-percentage"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    max="100"
                    step={0.5}
                    value={ivaInput ?? String(ivaPercentage)}
                    onChange={(e) => setIvaInput(e.target.value)}
                    onBlur={() => {
                      const parsed = parseFloat(ivaInput ?? String(ivaPercentage));
                      const nextValue = Number.isNaN(parsed) ? ivaPercentage : parsed;
                      updateProject.mutate({
                        id: project.id,
                        updates: { iva_percentage: nextValue },
                      });
                      setIvaInput(null);
                    }}
                    className="text-center text-heading font-semibold"
                  />
                </div>
              )}

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
                  value={marginInput ?? String(marginPercentage)}
                  onChange={(e) => {
                    setMarginInput(e.target.value);
                  }}
                  onBlur={() => {
                    const parsed = parseFloat(marginInput ?? String(marginPercentage));
                    const nextValue = Number.isNaN(parsed) ? marginPercentage : parsed;
                    updateProject.mutate({
                      id: project.id,
                      updates: { margin_percentage: nextValue },
                    });
                    setMarginInput(null);
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
                  <span>Margen ({marginPercentage}%)</span>
                  <span>+ {formatCurrency(marginAmount)}</span>
                </div>
              )}

              {includeIVA && (
                <div className="flex items-center justify-between text-body">
                  <span>IVA ({ivaPercentage}%)</span>
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

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur border-t md:hidden z-50">
          <Button variant="action" size="xl" className="w-full" onClick={() => setIsAddModalOpen(true)}>
            <Plus className="h-5 w-5" />
            Anadir partida
          </Button>
        </div>

        <div className="h-20 md:hidden flex-shrink-0" />
      </div>

      <AddItemModal
        open={isAddModalOpen}
        onClose={handleCloseModal}
        onAdd={handleAddItem}
        editData={
          editingItem
            ? {
                templateId: editingItem.template_id,
                quantity: editingItem.quantity,
                includeInstallation: editingItem.include_installation,
                includeSupply: editingItem.include_supply,
                optionEnabled: editingItem.option_enabled,
                notes: editingItem.notes,
                customPriceInstallation: editingItem.price_installation,
                customPriceSupply: editingItem.price_supply,
              }
            : undefined
        }
      />

      <Dialog open={editMetaOpen} onOpenChange={setEditMetaOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar datos del proyecto</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="meta-name">Titulo</Label>
              <Input id="meta-name" value={projectNameInput} onChange={(e) => setProjectNameInput(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Cliente</Label>
              <Select value={projectClientIdInput} onValueChange={setProjectClientIdInput}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background">
                  <SelectItem value="__none__">Sin cliente</SelectItem>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="meta-status">Estado</Label>
              <Select value={projectStatusInput} onValueChange={(value: ProjectStatus) => setProjectStatusInput(value)}>
                <SelectTrigger id="meta-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background">
                  {Object.entries(PROJECT_STATUSES).map(([key, { label }]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="meta-notes">Descripcion</Label>
              <Textarea id="meta-notes" rows={4} value={projectNotesInput} onChange={(e) => setProjectNotesInput(e.target.value)} />
            </div>

            <Button variant="action" className="w-full" onClick={handleSaveProjectMeta} disabled={updateProject.isPending}>
              {updateProject.isPending ? "Guardando..." : "Guardar cambios"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
