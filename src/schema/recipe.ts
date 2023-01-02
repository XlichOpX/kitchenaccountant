import { z } from "zod";
import { cuidSchema } from "./common";

export const recipeCreateSchema = z.object({
  name: z.string().min(3).max(32),
  profitPercentage: z.number().positive(),
  ingredients: z
    .object({
      ingredientId: cuidSchema,
      units: z.number().positive(),
    })
    .array(),
});

export const recipeUpdateSchema = recipeCreateSchema.extend({
  id: cuidSchema,
});
