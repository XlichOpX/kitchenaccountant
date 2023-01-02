import type { RouterOutputs } from "~/utils/trpc";
import { RecipeItem } from "./recipe-item";

export function RecipeList({
  recipes,
}: {
  recipes: RouterOutputs["recipe"]["getAll"];
}) {
  if (recipes.length === 0) {
    return <p>No se encontraron recetas...</p>;
  }

  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
      {recipes.map((recipe) => (
        <RecipeItem key={recipe.id} recipe={recipe} />
      ))}
    </ul>
  );
}
