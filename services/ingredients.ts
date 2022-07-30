import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { MeasurementUnit } from "./measurement_units";

export const getIngredients = async () => {
  const { data, error } = await supabaseClient
    .from("ingredients")
    .select(
      "id, name, price, package_units, measurement_unit:measurement_unit_id ( name, symbol )"
    )
    .order("name", { ascending: true });

  if (!error) {
    return data as Ingredient[];
  }
  throw new Error(error.message);
};

export const createIngredient = async (ingredient: CreateIngredientOptions) => {
  const { data, error } = await supabaseClient
    .from("ingredients")
    .insert(ingredient);

  if (!error) {
    return data[0] as Ingredient;
  }
  throw new Error(error.message);
};

export const getIngredient = async (ingredientId: number) => {
  const { data, error } = await supabaseClient
    .from("ingredients")
    .select(
      "id, name, price, unit_price, package_units, measurement_unit:measurement_unit_id ( id, name, symbol )"
    )
    .eq("id", ingredientId);

  if (!error) {
    return data[0] as Ingredient;
  }
  throw new Error(error.message);
};

export const updateIngredient = async ({
  id,
  ...ingredient
}: Partial<Ingredient>) => {
  if (!id) throw new Error("Ingredient id is undefined");

  const { data, error } = await supabaseClient
    .from("ingredients")
    .update(ingredient)
    .eq("id", id);

  if (!error) {
    return data[0] as Ingredient;
  }
  throw new Error(error.message);
};

export interface Ingredient {
  id: number;
  name: string;
  measurement_unit: MeasurementUnit;
  package_units: number;
  price: number;
  unit_price: number;
}

export interface CreateIngredientOptions {
  name: string;
  user_id: string;
  measurement_unit_id: number;
  package_units: number;
  price: number;
}
