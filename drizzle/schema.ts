import { integer, pgEnum, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */

// Enums for PostgreSQL
export const roleEnum = pgEnum("role", ["user", "admin"]);
export const userStatusEnum = pgEnum("user_status", ["pending_approval", "active", "suspended"]);
export const statusEnum = pgEnum("status", ["draft", "published"]);
export const contactTypeEnum = pgEnum("contact_type", ["contact", "seminar_application"]);
export const contactStatusEnum = pgEnum("contact_status", ["pending", "in_progress", "completed"]);
export const attendanceEnum = pgEnum("attendance", ["attend", "decline"]);

export const users = pgTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).unique(),
  name: text("name").notNull(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  password: varchar("password", { length: 255 }), // bcrypt hashed password
  companyName: varchar("companyName", { length: 200 }), // 所属会社名
  loginMethod: varchar("loginMethod", { length: 64 }).default("email"),
  role: roleEnum("role").default("user").notNull(),
  status: userStatusEnum("status").default("pending_approval").notNull(), // アカウントステータス
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn"),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * User approvals table for tracking admin approvals
 */
export const userApprovals = pgTable("userApprovals", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("userId").notNull(), // 承認対象のユーザーID
  approvedBy: integer("approvedBy").notNull(), // 承認したアドミンのID
  approvedAt: timestamp("approvedAt").defaultNow().notNull(),
  comment: text("comment"), // 承認時のコメント
});

export type UserApproval = typeof userApprovals.$inferSelect;
export type InsertUserApproval = typeof userApprovals.$inferInsert;

/**
 * Members table for storing member information
 */
export const members = pgTable("members", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 100 }).notNull(),
  companyName: varchar("companyName", { length: 200 }).notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  message: text("message").notNull(),
  photoUrl: varchar("photoUrl", { length: 500 }),
  category: varchar("category", { length: 50 }).notNull(),
  committee: varchar("committee", { length: 50 }),
  websiteUrl: varchar("websiteUrl", { length: 500 }), // 公式ホームページURL
  twitterUrl: varchar("twitterUrl", { length: 500 }), // X (Twitter) URL
  youtubeUrl: varchar("youtubeUrl", { length: 500 }), // YouTube URL
  tiktokUrl: varchar("tiktokUrl", { length: 500 }), // TikTok URL
  instagramUrl: varchar("instagramUrl", { length: 500 }), // Instagram URL
  lineUrl: varchar("lineUrl", { length: 500 }), // LINE URL
  services: text("services"), // 提供サービス・商品（カンマ区切り）
  achievements: text("achievements"), // 活動実績（受賞歴、メディア掲載履歴など）
  sortOrder: integer("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Member = typeof members.$inferSelect;
export type InsertMember = typeof members.$inferInsert;

/**
 * Officers table for storing officer information
 */
export const officers = pgTable("officers", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 100 }).notNull(),
  companyName: varchar("companyName", { length: 200 }).notNull(),
  position: varchar("position", { length: 100 }).notNull(), // 役職（会長、専任幹事、事務長、理事、相談役、委員長、副委員長、各委員会委員長）
  committee: varchar("committee", { length: 50 }), // 所属委員会（委員会委員長の場合のみ）
  message: text("message"),
  photoUrl: varchar("photoUrl", { length: 500 }),
  sortOrder: integer("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Officer = typeof officers.$inferSelect;
export type InsertOfficer = typeof officers.$inferInsert;

/**
 * Seminars table for storing morning seminar schedule
 */
export const seminars = pgTable("seminars", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  date: varchar("date", { length: 10 }).notNull(), // YYYY-MM-DD形式
  time: varchar("time", { length: 20 }).notNull(), // 例: "朝6:00〜7:00"
  speaker: varchar("speaker", { length: 200 }).notNull(), // 講師名
  theme: varchar("theme", { length: 300 }).notNull(), // テーマ
  venue: varchar("venue", { length: 300 }).notNull(), // 会場
  description: text("description"), // 説明（任意）
  sortOrder: integer("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Seminar = typeof seminars.$inferSelect;
export type InsertSeminar = typeof seminars.$inferInsert;

/**
 * Blog posts table for storing blog articles
 */
export const blogPosts = pgTable("blogPosts", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: varchar("title", { length: 300 }).notNull(),
  slug: varchar("slug", { length: 300 }).notNull().unique(), // URL用のスラッグ
  content: text("content").notNull(), // Markdown形式の本文
  excerpt: text("excerpt"), // 抜粋（一覧表示用）
  category: varchar("category", { length: 50 }).notNull(), // カテゴリー（活動報告、お知らせ、イベント、その他）
  tags: text("tags"), // タグ（カンマ区切り）
  thumbnailUrl: varchar("thumbnailUrl", { length: 500 }), // サムネイル画像URL
  status: statusEnum("status").default("draft").notNull(), // 公開ステータス
  publishedAt: timestamp("publishedAt"), // 公開日時
  authorId: integer("authorId"), // 投稿者ID（usersテーブルへの参照）
  viewCount: integer("viewCount").default(0).notNull(), // 閲覧数
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;

/**
 * Contacts table for storing contact form submissions
 */
export const contacts = pgTable("contacts", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  type: contactTypeEnum("type").notNull(), // 問い合わせ種別（一般問い合わせ、セミナー申込）
  name: varchar("name", { length: 100 }).notNull(), // 氏名
  email: varchar("email", { length: 320 }).notNull(), // メールアドレス
  phone: varchar("phone", { length: 20 }), // 電話番号
  companyName: varchar("companyName", { length: 200 }), // 会社名
  message: text("message").notNull(), // メッセージ内容
  status: contactStatusEnum("status").default("pending").notNull(), // ステータス（未対応、対応中、完了）
  reply: text("reply"), // 返信内容
  repliedAt: timestamp("repliedAt"), // 返信日時
  repliedBy: integer("repliedBy"), // 返信者ID（usersテーブルへの参照）
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Contact = typeof contacts.$inferSelect;
export type InsertContact = typeof contacts.$inferInsert;

/**
 * Event RSVPs table for storing 30th anniversary event responses
 */
export const eventRsvps = pgTable("eventRsvps", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  attendance: attendanceEnum("attendance").notNull(), // 出欠（出席、欠席）
  affiliation: varchar("affiliation", { length: 100 }).notNull(), // 所属単会
  position: varchar("position", { length: 100 }), // 役職
  lastName: varchar("lastName", { length: 50 }).notNull(), // 姓
  firstName: varchar("firstName", { length: 50 }).notNull(), // 名
  email: varchar("email", { length: 320 }).notNull(), // メールアドレス
  message: text("message"), // メッセージ
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type EventRsvp = typeof eventRsvps.$inferSelect;
export type InsertEventRsvp = typeof eventRsvps.$inferInsert;
