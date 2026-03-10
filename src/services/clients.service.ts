import { supabase } from "@/lib/supabase";
import type { Tables, TablesInsert, TablesUpdate } from "@/types/database.types";

export type ClientRow = Tables<"clients">;
export type ClientInsert = Omit<TablesInsert<"clients">, "id" | "created_at" | "updated_at" | "user_id">;
export type ClientUpdate = Omit<TablesUpdate<"clients">, "id" | "created_at" | "updated_at" | "user_id">;

async function getRequiredUserId() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("No autenticado");
  return user.id;
}

export async function getClients() {
  const { data, error } = await supabase.from("clients").select("*").order("name");
  if (error) throw error;
  return data;
}

export async function getClientById(id: string) {
  const { data, error } = await supabase.from("clients").select("*").eq("id", id).single();
  if (error) throw error;
  return data;
}

export async function createClient(client: ClientInsert) {
  const userId = await getRequiredUserId();

  const { data, error } = await supabase
    .from("clients")
    .insert({ ...client, user_id: userId })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateClient(id: string, updates: ClientUpdate) {
  const { data, error } = await supabase.from("clients").update(updates).eq("id", id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteClient(id: string) {
  const { error } = await supabase.from("clients").delete().eq("id", id);
  if (error) throw error;
}
