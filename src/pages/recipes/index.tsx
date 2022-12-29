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

      <MainLayout>
        <h1 className="h1">Recetas</h1>
      </MainLayout>
    </>
  );
};

export default Ingredients;
