<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/989cf93d-847a-4cb8-b061-5e8edb0bbd3e

## Run Locally

**Prerequisites:** Node.js 22.5 or newer (the database uses the built-in `node:sqlite`).


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`


## Production deployment note

The current database adapter writes to a local SQLite file. Use it for local development or a
server with a persistent writable disk. A typical Netlify Functions deployment does not provide
a shared persistent SQLite file, so database-backed sync is **not production-safe on Netlify** as
currently implemented. Before deploying to Netlify for real users, migrate the data layer to a
managed database and configure its server-only environment variables. The Gemini API key must be
set as a server-side environment variable (`GEMINI_API_KEY`), never exposed with a `NEXT_PUBLIC_`
prefix.
