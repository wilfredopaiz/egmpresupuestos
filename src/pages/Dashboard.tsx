import { useMemo } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, calculateProjectTotal } from "@/lib/calculations";
import { projectStatuses } from "@/data/mockData";
import { useProjects } from "@/hooks/useProjects";
import {
  TrendingUp,
  Users,
  FolderKanban,
  Calculator,
  PieChart,
  BarChart3,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { projects, isLoading, error } = useProjects();

  if (isLoading) {
    return (
      <AppLayout title="Dashboard">
        <p className="text-muted-foreground">Cargando dashboard...</p>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout title="Dashboard">
        <p className="text-destructive">No se pudieron cargar los datos.</p>
      </AppLayout>
    );
  }
  
  // Valores calculados desde proyectos reales
  const stats = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    
    const projectsThisYear = projects.filter(
      (p) => new Date(p.created_at).getFullYear() === currentYear
    );
    const projectsThisMonth = projectsThisYear.filter(
      (p) => new Date(p.created_at).getMonth() === currentMonth
    );
    
    const budgetThisYear = projectsThisYear.reduce(
      (sum, p) => sum + calculateProjectTotal(p),
      0
    );
    const budgetThisMonth = projectsThisMonth.reduce(
      (sum, p) => sum + calculateProjectTotal(p),
      0
    );
    
    const avgBudgetThisYear =
      projectsThisYear.length > 0 ? budgetThisYear / projectsThisYear.length : 0;
    const avgBudgetThisMonth =
      projectsThisMonth.length > 0 ? budgetThisMonth / projectsThisMonth.length : 0;
    
    const projectsByStatus: Record<string, number> = {};
    projects.forEach((p) => {
      projectsByStatus[p.status] = (projectsByStatus[p.status] || 0) + 1;
    });
    
    const topBudgetProjects = [...projects]
      .sort((a, b) => calculateProjectTotal(b) - calculateProjectTotal(a))
      .slice(0, 5)
      .map((p) => ({ name: p.name, amount: calculateProjectTotal(p) }));
    
    return {
      totalProjects: projects.length,
      totalClients: [...new Set(projects.map((p) => p.client?.name ?? p.client_name).filter(Boolean))].length,
      budgetThisYear,
      budgetThisMonth,
      avgBudgetThisYear,
      avgBudgetThisMonth,
      projectsByStatus,
      topBudgetProjects,
    };
  }, [projects]);

  const { 
    totalProjects, 
    totalClients, 
    budgetThisYear, 
    budgetThisMonth,
    projectsByStatus,
    topBudgetProjects 
  } = stats;
  
  const stateDistribution = [
    { label: "En medición", value: projectsByStatus["en-medicion"] || 0, color: "#f59e0b" },
    { label: "Presupuestado", value: projectsByStatus["presupuestado"] || 0, color: "#3b82f6" },
    { label: "Aprobado", value: projectsByStatus["aprobado"] || 0, color: "#22c55e" },
    { label: "En obra", value: projectsByStatus["en-obra"] || 0, color: "#a855f7" },
    { label: "Finalizado", value: projectsByStatus["finalizado"] || 0, color: "#6b7280" },
  ].filter(s => s.value > 0);
  const distributionTotal = stateDistribution.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;
  const conicGradient =
    distributionTotal > 0
      ? stateDistribution
          .map((item) => {
            const start = currentAngle;
            const slice = (item.value / distributionTotal) * 360;
            const end = start + slice;
            currentAngle = end;
            return `${item.color} ${start}deg ${end}deg`;
          })
          .join(", ")
      : "#e5e7eb";
  const topMax = Math.max(...topBudgetProjects.map((p) => p.amount));

  return (
    <AppLayout title="Dashboard">
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-primary/10 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <FolderKanban className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalProjects}</p>
                  <p className="text-small text-muted-foreground">Proyectos Nuevos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted/50 border-muted">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                  <Users className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalClients}</p>
                  <p className="text-small text-muted-foreground">Clientes Nuevos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Budget volume cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-accent-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-lg font-bold truncate">{formatCurrency(budgetThisYear)}</p>
                  <p className="text-small text-muted-foreground">
                    Total presupuestado este <strong>año</strong>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-accent-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-lg font-bold truncate">{formatCurrency(budgetThisMonth)}</p>
                  <p className="text-small text-muted-foreground">
                    Total presupuestado este <strong>mes</strong>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status breakdown - compact */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Calculator className="h-4 w-4 text-primary" />
              <span className="text-small font-medium">Estado de proyectos</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(projectStatuses).map(([key, status]) => {
                const count = projectsByStatus[key] || 0;
                return (
                  <div
                    key={key}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-small ${status.color}`}
                  >
                    <span className="font-medium">{status.label}</span>
                    <span className="font-bold">{count}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Distribución por estado */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center gap-2">
              <PieChart className="h-4 w-4 text-primary" />
              <span className="text-small font-medium">Distribución por estado</span>
            </div>
            <div className="flex items-center gap-4">
              <div
                className="h-28 w-28 rounded-full border border-muted shadow-inner"
                style={{
                  background: distributionTotal ? `conic-gradient(${conicGradient})` : "#e5e7eb",
                }}
              />
              <div className="flex-1 space-y-2">
                {stateDistribution.map((item) => (
                  <div key={item.label} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-small">{item.label}</span>
                    </div>
                    <span className="text-small font-semibold">
                      {distributionTotal ? Math.round((item.value / distributionTotal) * 100) : 0}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top proyectos por presupuesto */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              <span className="text-small font-medium">Top 5 proyectos por presupuesto</span>
            </div>
            <div className="space-y-3">
              {topBudgetProjects.map((project) => {
                const width = topMax ? Math.round((project.amount / topMax) * 100) : 0;
                return (
                  <div key={project.name} className="space-y-1">
                    <div className="flex items-center justify-between text-small">
                      <span className="truncate">{project.name}</span>
                      <span className="font-semibold">{formatCurrency(project.amount)}</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
