import type { DefaultValues } from "react-hook-form";
import { useForm } from "react-hook-form";
import { ERROR_MESSAGES } from "~/utils/forms";
import type { RouterInputs } from "~/utils/trpc";
import { trpc } from "~/utils/trpc";
import { FormLabel } from "../ui/form-label";
import { Input } from "../ui/input";
import { SaveButton } from "../ui/save-button";

type FormData = RouterInputs["auth"]["updateUserSettings"];

export const SettingsForm = ({
  defaultValues,
}: {
  defaultValues?: DefaultValues<FormData>;
}) => {
  const { register, handleSubmit } = useForm<FormData>({ defaultValues });
  const mutation = trpc.auth.updateUserSettings.useMutation();
  return (
    <form
      className="flex flex-col items-start gap-3"
      onSubmit={handleSubmit((data) => {
        mutation.mutate(data);
      })}
    >
      <div className="flex items-center gap-2">
        <FormLabel htmlFor="currencySymbol">Símbolo de moneda:</FormLabel>
        <Input
          id="currencySymbol"
          type="text"
          placeholder="$"
          className="max-w-[8ch] text-center"
          onClick={(evt) => evt.currentTarget.select()}
          {...register("currencySymbol", {
            required: ERROR_MESSAGES.required,
            minLength: { value: 1, message: ERROR_MESSAGES.minLength(1) },
            maxLength: { value: 4, message: ERROR_MESSAGES.maxLength(4) },
          })}
        />
      </div>

      <SaveButton type="submit" isLoading={mutation.isLoading}>
        Guardar cambios
      </SaveButton>
    </form>
  );
};
