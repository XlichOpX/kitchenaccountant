import { TRPCError } from "@trpc/server";
import { settingsUpdateSchema } from "~/schema/settings";
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

  updateUserSettings: protectedProcedure
    .input(settingsUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.settings.update({
        data: input,
        where: {
          userId: ctx.session.user.id,
        },
      });
    }),
});
