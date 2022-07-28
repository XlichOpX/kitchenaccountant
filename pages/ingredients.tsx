import { withPageAuth } from "@supabase/auth-helpers-nextjs";
import { Card, List } from "antd";
import { CreateIngredientModal, PageContent, PageHeader } from "components";
import useIngredients from "hooks/useIngredients";
import SidebarLayout from "layouts/SidebarLayout";
import Head from "next/head";
import Link from "next/link";
import { NextPageWithLayout } from "pages/_app";
import getTitle from "utils/getTitle";

const Ingredients: NextPageWithLayout = () => {
  const { ingredients, error } = useIngredients();

  return (
    <>
      <Head>
        <title>{getTitle("Tus ingredientes")}</title>
      </Head>

      <PageHeader>
        <h1 className="m-0">Tus ingredientes</h1>
        <CreateIngredientModal />
      </PageHeader>

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
      </PageContent>
    </>
  );
};

Ingredients.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default Ingredients;

export const getServerSideProps = withPageAuth();
