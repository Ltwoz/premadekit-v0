import { z } from "zod";

const PathsSchema = z.object({
  auth: z.object({
    signIn: z.string().min(1),
    signUp: z.string().min(1),
  }),
  app: z.object({
    teamDashboard: z.string().min(1),
    teamSettings: z.string().min(1),
    teamBilling: z.string().min(1),
    teamMembers: z.string().min(1),
    teamBillingReturn: z.string().min(1),
    invitation: z.string().min(1),
  }),
});

export const pathsConfig = PathsSchema.parse({
  auth: {
    signIn: "/sign-in",
    signUp: "/sign-up",
  },
  app: {
    teamDashboard: "/dashboard/[team]",
    teamSettings: `/dashboard/[team]/settings`,
    teamBilling: `/dashboard/[team]/settings/billing`,
    teamMembers: `/dashboard/[team]/settings/members`,
    teamBillingReturn: `/dashboard/[team]/billing/return`,
    invitation: "/invitation",
  },
} satisfies z.infer<typeof PathsSchema>);