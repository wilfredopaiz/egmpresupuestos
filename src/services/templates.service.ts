import { supabase } from "@/lib/supabase";
import type { TablesInsert } from "@/types/database.types";

export type ItemTemplateInsert = Omit<TablesInsert<"item_templates">, "id" | "created_at" | "user_id">;

async function getRequiredUserId() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("No autenticado");
  return user.id;
}

export async function getTemplates() {
  const { data, error } = await supabase
    .from("item_templates")
    .select("*, section:sections(id, name, icon)")
    .order("name");

  if (error) throw error;
  return data;
}

export async function getTemplatesBySection(sectionId: string) {
  const { data, error } = await supabase
    .from("item_templates")
    .select("*")
    .eq("section_id", sectionId)
    .order("name");

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
