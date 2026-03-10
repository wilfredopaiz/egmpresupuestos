# Modelos de datos - EGM Presupuestos

## Diagrama de relaciones

```
auth.users (Supabase Auth)
    │
    │ 1:1 (trigger automático)
    ▼
profiles
    │
    ├──────────────────────┐
    │ 1:N                  │ 1:N
    ▼                      ▼
clients                sections (user_id nullable)
                           │
                           │ 1:N
                           ▼
                       item_templates (user_id nullable)
    │                      │
    │ 1:N                  │ N:1
    ▼                      │
projects ◄─────────────────┘
    │         (via project_items.template_id)
    │ 1:N
    ▼
project_items
```

---

## profiles

Extiende `auth.users`. Se crea automáticamente al registrarse un usuario.

| Campo | Tipo | Nullable | Descripción |
|-------|------|----------|-------------|
| `id` | `uuid` | NO | PK · FK → `auth.users.id` |
| `full_name` | `text` | SÍ | Nombre completo del usuario |
| `email` | `text` | SÍ | Email (copiado de auth.users) |
| `created_at` | `timestamptz` | NO | Default: `now()` |
| `updated_at` | `timestamptz` | NO | Default: `now()` · Auto-update trigger |

**RLS:** cada usuario solo puede leer y editar su propio perfil.

---

## clients

Clientes de la empresa. Compartidos entre todos los usuarios.

| Campo | Tipo | Nullable | Descripción |
|-------|------|----------|-------------|
| `id` | `uuid` | NO | PK · `gen_random_uuid()` |
| `user_id` | `uuid` | NO | FK → `profiles.id` |
| `name` | `text` | NO | Nombre del cliente |
| `phone` | `text` | SÍ | Teléfono de contacto |
| `email` | `text` | SÍ | Email de contacto |
| `created_at` | `timestamptz` | NO | Default: `now()` |
| `updated_at` | `timestamptz` | NO | Default: `now()` · Auto-update trigger |

**RLS:** todos los autenticados ven y editan todos los clientes. `user_id` = auditoría (quién lo creó).

---

## sections

Secciones de trabajo (Albañilería, Pladur, Fontanería...).

- `user_id = NULL` → sección del catálogo global (visible para todos)
- `user_id = <uuid>` → sección personalizada del usuario

| Campo | Tipo | Nullable | Descripción |
|-------|------|----------|-------------|
| `id` | `uuid` | NO | PK · `gen_random_uuid()` |
| `user_id` | `uuid` | SÍ | FK → `profiles.id` · NULL = catálogo global |
| `name` | `text` | NO | Nombre de la sección |
| `icon` | `text` | NO | Emoji representativo · Default: `🔧` |
| `sort_order` | `int` | SÍ | Orden de visualización |
| `created_at` | `timestamptz` | NO | Default: `now()` |

**RLS:** todos los autenticados ven y editan todas las secciones/plantillas. `user_id` = auditoría.

**Catálogo global (seed):**
| icon | name |
|------|------|
| 🧱 | Albañilería |
| 📐 | Pladur |
| 🚿 | Fontanería |
| ⚡ | Electricidad |
| 🪨 | Revestimientos |
| 🎨 | Pintura |

---

## item_templates

Plantillas de partidas presupuestarias con precios unitarios.

- `user_id = NULL` → plantilla del catálogo global
- `user_id = <uuid>` → plantilla personalizada del usuario

| Campo | Tipo | Nullable | Descripción |
|-------|------|----------|-------------|
| `id` | `uuid` | NO | PK · `gen_random_uuid()` |
| `user_id` | `uuid` | SÍ | FK → `profiles.id` · NULL = catálogo global |
| `section_id` | `uuid` | NO | FK → `sections.id` |
| `name` | `text` | NO | Nombre de la partida |
| `unit` | `text` | NO | Unidad de medida (`ud`, `m²`, `ml`, `m³`, `kg`, `l`, `h`, `pa`) |
| `price_installation` | `numeric(10,2)` | NO | Precio de mano de obra por unidad |
| `price_supply` | `numeric(10,2)` | SÍ | Precio de material por unidad (opcional) |
| `has_option` | `boolean` | SÍ | Si tiene opción adicional marcable |
| `option_label` | `text` | SÍ | Etiqueta de la opción (ej: "Incluye escalera") |
| `created_at` | `timestamptz` | NO | Default: `now()` |

**RLS:** todos los autenticados ven y editan todas las secciones/plantillas. `user_id` = auditoría.

**Catálogo global (seed):**

| Sección | Partida | Unidad | Instalación | Material |
|---------|---------|--------|-------------|----------|
| Albañilería | Zanja desagüe | ml | 45 € | — |
| Albañilería | Tapiado ventana | ud | 120 € | — |
| Albañilería | Apertura hueco pared | ud | 180 € | — |
| Pladur | Tabique pladur sencillo | m² | 32 € | — |
| Pladur | Falso techo continuo | m² | 38 € | — |
| Fontanería | Punto de agua | ud | 120 € | — |
| Fontanería | Punto de desagüe | ud | 95 € | — |
| Fontanería | Instalación sanitario | ud | 85 € | 150 € |
| Electricidad | Punto de luz | ud | 65 € | — |
| Electricidad | Toma de corriente | ud | 55 € | — |
| Electricidad | Cuadro eléctrico | ud | 450 € | — |
| Revestimientos | Colocación suelo cerámico | m² | 28 € | 22 € |
| Revestimientos | Alicatado paredes | m² | 30 € | 24 € |
| Revestimientos | Rodapié cerámico | ml | 12 € | 8 € |
| Pintura | Pintura techos y paredes | m² | 9 € | — |
| Pintura | Lacado puertas/marcos | ud | 85 € | — |

---

## projects

Obras o proyectos de reforma. Compartidos entre todos los usuarios. `user_id` indica quién lo creó.

| Campo | Tipo | Nullable | Descripción |
|-------|------|----------|-------------|
| `id` | `uuid` | NO | PK · `gen_random_uuid()` |
| `user_id` | `uuid` | NO | FK → `profiles.id` |
| `name` | `text` | NO | Nombre del proyecto/obra |
| `client_id` | `uuid` | SÍ | FK → `clients.id` · NULL si cliente no registrado |
| `client_name` | `text` | SÍ | Nombre del cliente (desnormalizado) |
| `status` | `project_status` | NO | Estado actual · Default: `en-medicion` |
| `notes` | `text` | SÍ | Notas internas del proyecto |
| `created_at` | `timestamptz` | NO | Default: `now()` |
| `updated_at` | `timestamptz` | NO | Default: `now()` · Auto-update trigger |

**RLS:** todos los autenticados ven y editan todos los proyectos. `user_id` = auditoría (quién lo creó).

**Enum `project_status`:**

| Valor | Label | Color |
|-------|-------|-------|
| `en-medicion` | En medición | Ámbar |
| `presupuestado` | Presupuestado | Azul |
| `aprobado` | Aprobado | Verde |
| `en-obra` | En obra | Morado |
| `finalizado` | Finalizado | Gris |

> `client_id` y `client_name` coexisten: si el cliente está registrado en `clients`, se usa `client_id`; si se escribe manualmente, solo `client_name`.

---

## project_items

Partidas incluidas en un proyecto. Cada fila es una plantilla aplicada con cantidad y opciones concretas.

| Campo | Tipo | Nullable | Descripción |
|-------|------|----------|-------------|
| `id` | `uuid` | NO | PK · `gen_random_uuid()` |
| `project_id` | `uuid` | NO | FK → `projects.id` (CASCADE delete) |
| `template_id` | `uuid` | NO | FK → `item_templates.id` (RESTRICT delete) |
| `quantity` | `numeric(10,2)` | NO | Cantidad de unidades |
| `include_installation` | `boolean` | NO | Incluir precio de mano de obra · Default: `true` |
| `include_supply` | `boolean` | NO | Incluir precio de material · Default: `false` |
| `option_enabled` | `boolean` | SÍ | Opción adicional activada (ej: escalera) |
| `notes` | `text` | SÍ | Notas de esta partida en concreto |
| `sort_order` | `int` | SÍ | Orden dentro del proyecto |
| `created_at` | `timestamptz` | NO | Default: `now()` |
| `updated_at` | `timestamptz` | NO | Default: `now()` · Auto-update trigger |

**RLS:** todos los autenticados ven y editan todas las partidas.

**Cálculo del importe de una partida:**
```
total = 0
if include_installation: total += template.price_installation * quantity
if include_supply and template.price_supply: total += template.price_supply * quantity
```

---

## app_settings

Ajustes globales de la aplicación (single-tenant). **Una única fila** compartida por todos los usuarios.

| Campo | Tipo | Nullable | Descripción |
|-------|------|----------|-------------|
| `id` | `uuid` | NO | PK · `gen_random_uuid()` |
| `settings` | `jsonb` | NO | JSON con company, defaults y custom_units |
| `created_at` | `timestamptz` | NO | Default: `now()` |
| `updated_at` | `timestamptz` | NO | Default: `now()` · Auto-update trigger |

**RLS:** todos los autenticados pueden leer y actualizar. Insert protegido (solo si no hay filas).

**Estructura del JSON `settings`:**

```jsonc
{
  "company": { "name", "cif", "address", "phone", "email" },
  "defaults": { "iva_percentage", "margin_percentage", "budget_validity_days" },
  "custom_units": [{ "id", "label" }]
}
```

> Se crea con la migración inicial con valores por defecto. Ver [task 003](../tasks/003-ajustes-en-db.md) para detalle.

---

## Constantes frontend (no van a BD)

Estas constantes se mantienen en `src/lib/constants.ts`:

### Unidades de medida

| id | Label |
|----|-------|
| `ud` | Unidades (ud) |
| `m2` | Metros cuadrados (m²) |
| `ml` | Metros lineales (ml) |
| `m3` | Metros cúbicos (m³) |
| `kg` | Kilogramos (kg) |
| `l` | Litros (l) |
| `h` | Horas (h) |
| `pa` | Partida alzada (pa) |

### Emojis disponibles para secciones

```
🧱 📐 🚿 ⚡ 🪨 🎨 🔧 🪚 🔩 🪛
🏗️ 🏠 🚪 🪟 🛁 🚽 💡 🔌 🧹 🪣
🧰 ⚙️ 🔨 📏 🪜
```
