import { Prisma } from "@prisma/client";

const mockUserEmail = "yhan.carlos2001@gmail.com";

export const MEASUREMENT_UNITS: Prisma.MeasurementUnitCreateInput[] = [
  { symbol: "g" },
  { symbol: "u" },
  { symbol: "ml" },
];

export const INGREDIENTS: Prisma.IngredientCreateInput[] = [
  formatIngredient("Harina", 1.1, 1000, "g"),
  formatIngredient("Huevos", 2.75, 15, "u"),
  formatIngredient("Agua", 0, 1000, "ml"),
  formatIngredient("Aceite", 4, 1000, "ml"),
  formatIngredient("Azúcar", 1.48, 1000, "g"),
  formatIngredient("Arequipe", 2.91, 250, "g"),
  formatIngredient("Cacao en polvo", 2.3, 250, "g"),
  formatIngredient("Chocolate oscuro", 2.1, 250, "g"),
  formatIngredient("Crema chantilly", 1.9, 200, "ml"),
  formatIngredient("Leche", 1.7, 1000, "ml"),
];

function formatIngredient(
  name: string,
  price: number,
  packageUnits: number,
  measurementUnit: string
) {
  return Prisma.validator<Prisma.IngredientCreateInput>()({
    name,
    price,
    packageUnits,
    measurementUnit: { connect: { symbol: measurementUnit } },
    unitPrice: price / packageUnits,
    user: { connect: { email: mockUserEmail } },
  });
}
