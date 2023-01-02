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
import { RecipeForm } from "./recipe-form";

export function CreateRecipeModal({ btnClassName }: { btnClassName?: string }) {
  const [open, setOpen] = useState(false);
  const { data: ingredients, isLoading } = trpc.ingredient.getAll.useQuery();

  const mutation = trpc.recipe.create.useMutation();
  const utils = trpc.useContext();

  return (
    <>
      <Modal open={open} onOpenChange={setOpen}>
        <ModalTrigger asChild>
          <Button className={btnClassName}>
            <BsPlusLg />
            Nueva receta
          </Button>
        </ModalTrigger>

        <ModalContent>
          <ModalTitle>Agregar nueva receta</ModalTitle>
          <ModalBody aria-live="polite" aria-busy={isLoading}>
            {ingredients && (
              <RecipeForm
                id="CreateRecipeForm"
                ingredients={ingredients}
                defaultValues={{
                  name: "",
                  ingredients: [
                    { ingredientId: ingredients[0]?.id, units: 100 },
                  ],
                  profitPercentage: 80,
                }}
                onSubmit={(data) => {
                  mutation.mutate(data, {
                    onSuccess: async () => {
                      utils.recipe.getAll.invalidate();
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
              form="CreateRecipeForm"
              isLoading={mutation.isLoading}
            />
          </ModalActions>
        </ModalContent>
      </Modal>
    </>
  );
}
