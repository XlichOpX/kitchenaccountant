import { Content } from "antd/lib/layout/layout";
import { ReactNode } from "react";

const PageContent = ({ children }: { children: ReactNode }) => (
  <Content className="p-3 overflow-auto">{children}</Content>
);

export default PageContent;
