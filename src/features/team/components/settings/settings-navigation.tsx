"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import { SubNavigationMenu } from "@/components/premadekit/sub-navigation-menu";
import { getSettingsRoutes } from "@/config/team-navigation";
import { cn } from "@/lib/utils";

interface SettingsNavigationProps {
  team: string;
}

export function SettingsNavigation({ team }: SettingsNavigationProps) {
  const pathname = usePathname();
  const routes = useMemo(() => getSettingsRoutes(team), [team]);

  const mobileRoutes = routes.flatMap((item) =>
    "children" in item ? item.children : [item]
  );

  return (
    <>
      <div className="hidden lg:flex min-w-[12rem] ml-6">
        <div className="sticky top-16 w-full h-fit space-y-4">
          {routes.map((item) => {
            if ("children" in item) {
              return (
                <div key={item.label} className="space-y-2">
                  <div className="text-xs font-semibold text-muted-foreground px-3">
                    {item.label}
                  </div>
                  <div className="space-y-1">
                    {item.children.map((child) => {
                      const isActive = pathname === child.path;
                      return (
                        <Link
                          key={`${child.label}-${child.path}`}
                          href={child.path}
                          className={cn(
                            "block px-3 py-2 text-sm font-normal rounded hover:bg-muted",
                            isActive
                              ? "text-primary font-medium"
                              : "text-muted-foreground"
                          )}
                        >
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            }

            return null;
          })}
        </div>
      </div>

      <div className="block w-full lg:hidden">
        <SubNavigationMenu routes={mobileRoutes} />
      </div>
    </>
  );
}
