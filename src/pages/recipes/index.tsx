import { type NextPage } from "next";
import Head from "next/head";
import { MainLayout } from "~/components/main-layout";
import { Button } from "~/components/ui/button";

import { getTitle } from "~/utils/get-title";

const Ingredients: NextPage = () => {
  return (
    <>
      <Head>
        <title>{getTitle("Recetas")}</title>
      </Head>

      <MainLayout>
        <Button isLoading>Prueba</Button>
      </MainLayout>
    </>
  );
};

export default Ingredients;
