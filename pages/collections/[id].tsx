import { Card, Layout, List } from "antd";
import CreateRecipeModal from "components/CreateRecipeModal";
import useCollection from "hooks/useCollection";
import SidebarLayout from "layouts/SidebarLayout";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { NextPageWithLayout } from "pages/_app";

const { Header, Content } = Layout;

const CollectionDetail: NextPageWithLayout = () => {
  const router = useRouter();
  let { id } = router.query;
  const { collection } = useCollection(Number(id));

  return (
    <>
      <Head>
        <title>{collection?.name} | Recipe Cost Calculator</title>
      </Head>

      <Header className="px-3 bg-white shadow-sm z-10 flex justify-between items-center">
        <h1 className="m-0">{collection?.name}</h1>
        <CreateRecipeModal collectionId={Number(id)} />
      </Header>

      <Content className="p-3 overflow-auto">
        <p className="m-0">{collection?.description}</p>

        <List
          header={<h2 className="m-0">Recetas</h2>}
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 2,
            lg: 3,
            column: 4,
          }}
          dataSource={collection?.recipes}
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
      </Content>
    </>
  );
};

CollectionDetail.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default CollectionDetail;
