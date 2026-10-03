import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db/client';
import { attachUserCookie, resolveUserId } from '@/lib/db/identity';
import { applySync, readState, touchUser, type SyncPayload } from '@/lib/db/repo';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** GET: everything stored for this browser (used to restore after local data is lost). */
export async function GET(req: NextRequest) {
  try {
    const { userId } = resolveUserId(req);
    touchUser(getDb(), userId);
    const res = NextResponse.json({ ok: true, state: readState(userId) });
    return attachUserCookie(res, userId);
  } catch (err) {
    console.error('[db] GET /api/db/sync failed:', err);
    return NextResponse.json({ ok: false, error: 'Database unavailable' }, { status: 503 });
  }
}

/** POST: { clear?: boolean, changes?: { [localStorageKey]: string | null } } */
export async function POST(req: NextRequest) {
  try {
    const { userId } = resolveUserId(req);
    const body = (await req.json().catch(() => null)) as SyncPayload | null;
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ ok: false, error: 'Invalid body' }, { status: 400 });
    }
    const applied = applySync(userId, {
      clear: body.clear === true,
      changes: body.changes && typeof body.changes === 'object' ? body.changes : {},
    });
    return attachUserCookie(NextResponse.json({ ok: true, applied }), userId);
  } catch (err) {
    console.error('[db] POST /api/db/sync failed:', err);
    return NextResponse.json({ ok: false, error: 'Database unavailable' }, { status: 503 });
  }
}
