import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Members table for storing member information
 */
export const members = mysqlTable("members", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  companyName: varchar("companyName", { length: 200 }).notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  message: text("message").notNull(),
  photoUrl: varchar("photoUrl", { length: 500 }),
  category: varchar("category", { length: 50 }).notNull(),
  committee: varchar("committee", { length: 50 }),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Member = typeof members.$inferSelect;
export type InsertMember = typeof members.$inferInsert;

/**
 * Officers table for storing officer information
 */
export const officers = mysqlTable("officers", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  companyName: varchar("companyName", { length: 200 }).notNull(),
  position: varchar("position", { length: 100 }).notNull(), // 役職（会長、専任幹事、事務長、理事、相談役、委員長、副委員長、各委員会委員長）
  committee: varchar("committee", { length: 50 }), // 所属委員会（委員会委員長の場合のみ）
  message: text("message"),
  photoUrl: varchar("photoUrl", { length: 500 }),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Officer = typeof officers.$inferSelect;
export type InsertOfficer = typeof officers.$inferInsert;

/**
 * Seminars table for storing morning seminar schedule
 */
export const seminars = mysqlTable("seminars", {
  id: int("id").autoincrement().primaryKey(),
  date: varchar("date", { length: 10 }).notNull(), // YYYY-MM-DD形式
  time: varchar("time", { length: 20 }).notNull(), // 例: "朝6:00〜7:00"
  speaker: varchar("speaker", { length: 200 }).notNull(), // 講師名
  theme: varchar("theme", { length: 300 }).notNull(), // テーマ
  venue: varchar("venue", { length: 300 }).notNull(), // 会場
  description: text("description"), // 説明（任意）
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Seminar = typeof seminars.$inferSelect;
export type InsertSeminar = typeof seminars.$inferInsert;
/**
 * Blog posts table for storing blog articles
 */
export const blogPosts = mysqlTable("blogPosts", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 300 }).notNull(),
  slug: varchar("slug", { length: 300 }).notNull().unique(), // URL用のスラッグ
  content: text("content").notNull(), // Markdown形式の本文
  excerpt: text("excerpt"), // 抜粋（一覧表示用）
  category: varchar("category", { length: 50 }).notNull(), // カテゴリー（活動報告、お知らせ、イベント、その他）
  tags: text("tags"), // タグ（カンマ区切り）
  thumbnailUrl: varchar("thumbnailUrl", { length: 500 }), // サムネイル画像URL
  status: mysqlEnum("status", ["draft", "published"]).default("draft").notNull(), // 公開ステータス
  publishedAt: timestamp("publishedAt"), // 公開日時
  authorId: int("authorId"), // 投稿者ID（usersテーブルへの参照）
  viewCount: int("viewCount").default(0).notNull(), // 閲覧数
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;

/**
 * Contacts table for storing contact form submissions
 */
export const contacts = mysqlTable("contacts", {
  id: int("id").autoincrement().primaryKey(),
  type: mysqlEnum("type", ["contact", "seminar_application"]).notNull(), // 問い合わせ種別（一般問い合わせ、セミナー申込）
  name: varchar("name", { length: 100 }).notNull(), // 氏名
  email: varchar("email", { length: 320 }).notNull(), // メールアドレス
  phone: varchar("phone", { length: 20 }), // 電話番号
  companyName: varchar("companyName", { length: 200 }), // 会社名
  message: text("message").notNull(), // メッセージ内容
  status: mysqlEnum("status", ["pending", "in_progress", "completed"]).default("pending").notNull(), // ステータス（未対応、対応中、完了）
  reply: text("reply"), // 返信内容
  repliedAt: timestamp("repliedAt"), // 返信日時
  repliedBy: int("repliedBy"), // 返信者ID（usersテーブルへの参照）
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Contact = typeof contacts.$inferSelect;
export type InsertContact = typeof contacts.$inferInsert;
