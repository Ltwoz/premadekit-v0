import { redirect } from "next/navigation";

import { getCurrentSession } from "@/lib/auth/session";
import { loadTeamWorkspace } from "@/features/team/server/team-workspace-loader";
import TeamHeader from "@/features/team/components/team-header";
import { TeamSubHeader } from "@/features/team/components/team-sub-header";

export default async function TeamLayout({
  children,
  params,
}: React.PropsWithChildren<{
  params: Promise<{ team: string }>;
}>) {
  const { team } = await params;
  const user = await getCurrentSession();
  if (!user) redirect("/sign-in");

  const data = await loadTeamWorkspace(team);

  const teams = data?.teams.map((t) => ({
    label: t.name,
    value: t.slug,
    pictureUrl: t.pictureUrl,
  }));

  return (
    <div className="relative min-h-screen">
      <TeamHeader team={team} teams={teams} user={user} />
      <TeamSubHeader team={team} />
      <main className="flex-1 min-h-screen">{children}</main>
    </div>
  );
}
