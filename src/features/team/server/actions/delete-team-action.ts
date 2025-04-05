"use server";

import { db } from "@/lib/db";
import { getCurrentSession } from "@/lib/auth/session";
import { teams } from "@/lib/db/schema/team";
import { count, eq } from "drizzle-orm";
import { cookies } from "next/headers";

export async function deleteTeamAction({ teamId }: { teamId: string }) {
  const user = await getCurrentSession();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  await assertUserPermission({ userId: user.id, teamId });

  const [userTeamCount] = await db
    .select({ count: count() })
    .from(teams)
    .where(eq(teams.ownerId, user.id));

  if (userTeamCount.count <= 1) {
    return { success: false, error: "You cannot delete your last team." };
  }

  await db.delete(teams).where(eq(teams.id, teamId));

  (await cookies()).set("teamCache", "", {
    path: "/",
    maxAge: 0,
  });

  return { success: true };
}

async function assertUserPermission({
  userId,
  teamId,
}: {
  userId: string;
  teamId: string;
}) {
  const data = await db.query.teams.findFirst({
    where: (teams, { and, eq }) =>
      and(eq(teams.id, teamId), eq(teams.ownerId, userId)),
  });

  if (!data) {
    return { success: false, error: "Team not found or permission denied" };
  }
}
