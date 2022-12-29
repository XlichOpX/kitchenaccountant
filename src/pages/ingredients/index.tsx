import { type NextPage } from "next";
import Head from "next/head";
import { CreateIngredientModal } from "~/components/ingredients/create-ingredient-modal";
import { IngredientList } from "~/components/ingredients/ingredient-list";
import { MainLayout } from "~/components/main-layout";
import { CenteredSpinner } from "~/components/ui/centered-spinner";
import { Input } from "~/components/ui/input";
import { useDebouncedState } from "~/hooks/useDebouncedState";

import { getTitle } from "~/utils/get-title";
import { trpc } from "~/utils/trpc";

const Ingredients: NextPage = () => {
  const [search, setSearch] = useDebouncedState("");
  const { data: ingredients, isLoading } = trpc.ingredient.getAll.useQuery({
    search,
  });

  return (
    <>
      <Head>
        <title>{getTitle("Ingredientes")}</title>
      </Head>

      <MainLayout>
        <h1 className="mb-3 text-center text-2xl font-bold sm:text-left">
          Ingredientes
        </h1>
        <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
          <div className="w-full sm:w-1/3 lg:w-1/4">
            <label className="sr-only" id="searchIngredients">
              Buscar ingredientes
            </label>
            <Input
              id="searchIngredients"
              placeholder="Buscar ingredientes"
              className="block w-full"
              onChange={(e) => setSearch(e.target.value)}
              maxLength={32}
            />
          </div>

          <CreateIngredientModal />
        </div>
        <hr className="mt-2 mb-3" />
        <section aria-busy={isLoading} aria-live="polite">
          {ingredients && <IngredientList ingredients={ingredients} />}
          {isLoading && <CenteredSpinner />}
        </section>
      </MainLayout>
    </>
  );
};

export default Ingredients;
