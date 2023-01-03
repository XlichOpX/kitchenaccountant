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

export const SubrecipesFields = ({
  form,
  recipes,
}: {
  form: UseFormReturn<RecipeFormInput>;
  recipes: RouterOutputs["recipe"]["getAll"];
}) => {
  const {
    register,
    control,
    formState: { errors },
  } = form;

  const { fields, prepend, remove } = useFieldArray({
    control,
    name: "subrecipes",
  });

  return (
    <fieldset>
      <div className="mb-1 flex justify-end">
        <FormLabel asChild className="mr-auto">
          <legend>Subrecetas</legend>
        </FormLabel>

        <Button
          intent="ghost"
          onClick={() =>
            prepend({ subrecipeId: recipes[0]?.id ?? "", units: 1 })
          }
          title="Agregar subreceta"
        >
          <BsPlusLg />
        </Button>
      </div>

      {fields.length === 0 && (
        <p className="text-center text-sm italic text-gray-600">
          Otras recetas que compongan a esta...
        </p>
      )}

      <div className="flex flex-col gap-2">
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-4">
            <div className="grow">
              <FormLabel htmlFor={field.id} className="sr-only">
                Subreceta
              </FormLabel>
              <Select
                id={field.id}
                isInvalid={Boolean(errors.subrecipes?.[index]?.subrecipeId)}
                {...register(`subrecipes.${index}.subrecipeId`, {
                  required: ERROR_MESSAGES.required,
                })}
              >
                {recipes.map((recipe) => (
                  <option key={recipe.id} value={recipe.id}>
                    {recipe.name}
                  </option>
                ))}
              </Select>
              <FormFeedback>
                {errors.subrecipes?.[index]?.subrecipeId?.message}
              </FormFeedback>
            </div>

            <div className="w-1/4">
              <FormLabel htmlFor={field.id} className="sr-only">
                Unidades de la receta
              </FormLabel>
              <Input
                id={field.id}
                type="number"
                step="any"
                onClick={(evt) => evt.currentTarget.select()}
                isInvalid={Boolean(errors.subrecipes?.[index]?.units)}
                {...register(`subrecipes.${index}.units`, {
                  required: ERROR_MESSAGES.required,
                  valueAsNumber: true,
                  min: { value: 0, message: ERROR_MESSAGES.min(0) },
                })}
              />
              <FormFeedback>
                {errors.subrecipes?.[index]?.units?.message}
              </FormFeedback>
            </div>

            <Button
              intent="ghost"
              onClick={() => remove(index)}
              title="Eliminar subreceta"
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
