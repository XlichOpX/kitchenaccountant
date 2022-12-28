import { cx } from "class-variance-authority";
import type { ComponentPropsWithoutRef } from "react";

export const FormFeedback = ({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<"span">) => {
  if (!children) return null;
  return (
    <span className={cx("text-red-400", className)} {...props}>
      {children}
    </span>
  );
};
