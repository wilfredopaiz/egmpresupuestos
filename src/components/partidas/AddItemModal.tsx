import { useState } from "react";
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
  ItemTemplate,
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
  }) => void;
}

export function AddItemModal({ open, onClose, onAdd }: AddItemModalProps) {
  const [sectionId, setSectionId] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [includeInstallation, setIncludeInstallation] = useState(true);
  const [includeSupply, setIncludeSupply] = useState(false);
  const [optionEnabled, setOptionEnabled] = useState(false);
  const [notes, setNotes] = useState("");

  const templates = sectionId ? getTemplatesBySection(sectionId) : [];
  const selectedTemplate = templateId ? getTemplateById(templateId) : null;

  const handleSectionChange = (value: string) => {
    setSectionId(value);
    setTemplateId("");
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
    });

    // Reset form
    setSectionId("");
    setTemplateId("");
    setQuantity("");
    setIncludeInstallation(true);
    setIncludeSupply(false);
    setOptionEnabled(false);
    setNotes("");
    onClose();

    toast({
      title: "Partida añadida",
      description: "La partida se ha añadido al proyecto",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-heading">Añadir partida</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Selector de sección */}
          <div className="space-y-2">
            <Label className="text-body font-medium">Sección</Label>
            <Select value={sectionId} onValueChange={handleSectionChange}>
              <SelectTrigger className="h-14 text-body-lg">
                <SelectValue placeholder="Selecciona sección" />
              </SelectTrigger>
              <SelectContent>
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
              onValueChange={setTemplateId}
              disabled={!sectionId}
            >
              <SelectTrigger className="h-14 text-body-lg">
                <SelectValue placeholder="Selecciona partida" />
              </SelectTrigger>
              <SelectContent>
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
            Guardar partida
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
