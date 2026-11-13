# Netlify deployment notes

This project uses Next.js App Router. Netlify detects Next.js and applies its maintained OpenNext adapter automatically.

## Netlify settings

- Base directory: the project directory containing this `package.json` (the ZIP contents are arranged with `package.json` at the project root).
- Build command: `npm run build` (also set in `netlify.toml`).
- Publish directory: leave blank; do not set it to `.next/standalone` or `out`.
- Node.js: pinned to `22.16.0` using `.nvmrc` and `netlify.toml`. This satisfies the app's Node.js `>=22.5` requirement for the built-in `node:sqlite` API.
- Add `GEMINI_API_KEY` in Netlify Project configuration > Environment variables to enable Gemini-backed AI features. Keep it server-side; do not use a `NEXT_PUBLIC_` prefix.

## Important database limitation

The current data adapter uses a local SQLite file. Netlify Functions do not provide a shared persistent local disk, so SQLite-backed cross-device sync is not durable on Netlify as currently implemented. The UI's browser-local data can still work, but reliable shared/persistent sync needs a managed database and a corresponding `DATABASE_PATH`/database adapter migration. This limitation is separate from the Next.js build/deploy configuration.

## Deployment

Connect the repository containing this `package.json` to Netlify and trigger a new deploy. If the repository contains this app in a subfolder, set Netlify's Base directory to that subfolder.
