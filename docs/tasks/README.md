# Tasks generales - EGM Presupuestos

## Objetivo

Resolver los problemas de persistencia y consistencia de datos que existen actualmente en la app. Todas las funcionalidades ya están construidas en UI, pero varios valores se pierden al navegar porque solo viven en estado local del componente.

## Problemas detectados

| # | Problema | Impacto |
|---|---------|---------|
| 1 | **IVA y Margen no se guardan por proyecto** | Al quitar el IVA o cambiar el margen en un proyecto, el cambio se pierde al volver a entrar. En `/presupuesto` se recalcula siempre con los defaults (21% y 15%). |
| 2 | **Precios personalizados por partida no se persisten** | El modal de añadir/editar partida permite cambiar precios, pero `project_items` no tiene campos para almacenarlos. Si en un futuro se cambia el precio de una plantilla, todos los presupuestos anteriores se verían afectados retroactivamente. |
| 3 | **Ajustes no se guardan en DB** | La página de Ajustes muestra campos editables (datos empresa, IVA default, margen default, validez presupuesto, unidades), pero todo es demo — nada se persiste. |

## Orden de ejecución

```
001-iva-margen-por-proyecto.md        → Campos IVA/margen en projects + persistir
002-precios-por-partida.md            → Precios snapshot en project_items
003-ajustes-en-db.md                  → Tabla app_settings (global) + persistir ajustes
004-corregir-rls-single-tenant.md     → Reemplazar RLS multi-tenant por single-tenant
005-pagina-clientes.md                → Página /clientes con CRUD completo
```

Las tasks son independientes entre sí, pero el orden sugerido va de menor a mayor impacto en el schema.

## Modelo de tenencia

**Single-tenant:** una sola empresa, múltiples usuarios que ven y editan todo. `user_id` existe en las tablas como campo de auditoría ("quién lo creó"), no como filtro de acceso. En un futuro se añadirán roles/permisos para restringir acceso.

## Convención

- Cada task incluye: contexto, cambios en DB (SQL), cambios en tipos, cambios en servicios/hooks, cambios en UI.
- Las migraciones SQL se diseñan para ejecutar manualmente en el SQL Editor de Supabase.
- RLS: autenticado = acceso total (single-tenant). Solo `profiles` restringe al propio usuario.
