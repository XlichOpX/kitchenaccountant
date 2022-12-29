import { z } from "zod";
import {
  ingredientCreateSchema,
  ingredientUpdateSchema,
} from "~/schema/ingredient";
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
    .input(ingredientCreateSchema)
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

  update: protectedProcedure
    .input(ingredientUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.ingredient.update({
        data: input,
        where: { id: input.id, userId: ctx.session.user.id },
      });
    }),
});
