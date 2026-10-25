# AI Study Buddy — Audit Report

## Scope and method

- Inspected the supplied ZIP archive and inventoried the Next.js App Router project, API routes, configuration, package metadata, database adapter, AI helpers, settings, and page/workspace source.
- Static checks covered 101 `.ts`/`.tsx` files: all local relative and `@/` imports resolved, and the TypeScript compiler parser found no syntax errors.
- Reviewed API request handling and key settings/support interactions for false-success behavior.
- No browser automation or live Gemini/database integration test was possible in this environment.

## Fixes applied in this audit copy

1. `app/api/quiz/generate/route.ts` — malformed JSON now returns HTTP 400 instead of falling into the generic 500 response. A generated quiz that does not contain the requested number of valid questions now returns a clear HTTP 502 error instead of silently presenting a partial quiz as success.
2. `app/api/ai/plan/route.ts` — incomplete AI study plans now return HTTP 502 rather than silently returning fewer days than requested.
3. `app/api/db/health/route.ts` — unexpected database/runtime error details are logged server-side and a generic `Database unavailable` message is returned to callers.
4. `lib/db/repo.ts` — tracked-value size limit is now measured in UTF-8 bytes, matching the `MAX_VALUE_BYTES` name and preventing multi-byte text from exceeding the intended limit.
5. `components/landing/Navbar.tsx` — brand logo now navigates to `/` instead of the dead `#` anchor.
6. `components/settings/PrivacySection.tsx` and `components/settings/ui.tsx` — password-change UI no longer reports success when there is no authentication backend; two-factor authentication is marked unavailable and its switch is disabled.
7. `components/settings/HelpSection.tsx` — support/help copy no longer presents the AI Tutor as a human live-chat service or claims password/2FA support; a fake `support@example.com` destination was replaced with an explicit not-configured message.
8. `lib/ai/rate-limit.ts` — expired buckets are periodically pruned and the in-memory map is bounded to reduce memory growth from high-cardinality client keys. This remains process-local and is not a production-wide rate limiter.
9. `DATABASE.md` and `README.md` — documented the local SQLite persistence requirement and the Netlify serverless limitation.

## Issues and risks found

| Severity | Area | Finding | Status / action |
|---|---|---|---|
| High | Deployment / persistence | SQLite file is written under `data/` by default. Typical Netlify Functions have ephemeral, per-instance storage; a successful deploy would not guarantee persistent or shared database state. | Documented. Migrate to a managed database before using Netlify for real persistent user data. Not changed automatically because that requires selecting/configuring a database provider and credentials. |
| High | Auth / account security | The app has no real sign-in/authentication provider. `sb_uid` is an anonymous browser identity, not an authenticated account; password changes, 2FA, and real login activity cannot work without an auth service. | UI made transparent for password/2FA; authentication remains unimplemented. Do not treat profile fields as a verified account. |
| Medium | AI abuse control | `lib/ai/rate-limit.ts` uses an in-memory `Map`; limits reset on process restarts and are not shared across serverless instances. It is not sufficient as production-wide abuse/cost protection. | Reported; use shared rate limiting (e.g. Redis/provider edge limit) before public launch. |
| Medium | AI integration | Gemini-dependent features require a valid server-side `GEMINI_API_KEY` and an available configured model. | Not live-tested; key/model availability cannot be verified in this environment. |
| Medium | Settings semantics | Email/push/in-app notification preferences are persisted as settings, but the source does not implement a complete notification delivery service. | Reported; connect real notification jobs/providers before representing these toggles as delivery guarantees. |
| Medium | Landing page | Footer `Privacy`, `Terms`, and `Contact` links remain placeholder `href="#"` anchors. | Not fixed because no approved policy text or real contact URL/email was supplied. Replace with real pages/contact details before public launch. |
| Medium | Dependencies / CI | Dependencies could not be installed: `npm ci --ignore-scripts --no-audit --no-fund` exceeded the available execution window. | Build/lint/type-check could not be run with project dependencies. Run in an environment with npm registry access. |
| Low | Database identity | Data is browser-cookie scoped and does not follow the user across browsers/devices; this is documented as current design. | Expected limitation until accounts are added. |

## Page and feature verification matrix

| Page / feature | Source review | Runtime status |
|---|---|---|
| Landing page / navigation | Landing components and CTA/navigation references inspected; brand link fixed. | Not browser-tested. Footer legal/contact links still need real destinations. |
| Dashboard | Route and dashboard imports/logic inspected. | Not browser-tested; dependency install unavailable. |
| AI Tutor | Chat API, Gemini helper, rate limiter and chat workspace inspected. | API key and Gemini network integration not verified. |
| Quiz Practice | Generation route and quiz UI references inspected; malformed JSON and incomplete output handling fixed. | AI-generated quiz cannot be live-tested without dependencies/key. |
| My Notes | Page/workspace and storage-sync architecture inspected. | CRUD/browser persistence not end-to-end tested. |
| My Progress | Page/workspace source inspected. | Chart/progress calculations not browser-tested. |
| Study Planner | Page/workspace and plan-generation API inspected. | AI plan and CRUD flows not end-to-end tested. |
| Tasks | Page/workspace and storage patterns inspected. | CRUD/filter/sort flows not browser-tested. |
| Settings | Settings persistence, privacy/security, notification, data, profile and help sections inspected. | Local storage import/export and responsive behavior not browser-tested. |
| DB sync/data/health | All database route source inspected; health error disclosure and byte-limit issues fixed. | Live SQLite API test not run; Netlify persistence is not suitable as currently implemented. |

## Validation results

- ZIP readable: **PASS**.
- TypeScript/TSX syntax parse (101 files): **PASS** (no parser diagnostics).
- Local import resolution: **PASS** (0 missing local imports).
- `npm ci --ignore-scripts --no-audit --no-fund`: **BLOCKED** (timed out).
- `npm run build`: **BLOCKED** (`next: not found`, dependencies absent).
- `npm run lint`: **BLOCKED** (`eslint: not found`, dependencies absent).
- `tsc --noEmit`: **BLOCKED** as a project type-check because React/Next/Google SDK/type packages are not installed; emitted missing-module/JSX-type diagnostics, not a reliable list of source type errors.
- Automated unit/E2E tests: no test suite found in the supplied project; no browser runtime available for this pass.

## Security and archive handling

The supplied ZIP includes `.git` history and local SQLite database artifacts (`studybuddy.db`, WAL and SHM). Treat the original ZIP as private; do not upload it to a public repository or share it publicly without reviewing/cleaning its Git history and database contents. The audit deliverable intentionally omits `.git` history and local database files. `.env.example` is retained, but real `.env` files are not included.

## Local run instructions

1. Install Node.js **22.5+**.
2. Extract the project archive and run `npm ci` (or `npm install` if lockfile installation is unavailable).
3. Create `.env.local` with `GEMINI_API_KEY=your_real_key` and optionally `GEMINI_MODEL=...`. Keep this file private and never commit it.
4. Run `npm run dev`, then open the local URL printed by Next.js.
5. Verify `GET /api/db/health`; SQLite creates `data/studybuddy.db` automatically when the runtime supports `node:sqlite`.
6. Before production, run `npx tsc --noEmit`, `npm run lint`, and `npm run build`, then execute manual browser regression tests for each page and API.

## Netlify deployment

Do not deploy this version to Netlify expecting SQLite data to persist. First replace `lib/db/client.ts`/`lib/db/repo.ts` with a managed, shared database implementation and configure its server-only credentials. Then configure `GEMINI_API_KEY` and any database variables in Netlify site environment settings, install dependencies, and run the production build. A green Next.js build alone would not validate data persistence or AI credentials.

## Overall status

This is a **partial, source-based audit with targeted fixes**, not a certification that the app is production-ready or bug-free. The major blocker is persistent database architecture for Netlify, followed by missing authentication and incomplete notification delivery. Full build, browser, and live API verification must be rerun where dependencies and service credentials are available.
