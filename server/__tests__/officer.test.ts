import { describe, it, expect, beforeEach } from "vitest";
import * as db from "../db";

describe("Officer Management", () => {
  let testOfficerId: number;

  beforeEach(async () => {
    // Clean up test data
    const officers = await db.getAllOfficers();
    for (const officer of officers) {
      if (officer.name.includes("テスト")) {
        await db.deleteOfficer(officer.id);
      }
    }
  });

  it("should create a new officer", async () => {
    const result = await db.createOfficer({
      name: "テスト会長",
      companyName: "テスト株式会社",
      position: "会長",
      message: "テストメッセージ",
      sortOrder: 0,
    });

    expect(result).toBeDefined();
    expect(result.id).toBeGreaterThan(0);

    const newOfficer = await db.getOfficerById(result.id);
    expect(newOfficer).toBeDefined();
    expect(newOfficer?.name).toBe("テスト会長");
    expect(newOfficer?.companyName).toBe("テスト株式会社");
    expect(newOfficer?.position).toBe("会長");

    testOfficerId = result.id;
  });

  it("should get all officers", async () => {
    // Create test officer
    const result = await db.createOfficer({
      name: "テスト副会長",
      companyName: "テスト企業",
      position: "副会長",
      sortOrder: 1,
    });

    const officers = await db.getAllOfficers();
    expect(officers.length).toBeGreaterThan(0);
    expect(officers.some((o) => o.id === result.id)).toBe(true);
  });

  it("should get officer by id", async () => {
    // Create test officer
    const result = await db.createOfficer({
      name: "テスト専任幹事",
      companyName: "テスト会社",
      position: "専任幹事",
      sortOrder: 2,
    });

    const retrieved = await db.getOfficerById(result.id);
    expect(retrieved).toBeDefined();
    expect(retrieved?.name).toBe("テスト専任幹事");
    expect(retrieved?.position).toBe("専任幹事");
  });

  it("should update officer", async () => {
    // Create test officer
    const result = await db.createOfficer({
      name: "テスト理事",
      companyName: "テスト法人",
      position: "理事",
      sortOrder: 3,
    });

    await db.updateOfficer(result.id, {
      name: "更新テスト理事",
      message: "更新されたメッセージ",
    });

    const updated = await db.getOfficerById(result.id);
    expect(updated?.name).toBe("更新テスト理事");
    expect(updated?.message).toBe("更新されたメッセージ");
  });

  it("should delete officer", async () => {
    // Create test officer
    const result = await db.createOfficer({
      name: "テスト相談役",
      companyName: "テスト組織",
      position: "相談役",
      sortOrder: 4,
    });

    await db.deleteOfficer(result.id);

    const deleted = await db.getOfficerById(result.id);
    expect(deleted).toBeNull();
  });

  it("should handle officer with committee", async () => {
    const result = await db.createOfficer({
      name: "テスト委員長",
      companyName: "テスト企業",
      position: "委員長",
      committee: "会員拡大委員会",
      sortOrder: 5,
    });

    const officer = await db.getOfficerById(result.id);
    expect(officer?.committee).toBe("会員拡大委員会");
  });

  it("should handle officer with photo URL", async () => {
    const result = await db.createOfficer({
      name: "テスト事務長",
      companyName: "テスト会社",
      position: "事務長",
      photoUrl: "https://example.com/photo.jpg",
      sortOrder: 6,
    });

    const officer = await db.getOfficerById(result.id);
    expect(officer?.photoUrl).toBe("https://example.com/photo.jpg");
  });

  it("should sort officers by sortOrder", async () => {
    // Create multiple officers with different sortOrder
    await db.createOfficer({
      name: "テスト役員3",
      companyName: "テスト会社3",
      position: "理事",
      sortOrder: 3,
    });

    await db.createOfficer({
      name: "テスト役員1",
      companyName: "テスト会社1",
      position: "会長",
      sortOrder: 1,
    });

    await db.createOfficer({
      name: "テスト役員2",
      companyName: "テスト会社2",
      position: "副会長",
      sortOrder: 2,
    });

    const officers = await db.getAllOfficers();
    const testOfficers = officers.filter((o) => o.name.includes("テスト役員"));

    expect(testOfficers.length).toBe(3);
    expect(testOfficers[0].sortOrder).toBeLessThanOrEqual(testOfficers[1].sortOrder);
    expect(testOfficers[1].sortOrder).toBeLessThanOrEqual(testOfficers[2].sortOrder);
  });

  it("should return null for non-existent officer", async () => {
    const officer = await db.getOfficerById(999999);
    expect(officer).toBeNull();
  });
});
