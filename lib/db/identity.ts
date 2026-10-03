import { randomUUID } from 'node:crypto';
import type { NextRequest, NextResponse } from 'next/server';

/**
 * Anonymous per-browser identity. The app has no login yet (sign-up only asks for a
 * name), so each browser gets a random id stored in an HttpOnly cookie. When real
 * accounts are added later, swap this one function for the authenticated user id.
 */
export const USER_COOKIE = 'sb_uid';
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function resolveUserId(req: NextRequest): { userId: string; isNew: boolean } {
  const existing = req.cookies.get(USER_COOKIE)?.value;
  if (existing && UUID_RE.test(existing)) return { userId: existing, isNew: false };
  return { userId: randomUUID(), isNew: true };
}

export function attachUserCookie(res: NextResponse, userId: string) {
  res.cookies.set(USER_COOKIE, userId, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 365 * 2,
  });
  return res;
}
