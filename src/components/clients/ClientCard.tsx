import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Mail, FolderKanban, Pencil, ChevronRight } from "lucide-react";
import type { Client } from "@/types";

interface ClientCardProps {
  client: Client;
  projectCount: number;
  onViewProjects: () => void;
  onEdit: () => void;
  // onDelete: () => void;
}

export function ClientCard({ client, projectCount, onViewProjects, onEdit }: ClientCardProps) {
  return (
    <Card className="hover:shadow-elevated transition-shadow duration-300">
      <CardHeader className="pb-3">
        <h3 className="text-subheading font-semibold truncate">{client.name}</h3>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-4 w-4" />
            <span className="truncate">{client.phone || "Sin teléfono"}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span className="truncate">{client.email || "Sin email"}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 border-t pt-3">
          <FolderKanban className="h-4 w-4 text-muted-foreground" />
          <p className="text-small text-muted-foreground">
            {projectCount} proyecto{projectCount !== 1 ? "s" : ""} asociado{projectCount !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex items-center justify-between gap-2 pt-1">
          <Button variant="outline" size="sm" onClick={onViewProjects} className="flex-1">
            Ver proyectos
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onEdit}>
            <Pencil className="h-4 w-4" />
          </Button>
          {/* <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button> */}
        </div>
      </CardContent>
    </Card>
  );
}
