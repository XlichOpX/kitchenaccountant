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
  ...recipe
}: CreateRecipeOptions) => {
  const { data: newRecipe, error } = await supabaseClient
    .from("recipes")
    .insert(recipe);

  if (!error) {
    const { error } = await supabaseClient.from("recipe_ingredients").insert(
      ingredients.map((i) => ({ ...i, recipe_id: newRecipe[0].id })),
      { returning: "minimal" }
    );

    if (!error) {
      return true;
    }
    throw new Error(error.message);
  }
  throw new Error(error.message);
};

export interface Recipe {
  id: number;
  created_at: string;
  name: string;
  description: string;
}

export interface CreateRecipeOptions {
  name: string;
  description: string;
  collection_id: number;
  ingredients: { ingredient_id: number; units: number }[];
}

export interface Collection {
  id: number;
  created_at: string;
  name: string;
  description: string;
}

export interface CollectionRecipes extends Collection {
  recipes: Recipe[];
}

export interface CreateCollectionOptions {
  name: string;
  description: string;
  user_id: string;
}
