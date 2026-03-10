import { supabase } from "@/lib/supabase";
import type { TablesInsert, TablesUpdate } from "@/types/database.types";

export type ProjectItemInsert = Omit<TablesInsert<"project_items">, "id" | "created_at" | "updated_at">;
export type ProjectItemUpdate = Omit<TablesUpdate<"project_items">, "id" | "created_at" | "updated_at">;

export async function addItemToProject(item: ProjectItemInsert) {
  let payload = item;

  if (payload.price_installation === undefined || payload.price_installation === null) {
    const { data: template, error: templateError } = await supabase
      .from("item_templates")
      .select("price_installation, price_supply")
      .eq("id", payload.template_id)
      .single();

    if (templateError) throw templateError;

    payload = {
      ...payload,
      price_installation: template.price_installation,
      price_supply: payload.price_supply ?? template.price_supply,
    };
  }

  const { data, error } = await supabase
    .from("project_items")
    .insert(payload)
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
