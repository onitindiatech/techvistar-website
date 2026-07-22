/**
 * @file src/server.ts
 * @description Application entry point — startup sequence and graceful shutdown.
 *
 * STARTUP SEQUENCE (order matters):
 *  1. Load .env file (dotenv)
 *  2. Validate all required env variables (env.ts — crashes here if misconfigured)
 *  3. Register process-level error handlers (uncaughtException, unhandledRejection)
 *  4. Connect to MongoDB — if this fails, abort (no point serving broken requests)
 *  5. Start HTTP server
 *  6. Log success
 *
 * GRACEFUL SHUTDOWN:
 *  - SIGTERM: sent by Docker, Kubernetes, PM2, Heroku, Railway when stopping container
 *  - SIGINT:  sent by Ctrl+C in the terminal
 *  Both signals stop accepting new connections, wait for in-flight requests, close DB.
 */

import 'dotenv/config'; // Load .env FIRST — before any other import reads process.env

import http from 'http';
import app             from './app';
import { env, normalizeOrigin } from '@/config/env';
import { connectDB, disconnectDB } from '@/config/database';
import '@/config/cloudinary'; // Phase 1.5 — configure Cloudinary SDK at startup
import { logger, setupProcessLogger } from '@/utils/logger';
import { DEV_ORIGINS, PRODUCTION_CORS_FALLBACK_ORIGINS } from '@/constants';
import { serviceService } from '@/services/service.service';

// ─── Register process-level error handlers ────────────────────────────────────
// Must be set up before anything async happens
setupProcessLogger();

// ─── Startup ──────────────────────────────────────────────────────────────────
async function startServer(): Promise<void> {
  try {
    const allowedOrigins = [
      ...new Set(
        (env.isDev ? [...DEV_ORIGINS] : [...env.clientUrls, ...PRODUCTION_CORS_FALLBACK_ORIGINS]).map(
          normalizeOrigin,
        ),
      ),
    ];

    logger.info('════════════════════════════════════════════════════');
    logger.info('  TechVistar API Server — Starting Up');
    logger.info(`  Environment: ${env.nodeEnv}`);
    logger.info(`  Port:        ${env.port}`);
    logger.info(`[CORS] process.env.CLIENT_URL: ${process.env.CLIENT_URL ?? '(unset)'}`);
    logger.info(`[CORS] env.clientUrls: ${JSON.stringify(env.clientUrls)}`);
    logger.info(`[CORS] allowedOrigins: ${JSON.stringify(allowedOrigins)}`);
    logger.info('════════════════════════════════════════════════════');

    // ── Step 1: Connect to MongoDB ─────────────────────────────────────────
    // Production: if DB fails, abort — no point serving broken requests.
    // Development: start anyway in 'degraded' state so you can work without a local MongoDB.
    try {
      await connectDB();
      await serviceService.seedFallbackServicesIfNeeded();
    } catch (dbErr) {
      if (env.isProd) {
        throw dbErr; // Re-throw to outer catch → process.exit(1)
      } else {
        logger.warn('[Server] MongoDB unavailable — starting in DEGRADED mode.');
        logger.warn('[Server] Install MongoDB locally or set MONGODB_URI to an Atlas connection string.');
      }
    }

    // ── Step 2: Create HTTP server ────────────────────────────────────────
    const server = http.createServer(app);

    // ── Step 3: Start listening ─────────────────────────────────────────────
    server.listen(env.port, () => {
      logger.info('════════════════════════════════════════════════════');
      logger.info(`  ✓ Server running at http://localhost:${env.port}`);
      logger.info(`  ✓ Health: http://localhost:${env.port}/api/health`);
      logger.info(`  ✓ API:    http://localhost:${env.port}/api`);
      logger.info('════════════════════════════════════════════════════');
    });

    // ── Graceful shutdown handler ─────────────────────────────────────────
    const shutdown = async (signal: string): Promise<void> => {
      logger.info(`[Server] ${signal} received — beginning graceful shutdown`);

      // Stop accepting new connections
      server.close(async () => {
        logger.info('[Server] HTTP server closed — no new connections accepted');

        // Close database connection
        await disconnectDB();

        logger.info('[Server] Shutdown complete. Goodbye.');
        process.exit(0);
      });

      // Force exit if graceful shutdown takes > 10 seconds
      // (e.g. a request is hanging — don't let the container get stuck)
      setTimeout(() => {
        logger.error('[Server] Graceful shutdown timed out — forcing exit');
        process.exit(1);
      }, 10_000).unref(); // .unref() prevents this timer from keeping the process alive
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT',  () => shutdown('SIGINT'));

  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    logger.error('[Server] Fatal error during startup — aborting', { message });
    process.exit(1);
  }
}

// ─── Launch ───────────────────────────────────────────────────────────────────
startServer();
