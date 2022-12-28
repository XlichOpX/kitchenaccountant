import type { VariantProps } from "class-variance-authority";
import type { ComponentPropsWithRef } from "react";
import { forwardRef } from "react";
import { baseInputClasses } from "~/theme/forms";

export type InputProps = VariantProps<typeof baseInputClasses> &
  ComponentPropsWithRef<"input">;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, isInvalid, borders, size, ...props }, ref) => (
    <>
      <input
        className={baseInputClasses({ className, isInvalid, borders, size })}
        ref={ref}
        {...props}
      />
    </>
  )
);
Input.displayName = "Input";
