import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "../trpc";

export const authRouter = router({
  getUserSettings: protectedProcedure.query(async ({ ctx }) => {
    const settings = await ctx.prisma.settings.findUnique({
      where: { userId: ctx.session.user.id },
    });

    if (!settings) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    return settings;
  }),
});
