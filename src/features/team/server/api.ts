import { db } from "@/lib/db";
import { subscriptionItems } from "@/lib/db/schema/billing";
import { memberships, teams } from "@/lib/db/schema/team";
import { generateUniqueSlug, slugify } from "@/lib/generic/slugify";
import { count, eq, sql } from "drizzle-orm";

export async function checkSlug(slug?: string) {
  if (!slug) {
    return true;
  }

  const team = await db.query.teams.findFirst({
    where: (teams, { eq }) => eq(teams.slug, slug),
  });

  return team ? false : true;
}

export async function setupNewUser({
  userId,
  email,
  name,
}: {
  userId: string;
  email: string | null;
  name?: string | null;
}) {
  let username = name;

  if (!username && email) {
    username = email.split("@")[0];
  }

  if (!username) {
    username = "";
  }

  let slug = slugify(username);
  const availableSlug = await checkSlug(slug);

  if (!availableSlug) {
    slug = generateUniqueSlug(username, slug);
  }

  const team = await db.query.teams.findFirst({
    where: (teams, { eq }) => eq(teams.ownerId, userId),
  });

  if (team) {
    return team;
  }

  const result = await db
    .insert(teams)
    .values({
      ownerId: userId,
      name: username,
      slug: slug,
      email: email,
    })
    .returning();

  await addCurrentUserToNewTeam(result[0].id, userId);

  return result;
}

export async function createTeam({
  userId,
  name,
}: {
  userId: string;
  name: string;
}) {
  let slug = slugify(name);
  const availableSlug = await checkSlug(slug);

  if (!availableSlug) {
    slug = generateUniqueSlug(name, slug);
  }

  const [result] = await db
    .insert(teams)
    .values({
      ownerId: userId,
      name,
      slug,
    })
    .returning();

  await addCurrentUserToNewTeam(result.id, userId);

  return result;
}

export async function getTeam(slug: string) {
  const team = await db.query.teams.findFirst({
    where: (teams, { eq }) => eq(teams.slug, slug),
  });

  return team;
}

export async function getTeamById(id: string) {
  const team = await db.query.teams.findFirst({
    where: (teams, { eq }) => eq(teams.id, id),
  });

  return team;
}

export async function getMyTeams(userId: string) {
  const [data] = await db.query.teams.findMany({
    columns: {
      id: true,
      name: true,
      pictureUrl: true,
      slug: true,
    },
    with: {
      memberships: {
        where: (memberships, { eq }) => eq(memberships.userId, userId),
        columns: {
          role: true,
        },
      },
    },
    where: (teams, { inArray }) =>
      inArray(
        teams.id,
        sql`(select team_id from memberships where user_id = ${userId})`
      ),
  });

  if (!data) return null;

  return {
    teams: data,
  };
}

export async function getTeamWorkspace(slug: string, userId: string) {
  try {
    const [teamResult, teamsResult] = await Promise.all([
      db.query.teams.findFirst({
        where: (teams, { eq }) => eq(teams.slug, slug),
        with: {
          memberships: {
            with: {
              role: {
                with: {
                  permissions: true,
                },
              },
            },
            where: (memberships, { eq }) => eq(memberships.userId, userId),
          },
          // subscription: true
        },
      }),
      db.query.teams.findMany({
        columns: {
          id: true,
          name: true,
          pictureUrl: true,
          slug: true,
        },
        with: {
          memberships: {
            where: (memberships, { eq }) => eq(memberships.userId, userId),
            columns: {
              role: true,
            },
          },
        },
        where: (teams, { inArray }) =>
          inArray(
            teams.id,
            sql`(select team_id from memberships where user_id = ${userId})`
          ),
      }),
    ]);

    if (!teamResult) {
      return null;
    }

    if (!teamsResult) {
      return null;
    }

    return {
      team: {
        id: teamResult.id,
        name: teamResult.name,
        pictureUrl: teamResult.pictureUrl,
        slug: teamResult.slug,
        role: teamResult.memberships[0]?.role.name,
        roleHierarchyLevel: teamResult.memberships[0]?.role.hierarchyLevel,
        ownerId: teamResult.ownerId,
        permissions: teamResult.memberships[0]?.role.permissions.map(
          (p) => p.permission
        ),
        // subscriptionStatus: team.subscription?.status,
      },
      teams: teamsResult,
    };
  } catch (error) {
    console.error("Error in getTeamWorkspace:", error);
    throw error;
  }
}

export async function addCurrentUserToNewTeam(teamId: string, userId: string) {
  const role = await db.query.roles.findFirst({
    where: (roles, { eq }) => eq(roles.hierarchyLevel, 1),
  });

  if (!role) {
    throw new Error("Top level role not found");
  }

  await db.insert(memberships).values({
    teamId,
    userId,
    role: role.name,
  });

  return true;
}

export async function getMembersCount(teamId: string) {
  const [data] = await db
    .select({ count: count() })
    .from(memberships)
    .where(eq(teams.id, teamId));

  return data.count;
}