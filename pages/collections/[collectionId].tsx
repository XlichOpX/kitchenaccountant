import { CloseOutlined } from "@ant-design/icons";
import { withPageAuth } from "@supabase/auth-helpers-nextjs";
import {
  Button,
  Card,
  List,
  message,
  Modal,
  PageHeader,
  Row,
  Space,
} from "antd";
import { CreateRecipeModal, Header, PageContent } from "components";
import { useCollection } from "hooks";
import SidebarLayout from "layouts/SidebarLayout";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { NextPageWithLayout } from "pages/_app";
import getTitle from "utils/getTitle";

const { confirm } = Modal;

const CollectionDetail: NextPageWithLayout<{ collectionId: number }> = ({
  collectionId,
}) => {
  const { collection, deleteCollection } = useCollection(collectionId);
  const router = useRouter();

  if (!collection) return null;

  return (
    <>
      <Head>
        <title>{getTitle(collection.name)}</title>
      </Head>

      <Header>
        <PageHeader
          title={collection.name}
          extra={[<CreateRecipeModal key={1} collectionId={collectionId} />]}
        />
      </Header>

      <PageContent>
        <Space direction="vertical" size="large" className="flex">
          <List
            grid={{
              gutter: 16,
              xs: 1,
              sm: 2,
              md: 2,
              lg: 3,
              column: 4,
            }}
            dataSource={collection.recipes}
            renderItem={(recipe) => (
              <List.Item>
                <Link href={`/recipes/${recipe.id}`}>
                  <a>
                    <Card hoverable>{recipe.name}</Card>
                  </a>
                </Link>
              </List.Item>
            )}
          />

          {collection.description && (
            <Card title="Descripción">
              <p>{collection.description}</p>
            </Card>
          )}

          <Card title="Eliminar colección">
            <p>
              Elimina a su vez todas las recetas asociadas. Tenga en cuenta que
              esta acción no se puede deshacer.
            </p>
            <Button
              danger
              icon={<CloseOutlined />}
              onClick={() =>
                confirm({
                  title: `¿Está seguro de eliminar la colleción "${collection.name}"?`,
                  okText: "Sí, eliminar",
                  okButtonProps: { danger: true },
                  cancelText: "Cancelar",
                  onOk: async () => {
                    try {
                      await deleteCollection();
                      router.replace("/collections");
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
        </Space>
      </PageContent>
    </>
  );
};

CollectionDetail.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default CollectionDetail;

export const getServerSideProps = withPageAuth({
  getServerSideProps: async (ctx) => ({
    props: {
      collectionId: Number(ctx.query.collectionId),
    },
  }),
  redirectTo: "/login",
});
