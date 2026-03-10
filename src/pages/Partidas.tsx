import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FolderPlus, ChevronRight, MoreVertical, Pencil, Trash2, Eye } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useSections, useTemplates } from "@/hooks/useSections";
import { SECTION_ICONS } from "@/lib/constants";
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

export default function Partidas() {
  const navigate = useNavigate();
  const { data: sections = [], isLoading: loadingSections, error: sectionsError } = useSections();
  const { data: templates = [], isLoading: loadingTemplates } = useTemplates();

  const [addSectionOpen, setAddSectionOpen] = useState(false);
  const [editSectionOpen, setEditSectionOpen] = useState(false);
  const [deleteSectionOpen, setDeleteSectionOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<any | null>(null);
  const [newSectionEmoji, setNewSectionEmoji] = useState("🧱");
  const [editSectionEmoji, setEditSectionEmoji] = useState("");

  const templateCountBySection = useMemo(() => {
    const map: Record<string, number> = {};
    templates.forEach((t: any) => {
      map[t.section_id] = (map[t.section_id] || 0) + 1;
    });
    return map;
  }, [templates]);

  const handleAddSection = () => {
    toast({
      title: "Pendiente",
      description: "Creacion de secciones se conecta en la siguiente fase.",
    });
    setAddSectionOpen(false);
    setNewSectionEmoji("🧱");
  };

  const handleEditSection = () => {
    toast({
      title: "Pendiente",
      description: "Edicion de secciones se conecta en la siguiente fase.",
    });
    setEditSectionOpen(false);
    setSelectedSection(null);
  };

  const handleDeleteSection = () => {
    toast({
      title: "Pendiente",
      description: "Eliminacion de secciones se conecta en la siguiente fase.",
    });
    setDeleteSectionOpen(false);
    setSelectedSection(null);
  };

  const openEditModal = (section: any) => {
    setSelectedSection(section);
    setEditSectionEmoji(section.icon);
    setEditSectionOpen(true);
  };

  const openDeleteModal = (section: any) => {
    setSelectedSection(section);
    setDeleteSectionOpen(true);
  };

  if (loadingSections || loadingTemplates) {
    return (
      <AppLayout title="Partidas">
        <p className="text-muted-foreground">Cargando catalogo...</p>
      </AppLayout>
    );
  }

  if (sectionsError) {
    return (
      <AppLayout title="Partidas">
        <p className="text-destructive">No se pudieron cargar las secciones.</p>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Partidas">
      <div className="space-y-4 w-full">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-sm">Selecciona una seccion</p>

          <Dialog open={addSectionOpen} onOpenChange={setAddSectionOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <FolderPlus className="h-4 w-4" />
                Nueva
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Nueva Seccion</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="section-name">Nombre</Label>
                  <Input id="section-name" placeholder="Ej: Carpinteria" className="h-12" />
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
                        {SECTION_ICONS.map((emoji) => (
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
                  Crear Seccion
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-3">
          {sections.map((section: any) => {
            const count = templateCountBySection[section.id] || 0;

            return (
              <Card key={section.id} className="p-0 overflow-hidden">
                <div className="flex items-center justify-between p-5 bg-card hover:bg-muted/50 transition-colors">
                  <div
                    className="flex items-center gap-4 flex-1 cursor-pointer"
                    onClick={() => navigate(`/partidas/${section.id}`)}
                  >
                    <span className="text-3xl">{section.icon}</span>
                    <div>
                      <h3 className="font-semibold text-lg">{section.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {count} {count === 1 ? "partida" : "partidas"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm" onClick={(e) => e.stopPropagation()}>
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

                    <ChevronRight className="h-6 w-6 text-muted-foreground cursor-pointer" onClick={() => navigate(`/partidas/${section.id}`)} />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      <Dialog open={editSectionOpen} onOpenChange={setEditSectionOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Seccion</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-section-name">Nombre</Label>
              <Input id="edit-section-name" defaultValue={selectedSection?.name} className="h-12" />
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
                    {SECTION_ICONS.map((emoji) => (
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

      <AlertDialog open={deleteSectionOpen} onOpenChange={setDeleteSectionOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar seccion?</AlertDialogTitle>
            <AlertDialogDescription>
              Se eliminara la seccion "{selectedSection?.name}" y todas sus partidas.
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
