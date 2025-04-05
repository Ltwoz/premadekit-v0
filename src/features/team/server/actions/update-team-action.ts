"use server";

import { eq } from "drizzle-orm";

import * as api from "../api";
import { getCurrentSession } from "@/lib/auth/session";
import { teams } from "@/lib/db/schema/team";
import { db } from "@/lib/db";

export async function updateTeamAction({
  id,
  name,
  slug,
}: {
  id: string;
  name?: string;
  slug?: string;
}) {
  const user = await getCurrentSession();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    if (slug) {
      const availableSlug = await api.checkSlug(slug);

      if (!availableSlug) {
        return { success: false, error: "This slug is already taken." };
      }
    }

    const [result] = await db
      .update(teams)
      .set({
        name,
        slug,
      })
      .where(eq(teams.id, id))
      .returning();

    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: "Failed to update team. Please try again.",
    };
  }
}
