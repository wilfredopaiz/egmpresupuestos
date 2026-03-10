import { supabase } from "@/lib/supabase";

export type UnitSetting = { id: string; label: string };

export type AppSettingsPayload = {
  company?: {
    name?: string;
    cif?: string;
    address?: string;
    phone?: string;
    email?: string;
  };
  defaults?: {
    iva_percentage?: number;
    margin_percentage?: number;
    budget_validity_days?: number;
  };
  custom_units?: UnitSetting[];
};

const DEFAULT_SETTINGS: Required<AppSettingsPayload> = {
  company: {
    name: "",
    cif: "",
    address: "",
    phone: "",
    email: "",
  },
  defaults: {
    iva_percentage: 21,
    margin_percentage: 15,
    budget_validity_days: 30,
  },
  custom_units: [],
};

export async function getAppSettings() {
  const { data, error } = await supabase
    .from("app_settings")
    .select("*")
    .order("created_at", { ascending: true })
    .limit(1)
    .single();

  if (error) throw error;

  const settings = (data.settings ?? {}) as AppSettingsPayload;

  return {
    ...data,
    settings: {
      ...DEFAULT_SETTINGS,
      ...settings,
      company: { ...DEFAULT_SETTINGS.company, ...(settings.company ?? {}) },
      defaults: { ...DEFAULT_SETTINGS.defaults, ...(settings.defaults ?? {}) },
      custom_units: settings.custom_units ?? DEFAULT_SETTINGS.custom_units,
    },
  };
}

export async function updateAppSettings(settings: AppSettingsPayload) {
  const current = await getAppSettings();

  const merged: AppSettingsPayload = {
    ...current.settings,
    ...settings,
    company: {
      ...(current.settings.company ?? {}),
      ...(settings.company ?? {}),
    },
    defaults: {
      ...(current.settings.defaults ?? {}),
      ...(settings.defaults ?? {}),
    },
    custom_units: settings.custom_units ?? current.settings.custom_units ?? [],
  };

  const { data, error } = await supabase
    .from("app_settings")
    .update({ settings: merged })
    .eq("id", current.id)
    .select("*")
    .single();

  if (error) throw error;

  return {
    ...data,
    settings: merged,
  };
}
