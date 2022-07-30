import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { Ingredient } from "./ingredients";

export const getRecipe = async (id: number) => {
  const { data, error } = await supabaseClient
    .from("recipes")
    .select(
      `*,
      ingredients:recipe_ingredients (
        ingredient:ingredient_id (
          id, name, price, unit_price, package_units, measurement_unit:measurement_unit_id ( id, name, symbol )
        ),
        units
      )`
    )
    .eq("id", id);

  if (!error) return data[0] as Recipe;

  throw new Error(error.message);
};

export interface Recipe {
  id: number;
  created_at: string;
  name: string;
  profit_percentage: number;
  collection_id: number;
  description?: string;
  ingredients: RecipeIngredient[];
}

export interface RecipeIngredient {
  units: number;
  ingredient: Ingredient;
}
