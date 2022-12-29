import type { RouterOutputs } from "~/utils/trpc";
import { Card } from "../ui/card";
import { EditIngredientModal } from "./edit-ingredient-modal";

export function IngredientItem({
  ingredient,
}: {
  ingredient: RouterOutputs["ingredient"]["getAll"][number];
}) {
  return (
    <Card asChild>
      <li>
        <div className="flex items-center justify-between">
          <h2 className="font-medium">{ingredient.name}</h2>
          <EditIngredientModal ingredient={ingredient} />
        </div>
        <hr className="my-2" />
        <p>Precio: {ingredient.price.toLocaleString()}</p>
        <p>Unidades: {ingredient.packageUnits.toLocaleString()}</p>
        <p>Precio unitario: {ingredient.unitPrice.toLocaleString()}</p>
      </li>
    </Card>
  );
}
