import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { appRouter } from '../server/routers';
import { createContext } from '../server/_core/context';

const app = express();

// Middleware
app.use(cors({
  origin: process.env.VITE_OAUTH_PORTAL_URL || 'https://manus.im',
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

// tRPC endpoint
app.use(
  '/api/trpc',
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Export for Vercel Serverless Functions
export default async (req: VercelRequest, res: VercelResponse) => {
  return new Promise((resolve, reject) => {
    app(req as any, res as any, (err: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(undefined);
      }
    });
  });
};
