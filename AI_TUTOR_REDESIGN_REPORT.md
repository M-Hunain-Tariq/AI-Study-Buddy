# AI Tutor redesign report

## Scope

This update redesigns the AI Tutor experience in both the dedicated `/ai-tutor` route and the AI Tutor view embedded in the Home dashboard. The existing landing page and Home dashboard presentation were not redesigned as part of this task.

## UI and interaction updates

- Added a compact desktop robot hero using the project's existing `public/images/ai_tutor_robot_hero.jpg` artwork.
- Added a matching mobile robot hero that collapses while a conversation is active so the chat can use more of the screen.
- Added selectable Ask Anything, Practice, and Socratic modes on desktop and mobile, wired to the existing `/api/ai/chat` endpoint.
- Added a clean chat workspace, responsive message layout, streaming states, copy and Save to Notes actions, and follow-up actions.
- Added a desktop Explore panel and mobile Explore sheet for the existing quick prompts and study tools. Selecting an item loads it into the composer; it does not send automatically.
- Preserved the existing supported upload types and 4 MB file size limit, with text-file length validation.
- Added conversation reopening from desktop history and retained mobile history loading/deletion. History remains browser-local, consistent with the current storage implementation.
- Kept the shared hero/sidebar components compatible with the Home dashboard's embedded AI Tutor. Dashboard history reopening is now wired as well, and duplicate quick prompts are avoided in that view.
- Added scoped mobile styles for the new AI Tutor layout.

## Validation performed

- TypeScript/TSX syntax parsing: 122 implementation files scanned, zero syntax errors.
- Local TypeScript import resolution: zero missing local imports.
- CSS parsing: `app/mobile.css` and `app/globals.css` parse successfully.
- `package.json` and `package-lock.json`: valid JSON.
- Confirmed the three mode names are present in the existing API and new desktop/mobile selectors send the selected mode.
- Confirmed desktop and mobile upload payloads remain wired.
- Confirmed dashboard embedded AI Tutor prop compatibility and conversation selection wiring.
- Confirmed the original robot hero artwork exists.

## Build verification limitation

A full dependency-backed Next.js production build and ESLint run were not completed in this environment. The project ZIP does not include `node_modules`; dependency installation was attempted but the npm registry/network request timed out. The checks above are syntax, import-resolution, CSS, and static integration checks; they are not a substitute for `npm run build`.

## Notes

- AI Tutor conversation history continues to use browser local storage; this update does not add cloud synchronization.
- Gemini API, `/api/ai/chat`, existing language preference storage, local Notes integration, and the current attachment handling flow are retained.
