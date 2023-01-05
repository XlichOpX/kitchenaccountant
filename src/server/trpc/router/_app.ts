import { router } from "../trpc";
import { authRouter } from "./auth";
import { ingredientRouter } from "./ingredients";
import { measurementUnitRouter } from "./measurementUnits";
import { recipeRouter } from "./recipes";

export const appRouter = router({
  ingredient: ingredientRouter,
  measurementUnit: measurementUnitRouter,
  recipe: recipeRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
