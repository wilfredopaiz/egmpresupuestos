import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { sections, getTemplatesBySection, sectionEmojis } from "@/data/mockData";
import { FolderPlus, ChevronRight, MoreVertical, Pencil, Trash2, Eye } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

export default function Partidas() {
  const navigate = useNavigate();
  const [addSectionOpen, setAddSectionOpen] = useState(false);
  const [editSectionOpen, setEditSectionOpen] = useState(false);
  const [deleteSectionOpen, setDeleteSectionOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<typeof sections[0] | null>(null);
  const [newSectionEmoji, setNewSectionEmoji] = useState("🧱");
  const [editSectionEmoji, setEditSectionEmoji] = useState("");

  const handleAddSection = () => {
    toast({
      title: "Sección creada",
      description: "Nueva sección añadida (demo)",
    });
    setAddSectionOpen(false);
    setNewSectionEmoji("🧱");
  };

  const handleEditSection = () => {
    toast({
      title: "Sección actualizada",
      description: `"${selectedSection?.name}" se ha actualizado (demo)`,
    });
    setEditSectionOpen(false);
    setSelectedSection(null);
  };

  const handleDeleteSection = () => {
    toast({
      title: "Sección eliminada",
      description: `"${selectedSection?.name}" se ha eliminado (demo)`,
    });
    setDeleteSectionOpen(false);
    setSelectedSection(null);
  };

  const openEditModal = (section: typeof sections[0]) => {
    setSelectedSection(section);
    setEditSectionEmoji(section.icon);
    setEditSectionOpen(true);
  };

  const openDeleteModal = (section: typeof sections[0]) => {
    setSelectedSection(section);
    setDeleteSectionOpen(true);
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
                  <Label>Icono</Label>
                  <Select value={newSectionEmoji} onValueChange={setNewSectionEmoji}>
                    <SelectTrigger className="h-12">
                      <SelectValue>
                        <span className="text-2xl">{newSectionEmoji}</span>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-background">
                      <div className="grid grid-cols-5 gap-1 p-2">
                        {sectionEmojis.map((emoji) => (
                          <SelectItem 
                            key={emoji} 
                            value={emoji}
                            className="flex items-center justify-center p-2 cursor-pointer hover:bg-muted rounded-md text-2xl"
                          >
                            {emoji}
                          </SelectItem>
                        ))}
                      </div>
                    </SelectContent>
                  </Select>
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
                className="p-0 overflow-hidden"
              >
                <div className="flex items-center justify-between p-5 bg-card hover:bg-muted/50 transition-colors">
                  <div 
                    className="flex items-center gap-4 flex-1 cursor-pointer"
                    onClick={() => navigate(`/partidas/${section.id}`)}
                  >
                    <span className="text-3xl">{section.icon}</span>
                    <div>
                      <h3 className="font-semibold text-lg">{section.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {templates.length} {templates.length === 1 ? 'partida' : 'partidas'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon-sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-background">
                        <DropdownMenuItem onClick={() => navigate(`/partidas/${section.id}`)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditModal(section)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => openDeleteModal(section)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    
                    <ChevronRight 
                      className="h-6 w-6 text-muted-foreground cursor-pointer" 
                      onClick={() => navigate(`/partidas/${section.id}`)}
                    />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Modal de editar sección */}
      <Dialog open={editSectionOpen} onOpenChange={setEditSectionOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Sección</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-section-name">Nombre</Label>
              <Input 
                id="edit-section-name" 
                defaultValue={selectedSection?.name}
                className="h-12" 
              />
            </div>
            <div className="space-y-2">
              <Label>Icono</Label>
              <Select value={editSectionEmoji} onValueChange={setEditSectionEmoji}>
                <SelectTrigger className="h-12">
                  <SelectValue>
                    <span className="text-2xl">{editSectionEmoji}</span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-background">
                  <div className="grid grid-cols-5 gap-1 p-2">
                    {sectionEmojis.map((emoji) => (
                      <SelectItem 
                        key={emoji} 
                        value={emoji}
                        className="flex items-center justify-center p-2 cursor-pointer hover:bg-muted rounded-md text-2xl"
                      >
                        {emoji}
                      </SelectItem>
                    ))}
                  </div>
                </SelectContent>
              </Select>
            </div>
            <Button variant="action" className="w-full" onClick={handleEditSection}>
              Guardar cambios
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de confirmación de eliminación */}
      <AlertDialog open={deleteSectionOpen} onOpenChange={setDeleteSectionOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar sección?</AlertDialogTitle>
            <AlertDialogDescription>
              Se eliminará la sección "{selectedSection?.name}" y todas sus partidas. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteSection}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}