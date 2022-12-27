import { type NextPage } from "next";
import Head from "next/head";
import { IngredientList } from "~/components/ingredients/ingredient-list";
import { MainLayout } from "~/components/main-layout";

import { getTitle } from "~/utils/get-title";
import { trpc } from "~/utils/trpc";

const Ingredients: NextPage = () => {
  const { data: ingredients } = trpc.ingredient.getAll.useQuery();

  return (
    <>
      <Head>
        <title>{getTitle("Ingredientes")}</title>
      </Head>

      <MainLayout>
        <h1 className="text-center text-2xl font-bold md:text-left">
          Ingredientes
        </h1>
        <hr className="mt-2 mb-3" />
        {ingredients && <IngredientList ingredients={ingredients} />}
      </MainLayout>
    </>
  );
};

export default Ingredients;
