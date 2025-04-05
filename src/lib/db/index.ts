import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";

import * as auth from "./schema/auth";
import * as subscription from "./schema/billing";
import * as team from "./schema/team";

export const schema = { ...auth, ...subscription, ...team };

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});
export const db = drizzle(pool, { schema });
