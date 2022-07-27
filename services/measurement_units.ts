import { supabaseClient } from "@supabase/auth-helpers-nextjs";

export const getMeasurementUnits = async () => {
  const { data, error } = await supabaseClient
    .from("measurement_units")
    .select("id, name, symbol")
    .order("name", { ascending: true });

  if (!error) {
    return data as MeasurementUnit[];
  }
  throw new Error(error.message);
};

interface MeasurementUnit {
  id: number;
  name: string;
  symbol: string;
}
