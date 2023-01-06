import type { RouterOutputs } from "~/utils/trpc";
import { trpc } from "~/utils/trpc";
import { Card } from "../ui/card";
import { EditIngredientModal } from "./edit-ingredient-modal";

export function IngredientItem({
  ingredient,
}: {
  ingredient: RouterOutputs["ingredient"]["getAll"][number];
}) {
  const { data: userSettings } = trpc.auth.getUserSettings.useQuery();

  return (
    <Card asChild>
      <li>
        <div className="flex items-center justify-between">
          <h2 className="font-medium">{ingredient.name}</h2>
          <EditIngredientModal ingredient={ingredient} />
        </div>
        <hr className="my-2" />
        <p>
          Precio: {userSettings?.currencySymbol}
          {ingredient.price.toLocaleString()}
        </p>
        <p>
          Unidades: {ingredient.packageUnits.toLocaleString()}{" "}
          {ingredient.measurementUnit.symbol}
        </p>
        <p>
          Precio unitario: {userSettings?.currencySymbol}
          {ingredient.unitPrice.toLocaleString()}
        </p>
      </li>
    </Card>
  );
}
