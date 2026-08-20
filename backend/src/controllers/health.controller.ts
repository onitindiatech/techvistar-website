/**
 * @file src/controllers/health.controller.ts
 * @description Controller for the health check endpoint.
 *
 * ARCHITECTURE DECISION:
 *   Controllers contain ONLY:
 *   1. Extracting data from req
 *   2. Calling service/util functions
 *   3. Sending the response via ApiResponse
 *
 *   No business logic, no DB queries — those go in services/repositories.
 *   Keeping controllers thin makes them easy to test and modify.
 */

import { Request, Response } from 'express';
import os from 'os';
import { ApiResponse } from '@/utils/ApiResponse';
import { getDbStatus } from '@/config/database';
import { env } from '@/config/env';
import { HTTP_STATUS } from '@/constants';

// ─── Health check ─────────────────────────────────────────────────────────────
/**
 * GET /api/health
 *
 * Returns:
 * - status:       'ok' | 'degraded' (degraded if DB is not connected)
 * - environment:  current NODE_ENV
 * - uptime:       process uptime in seconds
 * - timestamp:    current ISO timestamp
 * - version:      API version
 * - database:     MongoDB connection status
 * - system:       basic OS stats (memory, platform, arch)
 */
export async function healthCheck(_req: Request, res: Response): Promise<void> {
  const dbStatus  = getDbStatus();
  const isHealthy = dbStatus === 'connected';

  // 'degraded' means the server is running but not all dependencies are healthy
  const overallStatus = isHealthy ? 'ok' : 'degraded';

  // System memory in MB — useful for detecting memory leaks in production
  const totalMemoryMB = Math.round(os.totalmem() / 1024 / 1024);
  const freeMemoryMB  = Math.round(os.freemem()  / 1024 / 1024);
  const usedMemoryMB  = totalMemoryMB - freeMemoryMB;

  // Process memory (heap usage)
  const heapUsed  = Math.round(process.memoryUsage().heapUsed  / 1024 / 1024);
  const heapTotal = Math.round(process.memoryUsage().heapTotal / 1024 / 1024);

  const data = {
    status:      overallStatus,
    environment: env.nodeEnv,
    version:     'v1',
    timestamp:   new Date().toISOString(),
    uptime: {
      seconds:     Math.floor(process.uptime()),
      human:       formatUptime(process.uptime()),
    },
    database: {
      status: dbStatus,
      uri:    maskUri(env.mongoUri),
    },
    system: {
      platform:    process.platform,
      arch:        process.arch,
      nodeVersion: process.version,
      memory: {
        totalMB: totalMemoryMB,
        usedMB:  usedMemoryMB,
        freeMB:  freeMemoryMB,
      },
      heap: {
        usedMB:  heapUsed,
        totalMB: heapTotal,
      },
    },
  };

  // Return 503 if degraded — load balancers use the status code to route traffic
  const statusCode = isHealthy ? HTTP_STATUS.OK : HTTP_STATUS.SERVICE_UNAVAILABLE;

  ApiResponse.success(res, data, 'Veenero API is operational', statusCode);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatUptime(seconds: number): string {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return [
    d > 0 ? `${d}d` : '',
    h > 0 ? `${h}h` : '',
    m > 0 ? `${m}m` : '',
    `${s}s`,
  ].filter(Boolean).join(' ');
}

function maskUri(uri: string): string {
  return uri.replace(/:\/\/([^:]+):([^@]+)@/, '://$1:***@');
}
