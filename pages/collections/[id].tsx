import SidebarLayout from "layouts/SidebarLayout";
import { NextPageWithLayout } from "pages/_app";

const CollectionDetail: NextPageWithLayout = () => {
  return <div>Detalle</div>;
};

CollectionDetail.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default CollectionDetail;
