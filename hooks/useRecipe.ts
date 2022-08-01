import { useUser } from "@supabase/auth-helpers-react";
import { useCallback } from "react";
import {
  deleteRecipe as svDeleteRecipe,
  getRecipe,
  updateRecipe as svUpdateRecipe,
} from "services/recipes";
import useSWR, { useSWRConfig } from "swr";

const useRecipe = (id: number) => {
  const { user } = useUser();
  const { data: recipe, error } = useSWR(user && `recipes/${id}`, () =>
    getRecipe(id)
  );
  const { mutate } = useSWRConfig();

  const deleteRecipe = useCallback(async () => {
    try {
      await svDeleteRecipe(id);
    } catch (error) {
      throw error;
    }
  }, [id]);

  const updateRecipe: typeof svUpdateRecipe = useCallback(
    async (recipe, deletedIngredients) => {
      await svUpdateRecipe(recipe, deletedIngredients);
      await mutate(`recipes/${id}`);
    },
    [mutate, id]
  );

  return {
    recipe,
    deleteRecipe,
    updateRecipe,
    error,
    isLoading: !recipe && !error,
  };
};

export default useRecipe;
