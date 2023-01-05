import type { PrismaClient } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { cuidSchema } from "~/schema/common";
import { recipeCreateSchema, recipeUpdateSchema } from "~/schema/recipe";
import { protectedProcedure, router } from "../trpc";

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

const recipesQuery = Prisma.validator<Prisma.RecipeArgs>()({
  include: {
    ingredients: {
      include: { ingredient: true },
    },
    subRecipes: subRecipesInclude,
  },
});

type RecipeIngredients = Prisma.RecipeGetPayload<
  typeof recipesQuery
>["ingredients"];
type RecipeSubrecipes = Prisma.RecipeGetPayload<
  typeof recipesQuery
>["subRecipes"];

function getIngredientsCost(ingredients: RecipeIngredients) {
  return ingredients.reduce(
    (ac, ingredient) => ac + ingredient.ingredient.unitPrice * ingredient.units,
    0
  );
}

async function getSubrecipesCost(
  subRecipes: RecipeSubrecipes,
  prisma: PrismaClient
): Promise<number> {
  let total = 0;
  for (const subRecipe of subRecipes) {
    total += getIngredientsCost(subRecipe.recipe.ingredients);

    if (subRecipe.recipe.subRecipes.length === 0) {
      continue;
    }

    const subrecipeSubrecipes = await prisma.subRecipe.findMany({
      ...subRecipesInclude,
      where: {
        parentRecipeId: subRecipe.recipe.id,
      },
    });

    total += await getSubrecipesCost(subrecipeSubrecipes, prisma);
  }
  return total;
}

export const recipeRouter = router({
  getAll: protectedProcedure
    .input(z.object({ search: z.string().max(32).optional() }).optional())
    .query(async ({ ctx, input }) => {
      const recipes = await ctx.prisma.recipe.findMany({
        ...recipesQuery,
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
        const subRecipesCost = await getSubrecipesCost(
          recipe.subRecipes,
          ctx.prisma
        );
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

  getById: protectedProcedure
    .input(z.object({ recipeId: cuidSchema }))
    .query(async ({ ctx, input }) => {
      const recipe = await ctx.prisma.recipe.findUnique({
        include: {
          ingredients: {
            include: { ingredient: { include: { measurementUnit: true } } },
          },
          subRecipes: subRecipesInclude,
        },
        where: { id: input.recipeId, userId: ctx.session.user.id },
      });

      if (!recipe) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const ingredients = recipe.ingredients.map((ingredient) => ({
        ...ingredient,
        cost: ingredient.ingredient.unitPrice * ingredient.units,
      }));

      const subRecipes = [];
      for (const subrecipe of recipe.subRecipes) {
        subRecipes.push({
          ...subrecipe,
          cost: await getSubrecipesCost([subrecipe], ctx.prisma),
        });
      }

      const totalCost =
        ingredients.reduce((ac, ingredient) => ac + ingredient.cost, 0) +
        subRecipes.reduce((ac, subrecipe) => ac + subrecipe.cost, 0);

      const price = totalCost * (recipe.profitPercentage / 100 + 1);

      const netIncome = price - totalCost;
      return {
        ...recipe,
        ingredients,
        subRecipes,
        totalCost,
        price,
        netIncome,
      };
    }),
});
