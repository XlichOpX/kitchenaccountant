import { supabaseClient } from "@supabase/auth-helpers-nextjs";

export const measurementUnitQuery = "id, name, symbol";

export const getMeasurementUnits = async () => {
  const { data, error } = await supabaseClient
    .from("measurement_units")
    .select(measurementUnitQuery)
    .order("name", { ascending: true });

  if (!error) {
    return data as MeasurementUnit[];
  }
  throw new Error(error.message);
};

export interface MeasurementUnit {
  id: number;
  name: string;
  symbol: string;
}
