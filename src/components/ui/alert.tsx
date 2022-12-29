import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import type { ComponentPropsWithoutRef } from "react";

const alertClasses = cva("p-2 rounded shadow-sm", {
  variants: {
    intent: {
      primary: "bg-amber-200 text-amber-900",
      danger: "bg-red-200 text-red-600 shadow-red-100",
    },
  },
  defaultVariants: {
    intent: "danger",
  },
});

export type AlertProps = VariantProps<typeof alertClasses> &
  ComponentPropsWithoutRef<"div">;

export const Alert = ({
  children,
  className,
  intent,
  ...props
}: AlertProps) => {
  return (
    <div className={alertClasses({ className, intent })} {...props}>
      {children}
    </div>
  );
};
