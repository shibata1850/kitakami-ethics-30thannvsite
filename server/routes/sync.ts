import { Router } from "express";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { attendanceResponses, type InsertAttendanceResponse } from "../../drizzle/schema";

const router = Router();

// API Key for authentication (should be set in environment variables)
const SYNC_API_KEY = process.env.SYNC_API_KEY || "your-sync-api-key-change-this";

// Database connection
let _db: ReturnType<typeof drizzle> | null = null;
let _client: ReturnType<typeof postgres> | null = null;

async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _client = postgres(process.env.DATABASE_URL, {
        max: 1,
        idle_timeout: 20,
        connect_timeout: 10,
        ssl: { rejectUnauthorized: false },
        prepare: false,
      });
      _db = drizzle(_client);
    } catch (error) {
      console.error("[Sync] Failed to connect to database:", error);
      _db = null;
      _client = null;
    }
  }
  return _db;
}

// Middleware to verify API key
function verifyApiKey(req: any, res: any, next: any) {
  const apiKey = req.headers["x-api-key"] || req.query.api_key;

  if (!apiKey || apiKey !== SYNC_API_KEY) {
    console.warn("[Sync] Unauthorized sync attempt");
    return res.status(401).json({ error: "Unauthorized: Invalid API key" });
  }

  next();
}

// Interface for attendance sync data from Base44
interface AttendanceSyncData {
  forms: Array<{
    id: string;
    title: string;
    event_date?: string;
    responses: Array<{
      id: string;
      user_id?: string;
      user_name?: string;
      user_email?: string;
      status: "pending" | "attend" | "absent" | "late";
      response_data?: Record<string, any>;
      responded_at?: string;
    }>;
  }>;
}

/**
 * POST /api/sync/attendance
 * Receives attendance data from Base44 and syncs to local database
 */
router.post("/attendance", verifyApiKey, async (req, res) => {
  try {
    const data: AttendanceSyncData = req.body;

    if (!data || !data.forms || !Array.isArray(data.forms)) {
      return res.status(400).json({ error: "Invalid data format: expected { forms: [...] }" });
    }

    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: "Database not available" });
    }

    let syncedCount = 0;
    let updatedCount = 0;
    let errorCount = 0;

    for (const form of data.forms) {
      for (const response of form.responses) {
        try {
          // Check if response already exists
          const existing = await db
            .select()
            .from(attendanceResponses)
            .where(eq(attendanceResponses.base44ResponseId, response.id))
            .limit(1);

          const responseRecord: InsertAttendanceResponse = {
            base44FormId: form.id,
            base44ResponseId: response.id,
            formTitle: form.title,
            eventDate: form.event_date || null,
            userId: response.user_id || null,
            userName: response.user_name || null,
            userEmail: response.user_email || null,
            status: response.status || "pending",
            responseData: response.response_data ? JSON.stringify(response.response_data) : null,
            respondedAt: response.responded_at ? new Date(response.responded_at) : null,
            syncedAt: new Date(),
          };

          if (existing.length > 0) {
            // Update existing record
            await db
              .update(attendanceResponses)
              .set({
                ...responseRecord,
                updatedAt: new Date(),
              })
              .where(eq(attendanceResponses.base44ResponseId, response.id));
            updatedCount++;
          } else {
            // Insert new record
            await db.insert(attendanceResponses).values(responseRecord);
            syncedCount++;
          }
        } catch (err) {
          console.error(`[Sync] Error syncing response ${response.id}:`, err);
          errorCount++;
        }
      }
    }

    console.log(`[Sync] Attendance sync completed: ${syncedCount} new, ${updatedCount} updated, ${errorCount} errors`);

    res.json({
      success: true,
      message: "Attendance data synced successfully",
      stats: {
        synced: syncedCount,
        updated: updatedCount,
        errors: errorCount,
      },
    });
  } catch (error) {
    console.error("[Sync] Attendance sync error:", error);
    res.status(500).json({ error: "Sync failed", details: String(error) });
  }
});

/**
 * GET /api/sync/attendance/status
 * Returns sync status and latest attendance data
 */
router.get("/attendance/status", verifyApiKey, async (req, res) => {
  try {
    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: "Database not available" });
    }

    const responses = await db
      .select()
      .from(attendanceResponses)
      .orderBy(attendanceResponses.syncedAt);

    res.json({
      success: true,
      count: responses.length,
      lastSync: responses.length > 0 ? responses[responses.length - 1].syncedAt : null,
    });
  } catch (error) {
    console.error("[Sync] Status check error:", error);
    res.status(500).json({ error: "Status check failed" });
  }
});

export default router;
