import { type NextPage } from "next";
import Head from "next/head";
import { MainLayout } from "~/components/main-layout";
import { CreateRecipeModal } from "~/components/recipes/create-recipe-modal";
import { RecipeList } from "~/components/recipes/recipe-list";
import { SearchAndCreate } from "~/components/search-and-create";
import { CenteredSpinner } from "~/components/ui/centered-spinner";
import { useDebouncedState } from "~/hooks/useDebouncedState";

import { getTitle } from "~/utils/get-title";
import { trpc } from "~/utils/trpc";

const Ingredients: NextPage = () => {
  const [search, setSearch] = useDebouncedState("");
  const { data: recipes, isLoading } = trpc.recipe.getAll.useQuery({ search });

  return (
    <>
      <Head>
        <title>{getTitle("Recetas")}</title>
      </Head>

      <MainLayout>
        <h1 className="h1 mb-3">Recetas</h1>
        <SearchAndCreate
          onSearchChange={setSearch}
          createButton={<CreateRecipeModal btnClassName="w-full sm:w-auto" />}
          placeholder="Buscar recetas"
        />

        <section aria-busy={isLoading} aria-live="polite">
          {recipes && <RecipeList recipes={recipes} />}
          {isLoading && <CenteredSpinner />}
        </section>
      </MainLayout>
    </>
  );
};

export default Ingredients;
