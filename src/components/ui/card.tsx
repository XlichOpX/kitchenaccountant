import { Slot } from "@radix-ui/react-slot";
import type { ComponentPropsWithoutRef, PropsWithChildren } from "react";

export function Card({
  asChild,
  children,
  className,
  ...props
}: PropsWithChildren<{ asChild?: boolean } & ComponentPropsWithoutRef<"div">>) {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      className={
        "rounded border bg-white p-3 shadow-sm" + (` ${className}` ?? "")
      }
      {...props}
    >
      {children}
    </Comp>
  );
}
