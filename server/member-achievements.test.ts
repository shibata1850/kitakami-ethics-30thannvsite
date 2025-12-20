import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createMember, updateMember, getMemberById, deleteMember } from "./db";

describe("会員活動実績機能", () => {
  let testMemberId: number;

  beforeAll(async () => {
    // テスト用の会員を作成
    const member = await createMember({
      name: "テスト太郎",
      companyName: "テスト株式会社",
      title: "活動実績テスト",
      message: "活動実績機能のテストです",
      category: "その他",
      sortOrder: 999,
    });
    testMemberId = member.id;
  });

  afterAll(async () => {
    // テスト用の会員を削除
    if (testMemberId) {
      await deleteMember(testMemberId);
    }
  });

  it("活動実績を設定できる", async () => {
    await updateMember(testMemberId, {
      achievements: "2023年 優良企業賞受賞\n2024年 テレビ出演",
    });

    const member = await getMemberById(testMemberId);
    expect(member).toBeDefined();
    expect(member?.achievements).toBe("2023年 優良企業賞受賞\n2024年 テレビ出演");
  });

  it("活動実績を更新できる", async () => {
    await updateMember(testMemberId, {
      achievements: "2023年 優良企業賞受賞\n2024年 テレビ出演\n2025年 講演実績",
    });

    const member = await getMemberById(testMemberId);
    expect(member).toBeDefined();
    expect(member?.achievements).toBe(
      "2023年 優良企業賞受賞\n2024年 テレビ出演\n2025年 講演実績"
    );
  });

  it("活動実績をnullに設定できる", async () => {
    await updateMember(testMemberId, {
      achievements: null,
    });

    const member = await getMemberById(testMemberId);
    expect(member).toBeDefined();
    expect(member?.achievements).toBeNull();
  });

  it("活動実績が設定されていない会員を取得できる", async () => {
    const member = await getMemberById(testMemberId);
    expect(member).toBeDefined();
    expect(member?.achievements).toBeNull();
  });
});
