import { useUser } from "@supabase/auth-helpers-react";
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

  const addIngredient = async (ingredient: CreateIngredientOptions) => {
    if (!user) return;

    try {
      await createIngredient({
        ...ingredient,
        user_id: user.id,
      });
      mutate("ingredients");
    } catch (error) {
      throw error;
    }
  };

  return {
    ingredients,
    addIngredient,
    error,
    isLoading: ingredients.length === 0 && !error,
  };
};

export default useIngredients;
