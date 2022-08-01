import { CloseOutlined } from "@ant-design/icons";
import { withPageAuth } from "@supabase/auth-helpers-nextjs";
import {
  Button,
  Card,
  Col,
  message,
  Modal,
  PageHeader,
  Row,
  Space,
  Statistic,
} from "antd";
import { Header, PageContent } from "components";
import EditRecipeModal from "components/EditRecipeModal";
import useRecipe from "hooks/useRecipe";
import SidebarLayout from "layouts/SidebarLayout";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { NextPageWithLayout } from "pages/_app";
import { RecipeIngredient, Subrecipe } from "services/recipes";
import formatNumber from "utils/formatNumber";
import getTitle from "utils/getTitle";

const { confirm } = Modal;

const RecipeDetail: NextPageWithLayout<{ recipeId: number }> = ({
  recipeId,
}) => {
  const { recipe, deleteRecipe, updateRecipe } = useRecipe(recipeId);
  const router = useRouter();

  if (!recipe) return null;

  const recipeCost =
    getIngredientsCost(recipe.ingredients) +
    getSubrecipesCost(recipe.subrecipes);

  return (
    <>
      <Head>
        <title>{getTitle(recipe.name)}</title>
      </Head>

      <Header>
        <PageHeader
          title={recipe.name}
          extra={[
            <EditRecipeModal key={1} recipe={recipe} onUpdate={updateRecipe} />,
          ]}
        />
      </Header>

      <PageContent>
        <Space direction="vertical" size="large" className="flex">
          <Row gutter={[16, 16]}>
            {recipe.subrecipes.length > 0 && (
              <Col xs={24} md={12}>
                <Card title="Recetas base">
                  <ul>
                    {recipe.subrecipes.map(({ id, recipe, units }) => (
                      <li key={id}>
                        <Link href={`/recipes/${recipe.id}`}>
                          {recipe.name}
                        </Link>{" "}
                        - {units} u ={" "}
                        {formatNumber(
                          getIngredientsCost(recipe.ingredients) * units
                        )}
                      </li>
                    ))}
                  </ul>
                </Card>
              </Col>
            )}

            <Col xs={24} md={12}>
              <Card title="Ingredientes">
                <ul>
                  {recipe.ingredients.map(({ ingredient, units }) => (
                    <li key={ingredient.id}>
                      {ingredient.name} - {units}{" "}
                      {ingredient.measurement_unit.symbol} ={" "}
                      {formatNumber(units * ingredient.unit_price)}
                    </li>
                  ))}
                </ul>
              </Card>
            </Col>
          </Row>

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
                precision={2}
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

          <Card title="Eliminar receta">
            <p>Tenga en cuenta que esta acción no se puede deshacer.</p>

            <Button
              danger
              icon={<CloseOutlined />}
              onClick={() =>
                confirm({
                  title: `¿Está seguro de eliminar la receta "${recipe.name}"?`,
                  okText: "Sí, eliminar",
                  okButtonProps: { danger: true },
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
            </Button>
          </Card>
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

function getSubrecipesCost(subrecipes: Subrecipe[]) {
  return subrecipes.reduce(
    (acc, { units, recipe: { ingredients } }) =>
      acc + getIngredientsCost(ingredients) * units,
    0
  );
}

function getIngredientsCost(ingredients: RecipeIngredient[]) {
  return ingredients.reduce(
    (acc, { ingredient: { unit_price }, units }) => acc + unit_price * units,
    0
  );
}
