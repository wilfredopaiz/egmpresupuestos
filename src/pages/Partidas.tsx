import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FolderPlus, ChevronRight, MoreVertical, Pencil, Eye, EyeOff } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  useSections,
  useTemplates,
  useCreateSection,
  useUpdateSection,
  useToggleSectionHidden,
} from "@/hooks/useSections";
import { SECTION_ICONS } from "@/lib/constants";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Switch } from "@/components/ui/switch";

export default function Partidas() {
  const navigate = useNavigate();
  const [showHidden, setShowHidden] = useState(false);
  const { data: sections = [], isLoading: loadingSections, error: sectionsError } = useSections(showHidden);
  const { data: templates = [], isLoading: loadingTemplates } = useTemplates(showHidden);
  const createSection = useCreateSection();
  const updateSection = useUpdateSection();
  const toggleSectionHidden = useToggleSectionHidden();

  const [addSectionOpen, setAddSectionOpen] = useState(false);
  const [editSectionOpen, setEditSectionOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<any | null>(null);

  const [newSectionName, setNewSectionName] = useState("");
  const [newSectionEmoji, setNewSectionEmoji] = useState(SECTION_ICONS[0]);
  const [editSectionName, setEditSectionName] = useState("");
  const [editSectionEmoji, setEditSectionEmoji] = useState("");

  const templateCountBySection = useMemo(() => {
    const map: Record<string, number> = {};
    templates.forEach((t: any) => {
      map[t.section_id] = (map[t.section_id] || 0) + 1;
    });
    return map;
  }, [templates]);

  const handleAddSection = () => {
    if (!newSectionName.trim()) {
      toast({
        title: "Error",
        description: "El nombre de la seccion es obligatorio",
        variant: "destructive",
      });
      return;
    }

    createSection.mutate(
      {
        name: newSectionName.trim(),
        icon: newSectionEmoji,
      },
      {
        onSuccess: () => {
          toast({
            title: "Seccion creada",
            description: `"${newSectionName.trim()}" se ha creado correctamente`,
          });
          setAddSectionOpen(false);
          setNewSectionName("");
          setNewSectionEmoji(SECTION_ICONS[0]);
        },
        onError: () => {
          toast({
            title: "Error",
            description: "No se pudo crear la seccion",
            variant: "destructive",
          });
        },
      },
    );
  };

  const handleEditSection = () => {
    if (!selectedSection) return;

    if (!editSectionName.trim()) {
      toast({
        title: "Error",
        description: "El nombre de la seccion es obligatorio",
        variant: "destructive",
      });
      return;
    }

    updateSection.mutate(
      {
        id: selectedSection.id,
        updates: {
          name: editSectionName.trim(),
          icon: editSectionEmoji,
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "Seccion actualizada",
            description: `"${editSectionName.trim()}" se ha actualizado`,
          });
          setEditSectionOpen(false);
          setSelectedSection(null);
          setEditSectionName("");
          setEditSectionEmoji("");
        },
        onError: () => {
          toast({
            title: "Error",
            description: "No se pudo actualizar la seccion",
            variant: "destructive",
          });
        },
      },
    );
  };

  const openEditModal = (section: any) => {
    setSelectedSection(section);
    setEditSectionName(section.name);
    setEditSectionEmoji(section.icon);
    setEditSectionOpen(true);
  };

  const handleToggleHidden = (section: any, hidden: boolean) => {
    toggleSectionHidden.mutate(
      {
        id: section.id,
        hidden,
      },
      {
        onSuccess: () => {
          toast({
            title: hidden ? "Seccion oculta" : "Seccion visible",
            description: `"${section.name}" ${hidden ? "se ha ocultado" : "se ha reactivado"}`,
          });
        },
        onError: () => {
          toast({
            title: "Error",
            description: "No se pudo actualizar la seccion",
            variant: "destructive",
          });
        },
      },
    );
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
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <p className="text-muted-foreground text-sm">Selecciona una seccion</p>
            <div className="flex items-center gap-2">
              <Switch id="show-hidden-sections" checked={showHidden} onCheckedChange={setShowHidden} />
              <Label htmlFor="show-hidden-sections" className="text-sm text-muted-foreground">
                Mostrar ocultas
              </Label>
            </div>
          </div>

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
                  <Input
                    id="section-name"
                    placeholder="Ej: Carpinteria"
                    className="h-12"
                    value={newSectionName}
                    onChange={(e) => setNewSectionName(e.target.value)}
                  />
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
                  {createSection.isPending ? "Creando..." : "Crear Seccion"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-3">
          {sections.map((section: any) => {
            const count = templateCountBySection[section.id] || 0;

            return (
              <Card key={section.id} className={`p-0 overflow-hidden ${section.hidden ? "opacity-60" : ""}`}>
                <div className="flex items-center justify-between p-5 bg-card hover:bg-muted/50 transition-colors">
                  <div
                    className="flex items-center gap-4 flex-1 cursor-pointer"
                    onClick={() => navigate(`/partidas/${section.id}`)}
                  >
                    <span className="text-3xl">{section.icon}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{section.name}</h3>
                        {section.hidden && (
                          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                            Oculta
                          </span>
                        )}
                      </div>
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
                          onClick={() => handleToggleHidden(section, !section.hidden)}
                          className={section.hidden ? "" : "text-destructive focus:text-destructive"}
                        >
                          <EyeOff className="h-4 w-4 mr-2" />
                          {section.hidden ? "Mostrar" : "Ocultar"}
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

      <Dialog open={editSectionOpen} onOpenChange={setEditSectionOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Seccion</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-section-name">Nombre</Label>
              <Input
                id="edit-section-name"
                value={editSectionName}
                onChange={(e) => setEditSectionName(e.target.value)}
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
              {updateSection.isPending ? "Guardando..." : "Guardar cambios"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
