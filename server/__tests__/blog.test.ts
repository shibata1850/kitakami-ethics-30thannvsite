import { describe, it, expect, beforeAll } from "vitest";
import { appRouter } from "../routers";
import * as db from "../db";

describe("Blog Posts API", () => {
  let testPostId: number;

  beforeAll(async () => {
    // Clean up any existing test posts
    const existingPosts = await db.getAllBlogPosts();
    for (const post of existingPosts) {
      if (post.title.includes("Test Blog Post")) {
        await db.deleteBlogPost(post.id);
      }
    }
  });

  it("should create a new blog post", async () => {
    const caller = appRouter.createCaller({
      user: { id: 1, role: "admin" },
      req: {} as any,
      res: {} as any,
    });

    const result = await caller.blogPosts.create({
      title: "Test Blog Post",
      slug: "test-blog-post",
      content: "# Test Content\n\nThis is a test blog post.",
      excerpt: "This is a test excerpt",
      category: "活動報告",
      tags: "テスト, ブログ",
      status: "draft",
    });

    expect(result).toHaveProperty("id");
    expect(typeof result.id).toBe("number");
    testPostId = result.id;
  });

  it("should retrieve the created blog post by ID", async () => {
    const post = await db.getBlogPostById(testPostId);
    
    expect(post).toBeDefined();
    expect(post?.title).toBe("Test Blog Post");
    expect(post?.slug).toBe("test-blog-post");
    expect(post?.content).toContain("Test Content");
    expect(post?.category).toBe("活動報告");
    expect(post?.status).toBe("draft");
  });

  it("should retrieve the created blog post by slug", async () => {
    const post = await db.getBlogPostBySlug("test-blog-post");
    
    expect(post).toBeDefined();
    expect(post?.id).toBe(testPostId);
    expect(post?.title).toBe("Test Blog Post");
  });

  it("should update the blog post", async () => {
    const caller = appRouter.createCaller({
      user: { id: 1, role: "admin" },
      req: {} as any,
      res: {} as any,
    });

    await caller.blogPosts.update({
      id: testPostId,
      title: "Updated Test Blog Post",
      status: "published",
    });

    const updatedPost = await db.getBlogPostById(testPostId);
    expect(updatedPost?.title).toBe("Updated Test Blog Post");
    expect(updatedPost?.status).toBe("published");
    expect(updatedPost?.publishedAt).toBeDefined();
  });

  it("should filter blog posts by category", async () => {
    const posts = await db.getFilteredBlogPosts({
      category: "活動報告",
      status: "published",
    });

    expect(Array.isArray(posts)).toBe(true);
    expect(posts.length).toBeGreaterThan(0);
    expect(posts.every((p: any) => p.category === "活動報告")).toBe(true);
  });

  it("should search blog posts by query", async () => {
    const posts = await db.getFilteredBlogPosts({
      searchQuery: "Updated Test",
    });

    expect(Array.isArray(posts)).toBe(true);
    expect(posts.length).toBeGreaterThan(0);
    expect(posts.some((p: any) => p.title.includes("Updated Test"))).toBe(true);
  });

  it("should increment view count", async () => {
    const beforePost = await db.getBlogPostById(testPostId);
    const beforeViewCount = beforePost?.viewCount || 0;

    await db.incrementBlogPostViewCount(testPostId);

    const afterPost = await db.getBlogPostById(testPostId);
    expect(afterPost?.viewCount).toBe(beforeViewCount + 1);
  });

  it("should get published posts only via public API", async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: {} as any,
      res: {} as any,
    });

    const posts = await caller.blogPosts.list({});
    
    expect(Array.isArray(posts)).toBe(true);
    expect(posts.every((p: any) => p.status === "published")).toBe(true);
  });

  it("should delete the blog post", async () => {
    const caller = appRouter.createCaller({
      user: { id: 1, role: "admin" },
      req: {} as any,
      res: {} as any,
    });

    await caller.blogPosts.delete({ id: testPostId });

    const deletedPost = await db.getBlogPostById(testPostId);
    expect(deletedPost).toBeNull();
  });
});
