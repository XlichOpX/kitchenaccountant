import { useUser } from "@supabase/auth-helpers-react";
import { getIngredient, Ingredient } from "services/ingredients";
import useSWR, { useSWRConfig } from "swr";
import {
  updateIngredient as svUpdateIngredient,
  deleteIngredient as svDeleteIngredient,
} from "services/ingredients";

const useIngredient = (id: number) => {
  const { user } = useUser();
  const { mutate } = useSWRConfig();
  const { data: ingredient, error } = useSWR(user && `ingredients/${id}`, () =>
    getIngredient(id)
  );

  const updateIngredient = async (ingredient: Partial<Ingredient>) => {
    try {
      await svUpdateIngredient(ingredient);
      mutate(`ingredients/${id}`);
    } catch (error) {
      throw error;
    }
  };

  const deleteIngredient = async (ingredientId: number) => {
    try {
      await svDeleteIngredient(ingredientId);
    } catch (error) {
      throw error;
    }
  };

  return {
    ingredient,
    error,
    isLoading: !ingredient && !error,
    updateIngredient,
    deleteIngredient,
  };
};

export default useIngredient;
