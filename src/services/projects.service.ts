import { supabase } from "@/lib/supabase";
import type { Enums, TablesInsert, TablesUpdate } from "@/types/database.types";

export type ProjectStatus = Enums<"project_status">;
export type ProjectInsert = Omit<
  TablesInsert<"projects">,
  "id" | "created_at" | "updated_at" | "user_id" | "status"
>;
export type ProjectUpdate = Omit<TablesUpdate<"projects">, "id" | "created_at" | "updated_at" | "user_id">;

async function getRequiredUserId() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("No autenticado");
  return user.id;
}

const PROJECT_SELECT = `
  *,
  client:clients(id, name),
  items:project_items(
    *,
    template:item_templates(
      *,
      section:sections(id, name, icon)
    )
  )
`;

export async function getProjects() {
  const { data, error } = await supabase
    .from("projects")
    .select(PROJECT_SELECT)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getProjectById(id: string) {
  const { data, error } = await supabase.from("projects").select(PROJECT_SELECT).eq("id", id).single();
  if (error) throw error;
  return data;
}

export async function createProject(project: ProjectInsert) {
  const userId = await getRequiredUserId();

  const { data, error } = await supabase
    .from("projects")
    .insert({
      ...project,
      user_id: userId,
      status: "en-medicion",
      include_iva: project.include_iva ?? true,
      iva_percentage: project.iva_percentage ?? 21,
      margin_percentage: project.margin_percentage ?? 15,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateProject(id: string, updates: ProjectUpdate) {
  const { data, error } = await supabase.from("projects").update(updates).eq("id", id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteProject(id: string) {
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw error;
}
