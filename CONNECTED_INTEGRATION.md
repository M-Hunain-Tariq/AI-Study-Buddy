# AI Study Buddy — Connected Landing + Web App

## Flow
1. `/` opens the premium AI Study Buddy landing page.
2. The landing page's final **Start Learning Free** CTA opens the onboarding modal.
3. The user enters their name/email and selects subjects.
4. The submitted name/email are saved to browser localStorage.
5. After submission, the app navigates to `/dashboard`.
6. The original dashboard and all existing web-app routes remain available.

## Main routes
- `/` — Landing page
- `/dashboard` — Web app dashboard
- `/ai-tutor`
- `/study-planner`
- `/my-notes`
- `/tasks`
- `/quiz-practice`
- `/my-progress`
- `/settings`

## Validation
- TypeScript `tsc --noEmit`: passed.
- Production `next build`: not executed successfully in this environment because the uploaded project's `node_modules` is incomplete/missing Next's executable build files. Run `npm install` in a normal Node.js environment before `npm run build`.
