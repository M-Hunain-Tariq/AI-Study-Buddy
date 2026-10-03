import { getDb, transaction, type Database } from './client';

/** localStorage keys the app already uses -> mirrored into the database. */
export const TRACKED_KEYS = [
  'studybuddy_user_name',
  'studybuddy-settings-v1',
  'study_notes_v5',
  'study_tasks_v4',
  'study_planner_tasks',
  'study_planner_goals',
  'study_streak_days',
] as const;
export type TrackedKey = (typeof TRACKED_KEYS)[number];
export const isTrackedKey = (k: string): k is TrackedKey => (TRACKED_KEYS as readonly string[]).includes(k);

export const MAX_VALUE_BYTES = 2_000_000;

type Obj = Record<string, unknown>;
const str = (v: unknown): string | null => (v === undefined || v === null ? null : String(v));
const num = (v: unknown): number | null => (typeof v === 'number' && Number.isFinite(v) ? v : null);
const bool = (v: unknown): number => (v ? 1 : 0);
const isObj = (v: unknown): v is Obj => typeof v === 'object' && v !== null && !Array.isArray(v);

function parseArray(raw: string): Obj[] | null {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isObj).filter((r) => r.id !== undefined) : null;
  } catch {
    return null;
  }
}

export function touchUser(db: Database, userId: string, name?: string | null) {
  const now = Date.now();
  db.prepare(
    `INSERT INTO users (id, name, created_at, last_seen_at) VALUES (?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET last_seen_at = excluded.last_seen_at,
       name = COALESCE(excluded.name, users.name)`,
  ).run(userId, name ?? null, now, now);
}

/** Replace a user's rows in a normalized table with the rows parsed from the mirrored array. */
function replaceRows(
  db: Database,
  table: string,
  userId: string,
  rows: Obj[],
  cols: string[],
  map: (r: Obj) => (string | number | null)[],
) {
  db.prepare(`DELETE FROM ${table} WHERE user_id = ?`).run(userId);
  const insert = db.prepare(
    `INSERT OR REPLACE INTO ${table} (user_id, id, ${cols.join(', ')}, data)
     VALUES (?, ?, ${cols.map(() => '?').join(', ')}, ?)`,
  );
  for (const r of rows) insert.run(userId, String(r.id), ...map(r), JSON.stringify(r));
}

function syncNormalized(db: Database, userId: string, key: TrackedKey, value: string | null) {
  const tables: Partial<Record<TrackedKey, string>> = {
    study_notes_v5: 'notes',
    study_tasks_v4: 'tasks',
    study_planner_tasks: 'planner_tasks',
    study_planner_goals: 'planner_goals',
  };
  const table = tables[key];
  if (!table) return;
  if (value === null) {
    db.prepare(`DELETE FROM ${table} WHERE user_id = ?`).run(userId);
    return;
  }
  const rows = parseArray(value);
  if (!rows) return; // unparseable: keep the raw mirror, leave normalized rows untouched

  if (table === 'notes') {
    replaceRows(db, table, userId, rows,
      ['title', 'subject', 'color', 'priority', 'content', 'tags', 'is_pinned', 'is_private', 'last_edited_ts'],
      (r) => [str(r.title), str(r.subject), str(r.color), str(r.priority), str(r.content),
        JSON.stringify(Array.isArray(r.tags) ? r.tags : []), bool(r.isPinned), bool(r.isPrivate), num(r.lastEditedTimestamp)]);
  } else if (table === 'tasks') {
    replaceRows(db, table, userId, rows,
      ['title', 'subject', 'priority', 'status', 'due_date', 'description', 'completed_at'],
      (r) => [str(r.title), str(r.subject), str(r.priority), str(r.status), str(r.dueDate), str(r.description), num(r.completedAt)]);
  } else if (table === 'planner_tasks') {
    replaceRows(db, table, userId, rows,
      ['subject', 'topic', 'duration_minutes', 'completed', 'time', 'date', 'priority', 'color'],
      (r) => [str(r.subject), str(r.topic), num(r.durationMinutes), bool(r.completed), str(r.time), str(r.date), str(r.priority), str(r.color)]);
  } else if (table === 'planner_goals') {
    replaceRows(db, table, userId, rows,
      ['title', 'subject', 'due_date', 'completed', 'priority', 'target_sessions', 'completed_sessions'],
      (r) => [str(r.title), str(r.subject), str(r.dueDate), bool(r.completed), str(r.priority), num(r.targetSessions), num(r.completedSessions)]);
  }
}

export interface SyncPayload {
  clear?: boolean;
  changes?: Record<string, string | null>;
}

/** Apply a batch of localStorage changes (and optional full clear) for one user. */
export function applySync(userId: string, payload: SyncPayload) {
  return transaction((db) => {
    touchUser(db, userId);
    if (payload.clear) {
      for (const t of ['app_state', 'notes', 'tasks', 'planner_tasks', 'planner_goals']) {
        db.prepare(`DELETE FROM ${t} WHERE user_id = ?`).run(userId);
      }
      db.prepare('UPDATE users SET name = NULL WHERE id = ?').run(userId);
    }
    const now = Date.now();
    let applied = 0;
    for (const [key, value] of Object.entries(payload.changes ?? {})) {
      if (!isTrackedKey(key)) continue;
      if (value === null) {
        db.prepare('DELETE FROM app_state WHERE user_id = ? AND key = ?').run(userId, key);
        if (key === 'studybuddy_user_name') db.prepare('UPDATE users SET name = NULL WHERE id = ?').run(userId);
      } else {
        if (typeof value !== 'string' || value.length > MAX_VALUE_BYTES) continue;
        db.prepare(
          `INSERT INTO app_state (user_id, key, value, updated_at) VALUES (?, ?, ?, ?)
           ON CONFLICT(user_id, key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`,
        ).run(userId, key, value, now);
        if (key === 'studybuddy_user_name') {
          db.prepare('UPDATE users SET name = ? WHERE id = ?').run(value.slice(0, 120), userId);
        }
      }
      syncNormalized(db, userId, key, value);
      applied++;
    }
    return applied;
  });
}

export function readState(userId: string): Record<string, string> {
  const db = getDb();
  const rows = db.prepare('SELECT key, value FROM app_state WHERE user_id = ?').all(userId);
  const out: Record<string, string> = {};
  for (const r of rows) out[String(r.key)] = String(r.value);
  return out;
}

export const COLLECTIONS = {
  notes: 'notes',
  tasks: 'tasks',
  'planner-tasks': 'planner_tasks',
  'planner-goals': 'planner_goals',
} as const;
export type CollectionName = keyof typeof COLLECTIONS;

export function readCollection(userId: string, name: CollectionName): unknown[] {
  const db = getDb();
  const rows = db.prepare(`SELECT data FROM ${COLLECTIONS[name]} WHERE user_id = ?`).all(userId);
  return rows.map((r) => {
    try {
      return JSON.parse(String(r.data));
    } catch {
      return null;
    }
  }).filter(Boolean);
}

export function readUser(userId: string) {
  const row = getDb().prepare('SELECT id, name, created_at, last_seen_at FROM users WHERE id = ?').get(userId);
  return row ?? null;
}

export function counts(userId: string) {
  const db = getDb();
  const out: Record<string, number> = {};
  for (const [name, table] of Object.entries(COLLECTIONS)) {
    out[name] = Number(db.prepare(`SELECT COUNT(*) AS n FROM ${table} WHERE user_id = ?`).get(userId)?.n ?? 0);
  }
  return out;
}
