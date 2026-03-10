import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  calculateProjectTotal,
  calculateProjectTotalBySection,
  formatCurrency,
  calculateItemTotal,
} from "@/lib/calculations";
import { PROJECT_STATUSES } from "@/lib/constants";
import { useProject, useUpdateProject } from "@/hooks/useProjects";
import { Calculator, FileText, Share2, ArrowLeft, ChevronDown, Pencil } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useSections } from "@/hooks/useSections";

export default function Presupuesto() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const projectIdFromUrl = searchParams.get("proyecto");
  const isEditMode = searchParams.get("modo") === "editar";

  const { project, isLoading, error } = useProject(projectIdFromUrl);
  const updateProject = useUpdateProject();
  const { data: sections = [] } = useSections();

  const [marginInput, setMarginInput] = useState<string | null>(null);
  const [ivaInput, setIvaInput] = useState<string | null>(null);
  const [showBreakdown, setShowBreakdown] = useState(false);

  if (isLoading) {
    return (
      <AppLayout title="Presupuesto">
        <p className="text-muted-foreground">Cargando presupuesto...</p>
      </AppLayout>
    );
  }

  if (error || !project) {
    return (
      <AppLayout title="Presupuesto">
        <div className="flex flex-col items-center justify-center py-16 text-center px-4">
          <p className="text-muted-foreground mb-6">Selecciona un proyecto para ver su presupuesto</p>
          <Button variant="action" onClick={() => navigate("/proyectos")}>
            <ArrowLeft className="h-5 w-5" />
            Ir a Proyectos
          </Button>
        </div>
      </AppLayout>
    );
  }

  const subtotal = calculateProjectTotal(project);
  const marginPercentage = project.margin_percentage ?? 15;
  const ivaPercentage = project.iva_percentage ?? 21;
  const includeIVA = project.include_iva ?? true;
  const marginAmount = (subtotal * marginPercentage) / 100;
  const subtotalWithMargin = subtotal + marginAmount;
  const ivaAmount = includeIVA ? (subtotalWithMargin * ivaPercentage) / 100 : 0;
  const total = subtotalWithMargin + ivaAmount;
  const totalsBySection = calculateProjectTotalBySection(project);

  const handleShare = () => {
    toast({
      title: "Compartir presupuesto",
      description: "Funcion de compartir (demo)",
    });
  };

  const handleExport = () => {
    toast({
      title: "Exportar PDF",
      description: "Generando documento (demo)",
    });
  };

  return (
    <AppLayout title="Presupuesto">
      <div className="space-y-6 w-full">
        <Button variant="ghost" size="sm" onClick={() => navigate("/proyectos")} className="gap-2 -ml-2">
          <ArrowLeft className="h-4 w-4" />
          Proyectos
        </Button>

        <div className="flex items-start justify-between gap-3 pb-2">
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-bold break-words">{project.name}</h2>
            <p className="text-sm text-muted-foreground">{project.client?.name ?? project.client_name ?? "Sin cliente"}</p>
            <Badge className={`${PROJECT_STATUSES[project.status].color} text-small mt-2`}>
              {PROJECT_STATUSES[project.status].label}
            </Badge>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button variant="action" size="sm" asChild className="gap-1">
              <Link to={`/proyecto/${project.id}`}>
              <Pencil className="h-4 w-4" />
              <span className="hidden sm:inline">Editar</span>
              </Link>
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Calculator className="h-5 w-5 text-primary" />
              Desglose por seccion
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(totalsBySection).map(([sectionId, sectionTotal]) => {
              const section = sections.find((s: any) => s.id === sectionId);
              if (!section) return null;

              return (
                <div key={sectionId} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{section.icon}</span>
                    <span className="text-body font-medium">{section.name}</span>
                  </div>
                  <span className="text-body-lg font-semibold">{formatCurrency(sectionTotal)}</span>
                </div>
              );
            })}

            <div className="flex items-center justify-between pt-3 border-t-2">
              <span className="text-body-lg font-semibold">Subtotal</span>
              <span className="text-heading font-bold">{formatCurrency(subtotal)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="h-5 w-5 text-primary" />
              Detalle de partidas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {(project.items || []).map((item: any) => {
              const template = item.template;
              if (!template) return null;
              const itemTotal = calculateItemTotal(item);

              return (
                <div key={item.id} className="p-4 rounded-lg bg-muted/50 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-small text-muted-foreground">
                        {template.section?.icon} {template.section?.name}
                      </p>
                      <p className="text-body font-semibold">{template.name}</p>
                    </div>
                    <span className="text-body-lg font-bold shrink-0">{formatCurrency(itemTotal)}</span>
                  </div>

                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-small text-muted-foreground">
                    <span>
                      {item.quantity.toLocaleString("es-ES")} {template.unit}
                    </span>
                    {item.include_installation && (
                      <span>
                        Inst: {formatCurrency(item.price_installation)}/{template.unit}
                      </span>
                    )}
                    {item.include_supply && item.price_supply && (
                      <span>
                        Sum: {formatCurrency(item.price_supply)}/{template.unit}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-small text-muted-foreground">
                    {item.include_installation && <span>Instalacion</span>}
                    {item.include_supply && <span>Suministro</span>}
                  </div>

                  {item.notes && <p className="text-small text-muted-foreground italic">"{item.notes}"</p>}
                </div>
              );
            })}
          </CardContent>
        </Card>

        {isEditMode && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Ajustes del presupuesto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between gap-4 p-4 rounded-lg bg-muted/50">
                <Label htmlFor="iva" className="text-body font-medium cursor-pointer">
                  Incluir IVA ({ivaPercentage}%)
                </Label>
                <Switch
                  id="iva"
                  checked={includeIVA}
                  onCheckedChange={(checked) => {
                    updateProject.mutate({
                      id: project.id,
                      updates: { include_iva: checked },
                    });
                  }}
                />
              </div>

              {includeIVA && (
                <div className="p-4 rounded-lg bg-muted/50">
                  <Label htmlFor="iva-percentage" className="text-body font-medium mb-2 block">
                    IVA (%)
                  </Label>
                  <Input
                    id="iva-percentage"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    max="100"
                    step="0.5"
                    value={ivaInput ?? String(ivaPercentage)}
                    onChange={(e) => setIvaInput(e.target.value)}
                    onBlur={() => {
                      const parsed = parseFloat(ivaInput ?? String(ivaPercentage));
                      const nextValue = Number.isNaN(parsed) ? ivaPercentage : parsed;
                      updateProject.mutate({
                        id: project.id,
                        updates: { iva_percentage: nextValue },
                      });
                      setIvaInput(null);
                    }}
                    className="text-center text-heading font-bold"
                  />
                </div>
              )}

              <div className="p-4 rounded-lg bg-muted/50">
                <Label htmlFor="margin" className="text-body font-medium mb-2 block">
                  Margen de beneficio (%)
                </Label>
                <Input
                  id="margin"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  max="100"
                  step="0.5"
                  value={marginInput ?? String(marginPercentage)}
                  onChange={(e) => setMarginInput(e.target.value)}
                  onBlur={() => {
                    const parsed = parseFloat(marginInput ?? String(marginPercentage));
                    const nextValue = Number.isNaN(parsed) ? marginPercentage : parsed;
                    updateProject.mutate({
                      id: project.id,
                      updates: { margin_percentage: nextValue },
                    });
                    setMarginInput(null);
                  }}
                  className="text-center text-heading font-bold"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {isEditMode ? (
          <Card className="bg-secondary text-secondary-foreground">
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between text-body">
                <span>Subtotal partidas</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>

              {marginPercentage > 0 && (
                <div className="flex justify-between text-body">
                  <span>Margen ({marginPercentage}%)</span>
                  <span>+ {formatCurrency(marginAmount)}</span>
                </div>
              )}

              {includeIVA && (
                <div className="flex justify-between text-body">
                  <span>IVA ({ivaPercentage}%)</span>
                  <span>+ {formatCurrency(ivaAmount)}</span>
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t border-secondary-foreground/20">
                <span className="text-subheading font-semibold">TOTAL</span>
                <span className="text-display">{formatCurrency(total)}</span>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-secondary text-secondary-foreground">
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-subheading font-semibold">TOTAL</span>
                <span className="text-display">{formatCurrency(total)}</span>
              </div>

              <Collapsible open={showBreakdown} onOpenChange={setShowBreakdown}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-secondary-foreground/70 hover:text-secondary-foreground hover:bg-secondary-foreground/10 gap-2"
                  >
                    Ver desglose
                    <ChevronDown className={`h-4 w-4 transition-transform ${showBreakdown ? "rotate-180" : ""}`} />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-4 space-y-3 border-t border-secondary-foreground/20 mt-4">
                  <div className="flex justify-between text-body">
                    <span>Subtotal partidas</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>

                  {marginPercentage > 0 && (
                    <div className="flex justify-between text-body">
                      <span>Margen ({marginPercentage}%)</span>
                      <span>+ {formatCurrency(marginAmount)}</span>
                    </div>
                  )}

                  {includeIVA && (
                    <div className="flex justify-between text-body">
                      <span>IVA ({ivaPercentage}%)</span>
                      <span>+ {formatCurrency(ivaAmount)}</span>
                    </div>
                  )}
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>
        )}

        <p className="text-small text-muted-foreground text-center italic px-4">
          Presupuesto orientativo sujeto a mediciones finales. Validez 30 dias.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 pb-4">
          <Button variant="outline" size="lg" className="flex-1" onClick={handleShare}>
            <Share2 className="h-5 w-5" />
            Compartir
          </Button>
          <Button variant="action" size="lg" className="flex-1" onClick={handleExport}>
            <FileText className="h-5 w-5" />
            Exportar PDF
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
