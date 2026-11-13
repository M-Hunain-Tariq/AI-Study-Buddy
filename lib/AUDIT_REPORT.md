# AI Study Buddy — Engineering Audit & Fix Report

**Audit scope:** supplied `AI_Study_Buddy_Phase3.zip`  
**Working copy:** targeted source and configuration fixes applied  
**Verification environment:** Node.js 22.16.0; npm registry unavailable  
**Status:** source-level fixes and offline runtime checks completed; production verification remains blocked by dependency/network and service requirements.

## Executive summary

The project is a Next.js App Router application with desktop/mobile workspaces, Gemini-backed APIs, localStorage-based client state, and a SQLite mirror. The audit fixed several correctness, security, data-loss, mobile-parity, and misleading-UI issues while preserving the existing overall interface and feature layout.

The codebase could not be certified as 100% production-ready in this environment. `npm ci` cannot reach the npm registry (`EAI_AGAIN`) and the offline cache does not contain the required packages. Consequently the real Next.js production build, ESLint run, and dependency-backed TypeScript type-check could not be completed. Browser end-to-end tests and live Gemini tests also require dependencies, a browser, and an actual API key.

## Fixes implemented

### API and input validation

1. Added a shared streaming JSON request reader with strict `application/json` content-type checks, UTF-8 validation, malformed-JSON handling, and declared/streamed byte limits. The AI chat, AI plan, quiz generation, and database sync routes use it and return appropriate 400/413/415 errors.
2. Validated incoming AI chat attachments for supported MIME type, padded Base64 structure, and decoded size. The 4 MB attachment validator is bounded and avoids regex stack overflow on large inputs.
3. Added bounded/sanitized saved-chat history handling: valid sender/message schema, maximum 20 conversations, 14 messages per conversation, 6,000 characters per message, bounded metadata, and 1.5 MB total saved history.
4. Fixed malformed quiz request handling and reject incomplete AI-generated quiz results instead of returning partial content as success.
5. Fixed incomplete AI study-plan handling so the API reports an upstream failure instead of silently returning fewer days than requested.
6. Tightened study-plan inputs: subject/topic strings are bounded and empty values rejected; numeric values are safely clamped, including zero and invalid values.
7. Health endpoint no longer returns internal exception details or local DB paths in production responses.

### Security and abuse resistance

8. Added production security headers: `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, and production HSTS.
9. Rate-limit maps now expire/prune entries and have a bounded size. AI and DB-sync routes have separate limits. Client identity uses validated provider-injected IP headers and ignores the client-controlled generic `X-Forwarded-For` chain.
10. DB sync requires JSON, validates payload shape and tracked keys, and applies per-value and request-size limits.
11. Privacy/security settings no longer imply password changes, two-factor authentication, login audit, notification delivery, analytics, telemetry, or debug/experimental controls are operational when those integrations are absent. Unimplemented controls are clearly marked unavailable/disabled rather than giving false success.
12. Settings imports are schema-sanitized and field-bounded. Backup import is capped at 10 MB and ignores keys outside the StudyBuddy-owned namespace.
13. Storage cleanup now removes only StudyBuddy-owned keys, including `studybuddy-settings-v1`; it no longer calls `localStorage.clear()` and therefore preserves unrelated applications' data on the same origin.
14. Dependency versions were reconciled: React and React DOM are upgraded to 19.3.1; the lockfile pins Next.js 15.5.28; ESLint 9 uses a compatible flat-config bridge via `FlatCompat`.

### Data correctness and recovery

15. Corrected the study streak calculation: it increments at most once per local calendar day, continues only across consecutive dates, and is shared by desktop and mobile. Removed the old special-case reset when the streak equalled three.
16. Added local-date formatting helpers to avoid UTC date rollovers in planner dates.
17. Database mirror values are measured as UTF-8 bytes. Corrupt or duplicate-ID array data no longer causes normalized rows to be deleted.
18. DB sync retries failed writes, preserves newer pending values, protects local deletions/clear operations from stale restore responses, and serializes requests. Regular sync requests no longer unnecessarily use the browser's limited keepalive mechanism.
19. Added quiz history, AI language preference, streak state, and bounded saved AI chat history to the tracked database mirror.
20. Updated local data reporting, backup export/import, and deletion semantics to operate on StudyBuddy keys only.

### UI and feature integrity

21. Dashboard right-side widgets now display the actual saved study streak, current learning goal and today's study sessions instead of permanent zero/empty placeholders. Their buttons navigate to the Study Planner.
22. Desktop My Progress now computes summary statistics, activity, tasks, sessions, notes, quiz history and learning-goal progress from saved data; mobile progress uses consistent session totals/streak logic.
23. Fixed planner task/goal normalization and mobile parity for task duration, completion and stored records.
24. Dashboard statistic cards now derive completed study time, saved AI questions, and recent quiz accuracy from actual saved records. Weekly progress now plots completed planner sessions across the latest seven local calendar days.
25. Replaced the fake “resume Algebra lesson” dashboard CTA with actual Study Planner navigation, and corrected the dashboard task-list heading so it no longer claims every saved task is due today.
26. Fixed image/PDF attachment detection across desktop/mobile and ensure unsupported or oversized attachments produce a clear failure rather than being silently ignored.
27. Fixed the landing brand-link target and clarified unsupported Help/Support and account features.
28. Updated `README.md`, `DATABASE.md`, `.env.example`, and this report with current setup and deployment limitations.

## Offline verification performed

| Check | Result | Notes |
|---|---|---|
| ZIP extraction / source inventory | PASS | Original archive inspected; extracted source tree reviewed. |
| TypeScript/TSX syntax parse | PASS | 121 `.ts`/`.tsx` files parsed; zero parser diagnostics. |
| Local import resolution | PASS | 253 relative/`@/` imports checked; zero missing local paths. |
| Package manifest/lock consistency | PASS | Root dependency declarations match; lockfile v3; React/React DOM 19.3.1 and Next.js 15.5.28 confirmed in lock. |
| JSON request-reader runtime checks | PASS | Valid JSON, invalid JSON, wrong content type, declared oversize and streamed oversize cases. |
| AI and sync rate-limit checks | PASS | AI 20/minute and sync 120/minute test thresholds; untrusted forwarded-IP spoofing rejected; provider IP validated. |
| Study-streak utility checks | PASS | Same-day duplicate, next-day continuation, and expiry after a missed day. |
| Settings sanitization checks | PASS | Invalid enums, malformed values, oversized profile text and non-boolean flags safely normalized. |
| Storage ownership / delete helper | PASS | Removes StudyBuddy keys and preserves unrelated same-origin keys. |
| Attachment Base64 checks | PASS | Valid/invalid encodings plus exactly-at-limit and over-limit 4 MB cases. |
| Saved chat normalization | PASS | Malformed records, message and field caps, conversation caps and 1.5 MB total bound. |
| Dashboard statistics | PASS | Completed study-minute totals, saved AI question counts, bounded quiz-score averages, and malformed values. |
| Weekly activity aggregation | PASS | Completed sessions only, multiple sessions per date, rolling seven local dates, and invalid/future/out-of-range dates. |
| SQLite repository runtime checks | PASS | Real Node `node:sqlite`: save/read, normalized rows, user isolation, malformed mirror safety, and clear-then-save order. |
| `npm ci` with registry | BLOCKED | `EAI_AGAIN` resolving `registry.npmjs.org`. |
| `npm ci --offline` | BLOCKED | Required package metadata/tarballs not present in npm cache (`ENOTCACHED`). |
| `npm run build` | BLOCKED | `next: not found` because dependencies could not be installed. |
| `npm run lint` | BLOCKED | `eslint: not found` because dependencies could not be installed. |
| `npm run typecheck` | BLOCKED | Global TypeScript is present, but React/Next/Node/Gemini dependencies and type declarations are missing; resulting module/JSX diagnostics make this unsuitable as a project type-check. |
| Browser page/interaction tests | NOT RUN | Browser automation and an installed application runtime are unavailable. |
| Live Gemini tests | NOT RUN | Requires a real `GEMINI_API_KEY`, network access and installed SDK. |

The SQLite test emitted Node's experimental `node:sqlite` warning; the test operations themselves passed.

## Remaining production blockers / decisions

| Priority | Area | Remaining issue | Required next step |
|---|---|---|---|
| Critical | Database deployment | The current adapter stores data in a local SQLite file. Typical serverless instances do not provide a shared persistent filesystem. This is not safe for durable multi-instance Netlify deployment. | Select and configure a managed database; replace the SQLite adapter with a shared database implementation. |
| Critical | Authentication | `sb_uid` is an anonymous browser-scoped UUID cookie, not a verified user account. It does not provide real sign-in, account recovery, passwords, 2FA or cross-device ownership. | Integrate an authentication provider and bind every database operation to its verified user identity. |
| High | Rate limiting | Rate limits are process-local in-memory maps; limits reset at restart and are not shared across instances. Requests without a trusted edge IP header share the fallback `unknown-client` bucket. | Use shared rate limiting at the edge or via a shared store (e.g. Redis) and configure the trusted ingress header. |
| High | Gemini | Correct API key, quotas, model access and live provider behavior are not verifiable without the owner's credentials/network. | Set a valid server-side `GEMINI_API_KEY`; run chat, plan and quiz tests against the actual provider. |
| Medium | Notifications | Email, scheduled reminders and delivery services are not implemented. Their controls are now disabled and labelled accordingly. | Integrate an email/push provider and scheduled job/worker before enabling them. |
| Medium | Privacy/analytics | Analytics, usage sharing, and recommendation settings have no connected telemetry/service. Their controls are disabled and labelled accordingly. | Implement the desired service with an explicit privacy policy/consent flow, or remove these options. |
| Medium | Advanced settings | Debug logging, component-boundary visualization and the beta toggles are not wired to application behavior. They are now marked unavailable instead of pretending to work. | Implement each toggle against a real feature or remove it from the product UI. |
| Medium | Legal/contact | Landing footer Privacy, Terms and Contact links are placeholders because no approved policy text or support destination exists. | Supply real legal pages and a support contact before public launch. |
| Medium | Responsive UX | Source paths for desktop and mobile were reviewed, but actual viewport testing at representative device sizes could not be performed. | Run browser regression at phone, tablet and desktop breakpoints. |

## Page and feature status

| Area | Source audit / code changes | Browser verification |
|---|---|---|
| Landing / navigation | Navigation links and CTA destinations reviewed; brand root link fixed. Footer legal/contact placeholders remain. | Not run. |
| Dashboard | Task data, planner widgets, study-time/AI/quiz stats and seven-day activity now use saved data; fake lesson-resume message removed. | Not run. |
| AI Tutor | Chat API, streaming logic, attachments, history, model fallback, rate limits and desktop/mobile data reviewed. | Live Gemini and browser testing not run. |
| Quiz & Practice | Request parsing, generated quiz validation and saved quiz history tracking reviewed. | Live generation and quiz interaction not run. |
| My Notes | Storage reads/writes, normalization and DB mirror reviewed. | CRUD browser flow not run. |
| My Progress | Desktop progress calculations and mobile consistency improved. | Chart rendering/layout not run. |
| Study Planner | Date logic, task normalization, streak, goals and desktop/mobile parity reviewed. | Full modal/drag/viewport interactions not run. |
| Tasks | Storage shape and dashboard integration reviewed. | CRUD/filter/sort browser flow not run. |
| Settings | Backup import/export, storage size, data deletion, schema validation and unsupported settings behavior reviewed. | File picker, browser download and reload flow not run. |
| Database APIs | Request parsing, sync limits, rate-limits, SQLite repository logic and health error disclosure reviewed. | Actual Next.js HTTP route integration not run; repository tests passed. |

## Setup and deployment notes

1. Use Node.js **22.5+** (the project uses built-in `node:sqlite`).
2. Run `npm ci` in an environment with npm registry access.
3. Create a private `.env.local` with a real `GEMINI_API_KEY`; optionally set `GEMINI_MODEL`, `GEMINI_FALLBACK_MODELS`, `DATABASE_PATH`, and a trusted proxy header only when the ingress overwrites it.
4. Run `npm run typecheck`, `npm run lint`, `npm run build`, then `npm run dev` and complete browser regression tests.
5. Use the SQLite adapter only on a server with a persistent writable disk and a single shared runtime. For Netlify/serverless or multi-instance deployment, migrate to a managed shared database first.

## Archive hygiene

The supplied ZIP contained Git history and SQLite database/WAL/SHM files. The audit archive intentionally excludes `.git`, local database files, dependency/build output, and temporary compiler artifacts. `.env.example` is included; real environment secrets are not included.

## Overall conclusion

**Source-level audit and offline runtime tests: completed for the reviewed code paths. Full production verification: not completed.** The project has meaningful fixes, but it cannot honestly be certified as “100% bug-free” or production-ready until dependencies can be installed, the actual Next.js build/type/lint checks pass, browser testing is completed, Gemini is tested with a valid key, and the authentication/database deployment architecture is resolved.
