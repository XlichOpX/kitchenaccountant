import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { Ingredient, ingredientQuery } from "./ingredients";

export const recipeQuery = `
  id,
  name,
  description,
  collection_id,
  profit_percentage,
  created_at,
  ingredients:recipe_ingredients (
    id,
    units,
    ingredient:ingredient_id (${ingredientQuery})
  ),
  subrecipes:recipe_subrecipes!recipe_subrecipes_recipe_id_fkey (
    id,
    units,
    recipe:subrecipe_id (
      id,
      name,
      ingredients:recipe_ingredients (
        id,
        units,
        ingredient:ingredient_id (${ingredientQuery})
      )
    )
  )
`;

export const getRecipe = async (id: number) => {
  const { data, error } = await supabaseClient
    .from("recipes")
    .select(recipeQuery)
    .eq("id", id);

  if (!error) return data[0] as Recipe;
  throw new Error(error.message);
};

export const getRecipes = async () => {
  const { data, error } = await supabaseClient
    .from("recipes")
    .select("id, name, description, created_at");

  if (!error) return data as ListRecipe[];
};

export const deleteRecipe = async (recipeId: number) => {
  const { data, error } = await supabaseClient
    .from("recipes")
    .delete()
    .eq("id", recipeId);

  if (!error) return data[0] as Recipe;

  if (error.code === "23503")
    throw new Error("La receta está siendo usada por otras recetas.");

  throw new Error(error.message);
};

export const updateRecipe = async (
  recipe: Recipe,
  deletedIngredients?: number[],
  deletedSubrecipes?: number[]
) => {
  const { ingredients, subrecipes, id: recipeId, ...recipeInfo } = recipe;

  const newIngredients = ingredients
    .filter(({ id }) => !id)
    .map((i) => ({ ...i, recipe_id: recipeId }));

  const updatedIngredients = ingredients
    .filter(({ id }) => !!id)
    .map((i) => ({ ...i, recipe_id: recipeId }));

  const newSubrecipes = subrecipes
    .filter(({ id }) => !id)
    .map((i) => ({ ...i, recipe_id: recipeId }));

  const updatedSubrecipes = subrecipes
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

  const { error: newSubrecipesError } = await supabaseClient
    .from("recipe_subrecipes")
    .insert(newSubrecipes, { returning: "minimal" });

  const { error: updatedSubrecipesError } = await supabaseClient
    .from("recipe_subrecipes")
    .upsert(updatedSubrecipes, { returning: "minimal" });

  let deletedIngredientsError;
  if (deletedIngredients) {
    deletedIngredientsError = (
      await supabaseClient
        .from("recipe_ingredients")
        .delete({ returning: "minimal" })
        .in("id", deletedIngredients)
    ).error;
  }

  let deletedSubrecipesError;
  if (deletedSubrecipes) {
    deletedSubrecipesError = (
      await supabaseClient
        .from("recipe_subrecipes")
        .delete({ returning: "minimal" })
        .in("id", deletedSubrecipes)
    ).error;
  }

  if (
    recipeInfoError ||
    newIngredientsError ||
    updatedIngredientsError ||
    newSubrecipesError ||
    updatedSubrecipesError ||
    deletedIngredientsError ||
    deletedSubrecipesError
  )
    throw new Error("Ocurrió un error al guardar los cambios");
};

export interface ListRecipe {
  id: number;
  name: string;
  description?: string;
  created_at: string;
}

export interface Recipe {
  id: number;
  name: string;
  description?: string;
  collection_id: number;
  created_at: string;
  profit_percentage: number;
  ingredients: RecipeIngredient[];
  subrecipes: Subrecipe[];
}

export interface Subrecipe {
  id: number;
  units: number;
  recipe: {
    id: number;
    name: string;
    ingredients: RecipeIngredient[];
  };
}

export interface RecipeIngredient {
  id: number;
  units: number;
  ingredient: Ingredient;
}
