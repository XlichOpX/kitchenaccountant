import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { cuidSchema } from "~/schema/common";
import { recipeCreateSchema, recipeUpdateSchema } from "~/schema/recipe";
import { protectedProcedure, router } from "../trpc";

export const recipeRouter = router({
  getAll: protectedProcedure
    .input(z.object({ search: z.string().max(32).optional() }).optional())
    .query(async ({ ctx, input }) => {
      const recipes = await ctx.prisma.recipe.findMany({
        include: {
          ingredients: {
            include: { ingredient: true },
          },
        },
        where: {
          userId: ctx.session.user.id,
          ...(input?.search && {
            name: { contains: input.search, mode: "insensitive" },
          }),
        },
      });

      const recipesWithPrices = recipes.map((recipe) => {
        const ingredientCost = recipe.ingredients.reduce(
          (ac, ingredient) =>
            ac + ingredient.ingredient.unitPrice * ingredient.units,
          0
        );

        const price = ingredientCost * (recipe.profitPercentage / 100 + 1);

        return { ...recipe, ingredientCost, cost: ingredientCost, price };
      });

      return recipesWithPrices;
    }),

  create: protectedProcedure
    .input(recipeCreateSchema)
    .mutation(
      async ({ ctx, input: { name, profitPercentage, ingredients } }) => {
        return await ctx.prisma.recipe.create({
          data: {
            name,
            userId: ctx.session.user.id,
            profitPercentage,
            ingredients: {
              createMany: {
                data: ingredients.map(({ ingredientId, units }) => ({
                  ingredientId,
                  units,
                })),
              },
            },
          },
        });
      }
    ),

  update: protectedProcedure
    .input(recipeUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.recipe.update({
        data: {
          ...input,
          ingredients: {
            deleteMany: {},
            createMany: {
              data: input.ingredients.map(({ ingredientId, units }) => ({
                ingredientId,
                units,
              })),
            },
          },
        },
        where: { id: input.id, userId: ctx.session.user.id },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: cuidSchema }))
    .mutation(async ({ ctx, input }) => {
      const counts = await ctx.prisma.recipe.findUnique({
        select: {
          _count: { select: { subRecipes: true, parentRecipes: true } },
        },
        where: { id: input.id, userId: ctx.session.user.id },
      });

      if (!counts) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      if (counts._count.subRecipes > 0 || counts._count.parentRecipes > 0) {
        throw new TRPCError({ code: "CONFLICT" });
      }

      return await ctx.prisma.recipe.delete({
        where: { id: input.id, userId: ctx.session.user.id },
      });
    }),
});
