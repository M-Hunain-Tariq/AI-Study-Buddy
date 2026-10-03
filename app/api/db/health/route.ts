import { NextResponse } from 'next/server';
import { getDb, getDbPath } from '@/lib/db/client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = getDb();
    const version = Number(db.prepare('PRAGMA user_version').get()?.user_version ?? 0);
    const users = Number(db.prepare('SELECT COUNT(*) AS n FROM users').get()?.n ?? 0);
    return NextResponse.json({
      ok: true,
      engine: 'sqlite (node:sqlite)',
      schemaVersion: version,
      users,
      file: process.env.NODE_ENV === 'production' ? undefined : getDbPath(),
    });
  } catch (err) {
    return NextResponse.json({ ok: false, error: (err as Error).message }, { status: 503 });
  }
}
