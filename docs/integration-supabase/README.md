# Integración Supabase - EGM Presupuestos

## Objetivo

Migrar la app de presupuestos de construcción de datos mock en memoria a una base de datos real con **Supabase**, añadiendo autenticación por email y persistencia completa de datos.

## Estado actual

- Frontend React + Vite + TypeScript + shadcn/ui
- Datos 100% en memoria (se pierden al refrescar)
- Sin autenticación
- Store reactivo simple (`projectsStore.ts`) con patrón de suscripción
- Mock data en `src/data/mockData.ts` (secciones, plantillas, clientes, proyectos)

## Qué vamos a conseguir

1. **Autenticación por email** - Login/registro con Supabase Auth
2. **Persistencia real** - Todos los datos en PostgreSQL (Supabase)
3. **Multi-usuario** - Cada usuario ve solo sus datos (RLS)
4. **Datos catálogo compartidos** - Secciones, unidades y plantillas base disponibles para todos
5. **Datos privados por usuario** - Clientes, proyectos y partidas aislados por usuario

## Modelo de datos

```
auth.users (gestionado por Supabase Auth)
    |
    v
profiles ──────────────────────────────────┐
    |                                       |
    v                                       v
clients                              projects
                                        |
                                        v
                                   project_items
                                        |
                                        v
sections ─── item_templates ────────────┘
```

### Tablas

| Tabla | Tipo | RLS | Descripción |
|-------|------|-----|-------------|
| `profiles` | privada | por user_id | Perfil del usuario (se crea automáticamente al registrarse) |
| `sections` | catálogo | lectura pública, escritura por user | Secciones de trabajo (Albañilería, Pladur...) |
| `item_templates` | catálogo | lectura pública, escritura por user | Plantillas de partidas con precios |
| `clients` | privada | por user_id | Clientes del usuario |
| `projects` | privada | por user_id | Proyectos/obras |
| `project_items` | privada | por project.user_id | Partidas de cada proyecto |

## Stack técnico

- **@supabase/supabase-js** - Cliente JS
- **Supabase Auth** - Autenticación email/password
- **RLS (Row Level Security)** - Seguridad a nivel de fila
- **TanStack Query** (ya instalado) - Cache y sincronización de datos

## Tasks

| # | Archivo | Descripción |
|---|---------|-------------|
| 001 | [001-conexion-supabase.md](./001-conexion-supabase.md) | Instalar SDK, configurar cliente, variables de entorno |
| 002 | [002-modelo-datos-migracion.md](./002-modelo-datos-migracion.md) | Crear tablas y migración SQL completa |
| 003 | [003-rls-policies.md](./003-rls-policies.md) | Configurar Row Level Security en todas las tablas |
| 004 | [004-seed-catalogos.md](./004-seed-catalogos.md) | Insertar datos de catálogo (secciones, plantillas, unidades) |
| 005 | [005-auth-supabase.md](./005-auth-supabase.md) | Implementar autenticación email/password con UI |
| 006 | [006-proteccion-rutas.md](./006-proteccion-rutas.md) | Proteger rutas y crear layout autenticado |
| 007 | [007-servicios-supabase.md](./007-servicios-supabase.md) | Crear capa de servicios para acceso a datos |
| 008 | [008-hooks-queries.md](./008-hooks-queries.md) | Reescribir hooks con TanStack Query + Supabase |
| 009 | [009-migracion-paginas.md](./009-migracion-paginas.md) | Actualizar páginas para usar los nuevos hooks |
| 010 | [010-limpieza-final.md](./010-limpieza-final.md) | Eliminar mocks, store antiguo y limpieza general |

## Orden de ejecución

Las tasks están numeradas en orden de dependencia. Cada una depende de las anteriores.

```
001 Conexión → 002 Modelo DB → 003 RLS → 004 Seed
                                            ↓
010 Limpieza ← 009 Páginas ← 008 Hooks ← 007 Servicios ← 006 Rutas ← 005 Auth
```

## Notas importantes

- **No hay roles por ahora** - Todos los usuarios tienen los mismos permisos
- **Supabase Auth maneja sesiones** - No necesitamos gestionar tokens manualmente
- **RLS es obligatorio** - Nunca desactivar RLS en producción
- Las variables de entorno van en `.env.local` (ya en `.gitignore` por Vite)
- El proyecto usa **TanStack Query** (ya instalado) que aprovecharemos para cache
