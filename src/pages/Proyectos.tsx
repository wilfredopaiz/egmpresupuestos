import { useState, useMemo, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { calculateProjectTotal } from "@/lib/calculations";
import { PROJECT_STATUSES } from "@/lib/constants";
import { useClients } from "@/hooks/useClients";
import { useProjects } from "@/hooks/useProjects";
import { PlusCircle, Search, Filter, ChevronDown, X } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

export default function Proyectos() {
  const [searchParams] = useSearchParams();
  const clientIdFromUrl = searchParams.get("client_id");
  const statusFromUrl = searchParams.get("status");
  const { projects, isLoading, error } = useProjects();
  const { data: clients = [] } = useClients();
  const [searchQuery, setSearchQuery] = useState("");
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [clientFilter, setClientFilter] = useState<string>(clientIdFromUrl ?? "all");
  const [statusFilter, setStatusFilter] = useState<string>(statusFromUrl ?? "all");
  const [budgetFilter, setBudgetFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setClientFilter(clientIdFromUrl ?? "all");
  }, [clientIdFromUrl]);

  useEffect(() => {
    setStatusFilter(statusFromUrl ?? "all");
  }, [statusFromUrl]);

  // Get unique years from projects
  const years = useMemo(() => {
    const uniqueYears = [
      ...new Set(projects.map((p) => new Date(p.created_at).getFullYear())),
    ].sort((a, b) => b - a);
    return uniqueYears;
  }, [projects]);

  // Filter projects
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Search filter
      if (
        searchQuery &&
        !project.name.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Year filter
      if (
        yearFilter !== "all" &&
        new Date(project.created_at).getFullYear().toString() !== yearFilter
      ) {
        return false;
      }

      // Client filter
      if (clientFilter !== "all" && project.client_id !== clientFilter) {
        return false;
      }

      // Status filter
      if (statusFilter !== "all" && project.status !== statusFilter) {
        return false;
      }

      // Budget filter
      if (budgetFilter !== "all") {
        const total = calculateProjectTotal(project);
        switch (budgetFilter) {
          case "lt25":
            if (total >= 25000) return false;
            break;
          case "25_50":
            if (total < 25000 || total >= 50000) return false;
            break;
          case "50_80":
            if (total < 50000 || total >= 80000) return false;
            break;
          case "80_120":
            if (total < 80000 || total >= 120000) return false;
            break;
          case "120_150":
            if (total < 120000 || total >= 150000) return false;
            break;
          case "gt150":
            if (total < 150000) return false;
            break;
        }
      }

      return true;
    });
  }, [projects, searchQuery, yearFilter, clientFilter, statusFilter, budgetFilter]);

  const hasActiveFilters =
    yearFilter !== "all" || clientFilter !== "all" || statusFilter !== "all" || budgetFilter !== "all";

  const clearFilters = () => {
    setYearFilter("all");
    setClientFilter("all");
    setStatusFilter("all");
    setBudgetFilter("all");
    setSearchQuery("");
  };

  if (isLoading) {
    return (
      <AppLayout title="Proyectos">
        <p className="text-muted-foreground">Cargando proyectos...</p>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout title="Proyectos">
        <p className="text-destructive">No se pudieron cargar los proyectos.</p>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Proyectos">
      <div className="flex flex-col gap-4 overflow-hidden">
        {/* Search */}
        <div className="relative flex-shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Buscar obra..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 w-full"
          />
        </div>

        {/* Filter toggle + New button */}
        <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
          <Button
            variant={hasActiveFilters ? "secondary" : "outline"}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            Filtros
            {hasActiveFilters && (
              <span className="h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                {[yearFilter, clientFilter, budgetFilter].filter(
                  (f) => f !== "all"
                ).length + (statusFilter !== "all" ? 1 : 0)}
              </span>
            )}
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                showFilters ? "rotate-180" : ""
              }`}
            />
          </Button>

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4" />
              Limpiar
            </Button>
          )}

          <div className="flex-1 min-w-0" />

          <Button variant="action" asChild size="sm" className="shrink-0">
            <Link to="/nueva-obra">
              <PlusCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Nueva obra</span>
            </Link>
          </Button>
        </div>

        {/* Collapsible filters */}
        <Collapsible open={showFilters} onOpenChange={setShowFilters}>
          <CollapsibleContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 rounded-lg bg-muted/50">
              {/* Year filter */}
              <div className="space-y-1.5">
                <label className="text-small font-medium text-muted-foreground">
                  Año
                </label>
                <Select value={yearFilter} onValueChange={setYearFilter}>
                  <SelectTrigger className="h-10 w-full">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    <SelectItem value="all">Todos los años</SelectItem>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Client filter */}
              <div className="space-y-1.5">
                <label className="text-small font-medium text-muted-foreground">
                  Cliente
                </label>
                <Select value={clientFilter} onValueChange={setClientFilter}>
                  <SelectTrigger className="h-10 w-full">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    <SelectItem value="all">Todos los clientes</SelectItem>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status filter */}
              <div className="space-y-1.5">
                <label className="text-small font-medium text-muted-foreground">
                  Estado
                </label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-10 w-full">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    <SelectItem value="all">Todos los estados</SelectItem>
                    {Object.entries(PROJECT_STATUSES).map(([key, status]) => (
                      <SelectItem key={key} value={key}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Budget filter */}
              <div className="space-y-1.5">
                <label className="text-small font-medium text-muted-foreground">
                  Presupuesto
                </label>
                <Select value={budgetFilter} onValueChange={setBudgetFilter}>
                  <SelectTrigger className="h-10 w-full">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    <SelectItem value="all">Cualquier importe</SelectItem>
                    <SelectItem value="lt25">&lt; 25.000 €</SelectItem>
                    <SelectItem value="25_50">25.000 - 50.000 €</SelectItem>
                    <SelectItem value="50_80">50.000 - 80.000 €</SelectItem>
                    <SelectItem value="80_120">80.000 - 120.000 €</SelectItem>
                    <SelectItem value="120_150">120.000 - 150.000 €</SelectItem>
                    <SelectItem value="gt150">&gt; 150.000 €</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Results count */}
        <p className="text-small text-muted-foreground flex-shrink-0">
          {filteredProjects.length} proyecto
          {filteredProjects.length !== 1 ? "s" : ""}
          {hasActiveFilters && " encontrado"}
          {hasActiveFilters && filteredProjects.length !== 1 ? "s" : ""}
        </p>

        {/* Project list */}
        <div className="flex flex-col gap-4">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-subheading font-semibold mb-2">
              Sin resultados
            </h3>
            <p className="text-body text-muted-foreground mb-6 max-w-sm">
              {hasActiveFilters || searchQuery
                ? "No hay proyectos que coincidan con tu búsqueda"
                : "Crea tu primera obra para empezar"}
            </p>
            {hasActiveFilters || searchQuery ? (
              <Button variant="outline" onClick={clearFilters}>
                Limpiar filtros
              </Button>
            ) : (
              <Button variant="action" size="lg" asChild>
                <Link to="/nueva-obra">
                  <PlusCircle className="h-5 w-5" />
                  Crear primera obra
                </Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
