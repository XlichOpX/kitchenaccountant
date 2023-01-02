import type { DefaultValues, SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { ERROR_MESSAGES } from "~/utils/forms";
import type { RouterInputs, RouterOutputs } from "~/utils/trpc";
import { FormFeedback } from "../ui/form-feedback";
import { FormLabel } from "../ui/form-label";
import { Input } from "../ui/input";
import { Select } from "../ui/select";

type IngredientInput = RouterInputs["ingredient"]["create"];

export const IngredientForm = ({
  id,
  measurementUnits,
  onSubmit,
  defaultValues,
}: {
  measurementUnits: RouterOutputs["measurementUnit"]["getAll"];
  onSubmit: SubmitHandler<IngredientInput>;
  defaultValues?: DefaultValues<IngredientInput>;
  id: string;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IngredientInput>({
    defaultValues,
  });

  return (
    <form
      className="flex flex-col gap-3"
      id={id}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div>
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

      <div className="flex gap-4">
        <div>
          <FormLabel htmlFor="price">Precio</FormLabel>
          <Input
            id="price"
            type="number"
            step="any"
            onClick={(evt) => evt.currentTarget.select()}
            isInvalid={Boolean(errors.price)}
            {...register("price", {
              required: ERROR_MESSAGES.required,
              valueAsNumber: true,
            })}
          />
          <FormFeedback>{errors.price?.message}</FormFeedback>
        </div>

        <div>
          <FormLabel htmlFor="packageUnits">Unidades</FormLabel>
          <div className="flex">
            <div className="w-2/3 sm:w-3/4">
              <Input
                id="packageUnits"
                borders="noRight"
                className="h-full"
                type="number"
                step="any"
                isInvalid={Boolean(errors.packageUnits)}
                onClick={(evt) => evt.currentTarget.select()}
                {...register("packageUnits", {
                  required: ERROR_MESSAGES.required,
                  valueAsNumber: true,
                })}
              />
            </div>

            <div className="w-1/3 sm:w-1/4">
              <label htmlFor="measurementUnitId" className="sr-only">
                Unidad de medida
              </label>
              <Select
                borders="noLeft"
                className="h-full"
                id="measurementUnitId"
                isInvalid={Boolean(errors.measurementUnitId)}
                {...register("measurementUnitId", { required: true })}
              >
                {measurementUnits.map((mu) => (
                  <option key={mu.id} value={mu.id}>
                    {mu.symbol}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <FormFeedback>{errors.packageUnits?.message}</FormFeedback>
        </div>
      </div>
    </form>
  );
};
