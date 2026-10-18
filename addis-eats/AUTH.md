# Addis Eats Authentication

Authentication uses Supabase Auth with cookie-based SSR sessions.

## Local Configuration

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` using the values from the Supabase project's Connect dialog. `.env.local` is gitignored. Never add a Supabase secret/service-role key to a `NEXT_PUBLIC_` variable.

## Google Sign-In Setup

1. In Google Cloud Console, create an OAuth client ID for a web application. Add the Supabase project's Auth callback URL (shown in Supabase under **Authentication > Sign In / Providers > Google**) as an authorized redirect URI.
2. In Supabase, enable the Google provider and enter the Google client ID and client secret.
3. In Supabase **Authentication > URL Configuration**, add the app callback to the redirect allow list: `http://localhost:3000/auth/callback` for local development and `https://your-domain/auth/callback` for production.

The app starts OAuth at `/api/auth/google` and exchanges the returned code at `/auth/callback`; no Google credentials belong in the app's environment variables.

Install dependencies with `npm install` if needed.

## Database Setup

Run `supabase/migrations/20261016000000_create_profiles.sql` in the Supabase SQL Editor. It creates a profile for each existing Auth user, creates profiles for future users, and enables row-level security so users can only read their own profile. New users default to the `customer` role.

After the existing `public.orders` table is available, also run `supabase/migrations/20261018000000_add_order_cancellation.sql`. It adds the cancellation timestamp and an owner-scoped database function that only cancels orders before courier dispatch.

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
- `/api/auth/signin` uses `signInWithPassword`; `/api/auth/google` starts Google OAuth and `/auth/callback` exchanges the returned code for a Supabase session; `/api/auth/signout` revokes the Supabase session.
- The sign-in page validates the `next` destination to prevent open redirects.

## Authorization

The Proxy redirects unauthenticated visitors from `/checkout`, `/orders`, `/kitchen`, and `/dashboard` to sign in. Server components and API routes must continue calling `getSession()` and enforce ownership or staff-role checks themselves; the Proxy is not the authorization boundary for private data.

Order data is stored in the existing `public.orders` table. The cancellation migration must be applied before customers can use the cancel action.
