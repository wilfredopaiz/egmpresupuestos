import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { sections, getTemplatesBySection } from "@/data/mockData";
import { FolderPlus, ChevronRight } from "lucide-react";
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

export default function Partidas() {
  const navigate = useNavigate();
  const [addSectionOpen, setAddSectionOpen] = useState(false);

  const handleAddSection = () => {
    toast({
      title: "Sección creada",
      description: "Nueva sección añadida (demo)",
    });
    setAddSectionOpen(false);
  };

  return (
    <AppLayout title="Partidas">
      <div className="space-y-4 w-full">
        {/* Header con botón */}
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-sm">
            Selecciona una sección
          </p>
          
          <Dialog open={addSectionOpen} onOpenChange={setAddSectionOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <FolderPlus className="h-4 w-4" />
                Nueva
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Nueva Sección</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="section-name">Nombre</Label>
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

        {/* Grid de secciones */}
        <div className="grid gap-3">
          {sections.map((section) => {
            const templates = getTemplatesBySection(section.id);
            
            return (
              <Card
                key={section.id}
                className="p-0 overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
                onClick={() => navigate(`/partidas/${section.id}`)}
              >
                <div className="flex items-center justify-between p-5 bg-card hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{section.icon}</span>
                    <div>
                      <h3 className="font-semibold text-lg">{section.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {templates.length} {templates.length === 1 ? 'partida' : 'partidas'}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-6 w-6 text-muted-foreground" />
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
