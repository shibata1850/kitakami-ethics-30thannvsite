import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createMember, updateMember, getMemberById, deleteMember } from "./db";

describe("Member SNS Links", () => {
  let testMemberId: number;

  beforeAll(async () => {
    // テスト用会員を作成
    const member = await createMember({
      name: "テスト太郎",
      companyName: "テスト株式会社",
      title: "SNSリンクテスト",
      message: "SNSリンク機能のテストです",
      category: "その他",
      sortOrder: 999,
      websiteUrl: "https://example.com",
      twitterUrl: "https://twitter.com/test",
      youtubeUrl: "https://youtube.com/@test",
      tiktokUrl: "https://tiktok.com/@test",
      instagramUrl: "https://instagram.com/test",
      lineUrl: "https://line.me/R/ti/p/@test",
    });
    testMemberId = member.id;
  });

  afterAll(async () => {
    // テスト用会員を削除
    if (testMemberId) {
      await deleteMember(testMemberId);
    }
  });

  it("should create member with website URL", async () => {
    const member = await getMemberById(testMemberId);
    expect(member).toBeDefined();
    expect(member?.websiteUrl).toBe("https://example.com");
  });

  it("should create member with Twitter URL", async () => {
    const member = await getMemberById(testMemberId);
    expect(member).toBeDefined();
    expect(member?.twitterUrl).toBe("https://twitter.com/test");
  });

  it("should create member with YouTube URL", async () => {
    const member = await getMemberById(testMemberId);
    expect(member).toBeDefined();
    expect(member?.youtubeUrl).toBe("https://youtube.com/@test");
  });

  it("should create member with TikTok URL", async () => {
    const member = await getMemberById(testMemberId);
    expect(member).toBeDefined();
    expect(member?.tiktokUrl).toBe("https://tiktok.com/@test");
  });

  it("should create member with Instagram URL", async () => {
    const member = await getMemberById(testMemberId);
    expect(member).toBeDefined();
    expect(member?.instagramUrl).toBe("https://instagram.com/test");
  });

  it("should create member with LINE URL", async () => {
    const member = await getMemberById(testMemberId);
    expect(member).toBeDefined();
    expect(member?.lineUrl).toBe("https://line.me/R/ti/p/@test");
  });

  it("should update member SNS URLs", async () => {
    await updateMember(testMemberId, {
      twitterUrl: "https://twitter.com/updated",
      youtubeUrl: "https://youtube.com/@updated",
    });

    const member = await getMemberById(testMemberId);
    expect(member).toBeDefined();
    expect(member?.twitterUrl).toBe("https://twitter.com/updated");
    expect(member?.youtubeUrl).toBe("https://youtube.com/@updated");
  });

  it("should allow optional SNS URLs", async () => {
    const member = await createMember({
      name: "テスト次郎",
      companyName: "テスト株式会社2",
      title: "SNSなしテスト",
      message: "SNSリンクなしのテストです",
      category: "その他",
      sortOrder: 998,
    });

    expect(member).toBeDefined();
    expect(member.websiteUrl).toBeNull();
    expect(member.twitterUrl).toBeNull();
    expect(member.youtubeUrl).toBeNull();
    expect(member.tiktokUrl).toBeNull();
    expect(member.instagramUrl).toBeNull();
    expect(member.lineUrl).toBeNull();

    // クリーンアップ
    await deleteMember(member.id);
  });

  it("should update member with new SNS URLs", async () => {
    await updateMember(testMemberId, {
      twitterUrl: "https://twitter.com/final",
      youtubeUrl: "https://youtube.com/@final",
    });

    const member = await getMemberById(testMemberId);
    expect(member).toBeDefined();
    expect(member?.twitterUrl).toBe("https://twitter.com/final");
    expect(member?.youtubeUrl).toBe("https://youtube.com/@final");
  });
});
