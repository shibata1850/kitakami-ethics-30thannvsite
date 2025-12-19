import { describe, it, expect, beforeAll } from "vitest";
import { createMember, getMemberById, deleteMember } from "./db";

describe("会員詳細ページ機能", () => {
  let testMemberId: number;

  beforeAll(async () => {
    // テスト用会員を作成
    const member = await createMember({
      name: "詳細テスト太郎",
      companyName: "詳細テスト株式会社",
      title: "会員詳細ページのテスト",
      message: "これは会員詳細ページ機能のテストです。",
      photoUrl: "https://example.com/photo.jpg",
      category: "その他",
      committee: "会員拡大委員会",
      websiteUrl: "https://example.com",
      twitterUrl: "https://twitter.com/test",
      youtubeUrl: "https://youtube.com/@test",
      services: "テストサービス1,テストサービス2",
      sortOrder: 999,
    });
    testMemberId = member.id;
  });

  it("会員IDで会員情報を取得できる", async () => {
    const member = await getMemberById(testMemberId);
    expect(member).toBeDefined();
    expect(member?.id).toBe(testMemberId);
    expect(member?.name).toBe("詳細テスト太郎");
    expect(member?.companyName).toBe("詳細テスト株式会社");
  });

  it("存在しない会員IDではnullが返される", async () => {
    const member = await getMemberById(999999);
    expect(member).toBeNull();
  });

  it("会員情報にすべてのフィールドが含まれている", async () => {
    const member = await getMemberById(testMemberId);
    expect(member).toBeDefined();
    expect(member?.title).toBe("会員詳細ページのテスト");
    expect(member?.message).toBe("これは会員詳細ページ機能のテストです。");
    expect(member?.photoUrl).toBe("https://example.com/photo.jpg");
    expect(member?.category).toBe("その他");
    expect(member?.committee).toBe("会員拡大委員会");
    expect(member?.websiteUrl).toBe("https://example.com");
    expect(member?.twitterUrl).toBe("https://twitter.com/test");
    expect(member?.youtubeUrl).toBe("https://youtube.com/@test");
    expect(member?.services).toBe("テストサービス1,テストサービス2");
  });

  it("テスト後にテストデータを削除", async () => {
    await deleteMember(testMemberId);
    const member = await getMemberById(testMemberId);
    expect(member).toBeNull();
  });
});
