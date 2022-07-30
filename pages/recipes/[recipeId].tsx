import { withPageAuth } from "@supabase/auth-helpers-nextjs";
import { Col, Row, Statistic, Typography } from "antd";
import { PageContent, PageHeader } from "components";
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

      <PageHeader>
        <h1 className="m-0">{recipe.name}</h1>
      </PageHeader>

      <PageContent>
        <Typography>
          <Title>{recipe.name}</Title>
          <Paragraph>{recipe.description}</Paragraph>

          <Title level={2}>Ingredientes</Title>

          <ul>
            {recipe.ingredients.map(({ ingredient, units }) => (
              <li key={ingredient.id}>
                {ingredient.name} - {units} {ingredient.measurement_unit.symbol}
              </li>
            ))}
          </ul>

          <Title level={2}>Cálculos</Title>
          <Row gutter={16} className="-mx-4">
            <Col>
              <Statistic
                title="Costo de la receta"
                value={recipeCost}
                precision={2}
              />
            </Col>

            <Col>
              <Statistic
                title="Ganancia deseada"
                value={`${recipe.profit_percentage * 100} %`}
              />
            </Col>

            <Col>
              <Statistic
                title="Precio de venta sugerido"
                value={recipeCost + recipeCost * recipe.profit_percentage}
                precision={2}
              />
            </Col>
          </Row>
        </Typography>
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
