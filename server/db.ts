import { eq, like, or, and, desc, asc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, members, type InsertMember } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Member database helpers
 */

export async function getAllMembers() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(members).orderBy(desc(members.createdAt));
}

export async function getMemberById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(members).where(eq(members.id, id)).limit(1);
  return result[0] || null;
}

export async function createMember(data: InsertMember) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(members).values(data);
  return result;
}

export async function updateMember(id: number, data: Partial<InsertMember>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.update(members).set(data).where(eq(members.id, id));
  return result;
}

export async function deleteMember(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.delete(members).where(eq(members.id, id));
  return result;
}

export interface MemberFilterOptions {
  categories?: string[];
  committees?: string[];
  searchQuery?: string;
  sortBy?: "random" | "date_desc" | "date_asc";
}

export async function getFilteredMembers(options: MemberFilterOptions) {
  const db = await getDb();
  if (!db) return [];
  
  let query = db.select().from(members);

  const conditions = [];

  // Category filter
  if (options.categories && options.categories.length > 0) {
    conditions.push(
      or(...options.categories.map(cat => eq(members.category, cat)))!
    );
  }

  // Committee filter
  if (options.committees && options.committees.length > 0) {
    conditions.push(
      or(...options.committees.map(com => eq(members.committee, com)))!
    );
  }

  // Search query (name or company name)
  if (options.searchQuery && options.searchQuery.trim()) {
    const searchTerm = `%${options.searchQuery.trim()}%`;
    conditions.push(
      or(
        like(members.name, searchTerm),
        like(members.companyName, searchTerm)
      )!
    );
  }

  // Apply all conditions
  if (conditions.length > 0) {
    query = query.where(and(...conditions)!) as any;
  }

  // Sorting
  switch (options.sortBy) {
    case "date_desc":
      query = query.orderBy(desc(members.createdAt)) as any;
      break;
    case "date_asc":
      query = query.orderBy(asc(members.createdAt)) as any;
      break;
    case "random":
      query = query.orderBy(sql`RAND()`) as any;
      break;
    default:
      query = query.orderBy(desc(members.createdAt)) as any;
  }

  return query;
}
