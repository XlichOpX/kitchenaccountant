import type { VariantProps } from "class-variance-authority";
import type { ComponentPropsWithRef } from "react";
import { forwardRef } from "react";
import { baseInputClasses } from "~/theme/forms";

export type SelectProps = VariantProps<typeof baseInputClasses> &
  ComponentPropsWithRef<"select">;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ children, className, size, isInvalid, borders, ...props }, ref) => (
    <select
      className={baseInputClasses({ className, size, isInvalid, borders })}
      ref={ref}
      {...props}
    >
      {children}
    </select>
  )
);

Select.displayName = "Select";
