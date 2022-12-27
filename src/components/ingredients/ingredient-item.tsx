import type { RouterOutputs } from "~/utils/trpc";
import { Card } from "../ui/card";

export function IngredientItem({
  ingredient,
}: {
  ingredient: RouterOutputs["ingredient"]["getAll"][number];
}) {
  return (
    <Card asChild>
      <li>
        <h2 className="font-medium">{ingredient.name}</h2>
        <hr className="my-2" />
        <p>Precio: {ingredient.price.toLocaleString()}</p>
        <p>Unidades: {ingredient.packageUnits.toLocaleString()}</p>
        <p>Precio unitario: {ingredient.unitPrice.toLocaleString()}</p>
      </li>
    </Card>
  );
}
