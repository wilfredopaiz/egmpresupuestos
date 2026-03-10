import { supabase } from "@/lib/supabase";
import type { TablesInsert, TablesUpdate } from "@/types/database.types";

export type ProjectItemInsert = Omit<TablesInsert<"project_items">, "id" | "created_at" | "updated_at">;
export type ProjectItemUpdate = Omit<TablesUpdate<"project_items">, "id" | "created_at" | "updated_at">;

export async function addItemToProject(item: ProjectItemInsert) {
  const { data, error } = await supabase
    .from("project_items")
    .insert(item)
    .select(
      `
      *,
      template:item_templates(
        *,
        section:sections(id, name, icon)
      )
    `,
    )
    .single();

  if (error) throw error;
  return data;
}

export async function updateProjectItem(id: string, updates: ProjectItemUpdate) {
  const { data, error } = await supabase.from("project_items").update(updates).eq("id", id).select().single();
  if (error) throw error;
  return data;
}

export async function removeProjectItem(id: string) {
  const { error } = await supabase.from("project_items").delete().eq("id", id);
  if (error) throw error;
}
