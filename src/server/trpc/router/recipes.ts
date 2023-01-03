import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { cuidSchema } from "~/schema/common";
import { recipeCreateSchema, recipeUpdateSchema } from "~/schema/recipe";
import { protectedProcedure, router } from "../trpc";

export const recipeRouter = router({
  getAll: protectedProcedure
    .input(z.object({ search: z.string().max(32).optional() }).optional())
    .query(async ({ ctx, input }) => {
      const subRecipesInclude = {
        include: {
          recipe: {
            include: {
              subRecipes: true,
              ingredients: { include: { ingredient: true } },
            },
          },
        },
      };

      const recipes = await ctx.prisma.recipe.findMany({
        include: {
          ingredients: {
            include: { ingredient: true },
          },
          subRecipes: subRecipesInclude,
        },
        where: {
          userId: ctx.session.user.id,
          ...(input?.search && {
            name: { contains: input.search, mode: "insensitive" },
          }),
        },
      });

      const recipesWithPrices = [];
      for (const recipe of recipes) {
        const ingredientsCost = getIngredientsCost(recipe.ingredients);
        const subRecipesCost = await getSubrecipesCost(recipe.subRecipes);
        const cost = ingredientsCost + subRecipesCost;
        const price = cost * (recipe.profitPercentage / 100 + 1);
        recipesWithPrices.push({
          ...recipe,
          ingredientsCost,
          subRecipesCost,
          cost,
          price,
        });
      }

      return recipesWithPrices;

      function getIngredientsCost(
        ingredients: typeof recipes[number]["ingredients"]
      ) {
        return ingredients.reduce(
          (ac, ingredient) =>
            ac + ingredient.ingredient.unitPrice * ingredient.units,
          0
        );
      }

      async function getSubrecipesCost(
        subRecipes: typeof recipes[number]["subRecipes"]
      ): Promise<number> {
        let total = 0;
        for (const subRecipe of subRecipes) {
          total += getIngredientsCost(subRecipe.recipe.ingredients);

          if (subRecipe.recipe.subRecipes.length === 0) {
            continue;
          }

          const subrecipeSubrecipes = await ctx.prisma.subRecipe.findMany({
            ...subRecipesInclude,
            where: {
              parentRecipeId: subRecipe.recipe.id,
            },
          });

          total += await getSubrecipesCost(subrecipeSubrecipes);
        }
        return total;
      }
    }),

  create: protectedProcedure
    .input(recipeCreateSchema)
    .mutation(
      async ({
        ctx,
        input: { name, profitPercentage, ingredients, subrecipes },
      }) => {
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
            subRecipes: {
              createMany: {
                data: subrecipes.map(({ subrecipeId, units }) => ({
                  recipeId: subrecipeId,
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
    .mutation(async ({ ctx, input: { subrecipes, ingredients, ...input } }) => {
      return await ctx.prisma.recipe.update({
        data: {
          ...input,
          ingredients: {
            deleteMany: {},
            createMany: {
              data: ingredients.map(({ ingredientId, units }) => ({
                ingredientId,
                units,
              })),
            },
          },
          subRecipes: {
            deleteMany: {},
            createMany: {
              data: subrecipes.map(({ subrecipeId, units }) => ({
                recipeId: subrecipeId,
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

      if (counts._count.parentRecipes > 0) {
        throw new TRPCError({ code: "CONFLICT" });
      }

      return await ctx.prisma.recipe.delete({
        where: { id: input.id, userId: ctx.session.user.id },
      });
    }),
});
