import { useUser } from "@supabase/auth-helpers-react";
import { getRecipes } from "services/recipes";
import useSWR from "swr";

const useRecipes = () => {
  const { user } = useUser();
  const { data: recipes, error } = useSWR(user && "recipes", () =>
    getRecipes()
  );

  return {
    recipes,
    error,
    isLoading: !recipes && !error,
  };
};

export default useRecipes;
