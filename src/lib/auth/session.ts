import "server-only";

import { cache } from "react";

import { auth } from ".";

export const getCurrentSession = cache(
  async () => {
    const session = await auth();

    if (!session?.user) {
      return undefined;
    }

    return session.user;
  }
);
