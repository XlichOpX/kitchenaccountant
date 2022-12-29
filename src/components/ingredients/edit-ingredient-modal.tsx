import { useState } from "react";
import { MdEdit } from "react-icons/md";
import type { RouterOutputs } from "~/utils/trpc";
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

export const EditIngredientModal = ({
  ingredient,
}: {
  ingredient: RouterOutputs["ingredient"]["getAll"][number];
}) => {
  const [open, setOpen] = useState(false);
  const { data: measurementUnits, isLoading } =
    trpc.measurementUnit.getAll.useQuery();

  const mutation = trpc.ingredient.update.useMutation();
  const utils = trpc.useContext();

  return (
    <>
      <Modal open={open} onOpenChange={setOpen}>
        <ModalTrigger asChild>
          <Button
            intent="ghost"
            title={`Editar ingrediente: ${ingredient.name}`}
          >
            <MdEdit />
          </Button>
        </ModalTrigger>

        <ModalContent>
          <ModalTitle>Editar ingrediente: {ingredient.name}</ModalTitle>
          <ModalBody aria-live="polite" aria-busy={isLoading}>
            {measurementUnits && (
              <IngredientForm
                id="EditIngredientForm"
                measurementUnits={measurementUnits}
                defaultValues={{
                  name: ingredient.name,
                  measurementUnitId: ingredient.measurementUnitId,
                  packageUnits: ingredient.packageUnits,
                  price: ingredient.price,
                }}
                onSubmit={(data) => {
                  mutation.mutate(
                    { id: ingredient.id, ...data },
                    {
                      onSuccess: async () => {
                        utils.ingredient.getAll.invalidate();
                        setOpen(false);
                      },
                    }
                  );
                }}
              />
            )}
            {isLoading && <CenteredSpinner />}
          </ModalBody>

          <ModalActions>
            <SaveButton
              type="submit"
              form="EditIngredientForm"
              isLoading={mutation.isLoading}
            />
          </ModalActions>
        </ModalContent>
      </Modal>
    </>
  );
};
