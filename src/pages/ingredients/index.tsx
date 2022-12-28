import { type NextPage } from "next";
import Head from "next/head";
import { IngredientList } from "~/components/ingredients/ingredient-list";
import { MainLayout } from "~/components/main-layout";
import { Input } from "~/components/ui/input";
import { useDebouncedState } from "~/hooks/useDebouncedState";

import { getTitle } from "~/utils/get-title";
import { trpc } from "~/utils/trpc";

const Ingredients: NextPage = () => {
  const [search, setSearch] = useDebouncedState("");
  const { data: ingredients } = trpc.ingredient.getAll.useQuery({ search });

  return (
    <>
      <Head>
        <title>{getTitle("Ingredientes")}</title>
      </Head>

      <MainLayout>
        <h1 className="mb-3 text-center text-2xl font-bold md:text-left">
          Ingredientes
        </h1>
        <div className="flex items-center justify-between">
          <label className="sr-only" id="searchIngredients">
            Buscar ingredientes
          </label>
          <Input
            id="searchIngredients"
            placeholder="Buscar ingredientes"
            className="block w-full sm:w-1/3 lg:w-1/4"
            onChange={(e) => setSearch(e.target.value)}
            maxLength={32}
          />
        </div>
        <hr className="mt-2 mb-3" />
        {ingredients && <IngredientList ingredients={ingredients} />}
      </MainLayout>
    </>
  );
};

export default Ingredients;
