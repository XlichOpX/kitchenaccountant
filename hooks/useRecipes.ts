import { getRecipes } from "services/recipes";
import useSWR from "swr";

const useRecipes = () => {
  const { data: recipes, error } = useSWR("recipes", () => getRecipes());

  return {
    recipes,
    error,
    isLoading: !recipes && !error,
  };
};

export default useRecipes;
