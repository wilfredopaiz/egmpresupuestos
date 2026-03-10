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
import { Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useSections, useTemplates, useTemplatesBySection } from "@/hooks/useSections";
import { formatCurrency } from "@/lib/calculations";

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

  const { data: sections = [] } = useSections();
  const { data: allTemplates = [] } = useTemplates();
  const { data: templates = [] } = useTemplatesBySection(sectionId || null);
  const selectedTemplate = templateId ? allTemplates.find((t: any) => t.id === templateId) : null;

  useEffect(() => {
    if (editData && open) {
      const template = allTemplates.find((t: any) => t.id === editData.templateId);
      if (template) {
        setSectionId(template.section_id);
        setTemplateId(editData.templateId);
        setQuantity(editData.quantity.toString());
        setIncludeInstallation(editData.includeInstallation);
        setIncludeSupply(editData.includeSupply);
        setOptionEnabled(editData.optionEnabled || false);
        setNotes(editData.notes || "");
        setPriceInstallation(
          (editData.customPriceInstallation ?? template.price_installation).toString(),
        );
        setPriceSupply((editData.customPriceSupply ?? template.price_supply ?? 0).toString());
      }
    } else if (!open) {
      resetForm();
    }
  }, [editData, open, allTemplates]);

  useEffect(() => {
    if (selectedTemplate && !editData) {
      setPriceInstallation(String(selectedTemplate.price_installation));
      setPriceSupply(String(selectedTemplate.price_supply ?? 0));
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
    const template = allTemplates.find((t: any) => t.id === value);
    if (template) {
      setPriceInstallation(String(template.price_installation));
      setPriceSupply(String(template.price_supply ?? 0));
    }
  };

  const handleSubmit = () => {
    if (!templateId || !quantity || parseFloat(quantity) <= 0) {
      toast({
        title: "Error",
        description: "Selecciona una partida e introduce una cantidad valida",
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
      title: editData ? "Partida actualizada" : "Partida anadida",
      description: editData
        ? "La partida se ha actualizado correctamente"
        : "La partida se ha anadido al proyecto",
    });
  };

  const estimatedTotal = (() => {
    const qty = parseFloat(quantity) || 0;
    let total = 0;
    if (includeInstallation) {
      total += (parseFloat(priceInstallation) || 0) * qty;
    }
    if (includeSupply && selectedTemplate?.price_supply) {
      total += (parseFloat(priceSupply) || 0) * qty;
    }
    return total;
  })();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-heading">
            {editData ? "Editar partida" : "Anadir partida"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label className="text-body font-medium">Seccion</Label>
            <Select value={sectionId} onValueChange={handleSectionChange}>
              <SelectTrigger className="h-14 text-body-lg">
                <SelectValue placeholder="Selecciona seccion" />
              </SelectTrigger>
              <SelectContent className="bg-background">
                {sections.map((section: any) => (
                  <SelectItem key={section.id} value={section.id} className="h-12 text-body">
                    {section.icon} {section.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-body font-medium">Partida</Label>
            <Select value={templateId} onValueChange={handleTemplateChange} disabled={!sectionId}>
              <SelectTrigger className="h-14 text-body-lg">
                <SelectValue placeholder="Selecciona partida" />
              </SelectTrigger>
              <SelectContent className="bg-background">
                {templates.map((template: any) => (
                  <SelectItem key={template.id} value={template.id} className="h-12 text-body">
                    {template.name} ({template.unit})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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

          {selectedTemplate && (
            <div className="space-y-4 rounded-lg bg-muted/50 p-4">
              <Label className="text-body font-medium">Precios por unidad</Label>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Label className="text-small min-w-[100px]">Instalación EUR</Label>
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

                {selectedTemplate.price_supply !== null && (
                  <div className="flex items-center gap-3">
                    <Label className="text-small min-w-[100px]">Suministro EUR</Label>
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

          <div className="space-y-4 rounded-lg bg-muted/50 p-4">
            <div className="flex items-center justify-between gap-4">
              <Label className="text-body font-medium cursor-pointer" htmlFor="installation">
                Instalación
              </Label>
              <Switch id="installation" checked={includeInstallation} onCheckedChange={setIncludeInstallation} />
            </div>

            {selectedTemplate?.price_supply !== null && (
              <div className="flex items-center justify-between gap-4">
                <Label className="text-body font-medium cursor-pointer" htmlFor="supply">
                  Suministro
                </Label>
                <Switch id="supply" checked={includeSupply} onCheckedChange={setIncludeSupply} />
              </div>
            )}

            {selectedTemplate?.has_option && (
              <div className="flex items-center justify-between gap-4">
                <Label className="text-body font-medium cursor-pointer" htmlFor="option">
                  {selectedTemplate.option_label}
                </Label>
                <Switch id="option" checked={optionEnabled} onCheckedChange={setOptionEnabled} />
              </div>
            )}
          </div>

          {selectedTemplate && parseFloat(quantity) > 0 && (
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
              <div className="flex justify-between items-center">
                <span className="text-body font-medium">Total estimado</span>
                <span className="text-heading font-bold text-primary">{formatCurrency(estimatedTotal)}</span>
              </div>
            </div>
          )}

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

        <div className="sticky bottom-0 bg-background pt-4 border-t">
          <Button variant="action" size="xl" className="w-full" onClick={handleSubmit}>
            <Save className="h-5 w-5" />
            {editData ? "Guardar cambios" : "Guardar partida"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
