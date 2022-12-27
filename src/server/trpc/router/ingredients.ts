import { protectedProcedure, router } from "../trpc";

export const ingredientRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.ingredient.findMany({
      where: { userId: ctx.session.user.id },
    });
  }),
});
