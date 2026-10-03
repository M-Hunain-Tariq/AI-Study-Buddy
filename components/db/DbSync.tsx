'use client';

import { useEffect } from 'react';

/**
 * Invisible component that connects the existing app to the database without
 * touching any existing page or component:
 *  1. Watches the app's own localStorage keys and saves every change to the DB.
 *  2. On load, backs up current local data and restores anything the browser lost.
 * All failures are swallowed - if the database is down, the app keeps working
 * exactly as before on localStorage.
 */

const TRACKED = [
  'studybuddy_user_name',
  'studybuddy-settings-v1',
  'study_notes_v5',
  'study_tasks_v4',
  'study_planner_tasks',
  'study_planner_goals',
  'study_streak_days',
];
const ENDPOINT = '/api/db/sync';
const DEBOUNCE_MS = 600;

type Pending = { clear: boolean; changes: Record<string, string | null> };

declare global {
  interface Window {
    __sbDbSync?: boolean;
  }
}

function start() {
  if (typeof window === 'undefined' || window.__sbDbSync) return;
  window.__sbDbSync = true;

  const proto = Storage.prototype;
  const origSet = proto.setItem;
  const origRemove = proto.removeItem;
  const origClear = proto.clear;
  const isLocal = (s: Storage) => {
    try {
      return s === window.localStorage;
    } catch {
      return false;
    }
  };

  let pending: Pending = { clear: false, changes: {} };
  let timer: number | undefined;

  const hasPending = () => pending.clear || Object.keys(pending.changes).length > 0;

  const flush = (useBeacon = false) => {
    window.clearTimeout(timer);
    timer = undefined;
    if (!hasPending()) return;
    const body = JSON.stringify(pending);
    pending = { clear: false, changes: {} };
    try {
      if (useBeacon && navigator.sendBeacon) {
        navigator.sendBeacon(ENDPOINT, new Blob([body], { type: 'application/json' }));
      } else {
        fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true }).catch(() => {});
      }
    } catch {
      /* ignore */
    }
  };
  const schedule = () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => flush(), DEBOUNCE_MS);
  };

  proto.setItem = function (this: Storage, key: string, value: string) {
    origSet.call(this, key, value);
    if (isLocal(this) && TRACKED.includes(key)) {
      pending.changes[key] = String(value);
      schedule();
    }
  };
  proto.removeItem = function (this: Storage, key: string) {
    origRemove.call(this, key);
    if (isLocal(this) && TRACKED.includes(key)) {
      pending.changes[key] = null;
      schedule();
    }
  };
  proto.clear = function (this: Storage) {
    origClear.call(this);
    if (isLocal(this)) {
      pending = { clear: true, changes: {} };
      schedule();
    }
  };

  window.addEventListener('pagehide', () => flush(true));
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flush(true);
  });

  // Initial reconcile: restore what's missing locally, back up what the DB lacks.
  (async () => {
    try {
      const res = await fetch(ENDPOINT, { cache: 'no-store' });
      if (!res.ok) return;
      const { state } = (await res.json()) as { state: Record<string, string> };

      let restored = false;
      for (const key of TRACKED) {
        if (window.localStorage.getItem(key) === null && typeof state[key] === 'string') {
          origSet.call(window.localStorage, key, state[key]);
          restored = true;
        }
      }
      for (const key of TRACKED) {
        const local = window.localStorage.getItem(key);
        if (local !== null && local !== state[key]) pending.changes[key] = local;
      }
      flush();

      if (restored && !sessionStorage.getItem('sb_db_restored')) {
        sessionStorage.setItem('sb_db_restored', '1');
        window.location.reload();
      }
    } catch {
      /* database unreachable - app continues on localStorage */
    }
  })();
}

export default function DbSync() {
  useEffect(() => {
    start();
  }, []);
  return null;
}
