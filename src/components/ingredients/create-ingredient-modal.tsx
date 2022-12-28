import { useState } from "react";
import { BsPlusLg } from "react-icons/bs";
import { FaSave } from "react-icons/fa";
import { trpc } from "~/utils/trpc";
import { Button } from "../ui/button";
import { CenteredSpinner } from "../ui/centered-spinner";
import {
  Modal,
  ModalActions,
  ModalBody,
  ModalContent,
  ModalTitle,
  ModalTrigger,
} from "../ui/modal";
import { IngredientForm } from "./ingredient-form";

export function CreateIngredientModal() {
  const [open, setOpen] = useState(false);
  const { data: measurementUnits, isLoading } =
    trpc.measurementUnit.getAll.useQuery();

  const mutation = trpc.ingredient.create.useMutation();
  const utils = trpc.useContext();

  return (
    <>
      <Modal open={open} onOpenChange={setOpen}>
        <ModalTrigger asChild>
          <Button className="w-full sm:w-auto">
            <BsPlusLg />
            Nuevo ingrediente
          </Button>
        </ModalTrigger>

        <ModalContent>
          <ModalTitle>Agregar nuevo ingrediente</ModalTitle>
          <ModalBody>
            {measurementUnits && (
              <IngredientForm
                id="CreateIngredientForm"
                measurementUnits={measurementUnits}
                defaultValues={{
                  name: "",
                  measurementUnitId: measurementUnits[0]?.id,
                  packageUnits: 1000,
                  price: 5,
                }}
                onSubmit={async (data) => {
                  try {
                    await mutation.mutateAsync(data);
                    utils.ingredient.getAll.invalidate();
                    setOpen(false);
                  } catch (error) {
                    console.error(error);
                  }
                }}
              />
            )}
            {isLoading && <CenteredSpinner />}
          </ModalBody>

          <ModalActions>
            <Button type="submit" form="CreateIngredientForm">
              <FaSave />
              Guardar
            </Button>
          </ModalActions>
        </ModalContent>
      </Modal>
    </>
  );
}
