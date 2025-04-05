import "server-only";

import { cache } from "react";
import { notFound, redirect } from "next/navigation";

import { getCurrentSession } from "@/lib/auth/session";
import * as api from "./api";

export const loadTeamWorkspace = cache(workspaceLoader);

async function workspaceLoader(teamSlug: string) {
  const user = await getCurrentSession();

  if (!user) redirect("/sign-in");

  const workspace = await api.getTeamWorkspace(teamSlug, user?.id);

  if (!workspace) {
    notFound();
  }

  return workspace;
}
