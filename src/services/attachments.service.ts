import { supabase } from "@/lib/supabase";
import type { Tables, TablesInsert } from "@/types/database.types";

export type ProjectAttachment = Tables<"project_attachments">;
export type ProjectAttachmentInsert = TablesInsert<"project_attachments">;

const STORAGE_BUCKET = "adjuntos";
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

async function getRequiredUserId() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("No autenticado");
  return user.id;
}

function sanitizeFilename(filename: string) {
  return filename.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9._-]/g, "");
}

function createFileId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function validateFile(file: File) {
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    throw new Error(`Tipo no permitido: ${file.name}`);
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error(`Archivo supera 10 MB: ${file.name}`);
  }
}

export async function getAttachments(projectId: string) {
  const { data, error } = await supabase
    .from("project_attachments")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function uploadAttachment(projectId: string, file: File) {
  validateFile(file);
  const userId = await getRequiredUserId();

  const safeName = sanitizeFilename(file.name);
  const storagePath = `${projectId}/${createFileId()}-${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(storagePath, file, { upsert: false, contentType: file.type });

  if (uploadError) throw uploadError;

  const payload: ProjectAttachmentInsert = {
    project_id: projectId,
    user_id: userId,
    storage_path: storagePath,
    filename: file.name,
    mime_type: file.type,
    size_bytes: file.size,
  };

  const { data, error } = await supabase.from("project_attachments").insert(payload).select().single();
  if (error) throw error;
  return data;
}

export async function deleteAttachment(attachment: ProjectAttachment) {
  const { error: storageError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .remove([attachment.storage_path]);
  if (storageError) throw storageError;

  const { error } = await supabase.from("project_attachments").delete().eq("id", attachment.id);
  if (error) throw error;
}

export async function getSignedUrl(storagePath: string, expiresInSeconds = 60 * 60) {
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .createSignedUrl(storagePath, expiresInSeconds);

  if (error) throw error;
  return data.signedUrl;
}
