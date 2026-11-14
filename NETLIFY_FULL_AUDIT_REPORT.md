# AI Study Buddy — Netlify & Whole-Website Audit

**Audited source:** `AI Study Buddy - Premium Home Dashboard - Netlify.zip`  
**Audit date:** 14 November 2026  
**Scope:** Next.js application source, App Router APIs, Netlify build configuration, database/storage behavior, dependencies, static assets, and deployment hygiene.

## Summary

The audit found and fixed a definite AI Tutor API defect and corrected the Netlify-specific configuration for this Next.js App Router app. It also made the optional SQLite mirror stay disabled in the Netlify client bundle because Netlify Functions do not share a durable local disk. Browser `localStorage` remains the existing client-side store.

This is a source-level repair, not proof of a successful live Netlify deployment. The supplied deployment screenshots were only 100 pixels wide, so the exact Netlify build-log message could not be read. A real dependency install and `next build` could not be completed in this environment because the npm registry DNS lookup failed (`EAI_AGAIN`).

## Defects found and changes made

### 1. AI Tutor endpoint had no POST handler — fixed

Both desktop and mobile AI Tutor components send `POST /api/ai/chat`, but the route contained declarations and a system prompt only; it did not export a `POST` function. This guaranteed a failed chat request even if the rest of the site loaded.

The route now includes:
- A `POST` handler and explicit Node.js runtime.
- Bounded JSON body parsing and message-count/length validation.
- Conversation validation requiring a user turn at the start and end.
- Attachment validation for supported image/PDF MIME types, Base64 format, and 4 MB decoded size; bounded text attachments.
- Request rate limiting.
- Gemini streaming output as a plain-text `ReadableStream`, matching the desktop and mobile clients.
- Useful JSON error responses before streaming for missing API keys and provider errors.
- No-store and content-sniffing response headers.

### 2. Netlify configuration — corrected

`netlify.toml` now configures `npm run build`, `.next` as the publish directory, and Node.js 22.16.0. It does not pin a separate Next.js adapter; Netlify's automatic OpenNext integration is the supported default for modern Next.js App Router applications.

### 3. Netlify SQLite mirror requests — disabled on Netlify

The optional DB sync component previously called `/api/db/sync` in the browser, while the database adapter writes to a local SQLite file. Netlify Functions can run on separate instances and do not provide a shared durable SQLite filesystem. The Netlify build now sets `NEXT_PUBLIC_DB_SYNC_ENABLED=false`, which disables only this optional mirror in the client. Existing browser `localStorage` continues to hold this browser's notes, tasks, planner data, quiz history, and preferences.

Cross-device or shared-account persistence is **not** provided by the current ZIP. That requires a managed shared database and proper authenticated user identity.

### 4. Stale TypeScript build cache — cleaned

The archive contained `tsconfig.tsbuildinfo`, a generated incremental TypeScript cache. It has been removed from the deliverable and `*.tsbuildinfo` is now ignored by Git to prevent machine-specific build cache from being committed again.

### 5. Gemini secret configuration — deployment requirement

The server reads `GEMINI_API_KEY`. It must be added in Netlify Project configuration → Environment variables, with both Builds and Functions scopes. It must not use a `NEXT_PUBLIC_` prefix. After adding or changing it, trigger a new deploy. This is necessary for AI Tutor, study-plan generation, and quiz generation to access Gemini; it is not a static build dependency.

## Dependency security spot-check

The lockfile resolves Next.js `15.5.28` and React/React DOM `19.3.1`. These are the patched release levels named in the October 2026 Next.js/React security updates; no downgrade or unnecessary package bump was made. This is a targeted advisory check, **not** a complete `npm audit`: the npm registry was unreachable in this environment, so transitive dependency advisories could not be refreshed.

## Source checks completed

| Check | Result | Notes |
|---|---|---|
| TypeScript/TSX/JS syntax parsing | PASS | 121 source files; zero parser diagnostics. |
| Relative and `@/` local imports | PASS | No missing local import targets found. |
| CSS parser | PASS | `app/globals.css` and `app/mobile.css` parsed successfully. |
| Netlify TOML parse | PASS | Valid TOML; expected build, publish, and environment settings present. |
| Package manifest / lock root | PASS | Dependency and devDependency root declarations match. |
| App Router API exports | PASS | Chat POST, plan POST, quiz POST, DB data GET, DB health GET, DB sync GET/POST. |
| Local image references | PASS | Checked referenced assets; no missing local image files found in the project audit. |
| Environment secret scan | PASS | No real `.env`/private key file included; `.env.example` contains placeholders only. |
| ZIP archive integrity | PASS | Final archive tested after packaging. |
| `npm ci` | BLOCKED | `registry.npmjs.org` DNS returned `EAI_AGAIN`; install could not complete. |
| `npm run build` | NOT VERIFIED | Requires installed dependencies; no successful production build claim. |
| ESLint / full TypeScript typecheck | NOT VERIFIED | Dependencies/type declarations unavailable because install was blocked. |
| Live Netlify deploy | NOT VERIFIED | Requires pushing this source and reading the actual Netlify deployment log. |
| Live Gemini requests | NOT VERIFIED | Requires the owner's valid `GEMINI_API_KEY` and an online deployment. |

## Netlify deployment settings

Use the repository root as Base directory and the following settings:

- Build command: `npm run build`
- Publish directory: `.next`
- Node.js: `22.16.0`
- No SPA redirect such as `/* /index.html 200` for this SSR/API Next.js app.

In Netlify environment variables, add `GEMINI_API_KEY` with Builds and Functions scopes, then deploy again.

After pushing the updated source, check Netlify → Deploys and confirm that a new deploy was created from the newest Git commit. If it fails, copy the full Deploy log; a narrow/thumbnail screenshot cannot identify the exact failing line.

## Remaining production work (not silently represented as fixed)

1. Migrate persistent server-side data from local SQLite to a managed shared database before claiming cross-device persistence on Netlify.
2. Add real authentication if users need accounts, recovery, or safe cross-device data ownership; the current browser identity cookie is not verified account authentication.
3. Move in-memory rate limits to a shared edge/store if limits must apply consistently across function instances.
4. Complete real production build, browser responsive tests, AI provider tests, and live Netlify deploy after dependencies and API credentials are available.

## Conclusion

The identified source defects above are fixed in this archive. The app is **not certified 100% error-free** because the actual Netlify build log was unreadable and the full Next.js build could not be run. The next decisive check is a new Netlify deploy from this commit and the full readable Deploy log if it still fails.
