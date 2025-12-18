import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import {
  mockProjects,
  mockClients,
  calculateProjectTotal,
  formatCurrency,
  projectStatuses,
} from "@/data/mockData";
import {
  TrendingUp,
  Users,
  FolderKanban,
  Calculator,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  // Calculate stats
  const totalProjects = mockProjects.length;
  const totalClients = mockClients.length;

  // Projects this year
  const projectsThisYear = mockProjects.filter(
    (p) => p.createdAt.getFullYear() === currentYear
  );
  const budgetThisYear = projectsThisYear.reduce(
    (sum, project) => sum + calculateProjectTotal(project),
    0
  );

  // Projects this month
  const projectsThisMonth = mockProjects.filter(
    (p) =>
      p.createdAt.getFullYear() === currentYear &&
      p.createdAt.getMonth() === currentMonth
  );
  const budgetThisMonth = projectsThisMonth.reduce(
    (sum, project) => sum + calculateProjectTotal(project),
    0
  );

  // Average budget this year and month
  const avgBudgetThisYear =
    projectsThisYear.length > 0 ? budgetThisYear / projectsThisYear.length : 0;
  const avgBudgetThisMonth =
    projectsThisMonth.length > 0 ? budgetThisMonth / projectsThisMonth.length : 0;

  // Projects by status
  const projectsByStatus = mockProjects.reduce((acc, project) => {
    acc[project.status] = (acc[project.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

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
                  <p className="text-small text-muted-foreground">Proyectos</p>
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
                  <p className="text-small text-muted-foreground">Clientes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Budget volume cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-accent-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-lg font-bold truncate">{formatCurrency(budgetThisYear)}</p>
                  <p className="text-small text-muted-foreground">
                    Este año
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
                    Este mes
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

        {/* Average budget cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <p className="text-small text-muted-foreground mb-1">
                Presupuesto medio (año)
              </p>
              <p className="text-lg font-bold">{formatCurrency(avgBudgetThisYear)}</p>
            </CardContent>
          </Card>

          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <p className="text-small text-muted-foreground mb-1">
                Presupuesto medio (mes)
              </p>
              <p className="text-lg font-bold">{formatCurrency(avgBudgetThisMonth)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="action" size="lg" asChild className="h-14">
            <Link to="/nueva-obra">Nueva obra</Link>
          </Button>
          <Button variant="outline" size="lg" asChild className="h-14">
            <Link to="/partidas">Ver partidas</Link>
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}