import { withPageAuth } from "@supabase/auth-helpers-nextjs";
import { Card, Col, PageHeader, Row, Space, Statistic, Typography } from "antd";
import { Header, PageContent } from "components";
import useRecipe from "hooks/useRecipe";
import SidebarLayout from "layouts/SidebarLayout";
import Head from "next/head";
import { NextPageWithLayout } from "pages/_app";
import getTitle from "utils/getTitle";

const { Title, Paragraph } = Typography;

const RecipeDetail: NextPageWithLayout<{ recipeId: number }> = ({
  recipeId,
}) => {
  const { recipe, error } = useRecipe(Number(recipeId));

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
        <PageHeader title={recipe.name} />
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
