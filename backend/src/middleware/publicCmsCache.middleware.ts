/**
 * HTTP caching for public, read-only CMS GET endpoints.
 * Does NOT apply to authenticated / admin routes.
 *
 * Cache-Control allows short browser/CDN reuse; ETag enables 304 when unchanged.
 * Response JSON envelope is unchanged.
 */

import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';

const PUBLIC_CMS_CACHE_CONTROL =
  'public, max-age=60, s-maxage=60, stale-while-revalidate=300';

export function publicCmsCache(req: Request, res: Response, next: NextFunction): void {
  if (req.method !== 'GET') {
    next();
    return;
  }

  res.setHeader('Cache-Control', PUBLIC_CMS_CACHE_CONTROL);
  res.setHeader('Vary', 'Accept-Encoding');

  const originalJson = res.json.bind(res);
  res.json = ((body: unknown) => {
    try {
      const payload = typeof body === 'string' ? body : JSON.stringify(body);
      const etag = `"${crypto.createHash('sha1').update(payload).digest('hex')}"`;
      res.setHeader('ETag', etag);

      const clientEtag = req.headers['if-none-match'];
      if (clientEtag && clientEtag === etag) {
        res.status(304).end();
        return res;
      }
    } catch {
      // If hashing fails, still send the full response
    }
    return originalJson(body);
  }) as Response['json'];

  next();
}
