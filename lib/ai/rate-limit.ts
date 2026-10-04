type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 20;
export function checkAiRateLimit(key: string) {
  const now = Date.now();
  const current = buckets.get(key);
  if (!current || current.resetAt <= now) { buckets.set(key, { count: 1, resetAt: now + WINDOW_MS }); return { ok: true, retryAfter: 0 }; }
  if (current.count >= MAX_REQUESTS) return { ok: false, retryAfter: Math.ceil((current.resetAt - now) / 1000) };
  current.count += 1; return { ok: true, retryAfter: 0 };
}
export function getClientKey(req: Request) {
  const forwarded = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const real = req.headers.get('x-real-ip')?.trim();
  return forwarded || real || 'unknown-client';
}
