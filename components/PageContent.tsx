import { Content } from "antd/lib/layout/layout";
import { ReactNode } from "react";

const PageContent = ({ children }: { children: ReactNode }) => (
  <Content className="p-6">{children}</Content>
);

export default PageContent;
