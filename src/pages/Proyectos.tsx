import { useState, useMemo } from "react";
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
import { mockProjects, mockClients, calculateProjectTotal } from "@/data/mockData";
import { PlusCircle, Search, Filter, ChevronDown, X } from "lucide-react";
import { Link } from "react-router-dom";

export default function Proyectos() {
  const [searchQuery, setSearchQuery] = useState("");
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [clientFilter, setClientFilter] = useState<string>("all");
  const [budgetFilter, setBudgetFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  // Get unique years from projects
  const years = useMemo(() => {
    const uniqueYears = [
      ...new Set(mockProjects.map((p) => p.createdAt.getFullYear())),
    ].sort((a, b) => b - a);
    return uniqueYears;
  }, []);

  // Filter projects
  const filteredProjects = useMemo(() => {
    return mockProjects.filter((project) => {
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
        project.createdAt.getFullYear().toString() !== yearFilter
      ) {
        return false;
      }

      // Client filter
      if (clientFilter !== "all" && project.client !== clientFilter) {
        return false;
      }

      // Budget filter
      if (budgetFilter !== "all") {
        const total = calculateProjectTotal(project);
        switch (budgetFilter) {
          case "small":
            if (total >= 5000) return false;
            break;
          case "medium":
            if (total < 5000 || total >= 15000) return false;
            break;
          case "large":
            if (total < 15000) return false;
            break;
        }
      }

      return true;
    });
  }, [searchQuery, yearFilter, clientFilter, budgetFilter]);

  const hasActiveFilters =
    yearFilter !== "all" || clientFilter !== "all" || budgetFilter !== "all";

  const clearFilters = () => {
    setYearFilter("all");
    setClientFilter("all");
    setBudgetFilter("all");
    setSearchQuery("");
  };

  return (
    <AppLayout title="Proyectos">
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Buscar obra..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12"
          />
        </div>

        {/* Filter toggle + New button */}
        <div className="flex items-center gap-2">
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
                ).length}
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

          <div className="flex-1" />

          <Button variant="action" asChild size="sm">
            <Link to="/nueva-obra">
              <PlusCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Nueva obra</span>
            </Link>
          </Button>
        </div>

        {/* Collapsible filters */}
        <Collapsible open={showFilters} onOpenChange={setShowFilters}>
          <CollapsibleContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-lg bg-muted/50">
              {/* Year filter */}
              <div className="space-y-1.5">
                <label className="text-small font-medium text-muted-foreground">
                  Año
                </label>
                <Select value={yearFilter} onValueChange={setYearFilter}>
                  <SelectTrigger className="h-10">
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
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    <SelectItem value="all">Todos los clientes</SelectItem>
                    {mockClients.map((client) => (
                      <SelectItem key={client.id} value={client.name}>
                        {client.name}
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
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    <SelectItem value="all">Cualquier importe</SelectItem>
                    <SelectItem value="small">&lt; 5.000 €</SelectItem>
                    <SelectItem value="medium">5.000 - 15.000 €</SelectItem>
                    <SelectItem value="large">&gt; 15.000 €</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Results count */}
        <p className="text-small text-muted-foreground">
          {filteredProjects.length} proyecto
          {filteredProjects.length !== 1 ? "s" : ""}
          {hasActiveFilters && " encontrado"}
          {hasActiveFilters && filteredProjects.length !== 1 ? "s" : ""}
        </p>

        {/* Project list */}
        <div className="grid gap-4">
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