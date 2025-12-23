import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import express, { type ErrorRequestHandler } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { appRouter } from '../server/routers';
import { createContext } from '../server/_core/context';

const app = express();

// Middleware
app.use(cors({
  origin: true, // Allow all origins for now to debug CORS issues
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
    onError: ({ error, path }) => {
      console.error(`[tRPC Error] ${path}:`, error.message, error.stack);
    },
  })
);

// Health check with database connection test
app.get('/api/health', async (req, res) => {
  try {
    // Check if DATABASE_URL is set
    const hasDbUrl = !!process.env.DATABASE_URL;
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: hasDbUrl ? 'configured' : 'not configured',
      env: {
        NODE_ENV: process.env.NODE_ENV,
        hasJwtSecret: !!process.env.JWT_SECRET,
        hasOAuthUrl: !!process.env.OAUTH_SERVER_URL,
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Error handling middleware - must be last
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error('[Express Error]', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err instanceof Error ? err.message : 'Unknown error',
  });
};
app.use(errorHandler);

// Export for Vercel Serverless Functions
export default async (req: VercelRequest, res: VercelResponse) => {
  return new Promise((resolve, reject) => {
    app(req as any, res as any, (err: any) => {
      if (err) {
        console.error('[Vercel Handler Error]', err);
        res.status(500).json({
          error: 'Internal Server Error',
          message: err instanceof Error ? err.message : 'Unknown error',
        });
        resolve(undefined);
      } else {
        resolve(undefined);
      }
    });
  });
};
