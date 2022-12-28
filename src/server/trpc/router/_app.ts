import { router } from "../trpc";
import { authRouter } from "./auth";
import { exampleRouter } from "./example";
import { ingredientRouter } from "./ingredients";
import { measurementUnitRouter } from "./measurementUnits";

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  ingredient: ingredientRouter,
  measurementUnit: measurementUnitRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
