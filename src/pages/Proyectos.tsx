import { AppLayout } from "@/components/layout/AppLayout";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { Button } from "@/components/ui/button";
import { mockProjects } from "@/data/mockData";
import { PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function Proyectos() {
  return (
    <AppLayout title="Proyectos">
      <div className="space-y-6 w-full overflow-hidden">
        {/* Header con botón */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-body text-muted-foreground">
            {mockProjects.length} proyecto{mockProjects.length !== 1 ? "s" : ""} activo{mockProjects.length !== 1 ? "s" : ""}
          </p>
          <Button variant="action" asChild className="w-full sm:w-auto">
            <Link to="/nueva-obra">
              <PlusCircle className="h-5 w-5" />
              Nueva obra
            </Link>
          </Button>
        </div>

        {/* Lista de proyectos */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mockProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {mockProjects.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <PlusCircle className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-subheading font-semibold mb-2">
              Sin proyectos
            </h3>
            <p className="text-body text-muted-foreground mb-6 max-w-sm">
              Crea tu primera obra para empezar a generar presupuestos
            </p>
            <Button variant="action" size="lg" asChild>
              <Link to="/nueva-obra">
                <PlusCircle className="h-5 w-5" />
                Crear primera obra
              </Link>
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
