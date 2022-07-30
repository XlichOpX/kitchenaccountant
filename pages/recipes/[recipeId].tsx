import { withPageAuth } from "@supabase/auth-helpers-nextjs";
import {
  Button,
  Card,
  message,
  Modal,
  PageHeader,
  Space,
  Statistic,
} from "antd";
import { Header, PageContent } from "components";
import useRecipe from "hooks/useRecipe";
import SidebarLayout from "layouts/SidebarLayout";
import Head from "next/head";
import { useRouter } from "next/router";
import { NextPageWithLayout } from "pages/_app";
import getTitle from "utils/getTitle";

const { confirm } = Modal;

const RecipeDetail: NextPageWithLayout<{ recipeId: number }> = ({
  recipeId,
}) => {
  const { recipe, deleteRecipe } = useRecipe(Number(recipeId));
  const router = useRouter();

  if (!recipe) return null;

  const recipeCost = recipe.ingredients.reduce(
    (acc, { ingredient: { unit_price }, units }) => acc + unit_price * units,
    0
  );

  return (
    <>
      <Head>
        <title>{getTitle(recipe.name)}</title>
      </Head>

      <Header>
        <PageHeader
          title={recipe.name}
          extra={[
            <Button
              key={1}
              danger
              onClick={() =>
                confirm({
                  title: `¿Está seguro de eliminar la receta "${recipe.name}"?`,
                  okText: "Sí, eliminar",
                  cancelText: "Cancelar",
                  onOk: async () => {
                    try {
                      await deleteRecipe();
                      router.replace(`/collections/${recipe.collection_id}`);
                    } catch (error) {
                      if (error instanceof Error)
                        message.error({ content: error.message });
                    }
                  },
                })
              }
            >
              Eliminar
            </Button>,
          ]}
        />
      </Header>

      <PageContent>
        <Space direction="vertical" size="large" className="flex">
          <Card title="Ingredientes">
            <ul>
              {recipe.ingredients.map(({ ingredient, units }) => (
                <li key={ingredient.id}>
                  {ingredient.name} - {units}{" "}
                  {ingredient.measurement_unit.symbol}
                </li>
              ))}
            </ul>
          </Card>

          <Card title="Cálculos">
            <Space size="large">
              <Statistic
                title="Costo de la receta"
                value={recipeCost}
                precision={2}
              />

              <Statistic
                title="Ganancia deseada"
                value={`${recipe.profit_percentage * 100} %`}
              />

              <Statistic
                title="Precio de venta sugerido"
                value={recipeCost + recipeCost * recipe.profit_percentage}
                precision={2}
              />
            </Space>
          </Card>

          {recipe.description && (
            <Card title="Descripción">
              <p>{recipe.description}</p>
            </Card>
          )}
        </Space>
      </PageContent>
    </>
  );
};

RecipeDetail.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default RecipeDetail;

export const getServerSideProps = withPageAuth({
  getServerSideProps: async (ctx) => ({
    props: {
      recipeId: Number(ctx.query.recipeId),
    },
  }),
});
