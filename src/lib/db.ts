import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../db/schema";

const databaseUrl = import.meta.env.DATABASE_URL;
const requiresSsl =
  import.meta.env.DATABASE_SSL === "true" || databaseUrl?.includes("supabase.com");

const normalizeDatabaseUrl = () => {
  if (!databaseUrl) {
    return databaseUrl;
  }

  try {
    const url = new URL(databaseUrl);
    if (requiresSsl) {
      url.searchParams.delete("sslmode");
    }
    return url.toString();
  } catch {
    return databaseUrl;
  }
};

const pool = new Pool({
  connectionString: normalizeDatabaseUrl(),
  ssl: requiresSsl ? { rejectUnauthorized: false } : undefined,
});

export const db = drizzle(pool, { schema });
