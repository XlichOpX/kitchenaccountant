import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { cuidSchema } from "~/schema/common";
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
        include: { measurementUnit: true },
        where: {
          userId: ctx.session.user.id,
          ...(input?.search && {
            name: { contains: input.search, mode: "insensitive" },
          }),
        },
        orderBy: {
          name: "asc",
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
        data: { ...input, unitPrice: input.price / input.packageUnits },
        where: { id: input.id, userId: ctx.session.user.id },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: cuidSchema }))
    .mutation(async ({ ctx, input }) => {
      const count = await ctx.prisma.ingredient.findUnique({
        select: { _count: { select: { recipes: true } } },
        where: { id: input.id, userId: ctx.session.user.id },
      });

      if (!count) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      if (count._count.recipes > 0) {
        throw new TRPCError({ code: "CONFLICT" });
      }

      return await ctx.prisma.ingredient.delete({
        where: { id: input.id, userId: ctx.session.user.id },
      });
    }),
});
