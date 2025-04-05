"use client";

import { pathsConfig } from "@/config/paths";
import { useRouter } from "next/navigation";
import { User } from "next-auth";

import { TeamSwitcher } from "./team-switcher";
import { Logo } from "@/components/logo";
import UserAccountDropdown from "./user-account-dropdown";

interface TeamHeaderProps {
  team: string;
  teams: Array<{
    label: string | null;
    value: string | null;
    pictureUrl: string | null;
  }>;
  user: User;
}

export default function TeamHeader({ team, teams, user }: TeamHeaderProps) {
  const router = useRouter();

  return (
    <header className="flex items-center h-16 px-4 lg:px-6 relative bg-white">
      <Logo href="/dashboard" />
      <nav className="flex flex-1 items-center justify-between md:pl-4 gap-6">
        <div className="flex items-center gap-4">
          <span className="text-xl text-muted-foreground">/</span>
          <TeamSwitcher
            teams={teams}
            selectedTeam={team}
            onTeamChange={(value) => {
              const path = value
                ? pathsConfig.app.teamDashboard.replace("[team]", value)
                : pathsConfig.app.teamDashboard;

              router.replace(path);
            }}
          />
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <UserAccountDropdown user={user} />
          </div>
        </div>
      </nav>
    </header>
  );
}
