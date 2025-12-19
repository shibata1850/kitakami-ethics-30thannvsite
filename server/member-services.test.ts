import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createMember, updateMember, getMemberById, deleteMember } from "./db";

describe("Member Services", () => {
  let testMemberId: number;

  beforeAll(async () => {
    // テスト用会員を作成
    const member = await createMember({
      name: "サービステスト太郎",
      companyName: "サービステスト株式会社",
      title: "提供サービステスト",
      message: "提供サービス・商品機能のテストです",
      category: "その他",
      sortOrder: 997,
      services: "税務相談,経営コンサルティング,記帳代行",
    });
    testMemberId = member.id;
  });

  afterAll(async () => {
    // テスト用会員を削除
    if (testMemberId) {
      await deleteMember(testMemberId);
    }
  });

  it("should create member with services", async () => {
    const member = await getMemberById(testMemberId);
    expect(member).toBeDefined();
    expect(member?.services).toBe("税務相談,経営コンサルティング,記帳代行");
  });

  it("should split services by comma", async () => {
    const member = await getMemberById(testMemberId);
    expect(member).toBeDefined();
    const servicesList = member?.services?.split(',');
    expect(servicesList).toHaveLength(3);
    expect(servicesList?.[0]).toBe("税務相談");
    expect(servicesList?.[1]).toBe("経営コンサルティング");
    expect(servicesList?.[2]).toBe("記帳代行");
  });

  it("should update member services", async () => {
    await updateMember(testMemberId, {
      services: "新サービス1,新サービス2",
    });

    const member = await getMemberById(testMemberId);
    expect(member).toBeDefined();
    expect(member?.services).toBe("新サービス1,新サービス2");
  });

  it("should allow optional services", async () => {
    const member = await createMember({
      name: "サービスなし太郎",
      companyName: "サービスなし株式会社",
      title: "サービスなしテスト",
      message: "サービスなしのテストです",
      category: "その他",
      sortOrder: 996,
    });

    expect(member).toBeDefined();
    expect(member.services).toBeNull();

    // クリーンアップ
    await deleteMember(member.id);
  });

  it("should handle services with spaces", async () => {
    const member = await createMember({
      name: "スペーステスト太郎",
      companyName: "スペーステスト株式会社",
      title: "スペーステスト",
      message: "スペースを含むサービスのテストです",
      category: "その他",
      sortOrder: 995,
      services: "サービス A , サービス B , サービス C",
    });

    expect(member).toBeDefined();
    expect(member.services).toBe("サービス A , サービス B , サービス C");
    
    const servicesList = member.services?.split(',');
    expect(servicesList).toHaveLength(3);
    // trim()で前後のスペースを削除することを想定
    expect(servicesList?.[0].trim()).toBe("サービス A");
    expect(servicesList?.[1].trim()).toBe("サービス B");
    expect(servicesList?.[2].trim()).toBe("サービス C");

    // クリーンアップ
    await deleteMember(member.id);
  });

  it("should handle single service", async () => {
    const member = await createMember({
      name: "単一サービステスト太郎",
      companyName: "単一サービステスト株式会社",
      title: "単一サービステスト",
      message: "単一サービスのテストです",
      category: "その他",
      sortOrder: 994,
      services: "単一サービス",
    });

    expect(member).toBeDefined();
    expect(member.services).toBe("単一サービス");
    
    const servicesList = member.services?.split(',');
    expect(servicesList).toHaveLength(1);
    expect(servicesList?.[0]).toBe("単一サービス");

    // クリーンアップ
    await deleteMember(member.id);
  });

  it("should update services to new value", async () => {
    // まずサービスありで作成
    const member = await createMember({
      name: "更新テスト太郎",
      companyName: "更新テスト株式会社",
      title: "更新テスト",
      message: "サービス更新のテストです",
      category: "その他",
      sortOrder: 993,
      services: "サービス1,サービス2",
    });

    // サービスを更新
    await updateMember(member.id, {
      services: "新しいサービスA,新しいサービスB,新しいサービスC",
    });

    const updatedMember = await getMemberById(member.id);
    expect(updatedMember).toBeDefined();
    expect(updatedMember?.services).toBe("新しいサービスA,新しいサービスB,新しいサービスC");

    // クリーンアップ
    await deleteMember(member.id);
  });
});
