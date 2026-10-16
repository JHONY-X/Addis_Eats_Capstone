# Addis Eats Authentication

Authentication uses Supabase Auth with cookie-based SSR sessions.

## Local Configuration

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` using the values from the Supabase project's Connect dialog. `.env.local` is gitignored. Never add a Supabase secret/service-role key to a `NEXT_PUBLIC_` variable.

Install dependencies with `npm install` if needed.

## Database Setup

Run `supabase/migrations/20261016000000_create_profiles.sql` in the Supabase SQL Editor. It creates a profile for each existing Auth user, creates profiles for future users, and enables row-level security so users can only read their own profile. New users default to the `customer` role.

Create users from **Authentication → Users**. To grant staff access, use the SQL Editor with the user's actual email:

```sql
update public.profiles
set role = 'staff'
where id = (
	select id from auth.users where email = 'staff@example.com'
);
```

Do not grant staff through user-editable Auth metadata or client code.

## Request Flow

- `src/lib/supabase/server.js` creates a request-scoped Supabase server client and reads/writes Auth cookies.
- `src/lib/supabase/proxy.js` refreshes tokens and verifies claims in the Next.js 16 Proxy.
- `src/lib/session.js` verifies the user with Supabase and loads the role from `public.profiles`; missing or unrecognized roles default to `customer`.
- `/api/auth/signin` uses `signInWithPassword`; `/api/auth/signout` revokes the Supabase session.
- `/api/auth/google` starts Google OAuth and `/auth/callback` exchanges the authorization code for a cookie-backed session.
- The sign-in page validates the `next` destination to prevent open redirects.

## Google Provider Setup

1. In Google Cloud Console, create an OAuth client ID for a Web application.
2. Add `https://<your-project-ref>.supabase.co/auth/v1/callback` as an authorized redirect URI in Google Cloud.
3. In Supabase, open **Authentication → Sign In / Providers → Google**, enable Google, and enter the Google client ID and client secret.
4. In Supabase **Authentication → URL Configuration**, set the local Site URL to `http://localhost:3000` and add `http://localhost:3000/auth/callback` to the allowed redirect URLs. Add the production callback URL when deploying.
5. Sign in at `/signin` with the Google account. To receive staff access, its email must match the account granted the `staff` role in `public.profiles`.

## Authorization

The Proxy redirects unauthenticated visitors from `/checkout`, `/orders`, `/kitchen`, and `/dashboard` to sign in. Server components and API routes must continue calling `getSession()` and enforce ownership or staff-role checks themselves; the Proxy is not the authorization boundary for private data.

Orders are still stored in the app's existing in-memory store. Supabase Auth does not make order data persistent; move orders to a database separately if persistence is required.
