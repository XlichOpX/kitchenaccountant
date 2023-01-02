import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import type { RouterOutputs } from "~/utils/trpc";
import { trpc } from "~/utils/trpc";
import { Alert } from "../ui/alert";
import { Button } from "../ui/button";
import { CenteredSpinner } from "../ui/centered-spinner";
import { ConfirmPopover } from "../ui/confirm-popover";
import {
  Modal,
  ModalActions,
  ModalBody,
  ModalContent,
  ModalTitle,
  ModalTrigger,
} from "../ui/modal";
import { SaveButton } from "../ui/save-button";
import { RecipeForm } from "./recipe-form";

export const EditRecipeModal = ({
  recipe,
}: {
  recipe: RouterOutputs["recipe"]["getAll"][number];
}) => {
  const [open, setOpen] = useState(false);
  const { data: ingredients, isLoading } = trpc.ingredient.getAll.useQuery();

  const updateMutation = trpc.recipe.update.useMutation();
  const deleteMutation = trpc.recipe.delete.useMutation();
  const utils = trpc.useContext();

  return (
    <>
      <Modal open={open} onOpenChange={setOpen}>
        <ModalTrigger asChild>
          <Button intent="ghost" title={`Editar receta: ${recipe.name}`}>
            <MdEdit />
          </Button>
        </ModalTrigger>

        <ModalContent>
          <ModalTitle>Editar receta: {recipe.name}</ModalTitle>
          <ModalBody aria-live="polite" aria-busy={isLoading}>
            {deleteMutation.error && (
              <Alert className="mb-3">
                {deleteMutation.error.data?.code === "CONFLICT"
                  ? "La receta se encuentra en uso en una o más recetas"
                  : "Ocurrió un error al eliminar la receta"}
              </Alert>
            )}
            {ingredients && (
              <RecipeForm
                id="EditRecipeForm"
                ingredients={ingredients}
                defaultValues={{
                  name: recipe.name,
                  profitPercentage: recipe.profitPercentage,
                  ingredients: recipe.ingredients.map(
                    ({ ingredientId, units }) => ({ ingredientId, units })
                  ),
                }}
                onSubmit={(data) => {
                  updateMutation.mutate(
                    { id: recipe.id, ...data },
                    {
                      onSuccess: async () => {
                        utils.recipe.getAll.invalidate();
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
            <ConfirmPopover
              description="¿Realmente desea eliminar esta receta?"
              trigger={
                <Button className="mr-auto" intent="danger">
                  <FaTrash />
                  Eliminar
                </Button>
              }
              confirmProps={{
                onClick: () =>
                  deleteMutation.mutate(
                    { id: recipe.id },
                    { onSuccess: () => utils.recipe.getAll.invalidate() }
                  ),
                isLoading: deleteMutation.isLoading,
              }}
            />

            <SaveButton
              type="submit"
              form="EditRecipeForm"
              isLoading={updateMutation.isLoading}
            />
          </ModalActions>
        </ModalContent>
      </Modal>
    </>
  );
};
