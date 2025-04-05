import { z } from "zod";

const reservedNames = [
  "settings",
  "dashboard",
  "profile",
  "account",
  "billing",
];

export const CreateTeamSchema = z.object({
  name: z
    .string({
      description: "The name of the team",
    })
    .nonempty("Team name is required")
    .min(3, { message: "Team name must contain at least 3 characters" })
    .max(50, { message: "Team name is too long" })
    .regex(/^[a-zA-Z0-9-]+$/, { message: "Name can only contain letters, numbers, and hyphens" })
    .refine((name) => !reservedNames.includes(name.toLowerCase()), {
      message: "This name is reserved",
    }),
});
