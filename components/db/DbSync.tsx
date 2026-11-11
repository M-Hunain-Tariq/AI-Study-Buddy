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
  'study_streak_state_v1',
  'study_quiz_history_v1',
  'studybuddy_ai_language',
  'studybuddy_ai_chat_history',
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
  let retryCount = 0;
  let inFlight = false;
  let flushAsBeaconAfterFlight = false;

  const hasPending = () => pending.clear || Object.keys(pending.changes).length > 0;

  const restorePending = (snapshot: Pending) => {
    // Newer writes win; an explicit clear remains ordered before any later writes.
    if (pending.clear) return;
    pending = {
      clear: snapshot.clear || pending.clear,
      changes: { ...snapshot.changes, ...pending.changes },
    };
  };
  const schedule = (delay = DEBOUNCE_MS) => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => flush(), delay);
  };
  const flush = (useBeacon = false) => {
    window.clearTimeout(timer);
    timer = undefined;
    if (!hasPending()) return;
    if (inFlight) {
      flushAsBeaconAfterFlight = flushAsBeaconAfterFlight || useBeacon;
      return;
    }

    const snapshot = pending;
    const body = JSON.stringify(snapshot);
    pending = { clear: false, changes: {} };
    try {
      if (useBeacon && navigator.sendBeacon) {
        const accepted = navigator.sendBeacon(ENDPOINT, new Blob([body], { type: 'application/json' }));
        if (accepted) {
          retryCount = 0;
          return;
        }
      }

      // Serialize requests so an older failed request cannot overwrite a newer save.
      inFlight = true;
      fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: useBeacon })
        .then((response) => {
          if (!response.ok) throw new Error(`Database sync failed (${response.status})`);
          retryCount = 0;
        })
        .catch(() => {
          restorePending(snapshot);
          retryCount = Math.min(retryCount + 1, 3);
        })
        .finally(() => {
          inFlight = false;
          const shouldUseBeacon = flushAsBeaconAfterFlight;
          flushAsBeaconAfterFlight = false;
          if (hasPending()) {
            if (shouldUseBeacon) {
              flush(true);
            } else if (retryCount > 0 && retryCount < 3) {
              schedule(Math.min(2_000 * 2 ** (retryCount - 1), 16_000));
            } else if (retryCount === 0) {
              schedule();
            }
          }
        });
    } catch {
      inFlight = false;
      restorePending(snapshot);
      retryCount = Math.min(retryCount + 1, 3);
      if (retryCount < 3) schedule(Math.min(2_000 * 2 ** (retryCount - 1), 16_000));
    }
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
    if (document.visibilityState === 'hidden') flush();
  });

  // Initial reconcile: restore what's missing locally, back up what the DB lacks.
  (async () => {
    try {
      const res = await fetch(ENDPOINT, { cache: 'no-store' });
      if (!res.ok) return;
      const { state } = (await res.json()) as { state: Record<string, string> };

      let restored = false;
      for (const key of TRACKED) {
        // A deletion/clear made while GET was in flight must beat stale server state.
        if (!pending.clear && !Object.prototype.hasOwnProperty.call(pending.changes, key) && window.localStorage.getItem(key) === null && typeof state[key] === 'string') {
          origSet.call(window.localStorage, key, state[key]);
          restored = true;
        }
      }
      for (const key of TRACKED) {
        const local = window.localStorage.getItem(key);
        if (local !== null && local !== state[key]) pending.changes[key] = local;
      }
      flush();

      // Never force a full-page reload during navigation. A reload here made the
      // landing-page CTA feel slow because the destination mounted, synced, and
      // then immediately navigated again. Missing local state is restored silently.
      if (restored) {
        try { sessionStorage.setItem('sb_db_restored', '1'); } catch { /* ignore */ }
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
