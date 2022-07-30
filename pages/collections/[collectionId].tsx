import { withPageAuth } from "@supabase/auth-helpers-nextjs";
import { Card, List } from "antd";
import { CreateRecipeModal, PageContent, PageHeader } from "components";
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

      <PageHeader>
        <h1 className="m-0">{collection.name}</h1>
        <CreateRecipeModal collectionId={collectionId} />
      </PageHeader>

      <PageContent>
        <Typography>
          <Paragraph className="m-0">{collection.description}</Paragraph>

          <Title level={2}>Recetas</Title>
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
        </Typography>
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
