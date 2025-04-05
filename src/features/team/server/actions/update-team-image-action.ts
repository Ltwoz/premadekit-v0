"use server";

import { eq } from "drizzle-orm";

import { getCurrentSession } from "@/lib/auth/session";
import { teams } from "@/lib/db/schema/team";
import { db } from "@/lib/db";

export async function updateTeamImageAction({
  id,
  fileUrl,
}: {
  id: string;
  fileUrl: string;
}) {
  const user = await getCurrentSession();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const [result] = await db
      .update(teams)
      .set({
        pictureUrl: fileUrl,
      })
      .where(eq(teams.id, id))
      .returning();

    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: "Failed to update team logo. Please try again.",
    };
  }
}
