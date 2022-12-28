import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import type { ComponentPropsWithRef } from "react";
import { forwardRef } from "react";

const buttonClasses = cva(
  "rounded border shadow-sm flex gap-2 items-center justify-center font-medium disabled:bg-gray-500/80 disabled:cursor-not-allowed focus-within:outline-none focus:ring-2",
  {
    variants: {
      intent: {
        primary:
          "text-amber-900 bg-amber-300 focus:ring-amber-200 border-amber-400",
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
  ComponentPropsWithRef<"button">;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, intent, className, ...props }, ref) => (
    <button
      className={buttonClasses({ intent, className })}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  )
);
Button.displayName = "Button";
