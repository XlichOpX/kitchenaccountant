import { supabaseClient } from "@supabase/auth-helpers-nextjs";

export const getCollections = async () => {
  const { data, error } = await supabaseClient
    .from("collections")
    .select()
    .order("created_at", { ascending: false });
  if (!error) {
    return data as Collection[];
  }
  throw new Error(error.message);
};

export const createCollection = async (collection: CreateCollectionOptions) => {
  const { data, error } = await supabaseClient
    .from("collections")
    .insert(collection);

  if (!error) {
    return data[0] as Collection;
  }
  throw new Error(error.message);
};

export const getCollection = async (collectionId: number) => {
  const { data, error } = await supabaseClient
    .from("collections")
    .select(
      `id, name, description, created_at,
      recipes ( id, name, description, created_at )`
    )
    .eq("id", collectionId)
    .order("name", { foreignTable: "recipes" });

  if (!error) {
    return data[0] as CollectionRecipes;
  }
  throw new Error(error.message);
};

export const createRecipe = async ({
  ingredients,
  subrecipes,
  ...recipe
}: CreateRecipeOptions) => {
  const { data: newRecipe, error: recipeError } = await supabaseClient
    .from("recipes")
    .insert(recipe);

  if (recipeError) throw new Error(recipeError.message);

  const recipeId = newRecipe[0].id;

  await supabaseClient.from("recipe_ingredients").insert(
    ingredients.map((i) => ({ ...i, recipe_id: recipeId })),
    { returning: "minimal" }
  );

  await supabaseClient.from("recipe_subrecipes").insert(
    subrecipes.map((s) => ({ ...s, recipe_id: recipeId })),
    { returning: "minimal" }
  );

  return recipeId;
};

export const deleteCollection = async (collectionId: number) => {
  const { error } = await supabaseClient
    .from("collections")
    .delete()
    .eq("id", collectionId);

  if (!error) {
    return true;
  }
  throw new Error("Ocurrió un error al eliminar la colección");
};

export interface Recipe {
  id: number;
  created_at: string;
  name: string;
  description: string;
}

export interface CreateRecipeOptions {
  name: string;
  description?: string;
  collection_id: number;
  user_id: string;
  ingredients: { ingredient_id: number; units: number }[];
  subrecipes: { subrecipe_id: number; units: number }[];
  profit_percentage: number;
}

export interface Collection {
  id: number;
  created_at: string;
  name: string;
  description?: string;
}

export interface CollectionRecipes extends Collection {
  recipes: Recipe[];
}

export interface CreateCollectionOptions {
  name: string;
  description: string;
  user_id: string;
}
