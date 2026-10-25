type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 20;
const MAX_BUCKETS = 10_000;
let requestsSinceCleanup = 0;

function pruneExpired(now: number) {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

export function checkAiRateLimit(key: string) {
  const now = Date.now();
  // Bound memory when clients send many distinct IP/header values.
  requestsSinceCleanup += 1;
  if (requestsSinceCleanup >= 128 || buckets.size >= MAX_BUCKETS) {
    pruneExpired(now);
    requestsSinceCleanup = 0;
  }

  const current = buckets.get(key);
  if (!current || current.resetAt <= now) {
    if (buckets.size >= MAX_BUCKETS) {
      const oldestKey = buckets.keys().next().value;
      if (oldestKey !== undefined) buckets.delete(oldestKey);
    }
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true, retryAfter: 0 };
  }
  if (current.count >= MAX_REQUESTS) {
    return { ok: false, retryAfter: Math.ceil((current.resetAt - now) / 1000) };
  }
  current.count += 1;
  return { ok: true, retryAfter: 0 };
}

export function getClientKey(req: Request) {
  const forwarded = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const real = req.headers.get('x-real-ip')?.trim();
  return forwarded || real || 'unknown-client';
}
