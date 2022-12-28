import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import type { ComponentPropsWithRef } from "react";

const inputClasses = cva(
  "shadow-sm rounded border placeholder:italic placeholder:text-gray-400 px-2 py-1 focus:ring-2 focus-within:outline-none",
  {
    variants: {
      isInvalid: {
        false:
          "focus:border-amber-300 focus:ring-amber-200 focus:shadow-amber-200",
        true: "border-red-400 focus:ring-red-300 focus:shadow-red-300",
      },
    },
    defaultVariants: {
      isInvalid: false,
    },
  }
);

export type InputProps = VariantProps<typeof inputClasses> &
  ComponentPropsWithRef<"input">;

export function Input({ className, isInvalid, ...props }: InputProps) {
  return (
    <input className={inputClasses({ className, isInvalid })} {...props} />
  );
}
