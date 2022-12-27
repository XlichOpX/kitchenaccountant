import { type NextPage } from "next";
import Head from "next/head";
import { MainLayout } from "~/components/main-layout";

import { getTitle } from "~/utils/get-title";

const Ingredients: NextPage = () => {
  return (
    <>
      <Head>
        <title>{getTitle("Ingredientes")}</title>
      </Head>

      <MainLayout>Ingredientes</MainLayout>
    </>
  );
};

export default Ingredients;
