import type { DefaultValues, SubmitHandler } from "react-hook-form";
import { useFieldArray, useForm } from "react-hook-form";
import { BsPlusLg, BsXLg } from "react-icons/bs";
import { ERROR_MESSAGES } from "~/utils/forms";
import type { RouterInputs, RouterOutputs } from "~/utils/trpc";
import { Button } from "../ui/button";
import { FormFeedback } from "../ui/form-feedback";
import { FormLabel } from "../ui/form-label";
import { Input } from "../ui/input";
import { Select } from "../ui/select";

type RecipeInput = RouterInputs["recipe"]["create"];

export const RecipeForm = ({
  id,
  onSubmit,
  defaultValues,
  ingredients,
}: {
  onSubmit: SubmitHandler<RecipeInput>;
  defaultValues?: DefaultValues<RecipeInput>;
  id: string;
  ingredients: RouterOutputs["ingredient"]["getAll"];
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<RecipeInput>({
    defaultValues,
  });

  const { fields, prepend, remove } = useFieldArray({
    control,
    name: "ingredients",
  });

  return (
    <form
      className="flex flex-col gap-3"
      id={id}
      onSubmit={handleSubmit(onSubmit)}
    >
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

      <fieldset>
        <div className="mb-1 flex justify-end">
          <FormLabel asChild className="mr-auto">
            <legend>Ingredientes</legend>
          </FormLabel>

          <Button
            intent="ghost"
            onClick={() =>
              prepend({ ingredientId: ingredients[0]?.id ?? "", units: 1 })
            }
            title="Agregar ingrediente"
          >
            <BsPlusLg />
          </Button>
        </div>

        <div className="flex flex-col gap-2">
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-4">
              <div className="grow">
                <FormLabel htmlFor={field.id} className="sr-only">
                  Ingrediente
                </FormLabel>
                <Select
                  id={field.id}
                  isInvalid={Boolean(errors.ingredients?.[index]?.ingredientId)}
                  {...register(`ingredients.${index}.ingredientId`, {
                    required: ERROR_MESSAGES.required,
                  })}
                >
                  {ingredients.map((ingredient) => (
                    <option key={ingredient.id} value={ingredient.id}>
                      {ingredient.name} ({ingredient.packageUnits}{" "}
                      {ingredient.measurementUnit.symbol})
                    </option>
                  ))}
                </Select>
                <FormFeedback>
                  {errors.ingredients?.[index]?.ingredientId?.message}
                </FormFeedback>
              </div>

              <div className="w-1/4">
                <FormLabel htmlFor={field.id} className="sr-only">
                  Cantidad
                </FormLabel>
                <Input
                  id={field.id}
                  type="number"
                  step="any"
                  onClick={(evt) => evt.currentTarget.select()}
                  isInvalid={Boolean(errors.ingredients?.[index]?.units)}
                  {...register(`ingredients.${index}.units`, {
                    required: ERROR_MESSAGES.required,
                    valueAsNumber: true,
                    min: { value: 0, message: ERROR_MESSAGES.min(0) },
                  })}
                />
                <FormFeedback>
                  {errors.ingredients?.[index]?.units?.message}
                </FormFeedback>
              </div>

              {fields.length > 1 && (
                <Button
                  intent="ghost"
                  onClick={() => remove(index)}
                  title="Eliminar ingrediente"
                  className="shrink-0"
                >
                  <BsXLg />
                </Button>
              )}
            </div>
          ))}
        </div>
      </fieldset>
    </form>
  );
};
