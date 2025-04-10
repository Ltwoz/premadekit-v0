import { z } from "zod";

export const BillingPortalSchema = z.object({
  slug: z.string(),
  teamId: z.string(),
})