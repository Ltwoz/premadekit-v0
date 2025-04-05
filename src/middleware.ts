import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  const url = new URL(req.url);
  const pathname = url.pathname;

  const teamCache = req.cookies.get("teamCache")?.value;

  if (pathname === "/dashboard") {
    let teamId = teamCache;

    if (!teamId) {
      const userTeam = await db.query.teams.findFirst({
        where: (teams, { eq }) => eq(teams.ownerId, session.user.id),
      });

      if (userTeam) {
        teamId = userTeam.id;
      }
    }

    if (teamId) {
      const team = await db.query.teams.findFirst({
        where: (teams, { eq }) => eq(teams.id, teamId),
      });

      if (team) {
        const response = NextResponse.redirect(
          new URL(`/dashboard/${team.slug}`, req.url)
        );

        response.headers.append(
          "Set-Cookie",
          `teamCache=${team.id}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=31536000`
        );

        return response;
      } else {
        const response = NextResponse.redirect(new URL(`/dashboard`, req.url));
        response.headers.append(
          "Set-Cookie",
          `teamCache=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`
        );

        return response;
      }
    }
  }

  const teamSlug = pathname.split("/")[2];

  if (teamSlug) {
    const validTeam = await db.query.teams.findFirst({
      where: (teams, { and, eq }) =>
        and(eq(teams.slug, teamSlug), eq(teams.ownerId, session.user.id)),
    });

    if (!validTeam) {
      return NextResponse.next();
    }

    const response = NextResponse.next();
    response.headers.append(
      "Set-Cookie",
      `teamCache=${validTeam.id}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=31536000`
    );
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/dashboard/:path*",
};
