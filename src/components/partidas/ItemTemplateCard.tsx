import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ItemTemplate, formatCurrency, getSectionById } from "@/data/mockData";
import { Edit, Plus } from "lucide-react";

interface ItemTemplateCardProps {
  template: ItemTemplate;
  onEdit?: () => void;
  onAdd?: () => void;
  showSection?: boolean;
}

export function ItemTemplateCard({ 
  template, 
  onEdit, 
  onAdd,
  showSection = false 
}: ItemTemplateCardProps) {
  const section = getSectionById(template.sectionId);

  return (
    <Card className="hover:shadow-elevated transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {showSection && section && (
              <span className="text-small text-muted-foreground">
                {section.icon} {section.name}
              </span>
            )}
            <h4 className="text-body-lg font-semibold text-foreground truncate">
              {template.name}
            </h4>
            <p className="text-small text-muted-foreground">
              Unidad: {template.unit}
            </p>
          </div>

          <div className="flex gap-2 shrink-0">
            {onEdit && (
              <Button variant="ghost" size="icon-sm" onClick={onEdit}>
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {onAdd && (
              <Button variant="action" size="icon" onClick={onAdd}>
                <Plus className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
          <div>
            <span className="text-small text-muted-foreground">Instalación: </span>
            <span className="text-body font-semibold text-foreground">
              {formatCurrency(template.priceInstallation)}
            </span>
            <span className="text-small text-muted-foreground">/{template.unit}</span>
          </div>

          {template.priceSupply && (
            <div>
              <span className="text-small text-muted-foreground">Suministro: </span>
              <span className="text-body font-semibold text-foreground">
                {formatCurrency(template.priceSupply)}
              </span>
              <span className="text-small text-muted-foreground">/{template.unit}</span>
            </div>
          )}
        </div>

        {template.hasOption && template.optionLabel && (
          <div className="mt-2">
            <span className="inline-flex items-center gap-1 text-small text-accent-foreground bg-accent px-2 py-1 rounded-md">
              ☑ {template.optionLabel}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
