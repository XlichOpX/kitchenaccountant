import { BookFilled } from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { useRouter } from "next/router";
import { ReactNode } from "react";

const { Sider } = Layout;

const SidebarLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const selectedKey = router.pathname.split("/")[1];

  return (
    <Layout>
      <Sider
        className="h-screen fixed z-10 md:static"
        collapsedWidth={0}
        breakpoint="md"
      >
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
          ]}
        />
      </Sider>

      <Layout className="h-screen">{children}</Layout>
    </Layout>
  );
};

export default SidebarLayout;
