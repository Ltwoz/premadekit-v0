"use client";

import {
  Sidebar,
  SidebarHeader,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { TeamSwitcher } from "./team-switcher";
import { pathsConfig } from "@/config/paths";
import { useRouter } from "next/navigation";

type teamsModel = {
  label: string | null;
  value: string | null;
  pictureUrl: string | null;
};

interface TeamSidebarProps {
  team: string;
  teams: teamsModel[];
}

export function TeamSidebar({ team, teams }: TeamSidebarProps) {
  const router = useRouter();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex justify-between items-center w-full">
            <TeamSwitcher
              teams={teams}
              selectedTeam={team}
              onTeamChange={(value) => {
                const path = value
                  ? pathsConfig.app.teamDashboard.replace('[team]', value)
                  : pathsConfig.app.teamDashboard;
        
                router.replace(path);
              }}
            />
          </div>
        </SidebarHeader>
      </Sidebar>
    </SidebarProvider>
  );
}
