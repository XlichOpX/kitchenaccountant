import { FaSave } from "react-icons/fa";
import type { ButtonProps } from "./button";
import { Button } from "./button";

export const SaveButton = ({ children, ...props }: ButtonProps) => {
  return (
    <Button {...props}>
      <FaSave />
      {children ?? "Guardar"}
    </Button>
  );
};
