import { eq, like, or, and, desc, asc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, members, type InsertMember, officers, type InsertOfficer, seminars, type InsertSeminar, blogPosts, type InsertBlogPost, contacts, type InsertContact } from "../drizzle/schema";
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

// ========== Officers CRUD ==========

export async function createOfficer(officer: InsertOfficer) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(officers).values(officer);
  return { id: Number((result as any).insertId) };
}

export async function getAllOfficers() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(officers).orderBy(asc(officers.sortOrder));
}

export async function getOfficerById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(officers).where(eq(officers.id, id));
  return result[0] || null;
}

export async function updateOfficer(id: number, data: Partial<InsertOfficer>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(officers).set(data).where(eq(officers.id, id));
  return { id };
}

export async function deleteOfficer(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(officers).where(eq(officers.id, id));
  return { id };
}

// ========== Seminars CRUD ==========

export async function createSeminar(seminar: InsertSeminar) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(seminars).values(seminar);
  const insertId = (result as any)[0]?.insertId || (result as any).insertId;
  return { id: Number(insertId) };
}

export async function getAllSeminars() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(seminars).orderBy(asc(seminars.date), asc(seminars.sortOrder));
}

export async function getUpcomingSeminars() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  return db.select().from(seminars)
    .where(sql`${seminars.date} >= ${today}`)
    .orderBy(asc(seminars.date), asc(seminars.sortOrder));
}

export async function getPastSeminars() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  return db.select().from(seminars)
    .where(sql`${seminars.date} < ${today}`)
    .orderBy(desc(seminars.date), asc(seminars.sortOrder));
}

export async function getSeminarById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(seminars).where(eq(seminars.id, id));
  return result[0] || null;
}

export async function updateSeminar(id: number, data: Partial<InsertSeminar>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(seminars).set(data).where(eq(seminars.id, id));
  return { id };
}

export async function deleteSeminar(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(seminars).where(eq(seminars.id, id));
  return { id };
}

// ========== Blog Posts CRUD ==========

export async function createBlogPost(post: InsertBlogPost) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(blogPosts).values(post);
  const insertId = (result as any)[0]?.insertId || (result as any).insertId;
  return { id: Number(insertId) };
}

export async function getAllBlogPosts() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
}

export async function getPublishedBlogPosts() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(blogPosts)
    .where(eq(blogPosts.status, "published"))
    .orderBy(desc(blogPosts.publishedAt));
}

export async function getBlogPostById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
  return result[0] || null;
}

export async function getBlogPostBySlug(slug: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
  return result[0] || null;
}

export async function updateBlogPost(id: number, data: Partial<InsertBlogPost>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(blogPosts).set(data).where(eq(blogPosts.id, id));
  return { id };
}

export async function deleteBlogPost(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(blogPosts).where(eq(blogPosts.id, id));
  return { id };
}

export interface BlogPostFilterOptions {
  category?: string;
  searchQuery?: string;
  status?: "draft" | "published";
}

export async function getFilteredBlogPosts(options: BlogPostFilterOptions) {
  const db = await getDb();
  if (!db) return [];
  
  let query = db.select().from(blogPosts);

  const conditions = [];

  // Category filter
  if (options.category) {
    conditions.push(eq(blogPosts.category, options.category));
  }

  // Status filter
  if (options.status) {
    conditions.push(eq(blogPosts.status, options.status));
  }

  // Search query (title or content)
  if (options.searchQuery && options.searchQuery.trim()) {
    const searchTerm = `%${options.searchQuery.trim()}%`;
    conditions.push(
      or(
        like(blogPosts.title, searchTerm),
        like(blogPosts.content, searchTerm)
      )!
    );
  }

  // Apply all conditions
  if (conditions.length > 0) {
    query = query.where(and(...conditions)!) as any;
  }

  // Sort by published date or created date
  query = query.orderBy(desc(blogPosts.publishedAt), desc(blogPosts.createdAt)) as any;

  return query;
}

export async function incrementBlogPostViewCount(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(blogPosts)
    .set({ viewCount: sql`${blogPosts.viewCount} + 1` })
    .where(eq(blogPosts.id, id));
  return { id };
}


// ============================================
// Contact Management Functions
// ============================================

export async function createContact(contact: InsertContact) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(contacts).values(contact);
  return { id: Number(result[0].insertId) };
}

export async function getAllContacts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(contacts).orderBy(desc(contacts.createdAt));
}

export async function getContactById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(contacts).where(eq(contacts.id, id));
  return result[0] || null;
}

export async function updateContactStatus(id: number, status: "pending" | "in_progress" | "completed") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(contacts)
    .set({ status, updatedAt: new Date() })
    .where(eq(contacts.id, id));
  return { id };
}

export async function updateContactReply(id: number, reply: string, repliedBy: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(contacts)
    .set({ 
      reply, 
      repliedBy, 
      repliedAt: new Date(),
      status: "completed",
      updatedAt: new Date() 
    })
    .where(eq(contacts.id, id));
  return { id };
}

export async function deleteContact(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(contacts).where(eq(contacts.id, id));
  return { id };
}

export type ContactFilterOptions = {
  type?: "contact" | "seminar_application";
  status?: "pending" | "in_progress" | "completed";
  searchQuery?: string;
};

export async function getFilteredContacts(options: ContactFilterOptions) {
  const db = await getDb();
  if (!db) return [];
  
  let query = db.select().from(contacts);

  const conditions = [];

  // Type filter
  if (options.type) {
    conditions.push(eq(contacts.type, options.type));
  }

  // Status filter
  if (options.status) {
    conditions.push(eq(contacts.status, options.status));
  }

  // Search query (name, email, company, or message)
  if (options.searchQuery && options.searchQuery.trim()) {
    const searchTerm = `%${options.searchQuery.trim()}%`;
    conditions.push(
      or(
        like(contacts.name, searchTerm),
        like(contacts.email, searchTerm),
        like(contacts.companyName, searchTerm),
        like(contacts.message, searchTerm)
      )!
    );
  }

  // Apply all conditions
  if (conditions.length > 0) {
    query = query.where(and(...conditions)!) as any;
  }

  // Sort by created date (newest first)
  query = query.orderBy(desc(contacts.createdAt)) as any;

  return query;
}
