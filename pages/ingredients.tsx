import { withPageAuth } from "@supabase/auth-helpers-nextjs";
import { Card, Layout, List } from "antd";
import CreateIngredientModal from "components/CreateIngredientModal";
import useIngredients from "hooks/useIngredients";
import SidebarLayout from "layouts/SidebarLayout";
import Head from "next/head";
import Link from "next/link";
import { NextPageWithLayout } from "pages/_app";

const { Content, Header } = Layout;

const Ingredients: NextPageWithLayout = () => {
  const { ingredients, error } = useIngredients();

  return (
    <>
      <Head>
        <title>Tus ingredientes | Recipe Cost Calculator</title>
      </Head>

      <Header className="px-3 bg-white shadow-sm z-10 flex justify-between items-center">
        <h1 className="m-0">Tus ingredientes</h1>
        <CreateIngredientModal />
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
          dataSource={ingredients}
          renderItem={(ingredient) => (
            <List.Item>
              <Link href={`/ingredients/${ingredient.id}`}>
                <a>
                  <Card title={ingredient.name} hoverable>
                    <p>Precio: {ingredient.price}</p>
                    <p>
                      Unidades: {ingredient.package_units}{" "}
                      {ingredient.measurement_unit.symbol}
                    </p>
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

Ingredients.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default Ingredients;

export const getServerSideProps = withPageAuth();
