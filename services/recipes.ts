import { supabaseClient } from "@supabase/auth-helpers-nextjs";

export const createRecipe = async (recipe: CreateRecipeOptions) => {
  const { data, error } = await supabaseClient.from("recipes").insert(recipe);

  if (!error) {
    return data[0] as Recipe;
  }
  throw new Error(error.message);
};

export interface Recipe {
  id: number;
  created_at: string;
  name: string;
  profit_percentage: number;
  collection_id: number;
  description: string;
}

export interface CreateRecipeOptions {
  name: string;
  description: string;
  collection_id: number;
}
