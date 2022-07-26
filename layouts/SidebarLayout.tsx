import { BookFilled, SettingFilled } from "@ant-design/icons";
import { GiFlour } from "react-icons/gi";
import { Button, Layout, Menu } from "antd";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import AppLogo from "components/AppLogo";

const { Sider } = Layout;
const appName = process.env.NEXT_PUBLIC_APP_NAME;

const SidebarLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const selectedKey = router.pathname.split("/")[1];

  return (
    <Layout className="h-screen">
      <Sider className="h-full fixed z-20" collapsedWidth={0} breakpoint="md">
        <div className="h-full flex flex-col">
          <div className="text-white flex gap-2 items-center p-3">
            <AppLogo className="w-7 h-7" />
            <div className="font-bold">{appName}</div>
          </div>
          <Menu
            className="grow"
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
              {
                label: "Ajustes",
                key: "settings",
                icon: <SettingFilled />,
              },
            ]}
          />

          <Button
            type="primary"
            danger
            className="rounded-none"
            onClick={() => router.push("/api/auth/logout")}
          >
            Cerrar sesión
          </Button>
        </div>
      </Sider>

      <Layout className="min-h-screen md:ml-[200px] block overflow-auto">
        {children}
      </Layout>
    </Layout>
  );
};

export default SidebarLayout;
