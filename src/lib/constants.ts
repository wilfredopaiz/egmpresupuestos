export const MEASURE_UNITS = [
  { id: "ud", label: "Unidades (ud)" },
  { id: "m2", label: "Metros cuadrados (m²)" },
  { id: "ml", label: "Metros lineales (ml)" },
  { id: "m3", label: "Metros cúbicos (m³)" },
  { id: "kg", label: "Kilogramos (kg)" },
  { id: "l", label: "Litros (l)" },
  { id: "h", label: "Horas (h)" },
  { id: "pa", label: "Partida alzada (pa)" },
] as const;

export const SECTION_ICONS = [
  "🧱",
  "📐",
  "🚿",
  "⚡",
  "🪨",
  "🎨",
  "🔧",
  "🪚",
  "🔩",
  "🪛",
  "🏗️",
  "🏠",
  "🚪",
  "🪟",
  "🛁",
  "🚽",
  "💡",
  "🔌",
  "🧹",
  "🪣",
  "🧰",
  "⚙️",
  "🔨",
  "📏",
  "🪜",
] as const;

export const SECTION_EMOJIS = SECTION_ICONS;

export const PROJECT_STATUSES = {
  "en-medicion": { label: "En medicion", color: "bg-amber-100 text-amber-800" },
  presupuestado: { label: "Presupuestado", color: "bg-blue-100 text-blue-800" },
  aprobado: { label: "Aprobado", color: "bg-green-100 text-green-800" },
  "en-obra": { label: "En obra", color: "bg-purple-100 text-purple-800" },
  finalizado: { label: "Finalizado", color: "bg-gray-100 text-gray-800" },
} as const;
