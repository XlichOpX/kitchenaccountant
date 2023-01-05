import { z } from "zod";

export const settingsUpdateSchema = z.object({
  currencySymbol: z.string().min(1).max(4),
});
