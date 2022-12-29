import { useState } from "react";
import { BsPlusLg } from "react-icons/bs";
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
import { SaveButton } from "../ui/save-button";
import { IngredientForm } from "./ingredient-form";

export function CreateIngredientModal({
  btnClassName,
}: {
  btnClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const { data: measurementUnits, isLoading } =
    trpc.measurementUnit.getAll.useQuery();

  const mutation = trpc.ingredient.create.useMutation();
  const utils = trpc.useContext();

  return (
    <>
      <Modal open={open} onOpenChange={setOpen}>
        <ModalTrigger asChild>
          <Button className={btnClassName}>
            <BsPlusLg />
            Nuevo ingrediente
          </Button>
        </ModalTrigger>

        <ModalContent>
          <ModalTitle>Agregar nuevo ingrediente</ModalTitle>
          <ModalBody aria-live="polite" aria-busy={isLoading}>
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
                onSubmit={(data) => {
                  mutation.mutate(data, {
                    onSuccess: async () => {
                      utils.ingredient.getAll.invalidate();
                      setOpen(false);
                    },
                  });
                }}
              />
            )}
            {isLoading && <CenteredSpinner />}
          </ModalBody>

          <ModalActions>
            <SaveButton
              type="submit"
              form="CreateIngredientForm"
              isLoading={mutation.isLoading}
            />
          </ModalActions>
        </ModalContent>
      </Modal>
    </>
  );
}
