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
    .select("*, recipes(*)")
    .eq("id", collectionId)
    .order("name", { foreignTable: "recipes" });

  if (!error) {
    return data[0] as CollectionRecipes;
  }
  throw new Error(error.message);
};

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

export interface Collection {
  id: number;
  created_at: string;
  name: string;
  user_id: string;
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
