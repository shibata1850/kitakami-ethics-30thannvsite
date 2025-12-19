import { describe, it, expect, beforeAll, afterAll } from "vitest";
import * as db from "./db";

describe("Officers CRUD", () => {
  let testOfficerId: number;

  beforeAll(async () => {
    // Clean up any existing test data
    const officers = await db.getAllOfficers();
    for (const officer of officers) {
      if (officer.name === "テスト会長") {
        await db.deleteOfficer(officer.id);
      }
    }
  });

  afterAll(async () => {
    // Clean up test data
    if (testOfficerId && testOfficerId > 0) {
      try {
        await db.deleteOfficer(testOfficerId);
      } catch (error) {
        // Ignore errors during cleanup
      }
    }
  });

  it("should create a new officer", async () => {
    const result = await db.createOfficer({
      name: "テスト会長",
      companyName: "テスト株式会社",
      position: "会長",
      message: "テストメッセージです。",
      sortOrder: 0,
    });

    expect(result).toHaveProperty("id");
    expect(typeof result.id).toBe("number");
    testOfficerId = result.id;
  });

  it("should get all officers", async () => {
    const officers = await db.getAllOfficers();
    expect(Array.isArray(officers)).toBe(true);
    expect(officers.length).toBeGreaterThan(0);
  });

  it("should get officer by ID", async () => {
    const officer = await db.getOfficerById(testOfficerId);
    expect(officer).toBeTruthy();
    expect(officer?.name).toBe("テスト会長");
    expect(officer?.companyName).toBe("テスト株式会社");
    expect(officer?.position).toBe("会長");
  });

  it("should update officer", async () => {
    await db.updateOfficer(testOfficerId, {
      message: "更新されたメッセージです。",
    });

    const officer = await db.getOfficerById(testOfficerId);
    expect(officer?.message).toBe("更新されたメッセージです。");
  });

  it("should delete officer", async () => {
    const idToDelete = testOfficerId;
    testOfficerId = 0; // Reset before deletion to avoid double deletion in afterAll
    await db.deleteOfficer(idToDelete);
    const officer = await db.getOfficerById(idToDelete);
    expect(officer).toBeNull();
  });

  it("should create officer with committee", async () => {
    const result = await db.createOfficer({
      name: "テスト委員長",
      companyName: "テスト企業",
      position: "会員拡大委員会委員長",
      committee: "会員拡大委員会",
      message: "委員会のテストメッセージ",
      sortOrder: 10,
    });

    expect(result).toHaveProperty("id");
    const officer = await db.getOfficerById(result.id);
    expect(officer?.committee).toBe("会員拡大委員会");

    // Clean up
    await db.deleteOfficer(result.id);
  });

  it("should sort officers by sortOrder", async () => {
    // Create multiple officers with different sortOrder
    const officer1 = await db.createOfficer({
      name: "役員A",
      companyName: "会社A",
      position: "理事",
      sortOrder: 20,
    });

    const officer2 = await db.createOfficer({
      name: "役員B",
      companyName: "会社B",
      position: "理事",
      sortOrder: 10,
    });

    const officers = await db.getAllOfficers();
    const testOfficers = officers.filter(
      (o: any) => o.name === "役員A" || o.name === "役員B"
    );

    expect(testOfficers[0].name).toBe("役員B"); // sortOrder 10 comes first
    expect(testOfficers[1].name).toBe("役員A"); // sortOrder 20 comes second

    // Clean up
    await db.deleteOfficer(officer1.id);
    await db.deleteOfficer(officer2.id);
  });
});
