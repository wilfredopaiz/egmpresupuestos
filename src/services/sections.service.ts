import { supabase } from "@/lib/supabase";
import type { TablesInsert } from "@/types/database.types";

export type SectionInsert = Omit<TablesInsert<"sections">, "id" | "created_at" | "user_id">;

async function getRequiredUserId() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("No autenticado");
  return user.id;
}

export async function getSections() {
  const { data, error } = await supabase.from("sections").select("*").order("sort_order");
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
