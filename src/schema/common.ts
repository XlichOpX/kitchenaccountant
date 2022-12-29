import { z } from "zod";

export const cuidSchema = z.string().min(1).max(64);
