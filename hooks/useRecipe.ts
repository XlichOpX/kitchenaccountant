import { useUser } from "@supabase/auth-helpers-react";
import { getRecipe } from "services/recipes";
import useSWR from "swr";

const useRecipe = (id: number) => {
  const { user } = useUser();
  const { data: recipe, error } = useSWR(user && `recipes/${id}`, () =>
    getRecipe(id)
  );

  return {
    recipe,
    error,
    isLoading: !recipe && !error,
  };
};

export default useRecipe;
