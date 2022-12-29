import { cva } from "class-variance-authority";

export const baseInputClasses = cva(
  "shadow-sm bg-white block w-full placeholder:italic placeholder:text-gray-400 focus:ring-2 focus-within:outline-none",
  {
    variants: {
      size: {
        md: "px-2 py-1",
      },
      isInvalid: {
        false:
          "focus:border-amber-300 focus:ring-amber-200 focus:shadow-amber-200",
        true: "border-red-400 focus:ring-red-300 focus:shadow-red-300",
      },
      borders: {
        all: "border rounded",
        noLeft: "border-t border-r border-b rounded-r",
        noRight: "border-t border-l border-b rounded-l",
      },
    },
    defaultVariants: {
      size: "md",
      isInvalid: false,
      borders: "all",
    },
  }
);
