import { supabase } from "@/lib/supabase";
import type { TablesInsert, TablesUpdate } from "@/types/database.types";

export type ItemTemplateInsert = Omit<TablesInsert<"item_templates">, "id" | "created_at" | "user_id">;
export type ItemTemplateUpdate = Omit<TablesUpdate<"item_templates">, "id" | "created_at" | "user_id">;

async function getRequiredUserId() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("No autenticado");
  return user.id;
}

export async function getTemplates(includeHidden = false) {
  let query = supabase.from("item_templates").select("*, section:sections(id, name, icon)");
  if (!includeHidden) {
    query = query.eq("hidden", false);
  }
  const { data, error } = await query.order("name");

  if (error) throw error;
  return data;
}

export async function getTemplatesBySection(sectionId: string, includeHidden = false) {
  let query = supabase.from("item_templates").select("*").eq("section_id", sectionId);
  if (!includeHidden) {
    query = query.eq("hidden", false);
  }
  const { data, error } = await query.order("name");

  if (error) throw error;
  return data;
}

export async function getTemplateById(id: string) {
  const { data, error } = await supabase
    .from("item_templates")
    .select("*, section:sections(id, name, icon)")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function createTemplate(template: ItemTemplateInsert) {
  const userId = await getRequiredUserId();

  const { data, error } = await supabase
    .from("item_templates")
    .insert({ ...template, user_id: userId })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateTemplate(id: string, updates: ItemTemplateUpdate) {
  const { data, error } = await supabase
    .from("item_templates")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function toggleTemplateHidden(id: string, hidden: boolean) {
  const { data, error } = await supabase
    .from("item_templates")
    .update({ hidden })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
