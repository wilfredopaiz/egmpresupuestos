import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PDFViewer } from "@react-pdf/renderer";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProjects, useProject } from "@/hooks/useProjects";
import { useAppSettings } from "@/hooks/useAppSettings";
import { PresupuestoPDF } from "@/components/presupuesto/PresupuestoPDF";
import { calculateProjectTotal, calculateProjectWithAdjustments } from "@/lib/calculations";

export default function PdfPreview() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const projectIdFromUrl = searchParams.get("proyecto");

  const { projects, isLoading: loadingProjects } = useProjects();
  const { project, isLoading: loadingProject } = useProject(projectIdFromUrl);
  const { data: appSettings } = useAppSettings();

  const selectedProject = useMemo(() => {
    if (project) return project;
    if (!projectIdFromUrl && projects.length > 0) return projects[0];
    return null;
  }, [project, projectIdFromUrl, projects]);

  const resolvedProjectId = selectedProject?.id ?? "";
  const subtotal = selectedProject ? calculateProjectTotal(selectedProject) : 0;
  const includeIva = selectedProject?.include_iva ?? true;
  const ivaPercentage = selectedProject?.iva_percentage ?? 21;
  const marginPercentage = selectedProject?.margin_percentage ?? 15;
  const { subtotalWithMargin, ivaAmount, total } = calculateProjectWithAdjustments({
    subtotal,
    includeIva,
    ivaPercentage,
    marginPercentage,
  });

  if (loadingProjects || loadingProject) {
    return (
      <AppLayout title="PDF Preview">
        <p className="text-muted-foreground">Cargando preview...</p>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="PDF Preview">
      <div className="space-y-4 w-full">
        <div className="flex items-center gap-2">
          <Select
            value={resolvedProjectId}
            onValueChange={(value) => {
              setSearchParams({ proyecto: value });
            }}
          >
            <SelectTrigger className="max-w-md">
              <SelectValue placeholder="Selecciona un proyecto" />
            </SelectTrigger>
            <SelectContent className="bg-background">
              {projects.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={() => navigate("/proyectos")}>
            Volver
          </Button>
        </div>

        {!selectedProject ? (
          <p className="text-muted-foreground">No hay proyecto seleccionado.</p>
        ) : (
          <div className="h-[calc(100vh-13rem)] w-full border rounded-lg overflow-hidden">
            <PDFViewer width="100%" height="100%" showToolbar>
              <PresupuestoPDF
                project={selectedProject}
                appSettings={appSettings}
                subtotal={subtotal}
                subtotalWithMargin={subtotalWithMargin}
                marginPercentage={marginPercentage}
                includeIva={includeIva}
                ivaPercentage={ivaPercentage}
                ivaAmount={ivaAmount}
                total={total}
                logoUrl={`${window.location.origin}/logo.webp`}
              />
            </PDFViewer>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
