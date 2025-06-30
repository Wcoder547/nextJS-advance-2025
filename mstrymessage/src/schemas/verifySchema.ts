import { z } from "zod";

export const verifySchema = z.object({
  code: z.string().length(6, "Verfication code must be at-least 6 digits"),
});
