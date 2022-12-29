import { cx } from "class-variance-authority";
import type { ComponentPropsWithoutRef } from "react";
import { Spinner } from "./spinner";

export const CenteredSpinner = ({
  spinnerProps,
  containerProps,
}: {
  containerProps?: ComponentPropsWithoutRef<"div">;
  spinnerProps?: ComponentPropsWithoutRef<typeof Spinner>;
}) => {
  const { className, ...props } = containerProps ?? {};
  return (
    <div
      className={cx("flex items-center justify-center", className)}
      {...props}
    >
      <Spinner {...spinnerProps} />
    </div>
  );
};
