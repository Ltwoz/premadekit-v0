import { z } from "zod";

export const CheckoutSchema = z.object({
  slug: z.string(),
  teamId: z.string(),
  planId: z.string(),
})