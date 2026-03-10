import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Building2, FileText, Info, Ruler, Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { MEASURE_UNITS } from "@/lib/constants";
import { useAuth } from "@/contexts/AuthContext";

export default function Ajustes() {
  const { user } = useAuth();
  const [addUnitOpen, setAddUnitOpen] = useState(false);
  const [editUnitOpen, setEditUnitOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<typeof MEASURE_UNITS[0] | null>(null);

  const handleSave = () => {
    toast({
      title: "Ajustes guardados",
      description: "Los cambios se han guardado correctamente (demo)",
    });
  };

  const handleAddUnit = () => {
    toast({
      title: "Medida creada",
      description: "Nueva unidad de medida añadida (demo)",
    });
    setAddUnitOpen(false);
  };

  const handleEditUnit = () => {
    toast({
      title: "Medida actualizada",
      description: `"${selectedUnit?.label}" se ha actualizado (demo)`,
    });
    setEditUnitOpen(false);
    setSelectedUnit(null);
  };

  const handleDeleteUnit = (unit: typeof MEASURE_UNITS[0]) => {
    toast({
      title: "Medida eliminada",
      description: `"${unit.label}" se ha eliminado (demo)`,
    });
  };

  const openEditUnit = (unit: typeof MEASURE_UNITS[0]) => {
    setSelectedUnit(unit);
    setEditUnitOpen(true);
  };

  return (
    <AppLayout title="Ajustes">
      <div className="space-y-6 w-full max-w-2xl mx-auto">
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
              <Label className="text-body font-medium">Usuario autenticado</Label>
              <Input value={user?.email ?? ""} disabled />
            </div>

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

        {/* Medidas */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Ruler className="h-5 w-5 text-primary" />
                Medidas
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => setAddUnitOpen(true)}>
                <Plus className="h-4 w-4" />
                Nueva
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {MEASURE_UNITS.map((unit) => (
              <div 
                key={unit.id} 
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <div>
                  <span className="font-medium">{unit.label}</span>
                  <span className="text-sm text-muted-foreground ml-2">({unit.id})</span>
                </div>
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon-sm"
                    onClick={() => openEditUnit(unit)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon-sm"
                    onClick={() => handleDeleteUnit(unit)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
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

      {/* Modal de nueva medida */}
      <Dialog open={addUnitOpen} onOpenChange={setAddUnitOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nueva Medida</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="unit-id">Código</Label>
              <Input 
                id="unit-id" 
                placeholder="Ej: m2"
                className="h-12" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit-label">Nombre</Label>
              <Input 
                id="unit-label" 
                placeholder="Ej: Metros cuadrados (m²)"
                className="h-12" 
              />
            </div>
            <Button variant="action" className="w-full" onClick={handleAddUnit}>
              Crear Medida
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de editar medida */}
      <Dialog open={editUnitOpen} onOpenChange={setEditUnitOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Medida</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-unit-id">Código</Label>
              <Input 
                id="edit-unit-id" 
                defaultValue={selectedUnit?.id}
                className="h-12" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-unit-label">Nombre</Label>
              <Input 
                id="edit-unit-label" 
                defaultValue={selectedUnit?.label}
                className="h-12" 
              />
            </div>
            <Button variant="action" className="w-full" onClick={handleEditUnit}>
              Guardar cambios
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
