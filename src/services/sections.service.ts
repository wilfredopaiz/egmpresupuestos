import { supabase } from "@/lib/supabase";
import type { TablesInsert, TablesUpdate } from "@/types/database.types";

export type SectionInsert = Omit<TablesInsert<"sections">, "id" | "created_at" | "user_id">;
export type SectionUpdate = Omit<TablesUpdate<"sections">, "id" | "created_at" | "user_id">;

async function getRequiredUserId() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("No autenticado");
  return user.id;
}

export async function getSections(includeHidden = false) {
  let query = supabase.from("sections").select("*");
  if (!includeHidden) {
    query = query.eq("hidden", false);
  }
  const { data, error } = await query.order("sort_order");
  if (error) throw error;
  return data;
}

export async function getSectionById(id: string) {
  const { data, error } = await supabase.from("sections").select("*").eq("id", id).single();
  if (error) throw error;
  return data;
}

export async function createSection(section: SectionInsert) {
  const userId = await getRequiredUserId();

  const { data, error } = await supabase
    .from("sections")
    .insert({ ...section, user_id: userId })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateSection(id: string, updates: SectionUpdate) {
  const { data, error } = await supabase.from("sections").update(updates).eq("id", id).select().single();
  if (error) throw error;
  return data;
}

export async function toggleSectionHidden(id: string, hidden: boolean) {
  const { data, error } = await supabase
    .from("sections")
    .update({ hidden })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}
