import Link from "next/link";
import type { RouterOutputs } from "~/utils/trpc";
import { trpc } from "~/utils/trpc";
import { Card } from "../ui/card";
import { EditRecipeModal } from "./edit-recipe-modal";

export function RecipeItem({
  recipe,
}: {
  recipe: RouterOutputs["recipe"]["getAll"][number];
}) {
  const { data: userSettings } = trpc.auth.getUserSettings.useQuery();

  return (
    <Card asChild>
      <li>
        <div className="flex items-center justify-between">
          <h2 className="font-medium">
            <Link href={`/recipes/${recipe.id}`} className="underline">
              {recipe.name}
            </Link>
          </h2>
          <EditRecipeModal recipe={recipe} />
        </div>
        <hr className="my-2" />
        <p>
          Costo: {userSettings?.currencySymbol}
          {recipe.cost.toLocaleString()}
        </p>
        <p>
          Precio de venta: {userSettings?.currencySymbol}
          {recipe.price.toLocaleString()}
        </p>
        <p>
          Ganancia: {recipe.profitPercentage.toLocaleString()} % ={" "}
          {userSettings?.currencySymbol}
          {(recipe.price - recipe.cost).toLocaleString()}
        </p>
      </li>
    </Card>
  );
}
