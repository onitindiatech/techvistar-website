/**
 * @file src/app.ts
 * @description Express application factory — middleware pipeline and route mounting.
 *
 * MIDDLEWARE ORDER (critical — wrong order = security issues or broken behaviour):
 *
 *  1. helmet()          → Set security headers FIRST, before any response goes out
 *  2. cors()            → Allow cross-origin before the browser pre-flight request fails
 *  3. compression()     → Compress responses early so all downstream middleware benefit
 *  4. cookieParser()    → Parse cookies before routes need them (JWT refresh tokens)
 *  5. requestLogger()   → Log HTTP method/URL BEFORE body parsing (captures all requests)
 *  6. json/urlencoded   → Parse request body (only after logging so we log everything)
 *  7. apiRouter         → All registered API routes
 *  8. notFound()        → Catches anything that didn't match a route (404)
 *  9. errorHandler()    → Formats ALL errors into the standard JSON envelope (MUST BE LAST)
 */

import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';

import { requestLogger } from '@/middleware/requestLogger';
import { notFound }      from '@/middleware/notFound';
import { errorHandler }  from '@/middleware/errorHandler';
import apiRouter         from '@/routes/index';
import { env }           from '@/config/env';
import { DEV_ORIGINS }   from '@/constants';

const app: Application = express();

// Trust Render's reverse proxy so rate limiting and req.ip use the real client IP.
app.set('trust proxy', 1);

// ── 1. Security headers (Helmet) ──────────────────────────────────────────────
// Sets 11+ security headers: X-Content-Type-Options, X-Frame-Options,
// Content-Security-Policy, Strict-Transport-Security, etc.
app.use(helmet({
  // contentSecurityPolicy is strict by default — relax for dev if needed
  contentSecurityPolicy: env.isProd,
}));

// ── 2. CORS ───────────────────────────────────────────────────────────────────
// Allowed origins:
//   - In development: DEV_ORIGINS + any localhost/127.0.0.1 port (see callback)
//   - In production:  env.clientUrls (comma-separated CLIENT_URL)
const allowedOrigins = env.isDev ? [...DEV_ORIGINS] : env.clientUrls;

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no Origin (Postman, server-to-server, mobile apps)
    if (!origin) return callback(null, true);
    // In development, allow any local Vite port (8080, 8081, 8082, 5173, …)
    if (env.isDev && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
      return callback(null, true);
    }
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS: Origin ${origin} not allowed`));
  },
  credentials: true,      // Allow cookies to be sent cross-origin (JWT refresh token)
  methods:     ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// ── 3. Compression ────────────────────────────────────────────────────────────
// Gzip responses > 1KB — reduces bandwidth by 60-80% for JSON APIs
app.use(compression());

// ── 4. Cookie Parser ──────────────────────────────────────────────────────────
// Needed for JWT refresh tokens stored as HttpOnly cookies (Phase 2)
app.use(cookieParser());

// ── 5. HTTP Request Logger ────────────────────────────────────────────────────
// Morgan piped through Winston — logs every request
app.use(requestLogger);

// ── 6. Body Parsers ───────────────────────────────────────────────────────────
app.use(express.json({
  limit: '10mb',    // Limit JSON body size to prevent DoS attacks
}));
app.use(express.urlencoded({
  extended: true,   // Supports nested objects in URL-encoded forms
  limit: '10mb',
}));

// ── 7. API Routes ─────────────────────────────────────────────────────────────
// All routes are prefixed with /api
app.use('/api', apiRouter);

// ── 8. 404 Handler ────────────────────────────────────────────────────────────
// Must come AFTER all valid routes — catches any unmatched request
app.use(notFound);

// ── 9. Global Error Handler ───────────────────────────────────────────────────
// Must be LAST — Express identifies 4-argument functions as error handlers
app.use(errorHandler);

export default app;
