import { db } from ".";
import { rolePermissions, roles } from "./schema/team";

async function main() {
  await db.insert(roles).values([
    { name: "owner", hierarchyLevel: 1 },
    { name: "member", hierarchyLevel: 2 },
  ]);

  await db.insert(rolePermissions).values([
    { role: "owner", permission: "roles.manage" },
    { role: "owner", permission: "billing.manage" },
    { role: "owner", permission: "settings.manage" },
    { role: "owner", permission: "members.manage" },
    { role: "owner", permission: "invites.manage" },

    { role: "member", permission: "settings.manage" },
    { role: "member", permission: "invites.manage" },
  ]);
}

main();