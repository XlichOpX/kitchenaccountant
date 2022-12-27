import { router } from "../trpc";
import { authRouter } from "./auth";
import { exampleRouter } from "./example";
import { ingredientRouter } from "./ingredients";

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  ingredient: ingredientRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
