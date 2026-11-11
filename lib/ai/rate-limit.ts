import { isIP } from 'node:net';

type Bucket = { count: number; resetAt: number };
const aiBuckets = new Map<string, Bucket>();
const syncBuckets = new Map<string, Bucket>();
const WINDOW_MS = 60_000;
const AI_MAX_REQUESTS = 20;
const SYNC_MAX_REQUESTS = 120;
const MAX_BUCKETS = 10_000;
let aiRequestsSinceCleanup = 0;
let syncRequestsSinceCleanup = 0;

function checkLimit(map: Map<string, Bucket>, key: string, maxRequests: number, requestsSinceCleanup: number) {
  const now = Date.now();
  if (requestsSinceCleanup >= 128 || map.size >= MAX_BUCKETS) {
    for (const [bucketKey, bucket] of map) {
      if (bucket.resetAt <= now) map.delete(bucketKey);
    }
    requestsSinceCleanup = 0;
  }

  const current = map.get(key);
  if (!current || current.resetAt <= now) {
    if (map.size >= MAX_BUCKETS) {
      const oldestKey = map.keys().next().value;
      if (oldestKey !== undefined) map.delete(oldestKey);
    }
    map.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true as const, retryAfter: 0, requestsSinceCleanup: requestsSinceCleanup + 1 };
  }
  if (current.count >= maxRequests) {
    return { ok: false as const, retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)), requestsSinceCleanup: requestsSinceCleanup + 1 };
  }
  current.count += 1;
  return { ok: true as const, retryAfter: 0, requestsSinceCleanup: requestsSinceCleanup + 1 };
}

export function checkAiRateLimit(key: string) {
  const result = checkLimit(aiBuckets, key, AI_MAX_REQUESTS, aiRequestsSinceCleanup);
  aiRequestsSinceCleanup = result.requestsSinceCleanup;
  return { ok: result.ok, retryAfter: result.retryAfter };
}

/** Protects anonymous DB sync against rapid creation of fresh browser identities. */
export function checkSyncRateLimit(key: string) {
  const result = checkLimit(syncBuckets, key, SYNC_MAX_REQUESTS, syncRequestsSinceCleanup);
  syncRequestsSinceCleanup = result.requestsSinceCleanup;
  return { ok: result.ok, retryAfter: result.retryAfter };
}

/**
 * Use IP headers injected by known edge providers, never the first value of the
 * client-controlled X-Forwarded-For chain. For another trusted proxy, configure
 * TRUSTED_PROXY_IP_HEADER and make sure the proxy overwrites that header.
 */
export function getClientKey(req: Request) {
  const configuredHeader = process.env.TRUSTED_PROXY_IP_HEADER?.trim().toLowerCase();
  const headers = [
    configuredHeader,
    'x-nf-client-connection-ip', // Netlify
    'cf-connecting-ip', // Cloudflare
    'x-vercel-forwarded-for', // Vercel
  ].filter((header): header is string => Boolean(header));

  for (const header of [...new Set(headers)]) {
    const value = req.headers.get(header)?.trim();
    if (value && isIP(value)) return `ip:${value.toLowerCase()}`;
  }
  return 'unknown-client';
}
