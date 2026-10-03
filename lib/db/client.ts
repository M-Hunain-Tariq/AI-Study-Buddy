import fs from 'node:fs';
import path from 'node:path';

/**
 * StudyBuddy database connection (SQLite via Node's built-in `node:sqlite`).
 *
 * - Zero extra dependencies, no native compile step. Requires Node.js >= 22.5.
 * - File location: $DATABASE_PATH, or <project>/data/studybuddy.db by default.
 * - Schema is created / migrated automatically on first use.
 */

type SqlValue = string | number | bigint | null;
export interface Statement {
  run(...params: SqlValue[]): { changes: number | bigint };
  get(...params: SqlValue[]): Record<string, unknown> | undefined;
  all(...params: SqlValue[]): Record<string, unknown>[];
}
export interface Database {
  exec(sql: string): void;
  prepare(sql: string): Statement;
  close(): void;
}

const SCHEMA_VERSION = 1;

const MIGRATIONS: Record<number, string> = {
  1: `
    CREATE TABLE IF NOT EXISTS users (
      id           TEXT PRIMARY KEY,
      name         TEXT,
      created_at   INTEGER NOT NULL,
      last_seen_at INTEGER NOT NULL
    );

    -- Raw mirror of every tracked localStorage key (lossless backup / restore).
    CREATE TABLE IF NOT EXISTS app_state (
      user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      key        TEXT NOT NULL,
      value      TEXT NOT NULL,
      updated_at INTEGER NOT NULL,
      PRIMARY KEY (user_id, key)
    );

    CREATE TABLE IF NOT EXISTS notes (
      user_id        TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      id             TEXT NOT NULL,
      title          TEXT,
      subject        TEXT,
      color          TEXT,
      priority       TEXT,
      content        TEXT,
      tags           TEXT,
      is_pinned      INTEGER NOT NULL DEFAULT 0,
      is_private     INTEGER NOT NULL DEFAULT 0,
      last_edited_ts INTEGER,
      data           TEXT NOT NULL,
      PRIMARY KEY (user_id, id)
    );

    CREATE TABLE IF NOT EXISTS tasks (
      user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      id           TEXT NOT NULL,
      title        TEXT,
      subject      TEXT,
      priority     TEXT,
      status       TEXT,
      due_date     TEXT,
      description  TEXT,
      completed_at INTEGER,
      data         TEXT NOT NULL,
      PRIMARY KEY (user_id, id)
    );

    CREATE TABLE IF NOT EXISTS planner_tasks (
      user_id          TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      id               TEXT NOT NULL,
      subject          TEXT,
      topic            TEXT,
      duration_minutes INTEGER,
      completed        INTEGER NOT NULL DEFAULT 0,
      time             TEXT,
      date             TEXT,
      priority         TEXT,
      color            TEXT,
      data             TEXT NOT NULL,
      PRIMARY KEY (user_id, id)
    );

    CREATE TABLE IF NOT EXISTS planner_goals (
      user_id            TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      id                 TEXT NOT NULL,
      title              TEXT,
      subject            TEXT,
      due_date           TEXT,
      completed          INTEGER NOT NULL DEFAULT 0,
      priority           TEXT,
      target_sessions    INTEGER,
      completed_sessions INTEGER,
      data               TEXT NOT NULL,
      PRIMARY KEY (user_id, id)
    );

    CREATE INDEX IF NOT EXISTS idx_notes_subject ON notes(user_id, subject);
    CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(user_id, status);
    CREATE INDEX IF NOT EXISTS idx_planner_tasks_date ON planner_tasks(user_id, date);
  `,
};

declare global {
  // eslint-disable-next-line no-var
  var __studybuddyDb: Database | undefined;
}

export function getDbPath(): string {
  return process.env.DATABASE_PATH
    ? path.resolve(process.env.DATABASE_PATH)
    : path.join(process.cwd(), 'data', 'studybuddy.db');
}

function openDatabase(file: string): Database {
  // process.getBuiltinModule keeps the bundler from trying to resolve `node:sqlite`.
  const getBuiltin = (process as unknown as { getBuiltinModule?: (id: string) => unknown }).getBuiltinModule;
  const sqlite = getBuiltin?.('node:sqlite') as
    | { DatabaseSync: new (file: string) => Database }
    | undefined;
  if (!sqlite?.DatabaseSync) {
    throw new Error('StudyBuddy database needs Node.js >= 22.5 (node:sqlite is not available in this runtime).');
  }
  return new sqlite.DatabaseSync(file);
}

function migrate(db: Database) {
  const row = db.prepare('PRAGMA user_version').get();
  let current = Number(row?.user_version ?? 0);
  while (current < SCHEMA_VERSION) {
    const next = current + 1;
    db.exec('BEGIN');
    try {
      db.exec(MIGRATIONS[next]);
      db.exec(`PRAGMA user_version = ${next}`);
      db.exec('COMMIT');
    } catch (err) {
      db.exec('ROLLBACK');
      throw err;
    }
    current = next;
  }
}

export function getDb(): Database {
  if (globalThis.__studybuddyDb) return globalThis.__studybuddyDb;

  const file = getDbPath();
  const dir = path.dirname(file);
  fs.mkdirSync(dir, { recursive: true });
  // Keep the database file out of git by default.
  const ignore = path.join(dir, '.gitignore');
  if (!fs.existsSync(ignore)) fs.writeFileSync(ignore, '*\n');

  const db = openDatabase(file);
  db.exec('PRAGMA journal_mode = WAL');
  db.exec('PRAGMA foreign_keys = ON');
  db.exec('PRAGMA busy_timeout = 5000');
  migrate(db);

  globalThis.__studybuddyDb = db;
  return db;
}

/** Run `fn` inside a transaction (rolls back on throw). */
export function transaction<T>(fn: (db: Database) => T): T {
  const db = getDb();
  db.exec('BEGIN');
  try {
    const result = fn(db);
    db.exec('COMMIT');
    return result;
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
}
