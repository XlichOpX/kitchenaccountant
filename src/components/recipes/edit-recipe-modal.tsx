import { useMemo, useState } from "react";
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
  const { data: ingredients, isLoading: isLoadingIngredients } =
    trpc.ingredient.getAll.useQuery();
  const { data: recipes, isLoading: isLoadingRecipes } =
    trpc.recipe.getAll.useQuery();

  const filteredRecipes = useMemo(
    () => recipes?.filter((r) => r.id !== recipe.id),
    [recipes, recipe]
  );

  const updateMutation = trpc.recipe.update.useMutation();
  const deleteMutation = trpc.recipe.delete.useMutation();
  const utils = trpc.useContext();

  return (
    <>
      <Modal
        open={open}
        onOpenChange={(open) => {
          if (!open) {
            deleteMutation.reset();
          }
          setOpen(open);
        }}
      >
        <ModalTrigger asChild>
          <Button intent="ghost" title={`Editar receta: ${recipe.name}`}>
            <MdEdit />
          </Button>
        </ModalTrigger>

        <ModalContent>
          <ModalTitle>Editar receta: {recipe.name}</ModalTitle>
          <ModalBody aria-live="polite" aria-busy={isLoadingIngredients}>
            {deleteMutation.error && (
              <Alert className="mb-3" role="alert">
                {deleteMutation.error.data?.code === "CONFLICT"
                  ? "La receta se encuentra en uso en una o más recetas"
                  : "Ocurrió un error al eliminar la receta"}
              </Alert>
            )}
            {ingredients && filteredRecipes && (
              <RecipeForm
                id="EditRecipeForm"
                ingredients={ingredients}
                recipes={filteredRecipes}
                defaultValues={{
                  name: recipe.name,
                  profitPercentage: recipe.profitPercentage,
                  ingredients: recipe.ingredients.map(
                    ({ ingredientId, units }) => ({ ingredientId, units })
                  ),
                  subrecipes: recipe.subRecipes.map(({ recipeId, units }) => ({
                    subrecipeId: recipeId,
                    units,
                  })),
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
            {(isLoadingIngredients || isLoadingRecipes) && <CenteredSpinner />}
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
