/**
 * @file src/config/env.ts
 * @description Centralised environment variable configuration.
 *
 * ARCHITECTURE DECISION:
 *   All process.env access is isolated here. No other file should call
 *   process.env directly. This enables:
 *   - Single source of truth for all config
 *   - Early validation at startup (fail fast principle)
 *   - Easy mocking in tests
 *   - TypeScript-typed access everywhere
 */

// ─── Helper: Validate required variables ─────────────────────────────────────
// Exported for use by feature configs that require mandatory env vars (e.g. JWT in production)
export function required(key: string): string {
  const value = process.env[key]?.trim();
  if (!value) {
    throw new Error(`[Config] Missing required environment variable: ${key}`);
  }
  return value;
}

// ─── Helper: Optional variable with fallback ──────────────────────────────────
function optional(key: string, fallback: string): string {
  return process.env[key] ?? fallback;
}

// ─── Helper: Parse integer env var ────────────────────────────────────────────
function optionalInt(key: string, fallback: number): number {
  const value = process.env[key];
  const parsed = value ? parseInt(value, 10) : NaN;
  return isNaN(parsed) ? fallback : parsed;
}

// ─── Helper: Parse comma-separated client URLs ───────────────────────────────
function parseClientUrls(raw: string): string[] {
  const urls = raw
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
  return urls.length > 0 ? [...new Set(urls)] : ['http://localhost:8080'];
}

const clientUrls = parseClientUrls(optional('CLIENT_URL', 'http://localhost:8080'));

// ─── Exported config object ───────────────────────────────────────────────────
// Constructed once at module load time — any missing required var crashes here,
// before the HTTP server ever starts.
export const env = {

  // ── Server ────────────────────────────────────────────────────────────────
  nodeEnv:    optional('NODE_ENV', 'development'),
  port:       optionalInt('PORT', 5000),
  clientUrl:  clientUrls[0],
  clientUrls,
  apiPrefix:  optional('API_PREFIX', '/api'),

  // ── Database (MongoDB) ────────────────────────────────────────────────────
  // In development, defaults to local MongoDB.
  // In production, MONGODB_URI must be set (e.g. MongoDB Atlas connection string).
  mongoUri: optional('MONGODB_URI', 'mongodb://localhost:27017/techvistar'),

  // ── JWT Authentication (Phase 2) ──────────────────────────────────────────
  jwtAccessSecret:    optional('JWT_ACCESS_SECRET', optional('JWT_SECRET', 'change_me_before_production')),
  jwtRefreshSecret:   optional('JWT_REFRESH_SECRET', 'change_me_refresh_before_production'),
  accessTokenExpiry:  optional('ACCESS_TOKEN_EXPIRY', '15m'),
  refreshTokenExpiry: optional('REFRESH_TOKEN_EXPIRY', '7d'),
  loginRateLimitWindow: optionalInt('LOGIN_RATE_LIMIT_WINDOW', process.env.NODE_ENV === 'development' ? 60 * 1000 : 15 * 60 * 1000),
  loginRateLimitMax:    optionalInt('LOGIN_RATE_LIMIT_MAX', process.env.NODE_ENV === 'development' ? 100 : 5),

  // ── Cloudinary (Media Uploads — Phase 1.5) ───────────────────────────────
  // Required — server refuses to start without a valid Cloudinary account.
  cloudinaryCloudName: required('CLOUDINARY_CLOUD_NAME'),
  cloudinaryApiKey:    required('CLOUDINARY_API_KEY'),
  cloudinaryApiSecret: required('CLOUDINARY_API_SECRET'),

  // ── Email (Nodemailer — Phase 3) ──────────────────────────────────────────
  mailHost:    optional('MAIL_HOST', 'smtp.gmail.com'),
  mailPort:    optionalInt('MAIL_PORT', 587),
  mailUser:    optional('MAIL_USER', ''),
  mailPass:    optional('MAIL_PASS', ''),
  mailFrom:    optional('MAIL_FROM', 'TechVistar <no-reply@techvistar.in>'),

  // ── AI Services (Phase 4) ─────────────────────────────────────────────────
  openaiApiKey: optional('OPENAI_API_KEY', ''),
  geminiApiKey: optional('GEMINI_API_KEY', ''),

  // ── Logging ───────────────────────────────────────────────────────────────
  // Levels: error | warn | info | http | debug
  logLevel:  optional('LOG_LEVEL', 'http'),
  uploadDir: optional('UPLOAD_DIR', 'uploads'),

  // ── Derived helpers ───────────────────────────────────────────────────────
  // isDev and isProd are used throughout the codebase for conditional behaviour
  // (e.g. show error stack in dev, hide in prod)
  get isDev()  { return this.nodeEnv === 'development'; },
  get isProd() { return this.nodeEnv === 'production'; },
  get isTest() { return this.nodeEnv === 'test'; },
} as const;

// ─── Type export ──────────────────────────────────────────────────────────────
// Other files can import this type to annotate any function that receives config
export type Env = typeof env;
