import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import type { RouterOutputs } from "~/utils/trpc";
import { trpc } from "~/utils/trpc";
import { Alert } from "../ui/alert";
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

  const updateMutation = trpc.ingredient.update.useMutation();
  const deleteMutation = trpc.ingredient.delete.useMutation();
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
            {deleteMutation.error && (
              <Alert className="mb-3">
                {deleteMutation.error.data?.code === "CONFLICT"
                  ? "El ingrediente se encuentra en uso en una o más recetas"
                  : "Ocurrió un error al eliminar el ingrediente"}
              </Alert>
            )}
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
                  updateMutation.mutate(
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
            <Button
              onClick={() =>
                deleteMutation.mutate(
                  { id: ingredient.id },
                  {
                    onSuccess: () => utils.ingredient.getAll.invalidate(),
                  }
                )
              }
              intent="danger"
              className="mr-auto"
              isLoading={deleteMutation.isLoading}
            >
              <FaTrash />
              Eliminar
            </Button>

            <SaveButton
              type="submit"
              form="EditIngredientForm"
              isLoading={updateMutation.isLoading}
            />
          </ModalActions>
        </ModalContent>
      </Modal>
    </>
  );
};
