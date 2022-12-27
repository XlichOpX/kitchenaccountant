import type { RouterOutputs } from "~/utils/trpc";
import { IngredientItem } from "./ingredient-item";

export function IngredientList({
  ingredients,
}: {
  ingredients: RouterOutputs["ingredient"]["getAll"];
}) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
      {ingredients.map((ingredient) => (
        <IngredientItem key={ingredient.id} ingredient={ingredient} />
      ))}
    </ul>
  );
}
