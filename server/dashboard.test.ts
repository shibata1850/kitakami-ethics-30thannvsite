import { describe, it, expect, beforeAll } from "vitest";
import { getDashboardStats } from "./db";

describe("Dashboard Stats", () => {
  beforeAll(async () => {
    // データベースが初期化されるまで待機
    await new Promise((resolve) => setTimeout(resolve, 1000));
  });

  it("should return dashboard statistics", async () => {
    const stats = await getDashboardStats();

    expect(stats).toBeDefined();
    expect(stats).toHaveProperty("memberCount");
    expect(stats).toHaveProperty("contactCount");
    expect(stats).toHaveProperty("pendingContactCount");
    expect(stats).toHaveProperty("upcomingSeminarCount");
    expect(stats).toHaveProperty("blogPostCount");
    expect(stats).toHaveProperty("upcomingSeminars");
    expect(stats).toHaveProperty("recentBlogPosts");
    expect(stats).toHaveProperty("pendingContacts");
  });

  it("should return valid member count", async () => {
    const stats = await getDashboardStats();

    expect(typeof stats.memberCount).toBe("number");
    expect(stats.memberCount).toBeGreaterThanOrEqual(0);
  });

  it("should return valid contact counts", async () => {
    const stats = await getDashboardStats();

    expect(typeof stats.contactCount).toBe("number");
    expect(typeof stats.pendingContactCount).toBe("number");

    expect(stats.contactCount).toBeGreaterThanOrEqual(0);
    expect(stats.pendingContactCount).toBeGreaterThanOrEqual(0);
  });

  it("should return valid seminar count", async () => {
    const stats = await getDashboardStats();

    expect(typeof stats.upcomingSeminarCount).toBe("number");
    expect(stats.upcomingSeminarCount).toBeGreaterThanOrEqual(0);
  });

  it("should return valid blog post count", async () => {
    const stats = await getDashboardStats();

    expect(typeof stats.blogPostCount).toBe("number");
    expect(stats.blogPostCount).toBeGreaterThanOrEqual(0);
  });

  it("should return upcoming seminars as an array", async () => {
    const stats = await getDashboardStats();

    expect(Array.isArray(stats.upcomingSeminars)).toBe(true);
    expect(stats.upcomingSeminars.length).toBeLessThanOrEqual(5);
  });

  it("should return recent blog posts as an array", async () => {
    const stats = await getDashboardStats();

    expect(Array.isArray(stats.recentBlogPosts)).toBe(true);
    expect(stats.recentBlogPosts.length).toBeLessThanOrEqual(5);
  });

  it("should return pending contacts as an array", async () => {
    const stats = await getDashboardStats();

    expect(Array.isArray(stats.pendingContacts)).toBe(true);
    expect(stats.pendingContacts.length).toBeLessThanOrEqual(5);
  });

  it("should have correct structure for upcoming seminars", async () => {
    const stats = await getDashboardStats();

    if (stats.upcomingSeminars.length > 0) {
      const seminar = stats.upcomingSeminars[0];
      expect(seminar).toHaveProperty("id");
      expect(seminar).toHaveProperty("date");
      expect(seminar).toHaveProperty("speakerName");
      expect(seminar).toHaveProperty("theme");
    }
  });

  it("should have correct structure for recent blog posts", async () => {
    const stats = await getDashboardStats();

    if (stats.recentBlogPosts.length > 0) {
      const post = stats.recentBlogPosts[0];
      expect(post).toHaveProperty("id");
      expect(post).toHaveProperty("title");
      expect(post).toHaveProperty("category");
      expect(post).toHaveProperty("publishedAt");
      expect(post).toHaveProperty("status");
    }
  });

  it("should have correct structure for pending contacts", async () => {
    const stats = await getDashboardStats();

    if (stats.pendingContacts.length > 0) {
      const contact = stats.pendingContacts[0];
      expect(contact).toHaveProperty("id");
      expect(contact).toHaveProperty("name");
      expect(contact).toHaveProperty("email");
      expect(contact).toHaveProperty("type");
      expect(contact).toHaveProperty("createdAt");
    }
  });
});
