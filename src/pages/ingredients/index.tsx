import { type NextPage } from "next";
import Head from "next/head";
import { CreateIngredientModal } from "~/components/ingredients/create-ingredient-modal";
import { IngredientList } from "~/components/ingredients/ingredient-list";
import { MainLayout } from "~/components/main-layout";
import { SearchAndCreate } from "~/components/search-and-create";
import { CenteredSpinner } from "~/components/ui/centered-spinner";
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
        <h1 className="h1">Ingredientes</h1>
        <SearchAndCreate
          onSearchChange={setSearch}
          createButton={
            <CreateIngredientModal btnClassName="w-full sm:w-auto" />
          }
          placeholder="Buscar ingredientes"
        />

        <section aria-busy={isLoading} aria-live="polite">
          {ingredients && <IngredientList ingredients={ingredients} />}
          {isLoading && <CenteredSpinner />}
        </section>
      </MainLayout>
    </>
  );
};

export default Ingredients;
