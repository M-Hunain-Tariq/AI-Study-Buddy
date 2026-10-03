# Real AI setup

All AI features now call Google Gemini from the **server** (the key never reaches the browser).

| Where | What the AI does | Route |
|---|---|---|
| AI Tutor page + Dashboard chat (incl. Quick Prompts, Study Tools) | Answers like a real tutor in natural, flowing language (streamed word by word, with bold/lists/tables/code when helpful), remembers the last messages, replies in the student's language, reads attached homework images (PNG/JPG/WEBP, max 4 MB) | `/api/ai/chat` |
| Study Planner → "Create My Study Plan with AI" | Builds a day-by-day plan from the subject, topics, exam date, days and daily minutes | `/api/ai/plan` |
| Quiz & Practice → "Generate from Lesson" | Writes MCQs from the pasted lesson | `/api/quiz/generate` |

## Steps
1. Get a key at https://aistudio.google.com/apikey
2. Create `.env.local` in the project root:
   `GEMINI_API_KEY="your-key"`
3. Optional: `GEMINI_MODEL="..."` to pick another Gemini model (default `gemini-3.8-flash`).
4. `npm install` then `npm run dev`.

No key or an AI error shows a clear message in the UI. There are no more canned answers.
Never put the key in a `NEXT_PUBLIC_` variable.
