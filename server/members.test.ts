import { describe, it, expect, beforeAll } from "vitest";
import { createMember, getAllMembers, getMemberById, updateMember, deleteMember, getFilteredMembers } from "../server/db";

describe("Members Database Operations", () => {
  let testMemberId: number;

  it("should create a new member", async () => {
    const memberData = {
      name: "テスト太郎",
      companyName: "株式会社テスト",
      title: "倫理法人会での学びと成長",
      message: "倫理法人会に入会してから、経営に対する考え方が大きく変わりました。",
      photoUrl: "https://example.com/photo.jpg",
      category: "製造・ものづくり",
      committee: "会員拡大委員会",
      sortOrder: 0,
    };

    const result = await createMember(memberData);
    expect(result).toBeDefined();
    
    // Get the created member to verify
    const members = await getAllMembers();
    const createdMember = members.find(m => m.name === "テスト太郎");
    expect(createdMember).toBeDefined();
    testMemberId = createdMember!.id;
  });

  it("should get all members", async () => {
    const members = await getAllMembers();
    expect(Array.isArray(members)).toBe(true);
    expect(members.length).toBeGreaterThan(0);
  });

  it("should get member by id", async () => {
    const member = await getMemberById(testMemberId);
    expect(member).toBeDefined();
    expect(member?.name).toBe("テスト太郎");
    expect(member?.companyName).toBe("株式会社テスト");
  });

  it("should update member", async () => {
    await updateMember(testMemberId, {
      title: "更新されたタイトル",
    });

    const updatedMember = await getMemberById(testMemberId);
    expect(updatedMember?.title).toBe("更新されたタイトル");
  });

  it("should filter members by category", async () => {
    const filteredMembers = await getFilteredMembers({
      categories: ["製造・ものづくり"],
    });

    expect(Array.isArray(filteredMembers)).toBe(true);
    expect(filteredMembers.length).toBeGreaterThan(0);
    expect(filteredMembers.every(m => m.category === "製造・ものづくり")).toBe(true);
  });

  it("should filter members by committee", async () => {
    const filteredMembers = await getFilteredMembers({
      committees: ["会員拡大委員会"],
    });

    expect(Array.isArray(filteredMembers)).toBe(true);
    expect(filteredMembers.length).toBeGreaterThan(0);
    expect(filteredMembers.every(m => m.committee === "会員拡大委員会")).toBe(true);
  });

  it("should search members by name", async () => {
    const searchResults = await getFilteredMembers({
      searchQuery: "テスト太郎",
    });

    expect(Array.isArray(searchResults)).toBe(true);
    expect(searchResults.length).toBeGreaterThan(0);
    expect(searchResults.some(m => m.name.includes("テスト太郎"))).toBe(true);
  });

  it("should search members by company name", async () => {
    const searchResults = await getFilteredMembers({
      searchQuery: "テスト",
    });

    expect(Array.isArray(searchResults)).toBe(true);
    expect(searchResults.length).toBeGreaterThan(0);
  });

  it("should sort members by date descending", async () => {
    const members = await getFilteredMembers({
      sortBy: "date_desc",
    });

    expect(Array.isArray(members)).toBe(true);
    if (members.length > 1) {
      const firstDate = new Date(members[0].createdAt).getTime();
      const secondDate = new Date(members[1].createdAt).getTime();
      expect(firstDate).toBeGreaterThanOrEqual(secondDate);
    }
  });

  it("should sort members by date ascending", async () => {
    const members = await getFilteredMembers({
      sortBy: "date_asc",
    });

    expect(Array.isArray(members)).toBe(true);
    if (members.length > 1) {
      const firstDate = new Date(members[0].createdAt).getTime();
      const secondDate = new Date(members[1].createdAt).getTime();
      expect(firstDate).toBeLessThanOrEqual(secondDate);
    }
  });

  it("should delete member", async () => {
    await deleteMember(testMemberId);

    const deletedMember = await getMemberById(testMemberId);
    expect(deletedMember).toBeNull();
  });
});
