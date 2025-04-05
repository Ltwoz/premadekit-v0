import { z } from "zod";
import { CreateTeamSchema } from "./create-team-schema";

export const UpdateTeamSchema = CreateTeamSchema.partial().merge(
  z.object({
    slug: z
      .string()
      .min(3, { message: "Team slug must contain at least 3 characters" })
      .max(50, { message: "Team slug is too long" })
      .regex(/^[a-z0-9-]+$/, { message: "Slug can only contain lowercase letters, numbers, and hyphens" })
      .optional(),
  })
);
