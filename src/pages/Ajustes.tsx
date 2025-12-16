import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Building2, User, FileText, Info } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function Ajustes() {
  const handleSave = () => {
    toast({
      title: "Ajustes guardados",
      description: "Los cambios se han guardado correctamente (demo)",
    });
  };

  return (
    <AppLayout title="Ajustes">
      <div className="space-y-6 max-w-2xl mx-auto">
        {/* Datos de empresa */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Datos de empresa
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="empresa" className="text-body font-medium">
                Nombre de empresa
              </Label>
              <Input
                id="empresa"
                placeholder="EGM Reformas S.L."
                defaultValue="EGM Reformas S.L."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cif" className="text-body font-medium">
                CIF/NIF
              </Label>
              <Input
                id="cif"
                placeholder="B12345678"
                defaultValue="B12345678"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="direccion" className="text-body font-medium">
                Dirección
              </Label>
              <Input
                id="direccion"
                placeholder="Calle Ejemplo, 123"
                defaultValue="C/ Valencia, 45 - 46001 Valencia"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefono" className="text-body font-medium">
                Teléfono
              </Label>
              <Input
                id="telefono"
                type="tel"
                placeholder="600 123 456"
                defaultValue="600 123 456"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-body font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="info@egmreformas.es"
                defaultValue="info@egmreformas.es"
              />
            </div>
          </CardContent>
        </Card>

        {/* Valores por defecto */}
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
              <Input
                id="iva-default"
                type="number"
                placeholder="21"
                defaultValue="21"
                className="text-center"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="margen-default" className="text-body font-medium">
                Margen por defecto (%)
              </Label>
              <Input
                id="margen-default"
                type="number"
                placeholder="15"
                defaultValue="15"
                className="text-center"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="validez" className="text-body font-medium">
                Validez presupuesto (días)
              </Label>
              <Input
                id="validez"
                type="number"
                placeholder="30"
                defaultValue="30"
                className="text-center"
              />
            </div>
          </CardContent>
        </Card>

        {/* Info app */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              Información
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-body text-muted-foreground">Versión</span>
              <span className="text-body font-medium">1.0.0 (Demo)</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-body text-muted-foreground">Datos</span>
              <span className="text-body font-medium">Mock / Ejemplo</span>
            </div>
            <Separator />
            <p className="text-small text-muted-foreground">
              Esta es una versión de demostración. Los datos mostrados son ejemplos 
              y no se guardan de forma permanente.
            </p>
          </CardContent>
        </Card>

        {/* Botón guardar */}
        <Button
          variant="action"
          size="xl"
          className="w-full"
          onClick={handleSave}
        >
          Guardar cambios
        </Button>
      </div>
    </AppLayout>
  );
}
