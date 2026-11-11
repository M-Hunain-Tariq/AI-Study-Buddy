import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db/client';
import { checkSyncRateLimit, getClientKey } from '@/lib/ai/rate-limit';
import { attachUserCookie, resolveUserId } from '@/lib/db/identity';
import { applySync, isTrackedKey, MAX_VALUE_BYTES, readState, touchUser, type SyncPayload, TRACKED_KEYS } from '@/lib/db/repo';
import { jsonReadError, jsonReadStatus, readJsonRequest } from '@/lib/server/read-json';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_REQUEST_BYTES = TRACKED_KEYS.length * MAX_VALUE_BYTES + 16_384;

/** GET: everything stored for this browser (used to restore after local data is lost). */
export async function GET(req: NextRequest) {
  const limit = checkSyncRateLimit(getClientKey(req));
  if (!limit.ok) return NextResponse.json({ ok: false, error: 'Too many sync requests. Please try again shortly.' }, { status: 429, headers: { 'Retry-After': String(limit.retryAfter), 'Cache-Control': 'no-store' } });
  try {
    const { userId } = resolveUserId(req);
    touchUser(getDb(), userId);
    const res = NextResponse.json({ ok: true, state: readState(userId) }, { headers: { 'Cache-Control': 'no-store' } });
    return attachUserCookie(res, userId);
  } catch (err) {
    console.error('[db] GET /api/db/sync failed:', err);
    return NextResponse.json({ ok: false, error: 'Database unavailable' }, { status: 503 });
  }
}

/** POST: { clear?: boolean, changes?: { [localStorageKey]: string | null } } */
export async function POST(req: NextRequest) {
  const limit = checkSyncRateLimit(getClientKey(req));
  if (!limit.ok) return NextResponse.json({ ok: false, error: 'Too many sync requests. Please try again shortly.' }, { status: 429, headers: { 'Retry-After': String(limit.retryAfter), 'Cache-Control': 'no-store' } });
  try {
    const parsedBody = await readJsonRequest(req, MAX_REQUEST_BYTES);
    if (!parsedBody.ok) {
      return NextResponse.json({ ok: false, ...jsonReadError(parsedBody.reason) }, { status: jsonReadStatus(parsedBody.reason) });
    }
    if (!parsedBody.value || typeof parsedBody.value !== 'object' || Array.isArray(parsedBody.value)) {
      return NextResponse.json({ ok: false, error: 'Request body must be a JSON object.' }, { status: 400 });
    }
    const body = parsedBody.value as SyncPayload;
    if (body.clear !== undefined && typeof body.clear !== 'boolean') {
      return NextResponse.json({ ok: false, error: 'The clear flag must be a boolean.' }, { status: 400 });
    }
    if (body.changes !== undefined && (!body.changes || typeof body.changes !== 'object' || Array.isArray(body.changes))) {
      return NextResponse.json({ ok: false, error: 'Changes must be an object.' }, { status: 400 });
    }
    const changes = body.changes ?? {};
    for (const [key, value] of Object.entries(changes)) {
      if (!isTrackedKey(key) || (value !== null && typeof value !== 'string')) {
        return NextResponse.json({ ok: false, error: 'The request contains an unsupported storage key or value.' }, { status: 400 });
      }
      if (typeof value === 'string' && Buffer.byteLength(value, 'utf8') > MAX_VALUE_BYTES) {
        return NextResponse.json({ ok: false, error: 'A stored value exceeds the 2 MB per-item limit.' }, { status: 413 });
      }
    }
    const { userId } = resolveUserId(req);
    const applied = applySync(userId, { clear: body.clear === true, changes });
    return attachUserCookie(NextResponse.json({ ok: true, applied }, { headers: { 'Cache-Control': 'no-store' } }), userId);
  } catch (err) {
    console.error('[db] POST /api/db/sync failed:', err);
    return NextResponse.json({ ok: false, error: 'Database unavailable' }, { status: 503 });
  }
}
