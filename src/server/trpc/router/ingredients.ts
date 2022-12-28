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

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(3).max(32),
        price: z.number().positive(),
        packageUnits: z.number().positive(),
        measurementUnitId: z.string().min(1).max(64),
      })
    )
    .mutation(
      async ({
        ctx,
        input: { name, price, packageUnits, measurementUnitId },
      }) => {
        return await ctx.prisma.ingredient.create({
          data: {
            name,
            price,
            packageUnits,
            unitPrice: price / packageUnits,
            userId: ctx.session.user.id,
            measurementUnitId,
          },
        });
      }
    ),
});
