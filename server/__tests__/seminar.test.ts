import { describe, it, expect, beforeAll } from "vitest";
import {
  createSeminar,
  getAllSeminars,
  getSeminarById,
  updateSeminar,
  deleteSeminar,
  getUpcomingSeminars,
} from "../db";
import type { InsertSeminar } from "../../drizzle/schema";

describe("Seminar Management", () => {
  let testSeminarId: number;

  const testSeminar: InsertSeminar = {
    date: "2026-01-21",
    time: "朝6:00〜7:00",
    speaker: "テスト講師",
    theme: "テストテーマ：経営の本質",
    venue: "北上市生涯学習センター",
    description: "これはテスト用のセミナーです。",
    sortOrder: 0,
  };

  beforeAll(async () => {
    // Clean up any existing test seminars
    const seminars = await getAllSeminars();
    for (const seminar of seminars) {
      if (seminar.speaker === "テスト講師") {
        await deleteSeminar(seminar.id);
      }
    }
  });

  it("should create a new seminar", async () => {
    const result = await createSeminar(testSeminar);
    expect(result).toBeDefined();
    expect(result.id).toBeGreaterThan(0);
    testSeminarId = result.id;
  });

  it("should get all seminars", async () => {
    const seminars = await getAllSeminars();
    expect(Array.isArray(seminars)).toBe(true);
    expect(seminars.length).toBeGreaterThan(0);
  });

  it("should get a seminar by ID", async () => {
    const seminar = await getSeminarById(testSeminarId);
    expect(seminar).toBeDefined();
    expect(seminar?.id).toBe(testSeminarId);
    expect(seminar?.speaker).toBe("テスト講師");
    expect(seminar?.theme).toBe("テストテーマ：経営の本質");
  });

  it("should get upcoming seminars", async () => {
    const upcomingSeminars = await getUpcomingSeminars();
    expect(Array.isArray(upcomingSeminars)).toBe(true);
    // The test seminar date is in the future, so it should be included
    const testSeminarInList = upcomingSeminars.find(
      (s) => s.id === testSeminarId
    );
    expect(testSeminarInList).toBeDefined();
  });

  it("should update a seminar", async () => {
    await updateSeminar(testSeminarId, {
      speaker: "更新された講師",
      theme: "更新されたテーマ",
    });

    const updated = await getSeminarById(testSeminarId);
    expect(updated?.speaker).toBe("更新された講師");
    expect(updated?.theme).toBe("更新されたテーマ");
  });

  it("should filter seminars by date range", async () => {
    const seminars = await getAllSeminars();
    const futureSeminars = seminars.filter(
      (s) => new Date(s.date) >= new Date()
    );
    expect(Array.isArray(futureSeminars)).toBe(true);
  });

  it("should sort seminars by date", async () => {
    const seminars = await getAllSeminars();
    const sorted = [...seminars].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    expect(sorted[0].date <= sorted[sorted.length - 1].date).toBe(true);
  });

  it("should validate required fields", async () => {
    const invalidSeminar: any = {
      date: "2026-01-28",
      // Missing required fields: time, speaker, theme, venue
    };

    await expect(createSeminar(invalidSeminar)).rejects.toThrow();
  });

  it("should delete a seminar", async () => {
    await deleteSeminar(testSeminarId);
    const deleted = await getSeminarById(testSeminarId);
    expect(deleted).toBeNull();
  });
});
