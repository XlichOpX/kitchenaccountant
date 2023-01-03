import type { UseFormReturn } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import { BsPlusLg, BsXLg } from "react-icons/bs";
import { Button } from "~/components/ui/button";
import { FormFeedback } from "~/components/ui/form-feedback";
import { FormLabel } from "~/components/ui/form-label";
import { Input } from "~/components/ui/input";
import { Select } from "~/components/ui/select";
import { ERROR_MESSAGES } from "~/utils/forms";
import type { RouterOutputs } from "~/utils/trpc";
import type { RecipeFormInput } from ".";

export const IngredientsFields = ({
  form,
  ingredients,
}: {
  form: UseFormReturn<RecipeFormInput>;
  ingredients: RouterOutputs["ingredient"]["getAll"];
}) => {
  const {
    register,
    control,
    formState: { errors },
  } = form;

  const { fields, prepend, remove } = useFieldArray({
    control,
    name: "ingredients",
  });

  return (
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

      {fields.length === 0 && (
        <p className="text-center text-sm italic text-gray-600">
          Agregue ingredientes a la receta
        </p>
      )}

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

            <Button
              intent="ghost"
              onClick={() => remove(index)}
              title="Eliminar ingrediente"
              className="shrink-0"
            >
              <BsXLg />
            </Button>
          </div>
        ))}
      </div>
    </fieldset>
  );
};
