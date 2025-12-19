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