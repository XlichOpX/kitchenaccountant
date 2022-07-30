import { withPageAuth } from "@supabase/auth-helpers-nextjs";
import { Card, List, PageHeader, Space } from "antd";
import { CreateRecipeModal, PageContent, Header } from "components";
import useCollection from "hooks/useCollection";
import SidebarLayout from "layouts/SidebarLayout";
import Head from "next/head";
import Link from "next/link";
import { NextPageWithLayout } from "pages/_app";
import getTitle from "utils/getTitle";
import { Typography } from "antd";

const { Paragraph, Title } = Typography;

const CollectionDetail: NextPageWithLayout<{ collectionId: number }> = ({
  collectionId,
}) => {
  const { collection } = useCollection(collectionId);

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
                    <Card title={recipe.name} hoverable>
                      {recipe.description}
                    </Card>
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
});
