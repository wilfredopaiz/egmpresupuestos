# 001 - Conexión Supabase

## Objetivo

Instalar el SDK de Supabase, configurar el cliente y las variables de entorno.

## Pasos

### 1. Instalar dependencia

```bash
npm install @supabase/supabase-js
```

### 2. Crear proyecto en Supabase

1. Ir a [supabase.com](https://supabase.com) y crear un nuevo proyecto
2. Anotar:
   - **Project URL** (ej: `https://xxxxxxxxxxxx.supabase.co`)
   - **anon public key** (en Settings → API)

### 3. Variables de entorno

Crear archivo `.env.local` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> Vite expone automáticamente las variables con prefijo `VITE_` al cliente.

### 4. Crear cliente Supabase

Crear archivo `src/lib/supabase.ts`:

```typescript
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Faltan variables de entorno de Supabase (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)");
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
```

### 5. Crear archivo de tipos (placeholder)

Crear archivo `src/types/database.types.ts`:

```typescript
// Este archivo se generará automáticamente con:
// npx supabase gen types typescript --project-id tu-project-id > src/types/database.types.ts
//
// Por ahora dejamos un placeholder que se completará en la task 002

export type Database = {
  public: {
    Tables: Record<string, never>;
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
```

### 6. Verificar que .env.local está en .gitignore

Comprobar que `.gitignore` contiene:

```
.env.local
.env.*.local
```

## Verificación

Importar el cliente en cualquier componente y verificar que no hay errores en consola:

```typescript
import { supabase } from "@/lib/supabase";
console.log("Supabase conectado:", supabase);
```

## Archivos creados/modificados

- `src/lib/supabase.ts` (nuevo)
- `src/types/database.types.ts` (nuevo)
- `.env.local` (nuevo, NO commitear)

## Dependencias

- Ninguna (primera task)
