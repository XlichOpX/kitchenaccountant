import type { VariantProps } from "class-variance-authority";
import type { ComponentPropsWithRef } from "react";
import { baseInputClasses } from "~/theme/forms";

export type InputProps = VariantProps<typeof baseInputClasses> &
  ComponentPropsWithRef<"input">;

export function Input({
  className,
  isInvalid,
  borders,
  size,
  ...props
}: InputProps) {
  return (
    <input
      className={baseInputClasses({ className, isInvalid, borders, size })}
      {...props}
    />
  );
}
