import { describe, it, expect, beforeAll } from "vitest";
import * as db from "./db";

describe("Related Members", () => {
  let testMemberId1: number;
  let testMemberId2: number;
  let testMemberId3: number;

  beforeAll(async () => {
    // Create test members in the same category
    const member1 = await db.createMember({
      name: "テスト太郎",
      companyName: "テスト株式会社",
      title: "代表取締役",
      message: "テストメッセージ",
      category: "製造業",
      committee: "活力朝礼委員会",
      sortOrder: 0,
    });
    testMemberId1 = member1.id;

    const member2 = await db.createMember({
      name: "テスト花子",
      companyName: "テスト工業",
      title: "社長",
      message: "テストメッセージ2",
      category: "製造業",
      committee: "広報委員会",
      sortOrder: 0,
    });
    testMemberId2 = member2.id;

    const member3 = await db.createMember({
      name: "テスト次郎",
      companyName: "テストサービス",
      title: "代表",
      message: "テストメッセージ3",
      category: "サービス業",
      committee: "活力朝礼委員会",
      sortOrder: 0,
    });
    testMemberId3 = member3.id;
  });

  it("should get related members in the same category", async () => {
    const relatedMembers = await db.getRelatedMembers(testMemberId1, 4);
    
    expect(relatedMembers).toBeDefined();
    expect(Array.isArray(relatedMembers)).toBe(true);
    expect(relatedMembers.length).toBeGreaterThan(0);
    
    // Should include member2 (same category) but not member1 (self) or member3 (different category)
    const memberIds = relatedMembers.map((m) => m.id);
    expect(memberIds).toContain(testMemberId2);
    expect(memberIds).not.toContain(testMemberId1);
    expect(memberIds).not.toContain(testMemberId3);
  });

  it("should respect the limit parameter", async () => {
    const relatedMembers = await db.getRelatedMembers(testMemberId1, 1);
    
    expect(relatedMembers).toBeDefined();
    expect(relatedMembers.length).toBeLessThanOrEqual(1);
  });

  it("should return empty array if no related members exist", async () => {
    // Create a member with a unique category
    const uniqueMember = await db.createMember({
      name: "ユニーク太郎",
      companyName: "ユニーク株式会社",
      title: "代表取締役",
      message: "ユニークメッセージ",
      category: "ユニークカテゴリー",
      committee: "活力朝礼委員会",
      sortOrder: 0,
    });

    const relatedMembers = await db.getRelatedMembers(uniqueMember.id, 4);
    
    expect(relatedMembers).toBeDefined();
    expect(Array.isArray(relatedMembers)).toBe(true);
    expect(relatedMembers.length).toBe(0);
  });

  it("should return empty array if member does not exist", async () => {
    const relatedMembers = await db.getRelatedMembers(999999, 4);
    
    expect(relatedMembers).toBeDefined();
    expect(Array.isArray(relatedMembers)).toBe(true);
    expect(relatedMembers.length).toBe(0);
  });
});
