import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { MeasurementUnit, measurementUnitQuery } from "./measurement_units";

export const ingredientQuery = `
  id,
  name,
  price,
  unit_price,
  package_units,
  measurement_unit:measurement_unit_id (${measurementUnitQuery})
`;

export const getIngredients = async () => {
  const { data, error } = await supabaseClient
    .from("ingredients")
    .select(ingredientQuery)
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
    .select(ingredientQuery)
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

export const deleteIngredient = async (ingredientId: number) => {
  const { data, error } = await supabaseClient
    .from("ingredients")
    .delete()
    .eq("id", ingredientId);

  if (!error) {
    return data[0] as Ingredient;
  }
  if (error.code === "23503") {
    throw new Error("El ingrediente está siendo usado en una o más recetas.");
  }
  throw new Error(error.message);
};

export interface Ingredient {
  id: number;
  name: string;
  price: number;
  unit_price: number;
  package_units: number;
  measurement_unit: MeasurementUnit;
}

export interface CreateIngredientOptions {
  name: string;
  price: number;
  package_units: number;
  measurement_unit_id: number;
  user_id: string;
}
