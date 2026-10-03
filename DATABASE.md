# AI Study Buddy — Database System

A SQLite database was added **without changing any existing file**. The app's pages and
components still read/write `localStorage` exactly as before; the database mirrors that
data automatically in the background.

## How it works
- `app/template.tsx` (new) mounts `components/db/DbSync.tsx`, an invisible component.
- Every change to the app's localStorage keys (notes, tasks, planner tasks/goals, streak,
  settings, user name) is saved to the database through `POST /api/db/sync` (debounced).
- On load it backs up current local data and **restores anything the browser lost**
  (e.g. site data cleared). "Reset / clear data" in Settings also clears the database copy.
- If the database is unavailable the app silently keeps working on localStorage.

## Files added
| File | Purpose |
|---|---|
| `lib/db/client.ts` | SQLite connection, auto-created schema + migrations |
| `lib/db/repo.ts` | Queries, sync logic, normalized tables |
| `lib/db/identity.ts` | Anonymous per-browser user id (cookie `sb_uid`) |
| `app/api/db/sync/route.ts` | `GET` restore · `POST` save changes |
| `app/api/db/data/route.ts` | `GET` read notes/tasks/planner data as JSON |
| `app/api/db/health/route.ts` | `GET` database status |
| `components/db/DbSync.tsx`, `app/template.tsx` | Client sync wiring |

## Tables
`users`, `app_state` (lossless mirror), `notes`, `tasks`, `planner_tasks`, `planner_goals`.
Schema version is tracked with `PRAGMA user_version`; add future migrations in `lib/db/client.ts`.

## Setup
- **Requires Node.js 22.5 or newer** (uses built-in `node:sqlite` — no new npm packages).
- Database file: `data/studybuddy.db` (auto-created, git-ignored). Change with env var
  `DATABASE_PATH=/path/to/studybuddy.db`.
- Needs a server with a **writable, persistent disk** (local, VPS, Docker volume). Serverless
  hosts with ephemeral storage (e.g. Vercel) would lose the file.

## Try it
- `GET /api/db/health` — status
- `GET /api/db/data` — everything saved for your browser
- `GET /api/db/data?collection=notes` — `notes | tasks | planner-tasks | planner-goals`

## Limits (by design, for now)
There are no logins yet, so data belongs to a browser (cookie), not a person — it does not
follow the user to another device. Real accounts are the natural next step; only
`lib/db/identity.ts` needs to change.
