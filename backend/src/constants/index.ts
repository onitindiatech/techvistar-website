/**
 * @file src/constants/index.ts
 * @description Application-wide constants.
 *
 * ARCHITECTURE DECISION:
 *   Magic numbers and magic strings are a maintenance trap. Any value that
 *   appears in more than one file — or could change in the future — lives here.
 */

// ─── HTTP Status Codes ────────────────────────────────────────────────────────
// Named constants instead of bare numbers — improves readability and prevents
// typos (returning 20 instead of 200 is caught by TypeScript when you use the enum)
export const HTTP_STATUS = {
  // 2xx — Success
  OK:                    200,
  CREATED:               201,
  ACCEPTED:              202,
  NO_CONTENT:            204,

  // 3xx — Redirection
  MOVED_PERMANENTLY:     301,
  NOT_MODIFIED:          304,

  // 4xx — Client Errors
  BAD_REQUEST:           400,
  UNAUTHORIZED:          401,
  FORBIDDEN:             403,
  NOT_FOUND:             404,
  METHOD_NOT_ALLOWED:    405,
  CONFLICT:              409,
  UNPROCESSABLE_ENTITY:  422,
  TOO_MANY_REQUESTS:     429,

  // 5xx — Server Errors
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED:       501,
  BAD_GATEWAY:           502,
  SERVICE_UNAVAILABLE:   503,
} as const;

// ─── API Response Status Strings ─────────────────────────────────────────────
// Used in ApiResponse.ts to set the `status` field on every JSON envelope
export const API_STATUS = {
  SUCCESS: 'success',
  ERROR:   'error',
  FAIL:    'fail',      // Client fault (4xx)
} as const;

// ─── Error Codes ─────────────────────────────────────────────────────────────
// Machine-readable error codes returned in the JSON envelope.
// The frontend / admin panel can switch on these instead of comparing messages.
export const ERROR_CODES = {
  // Generic
  INTERNAL_ERROR:      'INTERNAL_ERROR',
  VALIDATION_ERROR:    'VALIDATION_ERROR',
  NOT_FOUND:           'NOT_FOUND',
  UNAUTHORIZED:        'UNAUTHORIZED',
  FORBIDDEN:           'FORBIDDEN',
  CONFLICT:            'CONFLICT',
  TOO_MANY_REQUESTS:   'TOO_MANY_REQUESTS',
  BAD_REQUEST:         'BAD_REQUEST',

  // Auth-specific (Phase 2)
  INVALID_TOKEN:       'INVALID_TOKEN',
  TOKEN_EXPIRED:       'TOKEN_EXPIRED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  ACCOUNT_LOCKED:      'ACCOUNT_LOCKED',

  // Database-specific
  DB_CONNECTION_ERROR: 'DB_CONNECTION_ERROR',
  DB_QUERY_ERROR:      'DB_QUERY_ERROR',
  DUPLICATE_KEY:       'DUPLICATE_KEY',
} as const;

// ─── Database Constants ───────────────────────────────────────────────────────
export const DB = {
  CONNECTION_TIMEOUT_MS: 30_000,   // 30s — Atlas SRV DNS can be slow on some networks
  SOCKET_TIMEOUT_MS:     45_000,   // 45 seconds
  MAX_POOL_SIZE:         10,        // Max concurrent connections
  MIN_POOL_SIZE:         2,         // Keep 2 connections alive (reduce cold start latency)
  SERVER_SELECTION_TIMEOUT_MS: 30_000, // 30s — default 5s often fails with querySrv ETIMEOUT
} as const;

// ─── Rate Limiting ────────────────────────────────────────────────────────────
export const RATE_LIMIT = {
  WINDOW_MS:   15 * 60 * 1000,  // 15 minutes
  MAX_REQUESTS: 100,              // Max requests per window per IP
  SKIP_SUCCESSFUL_REQUESTS: false,
} as const;

export const CONTACT_RATE_LIMIT = {
  WINDOW_MS:    15 * 60 * 1000, // 15 minutes
  MAX_REQUESTS: 5,              // Max 5 requests per window per IP
} as const;

export const NEWSLETTER_RATE_LIMIT = {
  WINDOW_MS:    15 * 60 * 1000, // 15 minutes
  MAX_REQUESTS: 3,              // Max 3 requests per window per IP
} as const;

// ─── Media Upload (Cloudinary — Phase 1.5) ────────────────────────────────────
export const UPLOAD = {
  MAX_FILE_SIZE_BYTES: 10 * 1024 * 1024, // 10 MB
  FIELD_NAME:          'image',
  CLOUDINARY_FOLDER:   'techvistar/uploads',
  ALLOWED_MIME_TYPES: [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/svg+xml',
  ] as const,
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp', '.svg'] as const,
} as const;

export const VIDEO_UPLOAD = {
  MAX_FILE_SIZE_BYTES: 50 * 1024 * 1024, // 50 MB
  FIELD_NAME:          'video',
  CLOUDINARY_FOLDER:   'techvistar/uploads/videos',
  ALLOWED_MIME_TYPES: [
    'video/mp4',
    'video/webm',
  ] as const,
  ALLOWED_EXTENSIONS: ['.mp4', '.webm'] as const,
} as const;

export const RESUME_UPLOAD = {
  MAX_FILE_SIZE_BYTES: 5 * 1024 * 1024, // 5 MB
  FIELD_NAME:          'resume',
  CLOUDINARY_FOLDER:   'techvistar/resumes',
  ALLOWED_MIME_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/png',
    'image/jpeg',
    'image/jpg',
  ] as const,
  ALLOWED_EXTENSIONS: ['.pdf', '.doc', '.docx', '.png', '.jpg', '.jpeg'] as const,
} as const;

// ─── Validation Constraints ───────────────────────────────────────────────────
export const VALIDATION = {
  EMAIL_REGEX: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
  // Allows optional leading '+', followed by digits, spaces, hyphens, and parentheses. Length between 7 and 25.
  PHONE_REGEX: /^\+?[0-9\s\-()]{7,25}$/,
  VALID_SERVICES: ['web-development', 'mobile-development', 'ui-ux', 'consulting', 'other'] as const,
  NEWSLETTER_SOURCES: ['footer', 'blog_popup', 'contact_form', 'hero'] as const,
  JOB_DEPARTMENTS: ['Engineering', 'Design', 'Marketing', 'Sales', 'Product', 'Operations', 'Other'] as const,
  JOB_EMPLOYMENT_TYPES: ['Full-time', 'Part-time', 'Contract', 'Internship'] as const,
  JOB_STATUSES: ['active', 'closed', 'draft'] as const,
  JOB_APPLICATION_STATUSES: ['Pending', 'Shortlisted', 'Interview', 'Rejected', 'Selected'] as const,
  LIMITS: {
    NAME_MAX:    100,
    PHONE_MAX:   30,
    COMPANY_MAX: 100,
    BUDGET_MAX:  100,
    MESSAGE_MAX: 1000,
  }
} as const;

// ─── Pagination Defaults ──────────────────────────────────────────────────────
export const PAGINATION = {
  DEFAULT_PAGE:  1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT:     100,
} as const;

// ─── API Versioning ───────────────────────────────────────────────────────────
export const API_VERSION = 'v1' as const;

// ─── CORS Origins ─────────────────────────────────────────────────────────────
// Development origins — production origins come from env.clientUrls (CLIENT_URL)
export const DEV_ORIGINS = [
  'http://localhost:8080',   // Vite dev server (frontend)
  'http://localhost:8081',   // Vite dev server — fallback port when 8080 is occupied
  'http://localhost:8082',   // Vite dev server — fallback port when 8080/8081 are occupied
  'http://localhost:3000',   // Future admin panel
  'http://localhost:5173',   // Alternative Vite port
] as const;

