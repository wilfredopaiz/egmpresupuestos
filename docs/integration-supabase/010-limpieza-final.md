# 010 - Limpieza final

## Objetivo

Eliminar todo el código mock y el store reactivo antiguo. Verificar que la app funciona completamente con Supabase.

## Archivos a eliminar

- [ ] `src/data/mockData.ts` - Datos mock (reemplazado por Supabase + `constants.ts` + `calculations.ts`)
- [ ] `src/data/projectsStore.ts` - Store reactivo (reemplazado por TanStack Query + servicios)

## Verificar que no quedan imports

Buscar y eliminar cualquier referencia a:

```
import { ... } from "@/data/mockData"
import { ... } from "@/data/projectsStore"
```

## Código a conservar (ya migrado)

| Origen (mockData.ts) | Destino |
|---|---|
| `measureUnits` | `src/lib/constants.ts` → `MEASURE_UNITS` |
| `sectionEmojis` | `src/lib/constants.ts` → `SECTION_EMOJIS` |
| `projectStatuses` | `src/lib/constants.ts` → `PROJECT_STATUSES` |
| `formatCurrency()` | `src/lib/calculations.ts` |
| `formatQuantity()` | `src/lib/calculations.ts` |
| `calculateItemTotal()` | `src/lib/calculations.ts` (adaptada a formato Supabase) |
| `calculateProjectTotal()` | `src/lib/calculations.ts` |
| `calculateProjectTotalBySection()` | `src/lib/calculations.ts` |
| Interfaces (`Section`, `Project`, etc.) | Generadas por Supabase CLI en `database.types.ts` |

## Interfaces/tipos

Las interfaces de TypeScript ahora vienen de `src/types/database.types.ts` (generado por Supabase CLI). Para conveniencia, crear alias en `src/types/index.ts`:

```typescript
import { Database } from "./database.types";

// Alias de tipos de tablas
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Client = Database["public"]["Tables"]["clients"]["Row"];
export type Section = Database["public"]["Tables"]["sections"]["Row"];
export type ItemTemplate = Database["public"]["Tables"]["item_templates"]["Row"];
export type Project = Database["public"]["Tables"]["projects"]["Row"];
export type ProjectItem = Database["public"]["Tables"]["project_items"]["Row"];

// Tipos para inserts
export type ClientInsert = Database["public"]["Tables"]["clients"]["Insert"];
export type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"];
export type ProjectItemInsert = Database["public"]["Tables"]["project_items"]["Insert"];

// Enum
export type ProjectStatus = Database["public"]["Enums"]["project_status"];
```

## Checklist final

- [ ] Eliminar `src/data/mockData.ts`
- [ ] Eliminar `src/data/projectsStore.ts`
- [ ] Eliminar imports huérfanos
- [ ] Verificar que `npm run build` compila sin errores
- [ ] Crear `src/types/index.ts` con alias de tipos
- [ ] Mover constantes a `src/lib/constants.ts`
- [ ] Probar flujo completo:
  - [ ] Registro de usuario
  - [ ] Login
  - [ ] Crear cliente
  - [ ] Crear proyecto
  - [ ] Añadir partidas a proyecto
  - [ ] Ver presupuesto
  - [ ] Dashboard con estadísticas
  - [ ] Cerrar sesión
  - [ ] Login con otro usuario → datos aislados

## Archivos creados/modificados

- `src/types/index.ts` (nuevo)
- `src/lib/constants.ts` (completar con `SECTION_EMOJIS`, `PROJECT_STATUSES`)
- `src/data/mockData.ts` (eliminar)
- `src/data/projectsStore.ts` (eliminar)

## Dependencias

- Todas las tasks anteriores completadas
