import { useUser } from "@supabase/auth-helpers-react";
import { useCallback } from "react";
import {
  createRecipe,
  CreateRecipeOptions,
  getCollection,
} from "services/collections";
import useSWR, { useSWRConfig } from "swr";

const useCollection = (id: number) => {
  const { user } = useUser();
  const { mutate } = useSWRConfig();
  const { data: collection, error } = useSWR(user && `collections/${id}`, () =>
    getCollection(id)
  );

  const addRecipe = useCallback(
    async (recipe: CreateRecipeOptions) => {
      if (!user) return;
      try {
        await createRecipe({ ...recipe, collection_id: id, user_id: user.id });
        mutate(`collections/${id}`);
      } catch (error) {
        throw error;
      }
    },
    [id, mutate, user]
  );

  return {
    collection,
    addRecipe,
    error,
    isLoading: !collection && !error,
  };
};

export default useCollection;
