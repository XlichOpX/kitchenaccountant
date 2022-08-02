import { supabaseClient } from "@supabase/auth-helpers-nextjs";

export const getSettings = async () => {
  const { data, error } = await supabaseClient.from("settings").select();

  if (error) throw new Error(error.message);

  return data[0] as Settings;
};

export const updateSettings = async (settings: UpdateSettingsOptions) => {
  const { error } = await supabaseClient
    .from("settings")
    .upsert(settings, { returning: "minimal" });

  if (error) throw new Error(error.message);
};

export interface Settings {
  currency_symbol: string | null;
}

export interface UpdateSettingsOptions extends Settings {
  user_id: string;
}
