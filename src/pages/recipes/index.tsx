import { type NextPage } from "next";
import Head from "next/head";
import { MainLayout } from "~/components/main-layout";

import { getTitle } from "~/utils/get-title";

const Ingredients: NextPage = () => {
  return (
    <>
      <Head>
        <title>{getTitle("Recetas")}</title>
      </Head>

      <MainLayout>Recetas</MainLayout>
    </>
  );
};

export default Ingredients;
