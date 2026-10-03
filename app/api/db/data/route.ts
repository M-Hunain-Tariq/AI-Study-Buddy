import { NextRequest, NextResponse } from 'next/server';
import { resolveUserId } from '@/lib/db/identity';
import { COLLECTIONS, readCollection, readUser, type CollectionName } from '@/lib/db/repo';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/db/data                      -> user + all collections
 * GET /api/db/data?collection=notes     -> one of: notes | tasks | planner-tasks | planner-goals
 */
export async function GET(req: NextRequest) {
  try {
    const { userId, isNew } = resolveUserId(req);
    if (isNew) return NextResponse.json({ ok: true, user: null, data: {} });

    const wanted = req.nextUrl.searchParams.get('collection');
    if (wanted) {
      if (!(wanted in COLLECTIONS)) {
        return NextResponse.json({ ok: false, error: 'Unknown collection' }, { status: 400 });
      }
      return NextResponse.json({ ok: true, collection: wanted, items: readCollection(userId, wanted as CollectionName) });
    }

    const data = Object.fromEntries(
      (Object.keys(COLLECTIONS) as CollectionName[]).map((c) => [c, readCollection(userId, c)]),
    );
    return NextResponse.json({ ok: true, user: readUser(userId), data });
  } catch (err) {
    console.error('[db] GET /api/db/data failed:', err);
    return NextResponse.json({ ok: false, error: 'Database unavailable' }, { status: 503 });
  }
}
