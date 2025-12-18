import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Clock,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  // Calculate stats
  const totalProjects = mockProjects.length;
  const totalClients = mockClients.length;
  const totalBudget = mockProjects.reduce(
    (sum, project) => sum + calculateProjectTotal(project),
    0
  );

  // Projects by status
  const projectsByStatus = mockProjects.reduce((acc, project) => {
    acc[project.status] = (acc[project.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Recent projects
  const recentProjects = [...mockProjects]
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 3);

  // Average budget
  const avgBudget = totalProjects > 0 ? totalBudget / totalProjects : 0;

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

          <Card className="bg-secondary/50 border-secondary">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                  <Users className="h-5 w-5 text-secondary-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalClients}</p>
                  <p className="text-small text-muted-foreground">Clientes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-2">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-accent flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{formatCurrency(totalBudget)}</p>
                  <p className="text-small text-muted-foreground">
                    Volumen total presupuestado
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status breakdown */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              Estado de proyectos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(projectStatuses).map(([key, status]) => {
              const count = projectsByStatus[key] || 0;
              return (
                <div
                  key={key}
                  className="flex items-center justify-between py-2"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded-md text-small font-medium ${status.color}`}
                    >
                      {status.label}
                    </span>
                  </div>
                  <span className="text-body-lg font-bold">{count}</span>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Average budget */}
        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-small text-muted-foreground mb-1">
                  Presupuesto medio
                </p>
                <p className="text-heading font-bold">{formatCurrency(avgBudget)}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-background flex items-center justify-center">
                <Calculator className="h-6 w-6 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent projects */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Proyectos recientes
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/proyectos">Ver todos</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentProjects.map((project) => {
              const total = calculateProjectTotal(project);
              const status = projectStatuses[project.status];
              return (
                <Link
                  key={project.id}
                  to={`/proyecto/${project.id}`}
                  className="block p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold truncate">{project.name}</p>
                      <p className="text-small text-muted-foreground">
                        {project.client}
                      </p>
                    </div>
                    <span className="text-body font-bold shrink-0">
                      {formatCurrency(total)}
                    </span>
                  </div>
                  <div className="mt-2">
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${status.color}`}
                    >
                      {status.label}
                    </span>
                  </div>
                </Link>
              );
            })}
          </CardContent>
        </Card>

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