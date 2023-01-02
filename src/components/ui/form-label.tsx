import { Slot } from "@radix-ui/react-slot";
import { cx } from "class-variance-authority";
import type { ComponentPropsWithoutRef } from "react";

export const FormLabel = ({
  children,
  className,
  asChild,
  ...props
}: { asChild?: boolean } & ComponentPropsWithoutRef<"label">) => {
  const Comp = asChild ? Slot : "label";
  return (
    <Comp className={cx("mb-1 block", className)} {...props}>
      {children}
    </Comp>
  );
};
