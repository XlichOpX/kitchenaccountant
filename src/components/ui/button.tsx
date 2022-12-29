import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import type { ComponentPropsWithRef } from "react";
import { forwardRef } from "react";
import { CenteredSpinner } from "./centered-spinner";

const buttonClasses = cva(
  "overflow-hidden relative rounded border shadow-sm flex gap-2 items-center justify-center font-medium disabled:cursor-not-allowed focus-within:outline-none focus:ring-2",
  {
    variants: {
      intent: {
        primary:
          "text-amber-900 bg-amber-300 focus:ring-amber-200 border-amber-400 disabled:bg-amber-200 disabled:border-amber-300 disabled:text-amber-600",
      },
      size: {
        md: "px-2 py-1",
      },
    },
    defaultVariants: {
      intent: "primary",
      size: "md",
    },
  }
);

export type ButtonProps = VariantProps<typeof buttonClasses> &
  ComponentPropsWithRef<"button"> & { isLoading?: boolean };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { children, intent, className, isLoading = false, disabled, ...props },
    ref
  ) => (
    <button
      className={buttonClasses({ intent, className })}
      ref={ref}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && (
        <div className="absolute inset-0 bg-inherit">
          <CenteredSpinner
            spinnerProps={{ className: "h-6 w-6" }}
            containerProps={{ className: "h-full" }}
          />
        </div>
      )}
      {children}
    </button>
  )
);
Button.displayName = "Button";
