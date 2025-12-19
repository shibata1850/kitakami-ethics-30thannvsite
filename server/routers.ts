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
  }),
});

export type AppRouter = typeof appRouter;
