import { sql } from "drizzle-orm";
import { getDb } from "./db";

/** Returns readiness for Railway without exposing connection details or secrets. */
export async function isDatabaseHealthy(): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    await db.execute(sql`SELECT 1`);
    const requiredTables = ["users", "bookings", "booking_events", "staff_credentials"];
    for (const tableName of requiredTables) {
      const result = await db.execute(sql`
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = DATABASE()
          AND table_name = ${tableName}
        LIMIT 1
      `);
      const rows = Array.isArray(result) ? result[0] : result;
      if (!Array.isArray(rows) || rows.length === 0) return false;
    }
    return true;
  } catch {
    console.error("[Health] Database readiness check failed");
    return false;
  }
}
