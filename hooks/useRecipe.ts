import { useUser } from "@supabase/auth-helpers-react";
import { useCallback } from "react";
import { deleteRecipe as svDeleteRecipe, getRecipe } from "services/recipes";
import useSWR from "swr";

const useRecipe = (id: number) => {
  const { user } = useUser();
  const { data: recipe, error } = useSWR(user && `recipes/${id}`, () =>
    getRecipe(id)
  );

  const deleteRecipe = useCallback(async () => {
    try {
      await svDeleteRecipe(id);
    } catch (error) {
      throw error;
    }
  }, [id]);

  return {
    recipe,
    deleteRecipe,
    error,
    isLoading: !recipe && !error,
  };
};

export default useRecipe;
