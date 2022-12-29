import { type NextPage } from "next";
import Head from "next/head";
import { FaTrash } from "react-icons/fa";
import { MainLayout } from "~/components/main-layout";
import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

import { getTitle } from "~/utils/get-title";

const Ingredients: NextPage = () => {
  return (
    <>
      <Head>
        <title>{getTitle("Recetas")}</title>
      </Head>

      <MainLayout>
        <Popover>
          <PopoverTrigger asChild>
            <Button intent="danger">
              <FaTrash />
              Eliminar
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-40">
            <p className="mb-2 text-center">
              ¿Realmente desea eliminar este ingrediente?
            </p>
            <div className="flex flex-col gap-2">
              <PopoverClose asChild>
                <Button className="w-full" intent="outlinePrimary">
                  Cancelar
                </Button>
              </PopoverClose>

              <Button intent="danger" className="w-full">
                <FaTrash />
                Sí, eliminar
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </MainLayout>
    </>
  );
};

export default Ingredients;
