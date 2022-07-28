import { Header } from "antd/lib/layout/layout";
import { ReactNode } from "react";

const PageHeader = ({ children }: { children: ReactNode }) => (
  <Header className="px-3 bg-white shadow-sm z-10 flex justify-between items-center">
    {children}
  </Header>
);

export default PageHeader;
