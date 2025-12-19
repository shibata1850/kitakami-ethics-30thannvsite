import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { storagePut } from "./storage";

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
  }),

  members: router({
    // Public: Get all members with optional filters
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
        return db.getFilteredMembers(input);
      }),

    // Public: Get member by ID
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getMemberById(input.id);
      }),

    // Protected: Create new member (admin only)
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
          sortOrder: z.number().default(0),
        })
      )
      .mutation(async ({ input }) => {
        return db.createMember(input);
      }),

    // Protected: Update member (admin only)
    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().min(1).optional(),
          companyName: z.string().min(1).optional(),
          title: z.string().min(1).optional(),
          message: z.string().min(1).optional(),
          photoUrl: z.string().optional(),
          category: z.string().min(1).optional(),
          committee: z.string().optional(),
          sortOrder: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return db.updateMember(id, data);
      }),

    // Protected: Delete member (admin only)
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return db.deleteMember(input.id);
      }),

    // Protected: Upload member photo to S3
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

    // Protected: Export members to CSV
    exportCSV: protectedProcedure.query(async () => {
      const members = await db.getAllMembers();
      
      // CSV header
      const header = "氏名,会社名,タイトル,メッセージ,写真URL,カテゴリー,所属委員会,表示順序";
      
      // CSV rows
      const rows = members.map(member => {
        const escapeCsv = (str: string | null | undefined) => {
          if (!str) return "";
          // Escape double quotes and wrap in quotes if contains comma, newline, or quote
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
          member.sortOrder.toString(),
        ].join(",");
      });
      
      const csv = [header, ...rows].join("\n");
      return { csv };
    }),

    // Protected: Import members from CSV
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
              i++; // Skip next quote
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
            
            await db.createMember(memberData);
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

  officers: router({
    // Public: Get all officers
    list: publicProcedure.query(async () => {
      return db.getAllOfficers();
    }),

    // Public: Get officer by ID
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getOfficerById(input.id);
      }),

    // Protected: Create new officer (admin only)
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
        return db.createOfficer(input);
      }),

    // Protected: Update officer (admin only)
    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
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
        const { id, ...data } = input;
        return db.updateOfficer(id, data);
      }),

    // Protected: Delete officer (admin only)
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return db.deleteOfficer(input.id);
      }),

    // Protected: Upload photo
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

  contacts: router({
    // Public: Create new contact submission
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
        return db.createContact({
          ...input,
          status: "pending",
        });
      }),

    // Protected: Get all contacts with optional filters (admin only)
    list: protectedProcedure
      .input(
        z.object({
          type: z.enum(["contact", "seminar_application"]).optional(),
          status: z.enum(["pending", "in_progress", "completed"]).optional(),
          searchQuery: z.string().optional(),
        })
      )
      .query(async ({ input }) => {
        return db.getFilteredContacts(input);
      }),

    // Protected: Get contact by ID (admin only)
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getContactById(input.id);
      }),

    // Protected: Update contact status (admin only)
    updateStatus: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          status: z.enum(["pending", "in_progress", "completed"]),
        })
      )
      .mutation(async ({ input }) => {
        return db.updateContactStatus(input.id, input.status);
      }),

    // Protected: Reply to contact (admin only)
    reply: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          reply: z.string().min(1),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user?.id) {
          throw new Error("User ID not found");
        }
        return db.updateContactReply(input.id, input.reply, ctx.user.id);
      }),

    // Protected: Delete contact (admin only)
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return db.deleteContact(input.id);
      }),
  }),
});
export type AppRouter = typeof appRouter;
