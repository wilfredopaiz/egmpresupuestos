import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ItemTemplateCard } from "@/components/partidas/ItemTemplateCard";
import { Button } from "@/components/ui/button";
import { sections, getTemplatesBySection } from "@/data/mockData";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "@/hooks/use-toast";

export default function Partidas() {
  const [openSections, setOpenSections] = useState<string[]>(sections.map(s => s.id));

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleEdit = (templateName: string) => {
    toast({
      title: "Editar partida",
      description: `Editando "${templateName}" (demo)`,
    });
  };

  return (
    <AppLayout title="Partidas">
      <div className="space-y-4">
        <p className="text-body text-muted-foreground">
          Catálogo de partidas estándar organizadas por sección
        </p>

        {sections.map((section) => {
          const templates = getTemplatesBySection(section.id);
          const isOpen = openSections.includes(section.id);

          return (
            <Collapsible
              key={section.id}
              open={isOpen}
              onOpenChange={() => toggleSection(section.id)}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full h-14 justify-between px-4 bg-card hover:bg-muted rounded-xl shadow-card"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{section.icon}</span>
                    <span className="text-body-lg font-semibold">{section.name}</span>
                    <span className="text-small text-muted-foreground">
                      ({templates.length})
                    </span>
                  </div>
                  {isOpen ? (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  )}
                </Button>
              </CollapsibleTrigger>

              <CollapsibleContent className="pt-3 space-y-3 animate-accordion-down">
                {templates.map((template) => (
                  <ItemTemplateCard
                    key={template.id}
                    template={template}
                    onEdit={() => handleEdit(template.name)}
                  />
                ))}
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </div>
    </AppLayout>
  );
}
