import type { ReactElement } from "react";
import { Input } from "./ui/input";

export const SearchAndCreate = ({
  placeholder,
  onSearchChange,
  createButton,
}: {
  placeholder: string;
  onSearchChange: (value: string) => void;
  createButton: ReactElement;
}) => {
  return (
    <>
      <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
        <div className="w-full sm:w-1/3 lg:w-1/4">
          <label className="sr-only" id="searchIngredients">
            {placeholder}
          </label>
          <Input
            id="searchIngredients"
            placeholder={placeholder}
            className="block w-full"
            onChange={(e) => onSearchChange(e.target.value)}
            maxLength={32}
          />
        </div>
        {createButton}
      </div>
      <hr className="mt-2 mb-3" />
    </>
  );
};
