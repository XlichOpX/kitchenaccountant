import { cx } from "class-variance-authority";
import type { ComponentPropsWithoutRef } from "react";

export const FormLabel = ({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<"label">) => {
  return (
    <label className={cx("mb-1 block", className)} {...props}>
      {children}
    </label>
  );
};
