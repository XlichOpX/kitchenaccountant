import { CloseOutlined } from "@ant-design/icons";
import { withPageAuth } from "@supabase/auth-helpers-nextjs";
import { Button, Card, Descriptions, message, Modal, PageHeader } from "antd";
import { EditIngredientModal, Header, PageContent } from "components";
import { useIngredient, useSettings } from "hooks";
import SidebarLayout from "layouts/SidebarLayout";
import Head from "next/head";
import { useRouter } from "next/router";
import { NextPageWithLayout } from "pages/_app";
import formatNumber from "utils/formatNumber";
import getTitle from "utils/getTitle";

const { confirm } = Modal;

const IngredientDetail: NextPageWithLayout<{ ingredientId: number }> = ({
  ingredientId,
}) => {
  const { ingredient, deleteIngredient } = useIngredient(ingredientId);
  const { settings } = useSettings();
  const router = useRouter();

  if (!ingredient) return null;

  return (
    <>
      <Head>
        <title>{getTitle(ingredient.name)}</title>
      </Head>

      <Header>
        <PageHeader
          title={ingredient.name}
          extra={[<EditIngredientModal key={1} ingredient={ingredient} />, ,]}
        />
      </Header>

      <PageContent>
        <Card title="Datos del ingrediente" className="mb-5">
          <Descriptions>
            <Descriptions.Item label="Nombre">
              {ingredient.name}
            </Descriptions.Item>
            <Descriptions.Item label="Precio">
              {settings?.currency_symbol} {ingredient.price}
            </Descriptions.Item>
            <Descriptions.Item label="Unidades del paquete">
              {ingredient.package_units}
            </Descriptions.Item>
            <Descriptions.Item label="Precio por unidad">
              {settings?.currency_symbol} {formatNumber(ingredient.unit_price)}
            </Descriptions.Item>
            <Descriptions.Item label="Unidad de medida">
              {ingredient.measurement_unit.symbol}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <Card title="Eliminar ingrediente">
          <p>Tenga en cuenta que esta acción no se puede deshacer.</p>

          <Button
            icon={<CloseOutlined />}
            danger
            onClick={() =>
              confirm({
                title: "¿Está seguro de eliminar este ingrediente?",
                okButtonProps: { danger: true },
                onOk: async () => {
                  try {
                    await deleteIngredient(ingredient.id);
                    router.replace("/ingredients");
                  } catch (error) {
                    if (error instanceof Error) {
                      message.error(error.message);
                    }
                  }
                },
              })
            }
          >
            Eliminar
          </Button>
        </Card>
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
  redirectTo: "/login",
});
