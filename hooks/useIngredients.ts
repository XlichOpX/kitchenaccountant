import { useUser } from "@supabase/auth-helpers-react";
import { useCallback } from "react";
import {
  createIngredient,
  CreateIngredientOptions,
  getIngredients,
} from "services/ingredients";
import useSWR, { useSWRConfig } from "swr";

const useIngredients = () => {
  const { user } = useUser();
  const { mutate } = useSWRConfig();
  const { data: ingredients = [], error } = useSWR(user && "ingredients", () =>
    getIngredients()
  );

  const addIngredient = useCallback(
    async (ingredient: CreateIngredientOptions) => {
      if (!user) return;

      try {
        await createIngredient({ ...ingredient, user_id: user.id });
        mutate("ingredients");
      } catch (error) {
        throw error;
      }
    },
    [mutate, user]
  );

  return {
    ingredients,
    addIngredient,
    error,
    isLoading: ingredients.length === 0 && !error,
  };
};

export default useIngredients;
