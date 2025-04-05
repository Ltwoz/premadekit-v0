"use client";

import { useMemo } from "react";

import { SubNavigationMenu } from "@/components/premadekit/sub-navigation-menu";
import { getTeamRoutes } from "@/config/team-navigation";

interface TeamSubHeaderProps {
  team: string;
}

export function TeamSubHeader({ team }: TeamSubHeaderProps) {
  const routes = useMemo(() => getTeamRoutes(team), [team]);

  return (
    <>
      <SubNavigationMenu routes={routes} />
    </>
  );
}
