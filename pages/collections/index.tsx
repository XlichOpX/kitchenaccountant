import { withPageAuth } from "@supabase/auth-helpers-nextjs";
import { useUser } from "@supabase/auth-helpers-react";
import { Card, Layout, List } from "antd";
import CreateCollectionModal from "components/CreateCollectionModal";
import SidebarLayout from "layouts/SidebarLayout";
import Head from "next/head";
import Link from "next/link";
import { NextPageWithLayout } from "pages/_app";
import { getCollections } from "services/collections";
import useSWR from "swr";

const { Content, Header } = Layout;

const Collections: NextPageWithLayout = () => {
  const { user } = useUser();

  const { data: collections, error } = useSWR(
    user && "collections",
    getCollections()
  );

  return (
    <>
      <Head>
        <title>Tus colecciones | Recipe Cost Calculator</title>
      </Head>

      <Header className="px-3 bg-white shadow-sm z-10 flex justify-between items-center">
        <h1 className="m-0">Tus colecciones</h1>
        <CreateCollectionModal />
      </Header>

      <Content className="p-3 overflow-auto">
        <List
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 2,
            lg: 3,
            column: 4,
          }}
          dataSource={collections}
          renderItem={(collection) => (
            <List.Item>
              <Link href={`/collections/${collection.id}`}>
                <a>
                  <Card title={collection.name} hoverable>
                    {collection.description}
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

Collections.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default Collections;

export const getServerSideProps = withPageAuth();
