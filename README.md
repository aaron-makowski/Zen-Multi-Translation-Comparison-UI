# Compare translation apps

*Automatically synced with your [v0.dev](https://v0.dev) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/kodiakcryptos-projects/v0-compare-translation-apps)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/USt7SRA5Aqg)

## Overview

This repository will stay in sync with your deployed chats on [v0.dev](https://v0.dev).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.dev](https://v0.dev).

## Deployment

Your project is live at:

**[https://vercel.com/kodiakcryptos-projects/v0-compare-translation-apps](https://vercel.com/kodiakcryptos-projects/v0-compare-translation-apps)**

## Build your app

Continue building your app on:

**[https://v0.dev/chat/projects/USt7SRA5Aqg](https://v0.dev/chat/projects/USt7SRA5Aqg)**

## How It Works

1. Create and modify your project using [v0.dev](https://v0.dev)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

## Environment Variables

<<<<<<< HEAD
The Reddit integration uses Reddit's public JSON API and does not require authentication. To change the subreddit queried by the API route, define `REDDIT_SUBREDDIT` in your `.env` file. If you later switch to Reddit's authenticated API, you will also need to provide `REDDIT_CLIENT_ID` and `REDDIT_CLIENT_SECRET`.

## Documentation

- [Code of Conduct](docs/CODE_OF_CONDUCT.md)
- [Contributing](docs/CONTRIBUTING.md)
- [FAQ](docs/FAQ.md)

## PDF cache

Monitor the `public/pdfs/` folder for new files and ingest them automatically by running:

```bash
pnpm tsx scripts/watch-pdf-cache.ts
```

Whenever a new `.pdf` is added, the watcher runs the ingestion script (`scripts/ingest-pdf.ts`) and reports whether it succeeded or failed.
=======
Authentication uses [NextAuth](https://next-auth.js.org/) and requires the following environment variables:

```
NEXTAUTH_URL=
NEXTAUTH_SECRET=
GITHUB_ID=
GITHUB_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
EMAIL_FROM=
```

These values configure OAuth providers and the SMTP server used to send password reset emails.
>>>>>>> origin/codex/implement-auth-routes-and-features
