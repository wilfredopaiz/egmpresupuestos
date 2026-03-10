# 005 - Página de Clientes

## Contexto

La app ya tiene toda la infraestructura de clientes creada (servicio, hooks, tipos, tabla en DB). Sin embargo, los clientes solo se gestionan de forma inline dentro del flujo de "Nueva Obra" (un dropdown con opción de crear rápido). No existe una página dedicada para listarlos, crearlos, editarlos o eliminarlos.

## Lo que se quiere conseguir

- Página `/clientes` en el sidebar con lista completa de clientes
- Crear, editar y eliminar clientes desde esa página
- Ver cuántos proyectos tiene asociados cada cliente
- Navegar a los proyectos de un cliente concreto con un click

---

## 1. Archivos a crear

```
src/pages/Clientes.tsx
src/components/clients/ClientCard.tsx
src/components/clients/ClientFormModal.tsx
```

---

## 2. Archivos a modificar

```
src/App.tsx                          → nueva ruta /clientes
src/components/layout/AppSidebar.tsx → nuevo item en navegación
src/hooks/queryKeys.ts               → añadir clave detail
```

---

## 3. Ruta y navegación

### `src/App.tsx`

Añadir la ruta junto a las demás:

```tsx
<Route path="/clientes" element={<Clientes />} />
```

### `src/components/layout/AppSidebar.tsx`

Añadir item entre "Proyectos" y "Partidas":

```tsx
{ title: "Clientes", url: "/clientes", icon: Users }
```

> Usar el icono `Users` de `lucide-react`, que ya se usa en el proyecto.

---

## 4. Página `Clientes.tsx`

Seguir el patrón de `Proyectos.tsx`:

**Layout:**
- Header con título "Clientes" + botón "Nuevo cliente" (variant `action`)
- Buscador por nombre, teléfono o email
- Grid de cards (igual que proyectos: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`)
- Estado vacío si no hay clientes o no hay resultados de búsqueda

**Estado:**
- `searchTerm` → filtra en frontend por `name`, `phone`, `email`
- Datos de `useClients()`

**Acciones:**
- Botón "Nuevo cliente" → abre `ClientFormModal` en modo create
- En cada card: editar → abre `ClientFormModal` en modo edit, eliminar → confirmación

---

## 5. Componente `ClientCard.tsx`

Seguir el patrón visual de `ProjectCard.tsx`.

**Contenido de la card:**

```
┌─────────────────────────────────────┐
│ [Nombre cliente]                    │
│ 📞 600 123 456   ✉ email@...       │
│                                     │
│ N proyectos asociados               │
│                                     │
│ [Ver proyectos]  [Editar] [Eliminar]│
└─────────────────────────────────────┘
```

**Props:**
- `client: Client`
- `projectCount: number` — número de proyectos con `client_id = client.id`
- `onEdit: () => void`
- `onDelete: () => void`

**Cálculo de `projectCount`:**

En la página `Clientes.tsx`, cruzar los datos de `useClients()` y `useProjects()`:

```tsx
const projectCountByClient = projects.reduce((acc, p) => {
  if (p.client_id) acc[p.client_id] = (acc[p.client_id] ?? 0) + 1;
  return acc;
}, {} as Record<string, number>);
```

**Acción "Ver proyectos":**

Navegar a `/proyectos` con un query param de filtro:

```tsx
navigate(`/proyectos?client_id=${client.id}`)
```

> La página Proyectos ya tiene un filtro de cliente — verificar si acepta `client_id` por query param o si hace falta añadirlo.

**Eliminar:**

Mostrar toast de confirmación o `AlertDialog` de shadcn antes de llamar `useDeleteClient()`. Si el cliente tiene proyectos asociados (`projectCount > 0`), mostrar aviso de que los proyectos pasarán a no tener cliente registrado (el campo `client_name` desnormalizado se mantiene).

---

## 6. Componente `ClientFormModal.tsx`

Modal reutilizable para crear y editar clientes.

**Props:**
- `open: boolean`
- `onClose: () => void`
- `client?: Client` — si se pasa, modo edición; si no, modo creación

**Campos del formulario:**

| Campo | Tipo | Requerido |
|-------|------|-----------|
| Nombre | text input | Sí |
| Teléfono | text input | No |
| Email | email input | No |

**Comportamiento:**
- Create → `useCreateClient()` → invalidate → toast "Cliente creado"
- Edit → `useUpdateClient()` → invalidate → toast "Cliente actualizado"
- `onClose()` al completar con éxito

---

## 7. Query keys

**`src/hooks/queryKeys.ts`** — Añadir clave de detalle:

```typescript
clients: {
  all: ["clients"] as const,
  detail: (id: string) => ["clients", id] as const,
}
```

> Aunque por ahora no hay página de detalle de cliente, añadir la clave ya para consistencia.

---

## 8. Verificación

- [ ] El item "Clientes" aparece en el sidebar y navega a `/clientes`
- [ ] Se listan todos los clientes con nombre, teléfono, email y número de proyectos
- [ ] El buscador filtra por nombre, teléfono y email en tiempo real
- [ ] "Nuevo cliente" abre el modal y crea correctamente
- [ ] "Editar" abre el modal con los datos precargados y actualiza correctamente
- [ ] "Eliminar" pide confirmación y elimina; si tiene proyectos, muestra aviso
- [ ] "Ver proyectos" navega a `/proyectos` filtrando por ese cliente
- [ ] Estado vacío se muestra cuando no hay clientes o no hay resultados

---

## Notas

- No hace falta página de detalle de cliente por ahora (los proyectos se ven desde `/proyectos`).
- El hook `useClients()` ya existe en `src/hooks/useClients.ts` con todas las mutations — no hay que crear nada nuevo en la capa de datos.
- La infraestructura de DB (tabla, RLS, servicio) ya está lista desde la integración de Supabase.
