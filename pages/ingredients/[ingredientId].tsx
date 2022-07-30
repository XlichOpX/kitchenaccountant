import { EditFilled } from "@ant-design/icons";
import { withPageAuth } from "@supabase/auth-helpers-nextjs";
import { Button, Descriptions, Layout, PageHeader } from "antd";
import { PageContent } from "components";
import EditIngredientModal from "components/EditIngredientModal";
import useIngredient from "hooks/useIngredient";
import SidebarLayout from "layouts/SidebarLayout";
import Head from "next/head";
import { NextPageWithLayout } from "pages/_app";
import getTitle from "utils/getTitle";

const { Header } = Layout;

const IngredientDetail: NextPageWithLayout<{ ingredientId: number }> = ({
  ingredientId,
}) => {
  const { ingredient } = useIngredient(ingredientId);

  if (!ingredient) return null;

  return (
    <>
      <Head>
        <title>{getTitle(ingredient.name)}</title>
      </Head>

      <Header className="bg-white p-0">
        <PageHeader
          title={ingredient.name}
          onBack={() => window.history.back()}
          className="shadow-md"
          extra={[<EditIngredientModal key={1} ingredient={ingredient} />]}
        />
      </Header>

      <PageContent>
        <Descriptions title="Datos del ingrediente">
          <Descriptions.Item label="Nombre">
            {ingredient.name}
          </Descriptions.Item>
          <Descriptions.Item label="Precio">
            {ingredient.price}
          </Descriptions.Item>
          <Descriptions.Item label="Unidades del paquete">
            {ingredient.package_units}
          </Descriptions.Item>
          <Descriptions.Item label="Precio por unidad">
            {ingredient.unit_price}
          </Descriptions.Item>
          <Descriptions.Item label="Unidad de medida">
            {ingredient.measurement_unit.symbol}
          </Descriptions.Item>
        </Descriptions>
      </PageContent>
    </>
  );
};

IngredientDetail.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default IngredientDetail;

export const getServerSideProps = withPageAuth({
  getServerSideProps: async (ctx) => ({
    props: {
      ingredientId: Number(ctx.query.ingredientId),
    },
  }),
});
