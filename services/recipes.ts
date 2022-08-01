import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { Ingredient } from "./ingredients";

export const getRecipe = async (id: number) => {
  const { data, error } = await supabaseClient
    .from("recipes")
    .select(
      `*,
      ingredients:recipe_ingredients (
        id,
        ingredient:ingredient_id (
          id, name, price, unit_price, package_units, measurement_unit:measurement_unit_id ( id, name, symbol )
        ),
        units
      ),
      subrecipes:recipe_subrecipes!recipe_subrecipes_recipe_id_fkey (
        id,
        units,
        recipe:subrecipe_id (
          id, name, ingredients:recipe_ingredients (
            id, units, ingredient:ingredient_id ( id, name, price, unit_price, package_units, measurement_unit:measurement_unit_id ( id, name, symbol ) )
          )
        )
      )
      `
    )
    .eq("id", id);

  if (!error) return data[0] as Recipe;

  throw new Error(error.message);
};

export const getRecipes = async () => {
  const { data, error } = await supabaseClient
    .from("recipes")
    .select("id, name, created_at");

  if (!error) {
    return data as ListRecipe[];
  }
};

export const deleteRecipe = async (recipeId: number) => {
  const { data, error } = await supabaseClient
    .from("recipes")
    .delete()
    .eq("id", recipeId);

  if (!error) return data[0] as Recipe;

  throw new Error(error.message);
};

export const updateRecipe = async (
  recipe: Recipe,
  deletedIngredients?: number[]
) => {
  const { ingredients, id: recipeId, ...recipeInfo } = recipe;

  const newIngredients = ingredients
    .filter(({ id }) => !id)
    .map((i) => ({ ...i, recipe_id: recipeId }));

  const updatedIngredients = ingredients
    .filter(({ id }) => !!id)
    .map((i) => ({ ...i, recipe_id: recipeId }));

  const { error: recipeInfoError } = await supabaseClient
    .from("recipes")
    .update(recipeInfo, { returning: "minimal" })
    .eq("id", recipeId);

  const { error: newIngredientsError } = await supabaseClient
    .from("recipe_ingredients")
    .insert(newIngredients, { returning: "minimal" });

  const { error: updatedIngredientsError } = await supabaseClient
    .from("recipe_ingredients")
    .upsert(updatedIngredients, { returning: "minimal" });

  let deletedIngredientsError;
  if (deletedIngredients) {
    deletedIngredientsError = (
      await supabaseClient
        .from("recipe_ingredients")
        .delete({ returning: "minimal" })
        .in("id", deletedIngredients)
    ).error;
  }

  if (
    recipeInfoError ||
    newIngredientsError ||
    updatedIngredientsError ||
    deletedIngredientsError
  )
    throw new Error("Ocurrió un error al guardar los cambios");
};

export interface ListRecipe {
  id: number;
  name: string;
  created_at: string;
}

export interface Recipe {
  id: number;
  created_at: string;
  name: string;
  profit_percentage: number;
  collection_id: number;
  description?: string;
  ingredients: RecipeIngredient[];
  subrecipes: Subrecipe[];
}

export interface Subrecipe {
  id: number;
  recipe: {
    id: number;
    name: string;
    ingredients: RecipeIngredient[];
  };
  units: number;
}

export interface RecipeIngredient {
  id: number;
  units: number;
  ingredient: Ingredient;
}
