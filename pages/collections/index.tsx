import { withPageAuth } from "@supabase/auth-helpers-nextjs";
import { Layout } from "antd";
import SidebarLayout from "layouts/SidebarLayout";
import { NextPageWithLayout } from "pages/_app";

const { Content, Header } = Layout;

const Collections: NextPageWithLayout = () => {
  return (
    <>
      <Header className="px-3">
        <h1 className="text-white">Tus colecciones</h1>
      </Header>
      <Content className="p-3 overflow-auto">Tus colecciones</Content>
    </>
  );
};

Collections.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default Collections;

export const getServerSideProps = withPageAuth();
