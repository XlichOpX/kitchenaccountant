import { cx } from "class-variance-authority";
import NLink from "next/link";
import type { ComponentPropsWithRef } from "react";

export const Link = ({
  className,
  ...props
}: ComponentPropsWithRef<typeof NLink>) => {
  return <NLink className={cx("underline", className)} {...props} />;
};
