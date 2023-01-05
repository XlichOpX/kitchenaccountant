import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { type NextPage } from "next";
import Head from "next/head";
import { MainLayout } from "~/components/main-layout";
import { Alert } from "~/components/ui/alert";
import { CenteredSpinner } from "~/components/ui/centered-spinner";
import { Link } from "~/components/ui/link";
import { cuidSchema } from "~/schema/common";
import { getTitle } from "~/utils/get-title";
import { trpc } from "~/utils/trpc";

const RecipeDetail: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ recipeId }) => {
  const {
    data: recipe,
    isLoading,
    error,
  } = trpc.recipe.getById.useQuery({ recipeId }, { retry: false });

  return (
    <>
      <Head>
        <title>{getTitle(recipe?.name ?? "Cargando...")}</title>
      </Head>

      <MainLayout aria-busy={isLoading} aria-live="polite">
        <Link href="/recipes" className="mb-2 block">
          ← Volver a todas las recetas
        </Link>

        <h1 className="h1">{recipe?.name ?? "Cargando..."}</h1>

        {error && <Alert>{error.data?.code}</Alert>}
        {recipe && (
          <>
            <h2 className="h2">Recetas base</h2>
            <ul className="mb-3 list-inside list-disc">
              {recipe.subRecipes.map((subrecipe) => (
                <li key={subrecipe.id}>
                  {subrecipe.recipe.name} - {subrecipe.units} u ={" "}
                  {subrecipe.cost}
                </li>
              ))}
            </ul>

            <h2 className="h2">Ingredientes</h2>
            <ul className="mb-3 list-inside list-disc">
              {recipe.ingredients.map((ingredient) => (
                <li key={ingredient.id}>
                  {ingredient.ingredient.name} - {ingredient.units}{" "}
                  {ingredient.ingredient.measurementUnit.symbol} ={" "}
                  {ingredient.cost.toLocaleString()}
                </li>
              ))}
            </ul>

            <h2 className="h2">Cálculos</h2>
            <ul className="mb-3 list-inside list-disc">
              <li>Costo total: {recipe.totalCost.toLocaleString()}</li>
              <li>Precio de venta: {recipe.price.toLocaleString()}</li>
              <li>
                Ganancia: {recipe.profitPercentage.toLocaleString()} % ={" "}
                {recipe.netIncome.toLocaleString()}
              </li>
            </ul>
          </>
        )}
        {isLoading && <CenteredSpinner />}
      </MainLayout>
    </>
  );
};

export default RecipeDetail;

export const getServerSideProps: GetServerSideProps<{
  recipeId: string;
}> = async ({ params }) => {
  const url = cuidSchema.safeParse(params?.id);

  if (!url.success) {
    return {
      redirect: {
        destination: "/recipes",
        permanent: false,
      },
    };
  }

  return {
    props: {
      recipeId: url.data,
    },
  };
};
