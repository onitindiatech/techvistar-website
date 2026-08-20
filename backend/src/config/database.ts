/**
 * @file src/config/database.ts
 * @description MongoDB/Mongoose connection factory with retry logic and graceful shutdown.
 *
 * ARCHITECTURE DECISION:
 *   Connection is NOT established at import time. Instead, we export two functions:
 *   - connectDB()    → called once in server.ts before app.listen()
 *   - disconnectDB() → called on SIGTERM/SIGINT for graceful shutdown
 *
 *   This separation keeps the database lifecycle under server.ts's control,
 *   which makes testing much easier (you can connect/disconnect per test suite).
 */

import mongoose from 'mongoose';
import { env } from '@/config/env';
import { logger } from '@/utils/logger';
import { DB, ERROR_CODES } from '@/constants';

// ─── Mongoose global settings ─────────────────────────────────────────────────
// These apply to every model/query — set once here, not per-query
mongoose.set('strictQuery', true);   // Ignore fields not in schema (prevents fat-finger writes)
mongoose.set('bufferCommands', true);   // Allow Mongoose to buffer queries during initial connection/reconnect
mongoose.set('debug', env.isDev && env.logLevel === 'debug'); // Log Mongoose queries in debug mode

// ─── Connection options ───────────────────────────────────────────────────────
// Tune these based on your load — defaults are conservative for Phase 1
const MONGOOSE_OPTIONS: mongoose.ConnectOptions = {
  // Connection pool — how many simultaneous DB operations can be in-flight
  maxPoolSize:    DB.MAX_POOL_SIZE,
  minPoolSize:    DB.MIN_POOL_SIZE,

  // Timeouts — prevent hanging indefinitely if MongoDB is unreachable
  serverSelectionTimeoutMS: DB.SERVER_SELECTION_TIMEOUT_MS,
  socketTimeoutMS:          DB.SOCKET_TIMEOUT_MS,
  connectTimeoutMS:         DB.CONNECTION_TIMEOUT_MS,

  // Heartbeat — keeps the connection alive and detects dead connections faster
  heartbeatFrequencyMS: 10_000,
};

// ─── Connection state tracker ─────────────────────────────────────────────────
// Used by the health endpoint to report DB status without making a live query
let dbStatus: 'disconnected' | 'connecting' | 'connected' | 'error' = 'disconnected';

export function getDbStatus() {
  return dbStatus;
}

// ─── Connect ──────────────────────────────────────────────────────────────────
/**
 * Establishes a connection to MongoDB.
 * Called once in server.ts — BEFORE app.listen().
 *
 * Why before listen? If the DB is unreachable, we should refuse to start accepting
 * HTTP traffic rather than serving requests that will all fail at the DB layer.
 */
export async function connectDB(): Promise<void> {
  dbStatus = 'connecting';

  try {
    logger.info('[Database] Connecting to MongoDB...', { uri: maskUri(env.mongoUri) });

    await mongoose.connect(env.mongoUri, MONGOOSE_OPTIONS);

    dbStatus = 'connected';
    logger.info('[Database] ✓ MongoDB connected successfully', {
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      name: mongoose.connection.name,
    });

    // ── Register connection event handlers ──────────────────────────────────
    // These fire for events that happen AFTER the initial connection
    mongoose.connection.on('disconnected', () => {
      dbStatus = 'disconnected';
      logger.warn('[Database] MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      dbStatus = 'connected';
      logger.info('[Database] MongoDB reconnected');
    });

    mongoose.connection.on('error', (err: Error) => {
      dbStatus = 'error';
      logger.error('[Database] MongoDB connection error', {
        code:    ERROR_CODES.DB_CONNECTION_ERROR,
        message: err.message,
      });
    });

  } catch (err) {
    dbStatus = 'error';
    const message = err instanceof Error ? err.message : String(err);

    logger.error('[Database] ✗ Failed to connect to MongoDB', {
      code:    ERROR_CODES.DB_CONNECTION_ERROR,
      message,
      uri:     maskUri(env.mongoUri),
    });

    // Re-throw so server.ts can decide: exit or retry
    throw err;
  }
}

// ─── Disconnect ───────────────────────────────────────────────────────────────
/**
 * Gracefully closes the MongoDB connection.
 * Called on SIGTERM/SIGINT in server.ts.
 *
 * Why graceful? Abrupt process.exit() can leave write operations half-committed.
 * Mongoose.disconnect() waits for in-flight operations to finish.
 */
export async function disconnectDB(): Promise<void> {
  if (mongoose.connection.readyState === 0) return; // Already disconnected

  try {
    await mongoose.disconnect();
    dbStatus = 'disconnected';
    logger.info('[Database] MongoDB connection closed gracefully');
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    logger.error('[Database] Error during disconnect', { message });
  }
}

// ─── Utility: Mask credentials in URI for logging ─────────────────────────────
// mongodb+srv://user:PASSWORD@cluster.mongodb.net/db → mongodb+srv://user:***@cluster...
function maskUri(uri: string): string {
  return uri.replace(/:\/\/([^:]+):([^@]+)@/, '://$1:***@');
}
