import * as DialogPrimitive from "@radix-ui/react-dialog";
import type { VariantProps } from "class-variance-authority";
import { cva, cx } from "class-variance-authority";
import type { ComponentPropsWithoutRef, ComponentPropsWithRef } from "react";
import { forwardRef } from "react";
import { RxCross1 } from "react-icons/rx";

const modalClasses = cva(
  "m-auto w-full rounded bg-white p-4 shadow-lg data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out",
  {
    variants: {
      size: {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
        "2xl": "max-w-2xl",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

export type ModalProps = VariantProps<typeof modalClasses> &
  ComponentPropsWithRef<"div">;

export const ModalContent = forwardRef<HTMLDivElement, ModalProps>(
  ({ children, className, size, ...props }, forwardedRef) => (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-20 flex overflow-auto bg-black/25 p-2 backdrop-blur-sm data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out">
        <DialogPrimitive.Content
          {...props}
          ref={forwardedRef}
          className={modalClasses({ className, size })}
        >
          {children}
          <DialogPrimitive.Close
            aria-label="Cerrar"
            className="fixed top-0 right-0 flex h-10 w-10 items-center justify-center bg-white shadow-md"
          >
            <RxCross1 className="h-6 w-6" />
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Overlay>
    </DialogPrimitive.Portal>
  )
);
ModalContent.displayName = "DialogContent";

export const Modal = DialogPrimitive.Root;
export const ModalTrigger = DialogPrimitive.Trigger;
export const ModalTitle = ({
  children,
  className,
  ...props
}: DialogPrimitive.DialogTitleProps) => (
  <DialogPrimitive.Title
    className={cx("text-lg font-medium", className)}
    {...props}
  >
    {children}
  </DialogPrimitive.Title>
);

export const ModalBody = ({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) => (
  <div className={cx("my-3", className)} {...props}>
    {children}
  </div>
);

export const ModalActions = ({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) => (
  <div
    className={cx("mt-3 flex items-center justify-end gap-3", className)}
    {...props}
  >
    {children}
  </div>
);
