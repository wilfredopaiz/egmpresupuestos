import type { Database } from "./database.types";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Client = Database["public"]["Tables"]["clients"]["Row"];
export type Section = Database["public"]["Tables"]["sections"]["Row"];
export type ItemTemplate = Database["public"]["Tables"]["item_templates"]["Row"];
export type Project = Database["public"]["Tables"]["projects"]["Row"];
export type ProjectItem = Database["public"]["Tables"]["project_items"]["Row"];

export type ClientInsert = Database["public"]["Tables"]["clients"]["Insert"];
export type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"];
export type ProjectItemInsert = Database["public"]["Tables"]["project_items"]["Insert"];

export type ProjectStatus = Database["public"]["Enums"]["project_status"];
