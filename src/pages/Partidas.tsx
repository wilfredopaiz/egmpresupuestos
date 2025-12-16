import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ItemTemplateCard } from "@/components/partidas/ItemTemplateCard";
import { Button } from "@/components/ui/button";
import { sections, getTemplatesBySection } from "@/data/mockData";
import { ChevronDown, ChevronRight, Plus, FolderPlus } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Partidas() {
  const [openSections, setOpenSections] = useState<string[]>([]);
  const [addSectionOpen, setAddSectionOpen] = useState(false);
  const [addItemOpen, setAddItemOpen] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState<string>("");

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleEdit = (templateName: string) => {
    toast({
      title: "Editar partida",
      description: `Editando "${templateName}" (demo)`,
    });
  };

  const handleAddSection = () => {
    toast({
      title: "Sección creada",
      description: "Nueva sección añadida (demo)",
    });
    setAddSectionOpen(false);
  };

  const handleAddItem = () => {
    toast({
      title: "Partida creada",
      description: "Nueva partida añadida (demo)",
    });
    setAddItemOpen(false);
    setSelectedSectionId("");
  };

  const openAddItemModal = (sectionId: string) => {
    setSelectedSectionId(sectionId);
    setAddItemOpen(true);
  };

  return (
    <AppLayout title="Partidas">
      <div className="space-y-4 w-full overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-body text-muted-foreground">
            Catálogo de partidas estándar organizadas por sección
          </p>
          
          {/* Botón Agregar Sección */}
          <Dialog open={addSectionOpen} onOpenChange={setAddSectionOpen}>
            <DialogTrigger asChild>
              <Button variant="action" className="w-full sm:w-auto">
                <FolderPlus className="h-5 w-5" />
                Agregar Sección
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Nueva Sección</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="section-name">Nombre de la sección</Label>
                  <Input id="section-name" placeholder="Ej: Carpintería" className="h-12" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="section-icon">Icono (emoji)</Label>
                  <Input id="section-icon" placeholder="Ej: 🪚" className="h-12" />
                </div>
                <Button variant="action" className="w-full" onClick={handleAddSection}>
                  Crear Sección
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {sections.map((section) => {
          const templates = getTemplatesBySection(section.id);
          const isOpen = openSections.includes(section.id);

          return (
            <Collapsible
              key={section.id}
              open={isOpen}
              onOpenChange={() => toggleSection(section.id)}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full h-14 justify-between px-4 bg-secondary hover:bg-secondary/80 rounded-xl border-2 border-border"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{section.icon}</span>
                    <span className="text-body-lg font-semibold">{section.name}</span>
                    <span className="text-small text-muted-foreground">
                      ({templates.length})
                    </span>
                  </div>
                  {isOpen ? (
                    <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform duration-200" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform duration-200" />
                  )}
                </Button>
              </CollapsibleTrigger>

              <CollapsibleContent className="overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2 duration-200">
                <div className="pt-3 pl-4 space-y-3 border-l-2 border-primary/30 ml-4">
                  {templates.map((template) => (
                    <ItemTemplateCard
                      key={template.id}
                      template={template}
                      onEdit={() => handleEdit(template.name)}
                    />
                  ))}
                  
                  {/* Botón agregar partida dentro de sección */}
                  <Button 
                    variant="outline" 
                    className="w-full h-12 border-dashed border-2"
                    onClick={() => openAddItemModal(section.id)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar partida a {section.name}
                  </Button>
                </div>
              </CollapsibleContent>
            </Collapsible>
          );
        })}

        {/* Modal Agregar Partida */}
        <Dialog open={addItemOpen} onOpenChange={setAddItemOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Nueva Partida</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Sección</Label>
                <Select value={selectedSectionId} onValueChange={setSelectedSectionId}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Seleccionar sección" />
                  </SelectTrigger>
                  <SelectContent>
                    {sections.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.icon} {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="item-name">Nombre de la partida</Label>
                <Input id="item-name" placeholder="Ej: Instalación enchufe" className="h-12" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="item-unit">Unidad</Label>
                <Input id="item-unit" placeholder="Ej: ud, m², ml" className="h-12" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="item-price-install">Precio instalación (€)</Label>
                  <Input id="item-price-install" type="number" placeholder="0" className="h-12" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="item-price-supply">Precio suministro (€)</Label>
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
    </AppLayout>
  );
}
