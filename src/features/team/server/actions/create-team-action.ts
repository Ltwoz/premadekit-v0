"use server";

import { getCurrentSession } from "@/lib/auth/session";
import * as api from "../api";

export async function createTeamAction({ name }: { name: string }) {
  const user = await getCurrentSession();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const data = await api.createTeam({ userId: user.id, name });

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: "Failed to create team. Please try again.",
    };
  }
}
