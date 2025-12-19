import { describe, it, expect, beforeAll, afterAll } from "vitest";
import * as db from "./db";

describe("Seminar Management System", () => {
  let testSeminarId = 0;

  // Cleanup function
  const cleanup = async () => {
    if (testSeminarId > 0) {
      try {
        await db.deleteSeminar(testSeminarId);
      } catch (error) {
        // Ignore errors during cleanup
      }
    }
  };

  beforeAll(async () => {
    // Ensure database is available
    const database = await db.getDb();
    expect(database).toBeDefined();
  });

  afterAll(async () => {
    await cleanup();
  });

  it("should create a new seminar", async () => {
    const seminarData = {
      date: "2026-01-15",
      time: "朝6:00〜7:00",
      speaker: "テスト講師",
      theme: "テストテーマ",
      venue: "テスト会場",
      description: "テスト説明",
      sortOrder: 0,
    };

    const result = await db.createSeminar(seminarData);
    expect(result).toHaveProperty("id");
    expect(result.id).toBeGreaterThan(0);
    testSeminarId = result.id;
  });

  it("should get all seminars", async () => {
    const seminars = await db.getAllSeminars();
    expect(Array.isArray(seminars)).toBe(true);
    expect(seminars.length).toBeGreaterThan(0);
  });

  it("should get upcoming seminars", async () => {
    const seminars = await db.getUpcomingSeminars();
    expect(Array.isArray(seminars)).toBe(true);
    // All seminars should have dates >= today
    const today = new Date().toISOString().split('T')[0];
    seminars.forEach((seminar: any) => {
      expect(seminar.date >= today).toBe(true);
    });
  });

  it("should get seminar by ID", async () => {
    const seminar = await db.getSeminarById(testSeminarId);
    expect(seminar).toBeDefined();
    expect(seminar?.id).toBe(testSeminarId);
    expect(seminar?.speaker).toBe("テスト講師");
    expect(seminar?.theme).toBe("テストテーマ");
  });

  it("should update seminar", async () => {
    const updateData = {
      speaker: "更新された講師",
      theme: "更新されたテーマ",
    };

    await db.updateSeminar(testSeminarId, updateData);
    const updated = await db.getSeminarById(testSeminarId);
    expect(updated?.speaker).toBe("更新された講師");
    expect(updated?.theme).toBe("更新されたテーマ");
  });

  it("should delete seminar", async () => {
    await db.deleteSeminar(testSeminarId);
    const deleted = await db.getSeminarById(testSeminarId);
    expect(deleted).toBeNull();
    testSeminarId = 0; // Reset so cleanup doesn't fail
  });
});
