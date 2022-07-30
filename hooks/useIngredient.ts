import { useUser } from "@supabase/auth-helpers-react";
import { getIngredient } from "services/ingredients";
import useSWR, { useSWRConfig } from "swr";

const useIngredient = (id: number) => {
  const { user } = useUser();
  const { mutate } = useSWRConfig();
  const { data: ingredient, error } = useSWR(user && `ingredients/${id}`, () =>
    getIngredient(id)
  );

  return {
    ingredient,
    error,
    isLoading: !ingredient && !error,
  };
};

export default useIngredient;
