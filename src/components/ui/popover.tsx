import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cx } from "class-variance-authority";
import { forwardRef } from "react";

export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;
export const PopoverClose = PopoverPrimitive.Close;

export const PopoverContent = forwardRef<
  HTMLDivElement,
  PopoverPrimitive.PopoverContentProps & {
    container?: PopoverPrimitive.PopoverPortalProps["container"];
  }
>(({ children, container, className, ...props }, forwardedRef) => (
  <PopoverPrimitive.Portal container={container}>
    <PopoverPrimitive.Content
      sideOffset={5}
      ref={forwardedRef}
      className={cx(
        "z-30 rounded bg-white p-2 shadow-md data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out",
        className
      )}
      collisionPadding={5}
      {...props}
    >
      {children}
      <PopoverPrimitive.Arrow className="text-white" fill="currentColor" />
    </PopoverPrimitive.Content>
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = "PopoverContent";
