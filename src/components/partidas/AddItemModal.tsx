import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  sections,
  getTemplatesBySection,
  getTemplateById,
  formatCurrency,
} from "@/data/mockData";
import { Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface AddItemModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (data: {
    templateId: string;
    quantity: number;
    includeInstallation: boolean;
    includeSupply: boolean;
    optionEnabled: boolean;
    notes: string;
    customPriceInstallation?: number;
    customPriceSupply?: number;
  }) => void;
  editData?: {
    templateId: string;
    quantity: number;
    includeInstallation: boolean;
    includeSupply: boolean;
    optionEnabled?: boolean;
    notes?: string;
    customPriceInstallation?: number;
    customPriceSupply?: number;
  };
}

export function AddItemModal({ open, onClose, onAdd, editData }: AddItemModalProps) {
  const [sectionId, setSectionId] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [includeInstallation, setIncludeInstallation] = useState(true);
  const [includeSupply, setIncludeSupply] = useState(false);
  const [optionEnabled, setOptionEnabled] = useState(false);
  const [notes, setNotes] = useState("");
  const [priceInstallation, setPriceInstallation] = useState("");
  const [priceSupply, setPriceSupply] = useState("");

  const templates = sectionId ? getTemplatesBySection(sectionId) : [];
  const selectedTemplate = templateId ? getTemplateById(templateId) : null;

  // Pre-populate form when editing
  useEffect(() => {
    if (editData && open) {
      const template = getTemplateById(editData.templateId);
      if (template) {
        setSectionId(template.sectionId);
        setTemplateId(editData.templateId);
        setQuantity(editData.quantity.toString());
        setIncludeInstallation(editData.includeInstallation);
        setIncludeSupply(editData.includeSupply);
        setOptionEnabled(editData.optionEnabled || false);
        setNotes(editData.notes || "");
        setPriceInstallation(
          (editData.customPriceInstallation ?? template.priceInstallation).toString()
        );
        setPriceSupply(
          (editData.customPriceSupply ?? template.priceSupply ?? 0).toString()
        );
      }
    } else if (!open) {
      resetForm();
    }
  }, [editData, open]);

  // Update prices when template changes (only for new items)
  useEffect(() => {
    if (selectedTemplate && !editData) {
      setPriceInstallation(selectedTemplate.priceInstallation.toString());
      setPriceSupply((selectedTemplate.priceSupply ?? 0).toString());
    }
  }, [selectedTemplate, editData]);

  const resetForm = () => {
    setSectionId("");
    setTemplateId("");
    setQuantity("");
    setIncludeInstallation(true);
    setIncludeSupply(false);
    setOptionEnabled(false);
    setNotes("");
    setPriceInstallation("");
    setPriceSupply("");
  };

  const handleSectionChange = (value: string) => {
    setSectionId(value);
    setTemplateId("");
    setPriceInstallation("");
    setPriceSupply("");
  };

  const handleTemplateChange = (value: string) => {
    setTemplateId(value);
    const template = getTemplateById(value);
    if (template) {
      setPriceInstallation(template.priceInstallation.toString());
      setPriceSupply((template.priceSupply ?? 0).toString());
    }
  };

  const handleSubmit = () => {
    if (!templateId || !quantity || parseFloat(quantity) <= 0) {
      toast({
        title: "Error",
        description: "Selecciona una partida e introduce una cantidad válida",
        variant: "destructive",
      });
      return;
    }

    onAdd({
      templateId,
      quantity: parseFloat(quantity),
      includeInstallation,
      includeSupply,
      optionEnabled,
      notes,
      customPriceInstallation: parseFloat(priceInstallation) || undefined,
      customPriceSupply: parseFloat(priceSupply) || undefined,
    });

    resetForm();
    onClose();

    toast({
      title: editData ? "Partida actualizada" : "Partida añadida",
      description: editData 
        ? "La partida se ha actualizado correctamente"
        : "La partida se ha añadido al proyecto",
    });
  };

  // Calculate estimated total
  const estimatedTotal = (() => {
    const qty = parseFloat(quantity) || 0;
    let total = 0;
    if (includeInstallation) {
      total += (parseFloat(priceInstallation) || 0) * qty;
    }
    if (includeSupply && selectedTemplate?.priceSupply) {
      total += (parseFloat(priceSupply) || 0) * qty;
    }
    return total;
  })();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-heading">
            {editData ? "Editar partida" : "Añadir partida"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Selector de sección */}
          <div className="space-y-2">
            <Label className="text-body font-medium">Sección</Label>
            <Select value={sectionId} onValueChange={handleSectionChange}>
              <SelectTrigger className="h-14 text-body-lg">
                <SelectValue placeholder="Selecciona sección" />
              </SelectTrigger>
              <SelectContent className="bg-background">
                {sections.map((section) => (
                  <SelectItem 
                    key={section.id} 
                    value={section.id}
                    className="h-12 text-body"
                  >
                    {section.icon} {section.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Selector de partida */}
          <div className="space-y-2">
            <Label className="text-body font-medium">Partida</Label>
            <Select 
              value={templateId} 
              onValueChange={handleTemplateChange}
              disabled={!sectionId}
            >
              <SelectTrigger className="h-14 text-body-lg">
                <SelectValue placeholder="Selecciona partida" />
              </SelectTrigger>
              <SelectContent className="bg-background">
                {templates.map((template) => (
                  <SelectItem 
                    key={template.id} 
                    value={template.id}
                    className="h-12 text-body"
                  >
                    {template.name} ({template.unit})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Input de cantidad */}
          <div className="space-y-2">
            <Label className="text-body font-medium">
              Cantidad {selectedTemplate && `(${selectedTemplate.unit})`}
            </Label>
            <Input
              type="number"
              inputMode="decimal"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="text-heading font-bold text-center"
            />
          </div>

          {/* Precios editables */}
          {selectedTemplate && (
            <div className="space-y-4 rounded-lg bg-muted/50 p-4">
              <Label className="text-body font-medium">Precios por unidad</Label>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Label className="text-small min-w-[100px]">Instalación €</Label>
                  <Input
                    type="number"
                    inputMode="decimal"
                    step="0.01"
                    min="0"
                    value={priceInstallation}
                    onChange={(e) => setPriceInstallation(e.target.value)}
                    className="text-center font-semibold"
                  />
                </div>

                {selectedTemplate.priceSupply !== undefined && (
                  <div className="flex items-center gap-3">
                    <Label className="text-small min-w-[100px]">Suministro €</Label>
                    <Input
                      type="number"
                      inputMode="decimal"
                      step="0.01"
                      min="0"
                      value={priceSupply}
                      onChange={(e) => setPriceSupply(e.target.value)}
                      className="text-center font-semibold"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Toggles */}
          <div className="space-y-4 rounded-lg bg-muted/50 p-4">
            <div className="flex items-center justify-between gap-4">
              <Label className="text-body font-medium cursor-pointer" htmlFor="installation">
                ☑ Instalación
              </Label>
              <Switch
                id="installation"
                checked={includeInstallation}
                onCheckedChange={setIncludeInstallation}
              />
            </div>

            {selectedTemplate?.priceSupply && (
              <div className="flex items-center justify-between gap-4">
                <Label className="text-body font-medium cursor-pointer" htmlFor="supply">
                  ☑ Suministro
                </Label>
                <Switch
                  id="supply"
                  checked={includeSupply}
                  onCheckedChange={setIncludeSupply}
                />
              </div>
            )}

            {selectedTemplate?.hasOption && (
              <div className="flex items-center justify-between gap-4">
                <Label className="text-body font-medium cursor-pointer" htmlFor="option">
                  ☑ {selectedTemplate.optionLabel}
                </Label>
                <Switch
                  id="option"
                  checked={optionEnabled}
                  onCheckedChange={setOptionEnabled}
                />
              </div>
            )}
          </div>

          {/* Total estimado */}
          {selectedTemplate && parseFloat(quantity) > 0 && (
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
              <div className="flex justify-between items-center">
                <span className="text-body font-medium">Total estimado</span>
                <span className="text-heading font-bold text-primary">
                  {formatCurrency(estimatedTotal)}
                </span>
              </div>
            </div>
          )}

          {/* Observaciones */}
          <div className="space-y-2">
            <Label className="text-body font-medium">Observaciones</Label>
            <Textarea
              placeholder="Notas adicionales..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        {/* Botón fijo */}
        <div className="sticky bottom-0 bg-background pt-4 border-t">
          <Button 
            variant="action" 
            size="xl" 
            className="w-full"
            onClick={handleSubmit}
          >
            <Save className="h-5 w-5" />
            {editData ? "Guardar cambios" : "Guardar partida"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}