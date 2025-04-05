import { DefaultSession } from "next-auth";
import type { User as DefaultUser } from "next-auth";
import type { DefaultJWT, JWT as defaultJWT } from "next-auth/jwt";

import { users } from "@/lib/db/schema/auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: (typeof users.$inferSelect)["id"];
      isSuperAdmin: (typeof users.$inferSelect)["isSuperAdmin"];
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: (typeof users.$inferSelect)["id"];
    isSuperAdmin: (typeof users.$inferSelect)["isSuperAdmin"];
  }
}

declare module "next-auth/jwt" {
  interface JWT extends defaultJWT {
    id: (typeof users.$inferSelect)["id"];
    isSuperAdmin: (typeof users.$inferSelect)["isSuperAdmin"];
  }
}
