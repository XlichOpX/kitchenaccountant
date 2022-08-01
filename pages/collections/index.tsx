import { withPageAuth } from "@supabase/auth-helpers-nextjs";
import { Card, List, Modal, PageHeader } from "antd";
import { CreateCollectionModal, Header, PageContent } from "components";
import useCollections from "hooks/useCollections";
import SidebarLayout from "layouts/SidebarLayout";
import Head from "next/head";
import Link from "next/link";
import { NextPageWithLayout } from "pages/_app";
import getTitle from "utils/getTitle";

const Collections: NextPageWithLayout = () => {
  const { collections } = useCollections();

  return (
    <>
      <Head>
        <title>{getTitle("Tus colecciones")}</title>
      </Head>

      <Header>
        <PageHeader
          title="Tus colecciones"
          extra={[<CreateCollectionModal key={1} />]}
        />
      </Header>

      <PageContent>
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
      </PageContent>
    </>
  );
};

Collections.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default Collections;

export const getServerSideProps = withPageAuth();
