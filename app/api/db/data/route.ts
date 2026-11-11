import { NextRequest, NextResponse } from 'next/server';
import { resolveUserId, attachUserCookie } from '@/lib/db/identity';
import { COLLECTIONS, readCollection, readUser, type CollectionName } from '@/lib/db/repo';
import { checkSyncRateLimit, getClientKey } from '@/lib/ai/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/db/data                      -> user + all collections
 * GET /api/db/data?collection=notes     -> one of: notes | tasks | planner-tasks | planner-goals
 */
export async function GET(req: NextRequest) {
  const limit = checkSyncRateLimit(getClientKey(req));
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: 'Too many data requests. Please try again shortly.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfter), 'Cache-Control': 'no-store' } },
    );
  }

  try {
    const { userId, isNew } = resolveUserId(req);
    if (isNew) {
      const res = NextResponse.json({ ok: true, user: null, data: {} }, { headers: { 'Cache-Control': 'no-store' } });
      return attachUserCookie(res, userId);
    }

    const wanted = req.nextUrl.searchParams.get('collection');
    if (wanted) {
      if (!Object.prototype.hasOwnProperty.call(COLLECTIONS, wanted)) {
        return NextResponse.json({ ok: false, error: 'Unknown collection' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
      }
      const res = NextResponse.json(
        { ok: true, collection: wanted, items: readCollection(userId, wanted as CollectionName) },
        { headers: { 'Cache-Control': 'no-store' } },
      );
      return attachUserCookie(res, userId);
    }

    const data = Object.fromEntries(
      (Object.keys(COLLECTIONS) as CollectionName[]).map((collection) => [collection, readCollection(userId, collection)]),
    );
    const res = NextResponse.json({ ok: true, user: readUser(userId), data }, { headers: { 'Cache-Control': 'no-store' } });
    return attachUserCookie(res, userId);
  } catch (err) {
    console.error('[db] GET /api/db/data failed:', err);
    return NextResponse.json({ ok: false, error: 'Database unavailable' }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
}
