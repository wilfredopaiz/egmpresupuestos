import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Building2, FileText, Info, Ruler } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useAppSettings, useUpdateAppSettings } from "@/hooks/useAppSettings";
import { MEASURE_UNITS } from "@/lib/constants";

export default function Ajustes() {
  const { user } = useAuth();
  const { data, isLoading, error } = useAppSettings();
  const updateSettings = useUpdateAppSettings();

  const [companyName, setCompanyName] = useState("");
  const [companyCif, setCompanyCif] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [ivaDefault, setIvaDefault] = useState("21");
  const [marginDefault, setMarginDefault] = useState("15");
  const [validityDays, setValidityDays] = useState("30");

  useEffect(() => {
    if (!data) return;
    setCompanyName(data.settings.company?.name ?? "");
    setCompanyCif(data.settings.company?.cif ?? "");
    setCompanyAddress(data.settings.company?.address ?? "");
    setCompanyPhone(data.settings.company?.phone ?? "");
    setCompanyEmail(data.settings.company?.email ?? "");
    setIvaDefault(String(data.settings.defaults?.iva_percentage ?? 21));
    setMarginDefault(String(data.settings.defaults?.margin_percentage ?? 15));
    setValidityDays(String(data.settings.defaults?.budget_validity_days ?? 30));
  }, [data]);

  const saveAll = () => {
    updateSettings.mutate(
      {
        company: {
          name: companyName.trim(),
          cif: companyCif.trim(),
          address: companyAddress.trim(),
          phone: companyPhone.trim(),
          email: companyEmail.trim(),
        },
        defaults: {
          iva_percentage: Number.isNaN(parseFloat(ivaDefault)) ? 21 : parseFloat(ivaDefault),
          margin_percentage: Number.isNaN(parseFloat(marginDefault)) ? 15 : parseFloat(marginDefault),
          budget_validity_days: Number.isNaN(parseInt(validityDays, 10)) ? 30 : parseInt(validityDays, 10),
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "Ajustes guardados",
            description: "Los cambios se han guardado correctamente",
          });
        },
        onError: () => {
          toast({
            title: "Error",
            description: "No se pudieron guardar los ajustes",
            variant: "destructive",
          });
        },
      },
    );
  };

  if (isLoading) {
    return (
      <AppLayout title="Ajustes">
        <p className="text-muted-foreground">Cargando ajustes...</p>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout title="Ajustes">
        <p className="text-destructive">No se pudieron cargar los ajustes.</p>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Ajustes">
      <div className="space-y-6 w-full max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Datos de empresa
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-body font-medium">Usuario autenticado</Label>
              <Input value={user?.email ?? ""} disabled />
            </div>

            <div className="space-y-2">
              <Label htmlFor="empresa" className="text-body font-medium">
                Nombre de empresa
              </Label>
              <Input id="empresa" placeholder="EGM Reformas S.L." value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cif" className="text-body font-medium">
                CIF/NIF
              </Label>
              <Input id="cif" placeholder="B12345678" value={companyCif} onChange={(e) => setCompanyCif(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="direccion" className="text-body font-medium">
                Direccion
              </Label>
              <Input id="direccion" placeholder="Calle Ejemplo, 123" value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefono" className="text-body font-medium">
                Telefono
              </Label>
              <Input id="telefono" type="tel" placeholder="600 123 456" value={companyPhone} onChange={(e) => setCompanyPhone(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-body font-medium">
                Email
              </Label>
              <Input id="email" type="email" placeholder="info@egmreformas.es" value={companyEmail} onChange={(e) => setCompanyEmail(e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Valores por defecto
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="iva-default" className="text-body font-medium">
                IVA por defecto (%)
              </Label>
              <Input id="iva-default" type="number" value={ivaDefault} onChange={(e) => setIvaDefault(e.target.value)} className="text-center" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="margen-default" className="text-body font-medium">
                Margen por defecto (%)
              </Label>
              <Input id="margen-default" type="number" value={marginDefault} onChange={(e) => setMarginDefault(e.target.value)} className="text-center" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="validez" className="text-body font-medium">
                Validez presupuesto (dias)
              </Label>
              <Input id="validez" type="number" value={validityDays} onChange={(e) => setValidityDays(e.target.value)} className="text-center" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ruler className="h-5 w-5 text-primary" />
              Unidades de medida
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Estas unidades son fijas del sistema y no se pueden editar desde Ajustes.
            </p>
            {MEASURE_UNITS.map((unit) => (
              <div key={unit.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <span className="font-medium">{unit.label}</span>
                  <span className="text-sm text-muted-foreground ml-2">({unit.id})</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              Informacion
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-body text-muted-foreground">Version</span>
              <span className="text-body font-medium">1.0.0</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-body text-muted-foreground">Modo</span>
              <span className="text-body font-medium">Supabase</span>
            </div>
            <Separator />
            <p className="text-small text-muted-foreground">
              Estos ajustes son globales para la aplicacion (single-tenant) y se comparten entre usuarios.
            </p>
          </CardContent>
        </Card>

        <Button variant="action" size="xl" className="w-full" onClick={saveAll} disabled={updateSettings.isPending}>
          {updateSettings.isPending ? "Guardando..." : "Guardar cambios"}
        </Button>
      </div>
    </AppLayout>
  );
}
