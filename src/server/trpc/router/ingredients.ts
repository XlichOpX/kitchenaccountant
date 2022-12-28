import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const ingredientRouter = router({
  getAll: protectedProcedure
    .input(z.object({ search: z.string().max(32).optional() }).optional())
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.ingredient.findMany({
        where: {
          userId: ctx.session.user.id,
          ...(input?.search && { name: { contains: input.search } }),
        },
      });
    }),
});
