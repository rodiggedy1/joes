import { sql } from "drizzle-orm";
import { getDb } from "./db";

/** Returns readiness for Railway without exposing connection details or secrets. */
export async function isDatabaseHealthy(): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    await db.execute(sql`SELECT 1`);
    return true;
  } catch {
    console.error("[Health] Database readiness check failed");
    return false;
  }
}
