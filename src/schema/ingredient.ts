import { z } from "zod";
import { cuidSchema } from "./common";

export const ingredientCreateSchema = z.object({
  name: z.string().min(3).max(32),
  price: z.number().positive(),
  packageUnits: z.number().positive(),
  measurementUnitId: z.string().min(1).max(64),
});

export const ingredientUpdateSchema = ingredientCreateSchema.extend({
  id: cuidSchema,
});
