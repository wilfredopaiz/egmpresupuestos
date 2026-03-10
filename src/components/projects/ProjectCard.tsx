import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { calculateProjectTotal, formatCurrency } from "@/lib/calculations";
import { projectStatuses } from "@/data/mockData";
import { Edit, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface ProjectCardProps {
  project: any;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const total = calculateProjectTotal(project);
  const status = projectStatuses[project.status];

  return (
    <Card className="hover:shadow-elevated transition-shadow duration-300 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-subheading font-semibold truncate group-hover:text-primary transition-colors">
              {project.name}
            </h3>
            <p className="text-body text-muted-foreground truncate">
              {project.client?.name ?? project.client_name ?? "Sin cliente"}
            </p>
          </div>
          <Badge 
            variant="secondary" 
            className={`${status.color} shrink-0 text-small font-medium`}
          >
            {status.label}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-small text-muted-foreground">Total estimado</p>
            <p className="text-heading font-bold text-foreground">
              {formatCurrency(total)}
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              asChild
              className="h-12 w-12"
            >
              <Link to={`/proyecto/${project.id}`}>
                <Edit className="h-5 w-5" />
              </Link>
            </Button>
            <Button 
              variant="action" 
              size="icon"
              asChild
              className="h-12 w-12"
            >
              <Link to={`/presupuesto?proyecto=${project.id}`}>
                <ChevronRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>

        {project.notes && (
          <p className="mt-4 text-small text-muted-foreground line-clamp-2 border-t pt-3">
            {project.notes}
          </p>
        )}

        <p className="mt-3 text-small text-muted-foreground/70">
          {(project.items?.length ?? 0)} partida{(project.items?.length ?? 0) !== 1 ? "s" : ""}
        </p>
      </CardContent>
    </Card>
  );
}
