import { COOKIE_NAME } from "../shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { storagePut } from "./storage";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ENV } from "./_core/env";
import { memberApi, officerApi, inquiryApi, formApi, formResponseApi } from "./base44";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),

    // Register new user
    register: publicProcedure
      .input(
        z.object({
          name: z.string().min(1),
          email: z.string().email(),
          password: z.string().min(6),
          companyName: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        // Check if user already exists
        const existingUser = await db.getUserByEmail(input.email);
        if (existingUser) {
          throw new Error("Email already registered");
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(input.password, 10);

        // Create user with pending_approval status
        const newUser = await db.createUser({
          name: input.name,
          email: input.email,
          password: hashedPassword,
          companyName: input.companyName || null,
          loginMethod: "email",
          role: "user",
          status: "pending_approval",
        });

        // Get the created user
        const user = await db.getUserByEmail(input.email);
        if (!user) {
          throw new Error("Failed to create user");
        }

        // Get all admins for approval notification
        const admins = await db.getAdminUsers();
        console.log(`[Auth] New user registration: ${input.email}, awaiting approval from ${admins.length} admins`);

        return {
          message: "Registration successful. Your account is pending approval from administrators.",
          userId: user.id,
        };
      }),

    // Login with email and password
    login: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
          password: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        // Get user by email
        const user = await db.getUserByEmail(input.email);
        if (!user || !user.password) {
          throw new Error("Invalid email or password");
        }

        // Check password
        const passwordMatch = await bcrypt.compare(input.password, user.password);
        if (!passwordMatch) {
          throw new Error("Invalid email or password");
        }

        // Check if user is approved
        if (user.status !== "active") {
          throw new Error("Your account is pending approval");
        }

        // Generate JWT token
        const token = jwt.sign(
          { userId: user.id, email: user.email, role: user.role },
          ENV.jwtSecret,
          { expiresIn: "7d" }
        );

        // Update last signed in
        await db.updateLastSignedIn(user.id);

        return {
          message: "Login successful",
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            companyName: user.companyName,
          },
        };
      }),

    // Get pending approval users (admin only)
    getPendingUsers: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("Admin access required");
      }
      return db.getPendingApprovalUsers();
    }),

    // Approve user (admin only)
    approveUser: protectedProcedure
      .input(
        z.object({
          userId: z.number(),
          comment: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Admin access required");
        }
        if (!ctx.user.id) {
          throw new Error("User ID not found");
        }

        await db.approveUser(input.userId, ctx.user.id, input.comment);
        return { message: "User approved successfully" };
      }),
  }),

  // ============================================
  // Members Router - Base44 API連携
  // ============================================
  members: router({
    // Public: Get all members with optional filters (Base44 API)
    list: publicProcedure
      .input(
        z.object({
          categories: z.array(z.string()).optional(),
          committees: z.array(z.string()).optional(),
          searchQuery: z.string().optional(),
          sortBy: z.enum(["random", "date_desc", "date_asc"]).optional(),
        })
      )
      .query(async ({ input }) => {
        try {
          let members = await memberApi.getFiltered({
            categories: input.categories,
            committees: input.committees,
            searchQuery: input.searchQuery,
          });

          // ソート処理
          if (input.sortBy === "random") {
            members = members.sort(() => Math.random() - 0.5);
          } else if (input.sortBy === "date_desc") {
            members = members.sort((a, b) =>
              new Date(b.created_date).getTime() - new Date(a.created_date).getTime()
            );
          } else if (input.sortBy === "date_asc") {
            members = members.sort((a, b) =>
              new Date(a.created_date).getTime() - new Date(b.created_date).getTime()
            );
          }

          return members;
        } catch (error) {
          console.error('[Members] Failed to fetch from Base44:', error);
          throw new Error('会員情報の取得に失敗しました');
        }
      }),

    // Public: Get member by ID (Base44 API)
    getById: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        try {
          return await memberApi.getById(input.id);
        } catch (error) {
          console.error('[Members] Failed to get member:', error);
          throw new Error('会員情報の取得に失敗しました');
        }
      }),

    // Public: Get related members (same category) (Base44 API)
    getRelated: publicProcedure
      .input(z.object({ id: z.string(), limit: z.number().default(4) }))
      .query(async ({ input }) => {
        try {
          return await memberApi.getRelated(input.id, input.limit);
        } catch (error) {
          console.error('[Members] Failed to get related members:', error);
          return [];
        }
      }),

    // Protected: Create new member (admin only) - Base44で管理
    create: protectedProcedure
      .input(
        z.object({
          name: z.string().min(1),
          companyName: z.string().min(1),
          title: z.string().min(1),
          message: z.string().min(1),
          photoUrl: z.string().optional(),
          category: z.string().min(1),
          committee: z.string().optional(),
          websiteUrl: z.string().optional(),
          twitterUrl: z.string().optional(),
          youtubeUrl: z.string().optional(),
          tiktokUrl: z.string().optional(),
          instagramUrl: z.string().optional(),
          lineUrl: z.string().optional(),
          services: z.string().optional(),
          achievements: z.string().optional(),
          sortOrder: z.number().default(0),
        })
      )
      .mutation(async ({ input }) => {
        try {
          return await memberApi.create(input);
        } catch (error) {
          console.error('[Members] Failed to create member:', error);
          throw new Error('会員の作成に失敗しました');
        }
      }),

    // Protected: Update member (admin only) - Base44で管理
    update: protectedProcedure
      .input(
        z.object({
          id: z.string(),
          name: z.string().min(1).optional(),
          companyName: z.string().min(1).optional(),
          title: z.string().min(1).optional(),
          message: z.string().min(1).optional(),
          photoUrl: z.string().optional(),
          category: z.string().min(1).optional(),
          committee: z.string().optional(),
          websiteUrl: z.string().optional(),
          twitterUrl: z.string().optional(),
          youtubeUrl: z.string().optional(),
          tiktokUrl: z.string().optional(),
          instagramUrl: z.string().optional(),
          lineUrl: z.string().optional(),
          services: z.string().optional(),
          achievements: z.string().optional(),
          sortOrder: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const { id, ...data } = input;
          return await memberApi.update(id, data);
        } catch (error) {
          console.error('[Members] Failed to update member:', error);
          throw new Error('会員の更新に失敗しました');
        }
      }),

    // Protected: Delete member (admin only) - Base44で管理
    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        try {
          await memberApi.delete(input.id);
          return { success: true };
        } catch (error) {
          console.error('[Members] Failed to delete member:', error);
          throw new Error('会員の削除に失敗しました');
        }
      }),

    // Protected: Upload member photo to S3 (継続使用)
    uploadPhoto: protectedProcedure
      .input(
        z.object({
          fileName: z.string(),
          fileData: z.string(), // base64 encoded
          mimeType: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        const buffer = Buffer.from(input.fileData, "base64");
        const randomSuffix = Math.random().toString(36).substring(2, 15);
        const fileKey = `members/${input.fileName}-${randomSuffix}`;
        const result = await storagePut(fileKey, buffer, input.mimeType);
        return { url: result.url };
      }),

    // Protected: Export members to CSV (Base44 API)
    exportCSV: protectedProcedure.query(async () => {
      try {
        const members = await memberApi.list();

        // CSV header
        const header = "氏名,会社名,タイトル,メッセージ,写真URL,カテゴリー,所属委員会,表示順序";

        // CSV rows
        const rows = members.map(member => {
          const escapeCsv = (str: string | null | undefined) => {
            if (!str) return "";
            if (str.includes(",") || str.includes("\n") || str.includes('"')) {
              return `"${str.replace(/"/g, '""')}"`;
            }
            return str;
          };

          return [
            escapeCsv(member.name),
            escapeCsv(member.companyName),
            escapeCsv(member.title),
            escapeCsv(member.message),
            escapeCsv(member.photoUrl || ""),
            escapeCsv(member.category),
            escapeCsv(member.committee || ""),
            (member.sortOrder || 0).toString(),
          ].join(",");
        });

        const csv = [header, ...rows].join("\n");
        return { csv };
      } catch (error) {
        console.error('[Members] Failed to export CSV:', error);
        throw new Error('CSVエクスポートに失敗しました');
      }
    }),

    // Protected: Import members from CSV (Base44 API)
    importCSV: protectedProcedure
      .input(
        z.object({
          csvContent: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        const lines = input.csvContent.split("\n").filter(line => line.trim());

        if (lines.length < 2) {
          throw new Error("CSVファイルが空です");
        }

        // Skip header
        const dataLines = lines.slice(1);

        const parseCsvLine = (line: string): string[] => {
          const result: string[] = [];
          let current = "";
          let inQuotes = false;

          for (let i = 0; i < line.length; i++) {
            const char = line[i];
            const nextChar = line[i + 1];

            if (char === '"' && inQuotes && nextChar === '"') {
              current += '"';
              i++;
            } else if (char === '"') {
              inQuotes = !inQuotes;
            } else if (char === "," && !inQuotes) {
              result.push(current);
              current = "";
            } else {
              current += char;
            }
          }
          result.push(current);
          return result;
        };

        const imported: any[] = [];
        const errors: string[] = [];

        for (let i = 0; i < dataLines.length; i++) {
          try {
            const fields = parseCsvLine(dataLines[i]);

            if (fields.length < 6) {
              errors.push(`行 ${i + 2}: フィールド数が不足しています`);
              continue;
            }

            const [name, companyName, title, message, photoUrl, category, committee, sortOrder] = fields;

            if (!name || !companyName || !title || !message || !category) {
              errors.push(`行 ${i + 2}: 必須フィールドが空です`);
              continue;
            }

            const memberData = {
              name: name.trim(),
              companyName: companyName.trim(),
              title: title.trim(),
              message: message.trim(),
              photoUrl: photoUrl?.trim() || undefined,
              category: category.trim(),
              committee: committee?.trim() || undefined,
              sortOrder: parseInt(sortOrder || "0") || 0,
            };

            await memberApi.create(memberData);
            imported.push(memberData);
          } catch (error: any) {
            errors.push(`行 ${i + 2}: ${error.message}`);
          }
        }

        return {
          success: imported.length,
          errors,
          total: dataLines.length,
        };
      }),
  }),

  // ============================================
  // Officers Router - Base44 API連携
  // ============================================
  officers: router({
    // Public: Get all officers (Base44 API)
    list: publicProcedure.query(async () => {
      try {
        return await officerApi.list();
      } catch (error) {
        console.error('[Officers] Failed to fetch from Base44:', error);
        throw new Error('役員情報の取得に失敗しました');
      }
    }),

    // Public: Get officer by ID (Base44 API)
    getById: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        try {
          return await officerApi.getById(input.id);
        } catch (error) {
          console.error('[Officers] Failed to get officer:', error);
          throw new Error('役員情報の取得に失敗しました');
        }
      }),

    // Protected: Create new officer (admin only) - Base44で管理
    create: protectedProcedure
      .input(
        z.object({
          name: z.string().min(1),
          companyName: z.string().min(1),
          position: z.string().min(1),
          committee: z.string().optional(),
          message: z.string().optional(),
          photoUrl: z.string().optional(),
          sortOrder: z.number().default(0),
        })
      )
      .mutation(async ({ input }) => {
        try {
          return await officerApi.create(input);
        } catch (error) {
          console.error('[Officers] Failed to create officer:', error);
          throw new Error('役員の作成に失敗しました');
        }
      }),

    // Protected: Update officer (admin only) - Base44で管理
    update: protectedProcedure
      .input(
        z.object({
          id: z.string(),
          name: z.string().min(1).optional(),
          companyName: z.string().min(1).optional(),
          position: z.string().min(1).optional(),
          committee: z.string().optional(),
          message: z.string().optional(),
          photoUrl: z.string().optional(),
          sortOrder: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const { id, ...data } = input;
          return await officerApi.update(id, data);
        } catch (error) {
          console.error('[Officers] Failed to update officer:', error);
          throw new Error('役員の更新に失敗しました');
        }
      }),

    // Protected: Delete officer (admin only) - Base44で管理
    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        try {
          await officerApi.delete(input.id);
          return { success: true };
        } catch (error) {
          console.error('[Officers] Failed to delete officer:', error);
          throw new Error('役員の削除に失敗しました');
        }
      }),

    // Protected: Upload photo (継続使用)
    uploadPhoto: protectedProcedure
      .input(
        z.object({
          fileName: z.string(),
          fileData: z.string(), // base64
          mimeType: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        const buffer = Buffer.from(input.fileData, "base64");
        const ext = input.fileName.split(".").pop() || "jpg";
        const key = `officers/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
        const result = await storagePut(key, buffer, input.mimeType);
        return result;
      }),
  }),
  seminars: router({
    // Public: Get all seminars
    list: publicProcedure.query(async () => {
      return db.getAllSeminars();
    }),
    // Public: Get upcoming seminars
    upcoming: publicProcedure.query(async () => {
      return db.getUpcomingSeminars();
    }),
    // Public: Get past seminars
    past: publicProcedure.query(async () => {
      return db.getPastSeminars();
    }),
    // Public: Get seminar by ID
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getSeminarById(input.id);
      }),
    // Protected: Create new seminar (admin only)
    create: protectedProcedure
      .input(
        z.object({
          date: z.string().min(1), // YYYY-MM-DD
          time: z.string().min(1),
          speaker: z.string().min(1),
          theme: z.string().min(1),
          venue: z.string().min(1),
          description: z.string().optional(),
          sortOrder: z.number().default(0),
        })
      )
      .mutation(async ({ input }) => {
        return db.createSeminar(input);
      }),
    // Protected: Update seminar (admin only)
    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          date: z.string().min(1).optional(),
          time: z.string().min(1).optional(),
          speaker: z.string().min(1).optional(),
          theme: z.string().min(1).optional(),
          venue: z.string().min(1).optional(),
          description: z.string().optional(),
          sortOrder: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return db.updateSeminar(id, data);
      }),
    // Protected: Delete seminar (admin only)
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return db.deleteSeminar(input.id);
      }),
  }),

  blogPosts: router({
    // Public: Get all published blog posts with optional filters
    list: publicProcedure
      .input(
        z.object({
          category: z.string().optional(),
          searchQuery: z.string().optional(),
        })
      )
      .query(async ({ input }) => {
        return db.getFilteredBlogPosts({ ...input, status: "published" });
      }),
    // Public: Get blog post by ID
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const post = await db.getBlogPostById(input.id);
        if (post && post.status === "published") {
          // Increment view count
          await db.incrementBlogPostViewCount(input.id);
        }
        return post;
      }),
    // Public: Get blog post by slug
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const post = await db.getBlogPostBySlug(input.slug);
        if (post && post.status === "published") {
          // Increment view count
          await db.incrementBlogPostViewCount(post.id);
        }
        return post;
      }),
    // Protected: Get all blog posts (including drafts) for admin
    adminList: protectedProcedure
      .input(
        z.object({
          category: z.string().optional(),
          searchQuery: z.string().optional(),
          status: z.enum(["draft", "published"]).optional(),
        })
      )
      .query(async ({ input }) => {
        return db.getFilteredBlogPosts(input);
      }),
    // Protected: Create new blog post (admin only)
    create: protectedProcedure
      .input(
        z.object({
          title: z.string().min(1),
          slug: z.string().min(1),
          content: z.string().min(1),
          excerpt: z.string().optional(),
          category: z.string().min(1),
          tags: z.string().optional(),
          thumbnailUrl: z.string().optional(),
          status: z.enum(["draft", "published"]).default("draft"),
          publishedAt: z.date().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const postData = {
          ...input,
          authorId: ctx.user?.id,
          publishedAt: input.status === "published" && !input.publishedAt ? new Date() : input.publishedAt,
        };
        return db.createBlogPost(postData);
      }),
    // Protected: Update blog post (admin only)
    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().min(1).optional(),
          slug: z.string().min(1).optional(),
          content: z.string().min(1).optional(),
          excerpt: z.string().optional(),
          category: z.string().min(1).optional(),
          tags: z.string().optional(),
          thumbnailUrl: z.string().optional(),
          status: z.enum(["draft", "published"]).optional(),
          publishedAt: z.date().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        // If status is being changed to published and publishedAt is not set, set it to now
        if (data.status === "published" && !data.publishedAt) {
          const currentPost = await db.getBlogPostById(id);
          if (currentPost && currentPost.status === "draft") {
            data.publishedAt = new Date();
          }
        }
        return db.updateBlogPost(id, data);
      }),
    // Protected: Delete blog post (admin only)
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return db.deleteBlogPost(input.id);
      }),
    // Protected: Upload thumbnail image
    uploadThumbnail: protectedProcedure
      .input(
        z.object({
          filename: z.string(),
          contentType: z.string(),
          data: z.string(), // base64 encoded
        })
      )
      .mutation(async ({ input }) => {
        const buffer = Buffer.from(input.data, "base64");
        const timestamp = Date.now();
        const key = `blog-thumbnails/${timestamp}-${input.filename}`;
        const result = await storagePut(key, buffer, input.contentType);
        return { url: result.url };
      }),
  }),

  // ============================================
  // Contacts Router - Base44 Inquiry API連携
  // ============================================
  contacts: router({
    // Public: Create new contact submission (Base44 Inquiry API)
    create: publicProcedure
      .input(
        z.object({
          type: z.enum(["contact", "seminar_application"]),
          name: z.string().min(1),
          email: z.string().email(),
          phone: z.string().optional(),
          companyName: z.string().optional(),
          message: z.string().min(1),
        })
      )
      .mutation(async ({ input }) => {
        try {
          return await inquiryApi.create(input);
        } catch (error) {
          console.error('[Contacts] Failed to create inquiry:', error);
          throw new Error('お問い合わせの送信に失敗しました');
        }
      }),

    // Protected: Get all contacts with optional filters (admin only) - Base44 API
    list: protectedProcedure
      .input(
        z.object({
          type: z.enum(["contact", "seminar_application"]).optional(),
          status: z.enum(["pending", "in_progress", "completed"]).optional(),
          searchQuery: z.string().optional(),
        })
      )
      .query(async ({ input }) => {
        try {
          return await inquiryApi.getFiltered(input);
        } catch (error) {
          console.error('[Contacts] Failed to fetch inquiries:', error);
          throw new Error('お問い合わせの取得に失敗しました');
        }
      }),

    // Protected: Get contact by ID (admin only) - Base44 API
    getById: protectedProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        try {
          return await inquiryApi.getById(input.id);
        } catch (error) {
          console.error('[Contacts] Failed to get inquiry:', error);
          throw new Error('お問い合わせの取得に失敗しました');
        }
      }),

    // Protected: Update contact status (admin only) - Base44 API
    updateStatus: protectedProcedure
      .input(
        z.object({
          id: z.string(),
          status: z.enum(["pending", "in_progress", "completed"]),
        })
      )
      .mutation(async ({ input }) => {
        try {
          return await inquiryApi.update(input.id, { status: input.status });
        } catch (error) {
          console.error('[Contacts] Failed to update status:', error);
          throw new Error('ステータスの更新に失敗しました');
        }
      }),

    // Protected: Reply to contact (admin only) - Base44 API
    reply: protectedProcedure
      .input(
        z.object({
          id: z.string(),
          reply: z.string().min(1),
        })
      )
      .mutation(async ({ input, ctx }) => {
        try {
          return await inquiryApi.update(input.id, {
            reply: input.reply,
            repliedAt: new Date().toISOString(),
            repliedBy: ctx.user?.email || 'unknown',
            status: 'completed',
          });
        } catch (error) {
          console.error('[Contacts] Failed to reply:', error);
          throw new Error('返信の送信に失敗しました');
        }
      }),

    // Protected: Delete contact (admin only) - Base44 API
    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        try {
          await inquiryApi.delete(input.id);
          return { success: true };
        } catch (error) {
          console.error('[Contacts] Failed to delete inquiry:', error);
          throw new Error('お問い合わせの削除に失敗しました');
        }
      }),
  }),

  // ============================================
  // Dashboard Router - ハイブリッド（Base44 + PostgreSQL）
  // ============================================
  dashboard: router({
    // Protected: Get dashboard statistics (admin only)
    getStats: protectedProcedure.query(async () => {
      try {
        // Base44 APIからメンバー数と問い合わせ数を取得
        const [members, inquiries] = await Promise.all([
          memberApi.list(),
          inquiryApi.list(),
        ]);

        const memberCount = members.length;
        const contactCount = inquiries.length;
        const pendingContactCount = inquiries.filter(i => i.status === 'pending').length;

        // PostgreSQLから残りの統計を取得（seminars, blogPostsはまだPostgreSQL）
        const dbStats = await db.getDashboardStats();

        return {
          memberCount,
          contactCount,
          pendingContactCount,
          upcomingSeminarCount: dbStats.upcomingSeminarCount,
          blogPostCount: dbStats.blogPostCount,
          upcomingSeminars: dbStats.upcomingSeminars,
          recentBlogPosts: dbStats.recentBlogPosts,
          // pendingContactsはBase44から取得
          pendingContacts: inquiries
            .filter(i => i.status === 'pending')
            .slice(0, 5)
            .map(i => ({
              id: i.id,
              type: i.type,
              name: i.name,
              email: i.email,
              phone: i.phone || null,
              companyName: i.companyName || null,
              message: i.message,
              status: i.status || 'pending',
              reply: i.reply || null,
              repliedAt: i.repliedAt ? new Date(i.repliedAt) : null,
              repliedBy: null,
              createdAt: new Date(i.created_date),
              updatedAt: new Date(i.updated_date),
            })),
        };
      } catch (error) {
        console.error('[Dashboard] Failed to fetch stats:', error);
        // フォールバック: PostgreSQLから取得
        return db.getDashboardStats();
      }
    }),
  }),

  // Base44 Events API
  base44Events: router({
    // Public: Get events from Base44 API
    list: publicProcedure
      .input(
        z.object({
          event_type: z.string().optional(),
          status: z.string().optional(),
        }).optional()
      )
      .query(async ({ input }) => {
        try {
          const response = await fetch(
            `https://app.base44.com/api/apps/6943944870829f16b01dab30/entities/Event`,
            {
              headers: {
                'api_key': '8834846fdeeb4fa2aad4038a3117ccbc',
                'Content-Type': 'application/json',
              },
            }
          );

          if (!response.ok) {
            throw new Error(`Base44 API error: ${response.status}`);
          }

          const data = await response.json();

          // Filter events if needed
          let events = data || [];

          // Filter by event_type if specified
          if (input?.event_type) {
            events = events.filter((e: any) => e.event_type === input.event_type);
          }

          // Filter by status if specified (default: only approved events)
          if (input?.status) {
            events = events.filter((e: any) => e.status === input.status);
          }

          // Sort by event_date ascending (upcoming first)
          events.sort((a: any, b: any) => {
            const dateA = new Date(a.event_date || '');
            const dateB = new Date(b.event_date || '');
            return dateA.getTime() - dateB.getTime();
          });

          return events;
        } catch (error) {
          console.error('[Base44 API] Error fetching events:', error);
          throw new Error('Failed to fetch events from Base44');
        }
      }),

    // Public: Get upcoming events (event_date >= today)
    upcoming: publicProcedure
      .input(
        z.object({
          event_type: z.string().optional(),
        }).optional()
      )
      .query(async ({ input }) => {
        try {
          const response = await fetch(
            `https://app.base44.com/api/apps/6943944870829f16b01dab30/entities/Event`,
            {
              headers: {
                'api_key': '8834846fdeeb4fa2aad4038a3117ccbc',
                'Content-Type': 'application/json',
              },
            }
          );

          if (!response.ok) {
            throw new Error(`Base44 API error: ${response.status}`);
          }

          const data = await response.json();
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          let events = (data || []).filter((e: any) => {
            const eventDate = new Date(e.event_date || '');
            return eventDate >= today;
          });

          // Filter by event_type if specified
          if (input?.event_type) {
            events = events.filter((e: any) => e.event_type === input.event_type);
          }

          // Sort by event_date ascending
          events.sort((a: any, b: any) => {
            const dateA = new Date(a.event_date || '');
            const dateB = new Date(b.event_date || '');
            return dateA.getTime() - dateB.getTime();
          });

          return events;
        } catch (error) {
          console.error('[Base44 API] Error fetching upcoming events:', error);
          throw new Error('Failed to fetch upcoming events from Base44');
        }
      }),

    // Public: Get past events (event_date < today)
    past: publicProcedure
      .input(
        z.object({
          event_type: z.string().optional(),
        }).optional()
      )
      .query(async ({ input }) => {
        try {
          const response = await fetch(
            `https://app.base44.com/api/apps/6943944870829f16b01dab30/entities/Event`,
            {
              headers: {
                'api_key': '8834846fdeeb4fa2aad4038a3117ccbc',
                'Content-Type': 'application/json',
              },
            }
          );

          if (!response.ok) {
            throw new Error(`Base44 API error: ${response.status}`);
          }

          const data = await response.json();
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          let events = (data || []).filter((e: any) => {
            const eventDate = new Date(e.event_date || '');
            return eventDate < today;
          });

          // Filter by event_type if specified
          if (input?.event_type) {
            events = events.filter((e: any) => e.event_type === input.event_type);
          }

          // Sort by event_date descending (most recent first)
          events.sort((a: any, b: any) => {
            const dateA = new Date(a.event_date || '');
            const dateB = new Date(b.event_date || '');
            return dateB.getTime() - dateA.getTime();
          });

          return events;
        } catch (error) {
          console.error('[Base44 API] Error fetching past events:', error);
          throw new Error('Failed to fetch past events from Base44');
        }
      }),
  }),

  // ============================================
  // Attendance Router - 出欠登録
  // ============================================
  attendance: router({
    // Protected: Register attendance for an event
    register: protectedProcedure
      .input(
        z.object({
          eventDate: z.string(), // YYYY-MM-DD
          eventTitle: z.string(),
          base44EventId: z.string().optional(),
          status: z.enum(["attend", "absent", "late"]),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user?.email || !ctx.user?.name) {
          throw new Error("ユーザー情報が取得できません");
        }

        return db.upsertAttendanceResponse({
          eventDate: input.eventDate,
          formTitle: input.eventTitle,
          base44FormId: input.base44EventId,
          userEmail: ctx.user.email,
          userName: ctx.user.name,
          status: input.status,
        });
      }),

    // Protected: Get my attendance history
    myHistory: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user?.email) {
        throw new Error("ユーザー情報が取得できません");
      }
      return db.getAttendanceResponsesByEmail(ctx.user.email);
    }),

    // Protected: Get attendance list for specific event (admin or self)
    getByEvent: protectedProcedure
      .input(z.object({ eventDate: z.string() }))
      .query(async ({ input }) => {
        return db.getAttendanceResponsesByEventDate(input.eventDate);
      }),

    // Protected: Get attendance stats for specific event
    getStats: protectedProcedure
      .input(z.object({ eventDate: z.string() }))
      .query(async ({ input }) => {
        return db.getAttendanceStats(input.eventDate);
      }),

    // Protected: Get list of events with attendance data
    getEventDates: protectedProcedure.query(async () => {
      return db.getAttendanceEventDates();
    }),

    // Protected: Get filtered attendance responses (admin only)
    list: protectedProcedure
      .input(
        z.object({
          eventDate: z.string().optional(),
          status: z.enum(["pending", "attend", "absent", "late"]).optional(),
          searchQuery: z.string().optional(),
        })
      )
      .query(async ({ input }) => {
        return db.getFilteredAttendanceResponses(input);
      }),
  }),

  // ============================================
  // Attendance Forms Router - Base44フォーム連携
  // ============================================
  attendanceForms: router({
    // Protected: Get all active attendance forms
    list: protectedProcedure.query(async () => {
      try {
        return await formApi.getActiveForms();
      } catch (error) {
        console.error('[AttendanceForms] Failed to get forms:', error);
        return [];
      }
    }),

    // Protected: Get form definition with event info
    getFormDefinition: protectedProcedure
      .input(z.object({ formId: z.string() }))
      .query(async ({ input }) => {
        try {
          return await formApi.getFormDefinition(input.formId);
        } catch (error) {
          console.error('[AttendanceForms] Failed to get form definition:', error);
          throw new Error('フォーム定義の取得に失敗しました');
        }
      }),

    // Protected: Get my response for a form
    getMyResponse: protectedProcedure
      .input(z.object({ formId: z.string() }))
      .query(async ({ ctx, input }) => {
        if (!ctx.user?.email) {
          throw new Error('ユーザー情報が取得できません');
        }
        try {
          return await formResponseApi.getUserResponseForForm(input.formId, ctx.user.email);
        } catch (error) {
          console.error('[AttendanceForms] Failed to get my response:', error);
          return null;
        }
      }),

    // Protected: Get all my responses
    getMyResponses: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user?.email) {
        throw new Error('ユーザー情報が取得できません');
      }
      try {
        return await formResponseApi.getByUserEmail(ctx.user.email);
      } catch (error) {
        console.error('[AttendanceForms] Failed to get my responses:', error);
        return [];
      }
    }),

    // Protected: Submit attendance response
    submitResponse: protectedProcedure
      .input(
        z.object({
          formId: z.string(),
          attendance: z.enum(['attend', 'absent', 'undecided']),
          guestCount: z.number().optional(),
          comment: z.string().optional(),
          answers: z.record(z.any()).optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (!ctx.user?.email || !ctx.user?.name) {
          throw new Error('ユーザー情報が取得できません');
        }

        try {
          // Base44に回答を送信
          const response = await formResponseApi.submitResponse({
            form_id: input.formId,
            user_name: ctx.user.name,
            user_email: ctx.user.email,
            attendance: input.attendance,
            guest_count: input.guestCount,
            comment: input.comment,
            answers: input.answers,
          });

          // ローカルDBにも同期（バックアップ用）
          const form = await formApi.getById(input.formId);
          if (form) {
            await db.upsertAttendanceResponse({
              eventDate: form.event_date || new Date().toISOString().split('T')[0],
              formTitle: form.title,
              base44FormId: input.formId,
              userEmail: ctx.user.email,
              userName: ctx.user.name,
              status: input.attendance === 'attend' ? 'attend' :
                      input.attendance === 'absent' ? 'absent' : 'pending',
            });
          }

          return {
            success: true,
            message: '出欠を登録しました',
            data: response,
          };
        } catch (error) {
          console.error('[AttendanceForms] Failed to submit response:', error);
          throw new Error('出欠登録に失敗しました');
        }
      }),

    // Protected: Get responses for a form (admin only)
    getFormResponses: protectedProcedure
      .input(z.object({ formId: z.string() }))
      .query(async ({ ctx, input }) => {
        if (ctx.user?.role !== 'admin') {
          throw new Error('管理者権限が必要です');
        }
        try {
          return await formResponseApi.getByFormId(input.formId);
        } catch (error) {
          console.error('[AttendanceForms] Failed to get form responses:', error);
          return [];
        }
      }),
  }),

  eventRsvps: router({
    // Public: Create a new RSVP (for form submission)
    create: publicProcedure
      .input(
        z.object({
          attendance: z.enum(["attend", "decline"]),
          affiliation: z.string().min(1),
          position: z.string().optional(),
          lastName: z.string().min(1),
          firstName: z.string().min(1),
          email: z.string().email(),
          message: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return db.createEventRsvp(input);
      }),

    // Protected: Get all RSVPs with filtering (admin only)
    getAll: protectedProcedure
      .input(
        z.object({
          attendance: z.enum(["attend", "decline", "all"]).optional(),
          affiliation: z.string().optional(),
          search: z.string().optional(),
        })
      )
      .query(async ({ input }) => {
        return db.getFilteredEventRsvps(input);
      }),

    // Protected: Get statistics (admin only)
    getStats: protectedProcedure.query(async () => {
      return db.getEventRsvpStats();
    }),

    // Protected: Get unique affiliations (admin only)
    getAffiliations: protectedProcedure.query(async () => {
      return db.getEventRsvpAffiliations();
    }),

    // Protected: Delete an RSVP (admin only)
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return db.deleteEventRsvp(input.id);
      }),
  }),
});
export type AppRouter = typeof appRouter;
