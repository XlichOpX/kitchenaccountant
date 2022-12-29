import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import type { ComponentPropsWithRef } from "react";
import { forwardRef } from "react";
import { CenteredSpinner } from "./centered-spinner";

const buttonClasses = cva(
  "overflow-hidden relative rounded flex gap-2 items-center justify-center font-medium disabled:cursor-not-allowed focus-within:outline-none focus:ring-2",
  {
    variants: {
      intent: {
        primary:
          "text-amber-900 bg-amber-200 hover:bg-amber-300 shadow-sm border focus:ring-amber-200 border-amber-400 disabled:bg-amber-100 disabled:border-amber-300 disabled:text-amber-500",
        ghost: "hover:bg-black/10 focus:ring-amber-200",
      },
      size: {
        md: "px-2 py-1",
        sm: "p-0.5",
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
