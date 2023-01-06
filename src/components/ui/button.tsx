import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import type { ComponentPropsWithRef } from "react";
import { forwardRef } from "react";
import { CenteredSpinner } from "./centered-spinner";

export const buttonClasses = cva(
  "overflow-hidden relative rounded flex gap-2 items-center active:translate-y-[1px] justify-center font-medium disabled:cursor-not-allowed focus-within:outline-none focus:ring-2",
  {
    variants: {
      intent: {
        primary:
          "text-amber-900 bg-amber-200 hover:bg-amber-300 shadow border focus:ring-amber-200 border-amber-400 disabled:bg-amber-100 disabled:border-amber-300 disabled:text-amber-500",
        outlinePrimary:
          "text-amber-900 bg-transparent border border-amber-900 hover:bg-amber-200 hover:shadow focus:ring-amber-200 disabled:border-amber-300 disabled:bg-white disabled:text-amber-500 disabled:hover:bg-white",
        danger:
          "text-red-500 bg-red-100 hover:bg-red-200 shadow border focus:ring-red-200 border-red-500 disabled:bg-red-100 disabled:border-red-300 disabled:text-red-500",
        ghost: "hover:bg-black/10 focus:ring-amber-200",
      },
      size: {
        md: "px-2 py-1",
        lg: "px-3 py-1 text-lg",
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
    {
      children,
      intent,
      className,
      isLoading = false,
      disabled,
      type = "button",
      ...props
    },
    ref
  ) => (
    <button
      className={buttonClasses({ intent, className })}
      ref={ref}
      disabled={isLoading || disabled}
      type={type}
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
