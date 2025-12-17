// Secciones de trabajo
export interface Section {
  id: string;
  name: string;
  icon: string;
}

export const sections: Section[] = [
  { id: "albanileria", name: "Albañilería", icon: "🧱" },
  { id: "pladur", name: "Pladur", icon: "📐" },
  { id: "fontaneria", name: "Fontanería", icon: "🚿" },
  { id: "electricidad", name: "Electricidad", icon: "⚡" },
  { id: "revestimientos", name: "Revestimientos", icon: "🪨" },
  { id: "pintura", name: "Pintura", icon: "🎨" },
];

// Emojis disponibles para secciones (relacionados con construcción)
export const sectionEmojis = [
  "🧱", "📐", "🚿", "⚡", "🪨", "🎨", "🔧", "🪚", "🔩", "🪛",
  "🏗️", "🏠", "🚪", "🪟", "🛁", "🚽", "💡", "🔌", "🧹", "🪣",
  "🧰", "⚙️", "🔨", "📏", "🪜"
];

// Unidades de medida disponibles
export const measureUnits = [
  { id: "ud", label: "Unidades (ud)" },
  { id: "m2", label: "Metros cuadrados (m²)" },
  { id: "ml", label: "Metros lineales (ml)" },
  { id: "m3", label: "Metros cúbicos (m³)" },
  { id: "kg", label: "Kilogramos (kg)" },
  { id: "l", label: "Litros (l)" },
  { id: "h", label: "Horas (h)" },
  { id: "pa", label: "Partida alzada (pa)" },
];

// Clientes mock
export interface Client {
  id: string;
  name: string;
  phone?: string;
  email?: string;
}

export const mockClients: Client[] = [
  { id: "client-1", name: "Juan García", phone: "600 111 222", email: "juan@email.com" },
  { id: "client-2", name: "María López", phone: "600 333 444", email: "maria@email.com" },
  { id: "client-3", name: "Antonio Martínez", phone: "600 555 666" },
  { id: "client-4", name: "TechStart S.L.", phone: "961 234 567", email: "info@techstart.es" },
  { id: "client-5", name: "Cliente de ejemplo" },
];

// Partidas estándar (plantillas)
export interface ItemTemplate {
  id: string;
  sectionId: string;
  name: string;
  unit: string;
  priceInstallation: number;
  priceSupply?: number;
  hasOption?: boolean;
  optionLabel?: string;
}

export const itemTemplates: ItemTemplate[] = [
  // Albañilería
  {
    id: "zanja-desague",
    sectionId: "albanileria",
    name: "Zanja desagüe",
    unit: "ml",
    priceInstallation: 45,
  },
  {
    id: "tapiado-ventana",
    sectionId: "albanileria",
    name: "Tapiado ventana",
    unit: "ud",
    priceInstallation: 120,
  },
  {
    id: "apertura-hueco",
    sectionId: "albanileria",
    name: "Apertura hueco pared",
    unit: "ud",
    priceInstallation: 180,
  },
  // Pladur
  {
    id: "tabique-pladur",
    sectionId: "pladur",
    name: "Tabique pladur sencillo",
    unit: "m²",
    priceInstallation: 32,
  },
  {
    id: "falso-techo",
    sectionId: "pladur",
    name: "Falso techo continuo",
    unit: "m²",
    priceInstallation: 38,
  },
  // Fontanería
  {
    id: "punto-agua",
    sectionId: "fontaneria",
    name: "Punto de agua",
    unit: "ud",
    priceInstallation: 120,
  },
  {
    id: "desague",
    sectionId: "fontaneria",
    name: "Punto de desagüe",
    unit: "ud",
    priceInstallation: 95,
  },
  {
    id: "instalacion-sanitario",
    sectionId: "fontaneria",
    name: "Instalación sanitario",
    unit: "ud",
    priceInstallation: 85,
    priceSupply: 150,
  },
  // Electricidad
  {
    id: "punto-luz",
    sectionId: "electricidad",
    name: "Punto de luz",
    unit: "ud",
    priceInstallation: 65,
  },
  {
    id: "enchufe",
    sectionId: "electricidad",
    name: "Toma de corriente",
    unit: "ud",
    priceInstallation: 55,
  },
  {
    id: "cuadro-electrico",
    sectionId: "electricidad",
    name: "Cuadro eléctrico",
    unit: "ud",
    priceInstallation: 450,
  },
  // Revestimientos
  {
    id: "suelo-ceramico",
    sectionId: "revestimientos",
    name: "Colocación suelo cerámico",
    unit: "m²",
    priceInstallation: 28,
    priceSupply: 22,
    hasOption: true,
    optionLabel: "Incluye escalera",
  },
  {
    id: "alicatado",
    sectionId: "revestimientos",
    name: "Alicatado paredes",
    unit: "m²",
    priceInstallation: 30,
    priceSupply: 24,
  },
  {
    id: "rodapie",
    sectionId: "revestimientos",
    name: "Rodapié cerámico",
    unit: "ml",
    priceInstallation: 12,
    priceSupply: 8,
  },
  // Pintura
  {
    id: "pintura-techos-paredes",
    sectionId: "pintura",
    name: "Pintura techos y paredes",
    unit: "m²",
    priceInstallation: 9,
    hasOption: true,
    optionLabel: "Altura > 2.30 m",
  },
  {
    id: "pintura-lacado",
    sectionId: "pintura",
    name: "Lacado puertas/marcos",
    unit: "ud",
    priceInstallation: 85,
  },
];

// Estados de proyecto
export type ProjectStatus = "en-medicion" | "presupuestado" | "aprobado" | "en-obra" | "finalizado";

export const projectStatuses: Record<ProjectStatus, { label: string; color: string }> = {
  "en-medicion": { label: "En medición", color: "bg-amber-100 text-amber-800" },
  "presupuestado": { label: "Presupuestado", color: "bg-blue-100 text-blue-800" },
  "aprobado": { label: "Aprobado", color: "bg-green-100 text-green-800" },
  "en-obra": { label: "En obra", color: "bg-purple-100 text-purple-800" },
  "finalizado": { label: "Finalizado", color: "bg-gray-100 text-gray-800" },
};

// Partida de un proyecto
export interface ProjectItem {
  id: string;
  templateId: string;
  quantity: number;
  includeInstallation: boolean;
  includeSupply: boolean;
  optionEnabled?: boolean;
  notes?: string;
}

// Proyecto
export interface Project {
  id: string;
  name: string;
  client: string;
  status: ProjectStatus;
  notes?: string;
  items: ProjectItem[];
  createdAt: Date;
  updatedAt: Date;
}

// Proyectos de ejemplo
export const mockProjects: Project[] = [
  {
    id: "pizzeria-palmeretes",
    name: "Pizzería Palmeretes",
    client: "Cliente de ejemplo",
    status: "en-medicion",
    notes: "Local comercial 120m², reforma integral",
    items: [
      {
        id: "item-1",
        templateId: "suelo-ceramico",
        quantity: 89.7,
        includeInstallation: true,
        includeSupply: false,
        optionEnabled: true,
        notes: "Incluye 1 escalera de 14 peldaños",
      },
      {
        id: "item-2",
        templateId: "pintura-techos-paredes",
        quantity: 163.44,
        includeInstallation: true,
        includeSupply: false,
        optionEnabled: true,
        notes: "Altura 2.30 m, varios colores",
      },
      {
        id: "item-3",
        templateId: "punto-agua",
        quantity: 1,
        includeInstallation: true,
        includeSupply: false,
      },
      {
        id: "item-4",
        templateId: "alicatado",
        quantity: 45.2,
        includeInstallation: true,
        includeSupply: true,
        notes: "Zona cocina y baños",
      },
    ],
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "chalet-martinez",
    name: "Chalet Familia Martínez",
    client: "Antonio Martínez",
    status: "presupuestado",
    notes: "Reforma baño principal y aseo",
    items: [
      {
        id: "item-5",
        templateId: "alicatado",
        quantity: 28.5,
        includeInstallation: true,
        includeSupply: true,
      },
      {
        id: "item-6",
        templateId: "suelo-ceramico",
        quantity: 12.3,
        includeInstallation: true,
        includeSupply: true,
      },
      {
        id: "item-7",
        templateId: "instalacion-sanitario",
        quantity: 3,
        includeInstallation: true,
        includeSupply: true,
      },
    ],
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-18"),
  },
  {
    id: "oficina-tech",
    name: "Oficina TechStart",
    client: "TechStart S.L.",
    status: "aprobado",
    notes: "Acondicionamiento oficina 80m²",
    items: [
      {
        id: "item-8",
        templateId: "tabique-pladur",
        quantity: 35,
        includeInstallation: true,
        includeSupply: false,
      },
      {
        id: "item-9",
        templateId: "punto-luz",
        quantity: 24,
        includeInstallation: true,
        includeSupply: false,
      },
      {
        id: "item-10",
        templateId: "enchufe",
        quantity: 32,
        includeInstallation: true,
        includeSupply: false,
      },
    ],
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-22"),
  },
];

// Helper functions
export function getTemplateById(templateId: string): ItemTemplate | undefined {
  return itemTemplates.find((t) => t.id === templateId);
}

export function getSectionById(sectionId: string): Section | undefined {
  return sections.find((s) => s.id === sectionId);
}

export function getTemplatesBySection(sectionId: string): ItemTemplate[] {
  return itemTemplates.filter((t) => t.sectionId === sectionId);
}

export function calculateItemTotal(item: ProjectItem): number {
  const template = getTemplateById(item.templateId);
  if (!template) return 0;

  let total = 0;
  if (item.includeInstallation) {
    total += template.priceInstallation * item.quantity;
  }
  if (item.includeSupply && template.priceSupply) {
    total += template.priceSupply * item.quantity;
  }
  return total;
}

export function calculateProjectTotal(project: Project): number {
  return project.items.reduce((sum, item) => sum + calculateItemTotal(item), 0);
}

export function calculateProjectTotalBySection(project: Project): Record<string, number> {
  const totals: Record<string, number> = {};
  
  project.items.forEach((item) => {
    const template = getTemplateById(item.templateId);
    if (!template) return;
    
    const sectionId = template.sectionId;
    const itemTotal = calculateItemTotal(item);
    
    totals[sectionId] = (totals[sectionId] || 0) + itemTotal;
  });
  
  return totals;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatQuantity(quantity: number, unit: string): string {
  return `${quantity.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${unit}`;
}