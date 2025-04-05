import { pathsConfig } from "./paths";

function createPath(path: string, team: string) {
  return path.replace("[team]", team);
}

export const getTeamRoutes = (team: string) => [
  {
    label: "Overview",
    path: createPath(pathsConfig.app.teamDashboard, team),
  },
  {
    label: "Settings",
    path: createPath(pathsConfig.app.teamSettings, team),
  },
  {
    label: "Demo",
    path: createPath("/dashboard/[team]/demo", team),
  },
];

export const getSettingsRoutes = (team: string) => [
  {
    label: 'Team',
    children: [
      {
        label: 'General',
        path: createPath(pathsConfig.app.teamSettings, team),
      },
      {
        label: 'Members',
        path: createPath(pathsConfig.app.teamMembers, team),
      },
      {
        label: 'Billing',
        path: createPath(pathsConfig.app.teamBilling, team),
      },
    ]
  },
  {
    label: 'Account',
    children: [
      {
        label: 'Notifications',
        path: createPath("/dashboard/[team]/settings/notifications", team),
      },
    ]
  },
];