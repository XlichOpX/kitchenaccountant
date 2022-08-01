import { useUser } from "@supabase/auth-helpers-react";
import { useCallback } from "react";
import {
  createRecipe,
  CreateRecipeOptions,
  getCollection,
  deleteCollection as svDeleteCollection,
} from "services/collections";
import useSWR, { useSWRConfig } from "swr";

const useCollection = (collectionId: number) => {
  const { user } = useUser();
  const { mutate } = useSWRConfig();
  const { data: collection, error } = useSWR(
    user && `collections/${collectionId}`,
    () => getCollection(collectionId)
  );

  const addRecipe = useCallback(
    async (recipe: CreateRecipeOptions) => {
      if (!user) return;
      try {
        const newRecipeId = await createRecipe({
          ...recipe,
          collection_id: collectionId,
          user_id: user.id,
        });
        mutate(`collections/${collectionId}`);
        mutate("recipes");
        return newRecipeId;
      } catch (error) {
        throw error;
      }
    },
    [collectionId, mutate, user]
  );

  const deleteCollection = useCallback(async () => {
    await svDeleteCollection(collectionId);
    mutate("collections");
    mutate("recipes");
  }, [collectionId, mutate]);

  return {
    collection,
    addRecipe,
    deleteCollection,
    error,
    isLoading: !collection && !error,
  };
};

export default useCollection;
