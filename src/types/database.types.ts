export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      clients: {
        Row: {
          created_at: string;
          email: string | null;
          id: string;
          name: string;
          phone: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          email?: string | null;
          id?: string;
          name: string;
          phone?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          email?: string | null;
          id?: string;
          name?: string;
          phone?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "clients_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      item_templates: {
        Row: {
          created_at: string;
          has_option: boolean | null;
          id: string;
          name: string;
          option_label: string | null;
          price_installation: number;
          price_supply: number | null;
          section_id: string;
          unit: string;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          has_option?: boolean | null;
          id?: string;
          name: string;
          option_label?: string | null;
          price_installation?: number;
          price_supply?: number | null;
          section_id: string;
          unit?: string;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          has_option?: boolean | null;
          id?: string;
          name?: string;
          option_label?: string | null;
          price_installation?: number;
          price_supply?: number | null;
          section_id?: string;
          unit?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "item_templates_section_id_fkey";
            columns: ["section_id"];
            isOneToOne: false;
            referencedRelation: "sections";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "item_templates_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          created_at: string;
          email: string | null;
          full_name: string | null;
          id: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          email?: string | null;
          full_name?: string | null;
          id: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          email?: string | null;
          full_name?: string | null;
          id?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      project_items: {
        Row: {
          created_at: string;
          id: string;
          include_installation: boolean;
          include_supply: boolean;
          notes: string | null;
          option_enabled: boolean | null;
          price_installation: number;
          price_supply: number | null;
          project_id: string;
          quantity: number;
          sort_order: number | null;
          template_id: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          include_installation?: boolean;
          include_supply?: boolean;
          notes?: string | null;
          option_enabled?: boolean | null;
          price_installation: number;
          price_supply?: number | null;
          project_id: string;
          quantity?: number;
          sort_order?: number | null;
          template_id: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          include_installation?: boolean;
          include_supply?: boolean;
          notes?: string | null;
          option_enabled?: boolean | null;
          price_installation?: number;
          price_supply?: number | null;
          project_id?: string;
          quantity?: number;
          sort_order?: number | null;
          template_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "project_items_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "project_items_template_id_fkey";
            columns: ["template_id"];
            isOneToOne: false;
            referencedRelation: "item_templates";
            referencedColumns: ["id"];
          },
        ];
      };
      projects: {
        Row: {
          client_id: string | null;
          client_name: string | null;
          created_at: string;
          id: string;
          include_iva: boolean;
          iva_percentage: number;
          margin_percentage: number;
          name: string;
          notes: string | null;
          status: Database["public"]["Enums"]["project_status"];
          updated_at: string;
          user_id: string;
        };
        Insert: {
          client_id?: string | null;
          client_name?: string | null;
          created_at?: string;
          id?: string;
          include_iva?: boolean;
          iva_percentage?: number;
          margin_percentage?: number;
          name: string;
          notes?: string | null;
          status?: Database["public"]["Enums"]["project_status"];
          updated_at?: string;
          user_id: string;
        };
        Update: {
          client_id?: string | null;
          client_name?: string | null;
          created_at?: string;
          id?: string;
          include_iva?: boolean;
          iva_percentage?: number;
          margin_percentage?: number;
          name?: string;
          notes?: string | null;
          status?: Database["public"]["Enums"]["project_status"];
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "projects_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "projects_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      sections: {
        Row: {
          created_at: string;
          icon: string;
          id: string;
          name: string;
          sort_order: number | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          icon?: string;
          id?: string;
          name: string;
          sort_order?: number | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          icon?: string;
          id?: string;
          name?: string;
          sort_order?: number | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "sections_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      handle_new_user: {
        Args: Record<PropertyKey, never>;
        Returns: unknown;
      };
      handle_updated_at: {
        Args: Record<PropertyKey, never>;
        Returns: unknown;
      };
    };
    Enums: {
      project_status:
        | "en-medicion"
        | "presupuestado"
        | "aprobado"
        | "en-obra"
        | "finalizado";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never;
