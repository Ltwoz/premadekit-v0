import NextAuth from "next-auth";
import { Adapter } from "next-auth/adapters";
import Resend from "next-auth/providers/resend";
import Google from "next-auth/providers/google";

import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/lib/db";
import { setupNewUser } from "@/features/team/server/api";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db) as Adapter,
  providers: [
    Resend,
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: { strategy: "jwt" },
  events: {
    async createUser({ user }) {
      await setupNewUser({
        userId: user.id!,
        email: user.email!,
        name: user.name,
      });
    },
  },
  callbacks: {
    async jwt({ token, trigger, session, user }) {
      if (user) {
        const dbUser = await db.query.users.findFirst({
          where: (users, { eq }) => eq(users.id, user.id!),
        });

        if (user?.id) token.id = user.id;
        if (dbUser) token.isSuperAdmin = dbUser.isSuperAdmin;
      }

      if (trigger === "update") {
        return { ...token, ...session.user };
      }

      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.isSuperAdmin = token.isSuperAdmin;

      return session;
    },
  },
});
