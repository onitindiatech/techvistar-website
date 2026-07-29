import mongoose from 'mongoose';
import { getDbStatus } from '@/config/database';
import { env } from '@/config/env';

export type DashboardSystemStatus = {
  key: string;
  label: string;
  status: 'online' | 'degraded' | 'offline';
  detail?: string;
  healthPercent: number;
};

function resolveStatus(healthPercent: number): DashboardSystemStatus['status'] {
  if (healthPercent >= 90) return 'online';
  if (healthPercent >= 40) return 'degraded';
  return 'offline';
}

function isProductionSafeSecret(secret: string, fallbackMarkers: string[]): boolean {
  if (!secret?.trim()) return false;
  if (!env.isProd) return true;
  return !fallbackMarkers.some((marker) => secret.includes(marker));
}

export function buildSystemStatus(): DashboardSystemStatus[] {
  const dbStatus = getDbStatus();
  const dbHealth =
    dbStatus === 'connected' ? 100 : dbStatus === 'connecting' ? 55 : 0;

  const jwtConfigured =
    isProductionSafeSecret(env.jwtAccessSecret, ['change_me']) &&
    isProductionSafeSecret(env.jwtRefreshSecret, ['change_me']);

  const cloudinaryConfigured = Boolean(
    env.cloudinaryCloudName && env.cloudinaryApiKey && env.cloudinaryApiSecret,
  );

  const smtpConfigured = Boolean(env.mailUser?.trim() && env.mailPass?.trim());
  const smtpPartial = Boolean(env.mailHost?.trim() && env.mailUser?.trim());

  const openAiConfigured = Boolean(env.openaiApiKey?.trim());
  const geminiConfigured = Boolean(env.geminiApiKey?.trim());
  const aiConfigured = openAiConfigured || geminiConfigured;

  const envLoaded = Boolean(env.mongoUri?.trim() && env.apiPrefix?.trim());

  const rows: Array<Omit<DashboardSystemStatus, 'status'>> = [
    {
      key: 'api',
      label: 'API Gateway',
      healthPercent: dbStatus === 'connected' ? 100 : dbStatus === 'connecting' ? 60 : 20,
      detail: `${env.nodeEnv} · uptime ${Math.floor(process.uptime())}s`,
    },
    {
      key: 'database',
      label: 'MongoDB',
      healthPercent: dbHealth,
      detail: dbStatus,
    },
    {
      key: 'authentication',
      label: 'Authentication (JWT)',
      healthPercent: jwtConfigured ? 100 : 35,
      detail: jwtConfigured ? 'JWT secrets configured' : 'JWT secrets missing or unsafe',
    },
    {
      key: 'storage',
      label: 'Cloudinary Storage',
      healthPercent: cloudinaryConfigured ? 100 : 0,
      detail: cloudinaryConfigured ? `Cloudinary · ${env.cloudinaryCloudName}` : 'Cloudinary not configured',
    },
    {
      key: 'smtp',
      label: 'Email Service (SMTP)',
      healthPercent: smtpConfigured ? 100 : smtpPartial ? 55 : 0,
      detail: smtpConfigured
        ? `${env.mailHost}:${env.mailPort}`
        : smtpPartial
          ? 'SMTP host/user set, password missing'
          : 'SMTP not configured',
    },
    {
      key: 'openai',
      label: 'OpenAI',
      healthPercent: openAiConfigured ? 100 : 0,
      detail: openAiConfigured ? 'API key configured' : 'Not configured',
    },
    {
      key: 'environment',
      label: 'Environment Variables',
      healthPercent: envLoaded ? 100 : 40,
      detail: envLoaded ? 'Core environment loaded' : 'Missing core environment values',
    },
  ];

  if (geminiConfigured && !openAiConfigured) {
    rows.push({
      key: 'gemini',
      label: 'Gemini',
      healthPercent: 100,
      detail: 'API key configured',
    });
  }

  if (!aiConfigured) {
    rows.push({
      key: 'ai',
      label: 'AI Services',
      healthPercent: 0,
      detail: 'No AI provider configured',
    });
  }

  return rows.map((row) => ({
    ...row,
    status: resolveStatus(row.healthPercent),
  }));
}

export async function getDatabaseStats(): Promise<{ dataSizeMB: number; collections: number } | null> {
  try {
    if (mongoose.connection.readyState !== 1 || !mongoose.connection.db) {
      return null;
    }
    const stats = await mongoose.connection.db.stats();
    return {
      dataSizeMB: Math.round(Number(stats.dataSize ?? 0) / (1024 * 1024)),
      collections: Number(stats.collections ?? 0),
    };
  } catch {
    return null;
  }
}

export async function getAverageContactResponseHours(): Promise<number | null> {
  const { Contact } = await import('@/models/Contact');
  const [row] = await Contact.aggregate([
    {
      $match: {
        isDeleted: { $ne: true },
        status: 'resolved',
        updatedAt: { $exists: true },
        createdAt: { $exists: true },
      },
    },
    {
      $project: {
        responseMs: { $subtract: ['$updatedAt', '$createdAt'] },
      },
    },
    { $match: { responseMs: { $gte: 0 } } },
    {
      $group: {
        _id: null,
        avgMs: { $avg: '$responseMs' },
      },
    },
  ]);

  if (!row?.avgMs) return null;
  return Number((Number(row.avgMs) / (1000 * 60 * 60)).toFixed(1));
}
