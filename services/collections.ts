import { supabaseClient } from "@supabase/auth-helpers-nextjs";

export const getCollections = () => {
  return async () => {
    const { data, error } = await supabaseClient
      .from("collections")
      .select()
      .order("created_at", { ascending: false });
    if (!error) {
      return data as Collection[];
    }
    throw new Error(error.message);
  };
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

export interface Collection {
  id: number;
  created_at: string;
  name: string;
  user_id: string;
  description: string;
}

export interface CreateCollectionOptions {
  name: string;
  description: string;
  user_id: string;
}
