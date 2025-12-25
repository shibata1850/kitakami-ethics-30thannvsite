import { eq, like, or, and, desc, asc, sql, gte, not } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { InsertUser, users, members, type InsertMember, officers, type InsertOfficer, seminars, type InsertSeminar, blogPosts, type InsertBlogPost, contacts, type InsertContact, eventRsvps, userApprovals } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;
let _client: ReturnType<typeof postgres> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      console.log("[Database] Initializing connection...");
      // Configure for serverless environment
      _client = postgres(process.env.DATABASE_URL, {
        max: 1, // Single connection for serverless
        idle_timeout: 20, // Close idle connections after 20 seconds
        connect_timeout: 10, // Connection timeout in seconds
        ssl: { rejectUnauthorized: false }, // Supabase SSL configuration
        prepare: false, // Disable prepared statements for serverless
      });
      _db = drizzle(_client);
      console.log("[Database] Connection initialized successfully");
    } catch (error) {
      console.error("[Database] Failed to connect:", error);
      _db = null;
      _client = null;
    }
  }
  if (!process.env.DATABASE_URL) {
    console.warn("[Database] DATABASE_URL environment variable is not set");
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId && !user.email) {
    throw new Error("User openId or email is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      name: user.name || '',
      email: user.email || '',
      openId: user.openId || null,
      password: user.password || null,
      companyName: user.companyName || null,
      loginMethod: user.loginMethod || 'email',
      role: user.role || 'user',
      status: user.status || 'pending_approval',
    };
    const updateSet: Record<string, unknown> = {};

    if (user.name) updateSet.name = user.name;
    if (user.email) updateSet.email = user.email;
    if (user.loginMethod) updateSet.loginMethod = user.loginMethod;
    if (user.companyName) updateSet.companyName = user.companyName;
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
      values.status = 'active';
      updateSet.status = 'active';
    }
    if (user.status !== undefined) {
      values.status = user.status;
      updateSet.status = user.status;
    }

    if (!values.lastSignedIn && user.openId) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0 && user.openId) {
      updateSet.lastSignedIn = new Date();
    }

    // OAuth users use openId, email/password users use email
    const conflictTarget = user.openId ? users.openId : users.email;
    await db.insert(users).values(values).onConflictDoUpdate({
      target: conflictTarget,
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

/**
 * Create a new user (for email/password registration)
 * Unlike upsertUser, this function is designed for new user creation only
 */
export async function createUser(user: {
  name: string;
  email: string;
  password: string;
  companyName?: string | null;
  loginMethod?: string;
  role?: 'user' | 'admin';
  status?: 'pending_approval' | 'active' | 'suspended';
}): Promise<{ id: number }> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    const result = await db.insert(users).values({
      name: user.name,
      email: user.email,
      password: user.password,
      companyName: user.companyName || null,
      loginMethod: user.loginMethod || 'email',
      role: user.role || 'user',
      status: user.status || 'pending_approval',
    }).returning({ id: users.id });

    return result[0];
  } catch (error) {
    console.error("[Database] Failed to create user:", error);
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
 * Update user's lastSignedIn timestamp
 */
export async function updateLastSignedIn(userId: number): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update lastSignedIn: database not available");
    return;
  }

  try {
    await db.update(users)
      .set({ lastSignedIn: new Date(), updatedAt: new Date() })
      .where(eq(users.id, userId));
  } catch (error) {
    console.error("[Database] Failed to update lastSignedIn:", error);
  }
}

/**
 * Member database helpers
 */

export async function getAllMembers() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(members).orderBy(asc(members.sortOrder), desc(members.createdAt));
}

export async function getMemberById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(members).where(eq(members.id, id)).limit(1);
  return result[0] || null;
}

export async function getRelatedMembers(id: number, limit: number = 4) {
  const db = await getDb();
  if (!db) return [];
  
  // First get the current member's category
  const currentMember = await getMemberById(id);
  if (!currentMember) return [];
  
  // Get other members in the same category
  const result = await db
    .select()
    .from(members)
    .where(and(eq(members.category, currentMember.category), not(eq(members.id, id))))
    .limit(limit);
  
  return result;
}

export async function createMember(data: InsertMember) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(members).values(data).returning();
  return result[0];
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
  try {
    const db = await getDb();
    if (!db) {
      console.warn("[Database] getFilteredMembers: Database not available");
      return [];
    }

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
        query = query.orderBy(sql`RANDOM()`) as any;
        break;
      default:
        query = query.orderBy(desc(members.createdAt)) as any;
    }

    const result = await query;
    console.log(`[Database] getFilteredMembers: Retrieved ${result.length} members`);
    return result;
  } catch (error) {
    console.error("[Database] getFilteredMembers error:", error);
    throw error; // Re-throw so tRPC can handle it properly
  }
}

// ========== Officers CRUD ==========

export async function createOfficer(officer: InsertOfficer) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(officers).values(officer).returning({ id: officers.id });
  return result[0];
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
  const result = await db.insert(seminars).values(seminar).returning({ id: seminars.id });
  return result[0];
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
  const result = await db.insert(blogPosts).values(post).returning({ id: blogPosts.id });
  return result[0];
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
  const result = await db.insert(contacts).values(contact).returning({ id: contacts.id });
  return result[0];
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


// ===== Dashboard Stats =====

export async function getDashboardStats() {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const now = new Date();

  // 会員数
  const memberCount = await db.select({ count: sql<number>`count(*)` }).from(members);

  // 問い合わせ件数
  const contactCount = await db.select({ count: sql<number>`count(*)` }).from(contacts);
  const pendingContactCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(contacts)
    .where(eq(contacts.status, "pending"));

  // 今後のセミナー数
  const upcomingSeminarCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(seminars)
    .where(gte(seminars.date, now.toISOString().split("T")[0]));

  // ブログ記事数
  const blogPostCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(blogPosts)
    .where(eq(blogPosts.status, "published"));

  // 今後のセミナー（最大5件）
  const upcomingSeminars = await db
    .select()
    .from(seminars)
    .where(gte(seminars.date, now.toISOString().split("T")[0]))
    .orderBy(asc(seminars.date))
    .limit(5);

  // 最近のブログ投稿（最大5件）
  const recentBlogPosts = await db
    .select()
    .from(blogPosts)
    .orderBy(desc(blogPosts.publishedAt))
    .limit(5);

  // 未対応の問い合わせ（最大5件）
  const pendingContacts = await db
    .select()
    .from(contacts)
    .where(eq(contacts.status, "pending"))
    .orderBy(desc(contacts.createdAt))
    .limit(5);

  return {
    memberCount: memberCount[0]?.count || 0,
    contactCount: contactCount[0]?.count || 0,
    pendingContactCount: pendingContactCount[0]?.count || 0,
    upcomingSeminarCount: upcomingSeminarCount[0]?.count || 0,
    blogPostCount: blogPostCount[0]?.count || 0,
    upcomingSeminars,
    recentBlogPosts,
    pendingContacts,
  };
}


// ===== Event RSVPs =====

export async function createEventRsvp(data: {
  attendance: "attend" | "decline";
  affiliation: string;
  position?: string;
  lastName: string;
  firstName: string;
  email: string;
  message?: string;
}) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const [rsvp] = await db.insert(eventRsvps).values({
    attendance: data.attendance,
    affiliation: data.affiliation,
    position: data.position || null,
    lastName: data.lastName,
    firstName: data.firstName,
    email: data.email,
    message: data.message || null,
  });

  return rsvp;
}

export async function getFilteredEventRsvps(options: {
  attendance?: "attend" | "decline" | "all";
  affiliation?: string;
  search?: string;
}) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const conditions = [];

  if (options.attendance && options.attendance !== "all") {
    conditions.push(eq(eventRsvps.attendance, options.attendance));
  }

  if (options.affiliation) {
    conditions.push(eq(eventRsvps.affiliation, options.affiliation));
  }

  if (options.search && options.search.trim()) {
    const searchTerm = `%${options.search.trim()}%`;
    conditions.push(
      or(
        like(eventRsvps.lastName, searchTerm),
        like(eventRsvps.firstName, searchTerm),
        like(eventRsvps.email, searchTerm)
      )!
    );
  }

  let query = db.select().from(eventRsvps);

  if (conditions.length > 0) {
    query = query.where(and(...conditions)!) as any;
  }

  query = query.orderBy(desc(eventRsvps.createdAt)) as any;

  return query;
}

export async function getEventRsvpStats() {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const allRsvps = await db.select().from(eventRsvps);

  const attendCount = allRsvps.filter((r) => r.attendance === "attend").length;
  const declineCount = allRsvps.filter((r) => r.attendance === "decline").length;

  // Count by affiliation
  const affiliationCounts: Record<string, { attend: number; decline: number }> = {};
  allRsvps.forEach((rsvp) => {
    if (!affiliationCounts[rsvp.affiliation]) {
      affiliationCounts[rsvp.affiliation] = { attend: 0, decline: 0 };
    }
    if (rsvp.attendance === "attend") {
      affiliationCounts[rsvp.affiliation].attend++;
    } else {
      affiliationCounts[rsvp.affiliation].decline++;
    }
  });

  return {
    total: allRsvps.length,
    attendCount,
    declineCount,
    affiliationCounts,
  };
}

export async function getEventRsvpAffiliations() {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const rsvps = await db
    .selectDistinct({ affiliation: eventRsvps.affiliation })
    .from(eventRsvps)
    .orderBy(eventRsvps.affiliation);

  return rsvps.map((r) => r.affiliation);
}

export async function deleteEventRsvp(id: number) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db.delete(eventRsvps).where(eq(eventRsvps.id, id));
  return { success: true };
}

// ========== Authentication Helpers ==========

export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result[0] || null;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result[0] || null;
}

export async function getPendingApprovalUsers() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(users).where(eq(users.status, 'pending_approval')).orderBy(desc(users.createdAt));
}

export async function getAdminUsers() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(users).where(and(eq(users.role, 'admin'), eq(users.status, 'active')));
}

export async function approveUser(userId: number, approvedBy: number, comment?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Update user status to active
  await db.update(users).set({ status: 'active' }).where(eq(users.id, userId));
  
  // Record approval
  await db.insert(userApprovals).values({
    userId,
    approvedBy,
    comment: comment || null,
  });
  
  return { success: true };
}

export async function getUserApprovals(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(userApprovals).where(eq(userApprovals.userId, userId));
}
