# Netlify deployment checklist

This project uses the Next.js App Router. Netlify automatically applies its maintained OpenNext adapter for supported Next.js projects; do not pin a separate adapter version unless Netlify support specifically asks you to.

## Repository and build settings

The repository root must contain `package.json`, `package-lock.json`, `next.config.ts`, and `netlify.toml`.

`netlify.toml` configures:

- Build command: `npm run build`
- Publish directory: `.next`
- Node.js: `22.16.0`
- `NEXT_PUBLIC_DB_SYNC_ENABLED=false` so the browser does not call the optional SQLite mirror on Netlify.

If you configure the values in the Netlify UI, use the repository root as the Base directory, `npm run build` as the Build command, and `.next` as the Publish directory. Do not add a SPA catch-all redirect such as `/* /index.html 200`; this is a Next.js SSR/API application.

## Environment variables

In Netlify Project configuration > Environment variables, add:

- `GEMINI_API_KEY`: your Google AI Studio API key. Keep it server-side; never use a `NEXT_PUBLIC_` prefix.
- Optional `GEMINI_MODEL`: defaults to `gemini-3.8-flash`.
- Optional `GEMINI_FALLBACK_MODELS`: comma-separated fallback model IDs.

Make `GEMINI_API_KEY` available to both Builds and Functions scopes, then trigger a new deploy after changing it.

## Storage behaviour on Netlify

The app's existing primary storage is browser `localStorage`. The optional SQLite mirror uses a local file and is therefore not enabled on Netlify: Netlify Functions do not provide a shared persistent local disk. `NEXT_PUBLIC_DB_SYNC_ENABLED=false` prevents background sync requests that would otherwise fail or lose data between function instances. Notes, tasks, planner items, quiz history, and preferences continue to be stored in the current browser. Cross-device/shared persistence needs a managed database adapter (for example, hosted PostgreSQL or Netlify Blobs) and is not supplied by this ZIP.

For local development on a persistent machine, the SQLite mirror remains enabled by default. It uses Node.js 22.5 or newer and writes to `data/studybuddy.db`, unless `DATABASE_PATH` is set.

## Deployment verification

After pushing a commit, open Netlify > Deploys and confirm a new deploy was created from the latest commit. Check the full deploy log if the build fails. A previous deploy being marked failed is not proof that the latest commit has been built.
