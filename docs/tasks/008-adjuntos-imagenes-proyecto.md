# 008 - Adjuntos e imágenes por proyecto

## Contexto

Los proyectos no tienen ningún mecanismo de adjuntar archivos. El objetivo es permitir subir imágenes a cada proyecto, verlas como miniaturas en la vista del proyecto/presupuesto, y abrirlas en grande al hacer click. Los archivos se guardan en Supabase Storage en un bucket privado llamado `adjuntos`.

Por ahora: solo imágenes (JPG, PNG, WEBP, GIF). La arquitectura se diseña para poder ampliar a otros tipos en el futuro.

---

## 1. Supabase Storage — Bucket

Crear el bucket manualmente en **Supabase Dashboard → Storage → New bucket**:

| Campo | Valor |
|-------|-------|
| Name | `adjuntos` |
| Public | **No** (privado) |
| File size limit | 10 MB |
| Allowed MIME types | `image/jpeg, image/png, image/webp, image/gif` |

**Estructura de paths dentro del bucket:**

```
adjuntos/
  {project_id}/
    {uuid}-{filename}
    {uuid}-{filename}
```

**Políticas RLS del bucket:**

```sql
-- Leer archivos: solo autenticados
CREATE POLICY "adjuntos_select_authenticated"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'adjuntos');

-- Subir archivos: solo autenticados
CREATE POLICY "adjuntos_insert_authenticated"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'adjuntos');

-- Eliminar archivos: solo autenticados
CREATE POLICY "adjuntos_delete_authenticated"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'adjuntos');
```

> Las políticas de storage se configuran en **Dashboard → Storage → Policies**.

---

## 2. Tabla en base de datos

Los archivos del bucket no se consultan directamente — se mantiene una tabla `project_attachments` que registra los metadatos y la ruta en storage.

```sql
-- 008_create_project_attachments.sql

CREATE TABLE public.project_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id),
  storage_path text NOT NULL,        -- ej: "{project_id}/{uuid}-foto.jpg"
  filename text NOT NULL,            -- nombre original del archivo
  mime_type text NOT NULL,           -- "image/jpeg", etc.
  size_bytes int NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Índice
CREATE INDEX idx_project_attachments_project_id
  ON public.project_attachments(project_id);

-- RLS
ALTER TABLE public.project_attachments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "attachments_select_authenticated"
  ON public.project_attachments FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "attachments_insert_authenticated"
  ON public.project_attachments FOR INSERT
  TO authenticated WITH CHECK (true);

CREATE POLICY "attachments_delete_authenticated"
  ON public.project_attachments FOR DELETE
  TO authenticated USING (true);

COMMENT ON TABLE public.project_attachments IS 'Metadatos de archivos adjuntos por proyecto. El archivo físico vive en el bucket "adjuntos" de Storage.';
```

---

## 3. Archivos a crear

```
src/services/attachments.service.ts
src/hooks/useAttachments.ts
src/components/attachments/AttachmentUploader.tsx   → zona de drop/upload
src/components/attachments/AttachmentGrid.tsx        → grid de miniaturas
src/components/attachments/AttachmentLightbox.tsx    → vista en grande al hacer click
```

---

## 4. Archivos a modificar

```
src/types/database.types.ts      → añadir interfaz ProjectAttachment
src/pages/ProyectoDetalle.tsx    → añadir sección de adjuntos
src/pages/Presupuesto.tsx        → mostrar miniaturas (solo lectura)
```

---

## 5. Servicio `attachments.service.ts`

```typescript
// uploadAttachment(projectId, file) → Promise<ProjectAttachment>
//   1. Generar path: `{projectId}/{uuid}-{file.name}`
//   2. supabase.storage.from('adjuntos').upload(path, file)
//   3. INSERT en project_attachments con metadatos
//   4. Return el attachment creado

// getAttachments(projectId) → Promise<ProjectAttachment[]>
//   SELECT * FROM project_attachments WHERE project_id = projectId ORDER BY created_at DESC

// deleteAttachment(attachment) → Promise<void>
//   1. supabase.storage.from('adjuntos').remove([attachment.storage_path])
//   2. DELETE FROM project_attachments WHERE id = attachment.id

// getSignedUrl(storagePath, expiresInSeconds = 3600) → Promise<string>
//   supabase.storage.from('adjuntos').createSignedUrl(storagePath, expiresInSeconds)
//   Necesario porque el bucket es privado — las URLs expiran
```

---

## 6. Hook `useAttachments.ts`

```typescript
// useAttachments(projectId) → query: getAttachments(projectId)
// useUploadAttachment() → mutation: uploadAttachment() → invalidate on success
// useDeleteAttachment() → mutation: deleteAttachment() → invalidate on success
```

---

## 7. Componente `AttachmentUploader.tsx`

- Zona de drag & drop con `<input type="file" accept="image/*" multiple>`
- Botón alternativo "Seleccionar imágenes"
- Validación: solo imágenes, máximo 10 MB por archivo
- Barra de progreso durante la subida (Supabase Storage devuelve progreso)
- Muestra error si el tipo no es válido o supera el límite

---

## 8. Componente `AttachmentGrid.tsx`

Grid de miniaturas con URLs firmadas:

- Obtener `signedUrl` para cada attachment al montar
- Grid responsive: `grid-cols-2 sm:grid-cols-3 md:grid-cols-4`
- Cada miniatura: imagen con `object-cover` + botón de eliminar (icono X) en esquina
- Al hacer click en la imagen → abre `AttachmentLightbox`
- Estado de carga mientras se obtienen las URLs firmadas

---

## 9. Componente `AttachmentLightbox.tsx`

Visor a pantalla completa al hacer click en una miniatura:

- Overlay oscuro sobre toda la pantalla
- Imagen centrada a tamaño completo (con `max-h-screen`, scroll si es más alta)
- Botón cerrar (X) en esquina superior derecha
- Navegación anterior/siguiente entre imágenes del proyecto
- Nombre del archivo y fecha en la parte inferior
- Cerrar al hacer click fuera de la imagen o pulsar Escape

> Opciones: implementar propio (simple) o usar librería como `yet-another-react-lightbox` (`npm install yet-another-react-lightbox`).

---

## 10. Cambios en `ProyectoDetalle.tsx`

Añadir sección "Adjuntos" al final de la página, antes del footer:

```
┌─────────────────────────────────────────┐
│ 📎 Adjuntos                    [+ Añadir] │
│                                          │
│ [img] [img] [img] [img]                  │
│ [img] [img]                              │
└─────────────────────────────────────────┘
```

- Usa `useAttachments(projectId)` para cargar
- Muestra `AttachmentGrid` con las imágenes existentes
- Muestra `AttachmentUploader` al pulsar "+ Añadir"

---

## 11. Cambios en `Presupuesto.tsx`

Añadir sección de adjuntos en modo **solo lectura** (sin botón de subir ni eliminar):

- Solo mostrar `AttachmentGrid` sin controles de edición
- Posición: al final, antes del footer con botones de exportar

---

## 12. Tipos

**`src/types/database.types.ts`**:

```typescript
interface ProjectAttachment {
  id: string;
  project_id: string;
  user_id: string;
  storage_path: string;
  filename: string;
  mime_type: string;
  size_bytes: number;
  created_at: string;
  // computed (no en DB):
  signed_url?: string;
}
```

---

## 13. Verificación

- [ ] Crear bucket `adjuntos` privado en Supabase Dashboard
- [ ] Subir una imagen desde ProyectoDetalle → aparece como miniatura
- [ ] Subir varias imágenes a la vez → todas aparecen
- [ ] Hacer click en miniatura → se abre en grande (lightbox)
- [ ] Navegar entre imágenes con flechas en el lightbox
- [ ] Cerrar lightbox con X o pulsando Escape
- [ ] Botón eliminar en miniatura → pide confirmación → elimina de Storage y de la tabla
- [ ] En `/presupuesto` se ven las imágenes (solo lectura, sin botón de eliminar)
- [ ] Archivo mayor de 10 MB → error con mensaje claro
- [ ] Archivo que no es imagen → error con mensaje claro
- [ ] Las URLs firmadas se regeneran automáticamente (no expiran en sesión activa)

---

## Notas

- Las URLs firmadas caducan (1 hora por defecto). Para una sesión larga, regenerarlas al montar o usar un hook que las refresque. Alternativa simple: firmar con `expiresIn: 86400` (24h).
- El bucket es **privado** — nunca exponer las URLs de storage directamente; siempre usar URLs firmadas.
- Si en el futuro se quieren adjuntar PDFs u otros documentos, solo hace falta ampliar `ALLOWED_MIME_TYPES` en el validador del uploader y el bucket.
