# Ignite Auto

Admin-managed car dealership marketplace. Dealers and admins list inventory. Customers browse cars, save listings, and book test drives.

## Features

- AI image search: upload a car photo and get make, model, and details back
- Admin AI entry: upload a photo while adding a car and fill the listing from the image
- Test drive booking
- Saved cars
- Admin dashboard for inventory, bookings, and dealership settings

## Stack

- Next.js 16 App Router and React 19
- Tailwind CSS v4
- Prisma 6 and PostgreSQL
- Clerk authentication
- Arcjet bot protection and rate limiting
- Supabase storage for car images (`lib/supabase.js`)
- Google Gemini (`@google/genai`) for image identification

## Environment

Create `.env.local`. Names only:

```
DATABASE_URL
DIRECT_URL
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
GEMINI_API_KEY
ARCJET_KEY
CRON_SECRET
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
```

`DATABASE_URL`, `DIRECT_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `GEMINI_API_KEY`, `ARCJET_KEY`, and `CRON_SECRET` are read by this repo. Clerk reads `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`. `NODE_ENV` is read in `lib/prisma.js` and is set by Next.js.

`CRON_SECRET` authorizes `GET /api/cron/keep-alive` (`Authorization: Bearer <CRON_SECRET>`). Set the same value in Vercel so the daily cron can call the route. The GitHub backup workflow also needs repository secrets `CRON_SECRET` and `APP_URL` (deployed origin, no trailing path).

## Setup

```sh
npm install --legacy-peer-deps
npx prisma migrate dev
npm run dev
```

`postinstall` runs `prisma generate`. Apply the `KeepAlive` migration before the cron route can write.

## Keep-alive

Supabase free projects pause after about a week without activity. `app/api/cron/keep-alive/route.js` checks `CRON_SECRET`, upserts `KeepAlive` id `1`, writes and reads `note`, clears `note`, then lists one object through the Supabase client. The route is excluded from Clerk and Arcjet in `proxy.js`.

`vercel.json` calls that route once per day. `.github/workflows/keep-alive.yml` is a backup every 2 days. GitHub disables scheduled workflows after about 60 days without repository activity, so the Vercel cron is the one to rely on.

## Project structure

```
app/
  (main)/          public and customer pages (cars, saved cars, reservations, test drives)
  (admin)/admin/   dashboard, inventory, test drives, settings
  (auth)/          Clerk sign-in and sign-up
  api/cron/keep-alive/
  waitlist/
  page.jsx         home
actions/           server actions
components/        shared UI
lib/               Prisma, Supabase, Gemini, Arcjet
prisma/            schema and migrations
proxy.js           Clerk and Arcjet (Next.js 16 proxy)
vercel.json        daily keep-alive cron
```
