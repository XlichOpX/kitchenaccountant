import { useState } from "react";
import type { DefaultValues, SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { Alert } from "~/components/ui/alert";
import { FormFeedback } from "~/components/ui/form-feedback";
import { FormLabel } from "~/components/ui/form-label";
import { Input } from "~/components/ui/input";
import { ERROR_MESSAGES } from "~/utils/forms";
import type { RouterInputs, RouterOutputs } from "~/utils/trpc";
import { IngredientsFields } from "./ingredients-fields";
import { SubrecipesFields } from "./subrecipes-fields";

export type RecipeFormInput = RouterInputs["recipe"]["create"];

export const RecipeForm = ({
  id,
  onSubmit,
  defaultValues,
  ingredients,
  recipes,
}: {
  onSubmit: SubmitHandler<RecipeFormInput>;
  defaultValues?: DefaultValues<RecipeFormInput>;
  id: string;
  ingredients: RouterOutputs["ingredient"]["getAll"];
  recipes: RouterOutputs["recipe"]["getAll"];
}) => {
  const form = useForm<RecipeFormInput>({
    defaultValues,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="flex flex-col gap-3"
      id={id}
      onSubmit={handleSubmit((data) => {
        if (data.ingredients.length === 0 && data.subrecipes.length === 0) {
          return setError(
            "Debe agregar al menos un ingrediente o una subreceta"
          );
        }
        onSubmit(data);
        setError(null);
      })}
    >
      {error && <Alert role="alert">{error}</Alert>}
      <div className="flex gap-4">
        <div className="grow">
          <FormLabel htmlFor="name">Nombre</FormLabel>
          <Input
            id="name"
            isInvalid={Boolean(errors.name)}
            {...register("name", {
              required: ERROR_MESSAGES.required,
              maxLength: { value: 32, message: ERROR_MESSAGES.maxLength(32) },
              minLength: { value: 3, message: ERROR_MESSAGES.minLength(3) },
            })}
          />
          <FormFeedback>{errors.name?.message}</FormFeedback>
        </div>

        <div className="w-1/3">
          <FormLabel htmlFor="profitPercentage">Ganancia (%)</FormLabel>
          <Input
            id="profitPercentage"
            type="number"
            step="any"
            onClick={(evt) => evt.currentTarget.select()}
            isInvalid={Boolean(errors.profitPercentage)}
            {...register("profitPercentage", {
              required: ERROR_MESSAGES.required,
              valueAsNumber: true,
            })}
          />
          <FormFeedback>{errors.profitPercentage?.message}</FormFeedback>
        </div>
      </div>

      <hr />
      <IngredientsFields form={form} ingredients={ingredients} />
      <hr />
      <SubrecipesFields form={form} recipes={recipes} />
    </form>
  );
};
