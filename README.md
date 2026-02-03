# Leo Adu Site

Private family photo journal built with Astro, Drizzle, and Better Auth.

## Features
- Invite-only access gate for the entire site
- Admin review for access requests
- Email/password auth with invitations
- Photo content stored in Markdown with Japanese/English support
- Optional DeepL auto-translation for English captions

## Requirements
- Node.js 18+ (Node 20 recommended)
- Postgres database (Supabase works)

## Quick Start
```bash
npm install
npm run dev
```
Local server runs at `http://localhost:4321`.

## Environment
Copy `.env.example` to `.env` and fill in the values.

Required for local dev:
```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB_NAME"
BETTER_AUTH_SECRET="replace-with-a-long-random-string"
BETTER_AUTH_BASE_URL="http://localhost:4321"
APP_URL="http://localhost:4321"
ADMIN_EMAILS="admin@example.com"
REQUEST_ACCESS_TOKEN="replace-with-a-secret-token"
```

Optional:
```bash
DATABASE_SSL="true"
ALLOW_SIGNUP="false"
RESEND_API_KEY="re_..."
EMAIL_FROM="Leo Adu <no-reply@example.com>"
DEEPL_API_KEY="replace-with-your-deepl-api-key"
DEEPL_API_URL="https://api-free.deepl.com/v2/translate"
BOOTSTRAP_ADMIN_TOKEN="replace-with-a-one-time-token"
```

Notes:
- If you use Supabase, set `DATABASE_SSL="true"` and do not include `sslmode=require` in the URL.
- Restart the dev server after changing `.env`.

## Database
Apply schema (development):
```bash
npm run db:push
```

## Auth + Invite Flow
- `/invite-only` is the landing page for unauthenticated users.
- `/request-access?token=...` is the request form (token gated).
- `/admin/requests` shows pending requests and lets admins approve/deny.
- Approve sends an invite email with `/invite/<id>`.
- `/admin/invite` lets admins send invites directly.
- `/bootstrap-admin` creates the first user (disabled if users exist).

## Photo Content
Photos live in:
```text
src/content/photos/ja
src/content/photos/en
```

Sync metadata and auto-translate:
```bash
npm run photos:sync
node scripts/sync-photo-metadata.mjs --only 2025-07-12_he-looks-confy.md
```

## Scripts
```bash
npm run dev
npm run build
npm run preview
npm run db:push
npm run db:migrate
npm run photos:sync
```

## CI: Auto-sync Photos
Workflow: `.github/workflows/photos-sync.yml`
- Runs on push to `master`
- Auto-commits any changes from `photos:sync`

Set these GitHub Actions secrets:
```text
DEEPL_API_KEY
DEEPL_API_URL
```

