import { BookFilled } from "@ant-design/icons";
import { GiFlour } from "react-icons/gi";
import { Layout, Menu } from "antd";
import { useRouter } from "next/router";
import { ReactNode } from "react";

const { Sider } = Layout;

const SidebarLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const selectedKey = router.pathname.split("/")[1];

  return (
    <Layout className="h-screen">
      <Sider className="h-full fixed z-20" collapsedWidth={0} breakpoint="md">
        <Menu
          defaultSelectedKeys={[selectedKey]}
          theme="dark"
          onClick={(e) => router.push(`/${e.key}`)}
          items={[
            {
              label: "Tus colecciones",
              key: "collections",
              icon: <BookFilled />,
            },
            {
              label: "Tus ingredientes",
              key: "ingredients",
              icon: <GiFlour />,
            },
          ]}
        />
      </Sider>

      <Layout className="min-h-screen md:ml-[200px] block overflow-auto">
        {children}
      </Layout>
    </Layout>
  );
};

export default SidebarLayout;
