import type { ReactNode } from "react";
import { FaTrash } from "react-icons/fa";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import type { ButtonProps } from "./button";
import { Button } from "./button";

export const ConfirmPopover = ({
  trigger,
  description,
  cancelText = "Cancelar",
  confirmText = "Confirmar",
  confirmProps,
}: {
  trigger: ReactNode;
  description: string;
  cancelText?: string;
  confirmText?: string;
  confirmProps?: ButtonProps;
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>

      <PopoverContent className="w-40">
        <p className="mb-2 text-center">{description}</p>
        <div className="flex flex-col gap-2">
          <PopoverClose asChild>
            <Button className="w-full" intent="outlinePrimary">
              {cancelText}
            </Button>
          </PopoverClose>

          <Button intent="danger" className="w-full" {...confirmProps}>
            <FaTrash />
            {confirmText}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
