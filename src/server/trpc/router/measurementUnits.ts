import { protectedProcedure, router } from "../trpc";

export const measurementUnitRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.measurementUnit.findMany();
  }),
});
