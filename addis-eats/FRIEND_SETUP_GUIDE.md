# Addis Eats Clone Setup Guide

This guide explains how to create an independent copy of the Addis Eats project from scratch.

The person cloning this project must use their own:

- GitHub repository
- Supabase project
- Google Cloud project and OAuth credentials
- Vercel/deployment project
- Environment variables

Do not copy another person's `.env.local`, Supabase database credentials, Google client secret, or service-role key.

## 1. What this project contains

Addis Eats is a Next.js food-ordering application using:

- Next.js and React
- Supabase Authentication
- Google OAuth
- Supabase profiles and user roles
- SWR for client-side data fetching
- Leaflet maps
- Local recipe data in `src/data/recipes.json`

Current data limitations:

- Recipes are stored locally in `src/data/recipes.json`.
- User profiles and roles are stored in Supabase.
- Orders are currently stored in application memory in `src/lib/orders.js`.
- In-memory orders can disappear after a restart, deployment, or serverless cold start.

This is suitable as a demonstration project. A production restaurant system should move orders, dishes, and order items into persistent database tables.

## 2. Clone the project

Install Git and Node.js first. Then run:

```bash
git clone <repository-url>
cd <cloned-project>/addis-eats
```

Check the installed versions:

```bash
node --version
npm --version
```

Install the project dependencies:

```bash
npm install
```

Use `npm install` because this project includes `package-lock.json`.

## 3. Create the local environment file

Copy the example environment file:

```bash
cp .env.example .env.local
```

Open `.env.local` and enter values belonging to the new project:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key

SESSION_SECRET=your-own-random-secret-at-least-32-characters
```

Important rules:

- Never copy someone else's `.env.local`.
- Never commit `.env.local` to GitHub.
- Never put a Supabase service-role key in a `NEXT_PUBLIC_` variable.
- Never put a Google client secret in frontend code.

The `.gitignore` file is configured to ignore `.env*.local` files.

## 4. Create a new Supabase project

Create a new Supabase project using a separate account or a separate project owned by the person cloning the application.

In the Supabase dashboard:

1. Create a project.
2. Choose a project name, database password, and region.
3. Open the project API or Connect settings.
4. Copy the Project URL into `NEXT_PUBLIC_SUPABASE_URL`.
5. Copy the Publishable key into `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.

Do not use another project's database password, service-role key, or private credentials.

## 5. Create the profiles database table

The project includes this migration:

```text
supabase/migrations/20261016000000_create_profiles.sql
```

Open the Supabase SQL Editor and run that migration. It creates:

- The `public.profiles` table
- Customer and staff roles
- Row-level security
- A profile for existing users
- A trigger that creates a profile for new users

Do not run this migration unchanged:

```text
supabase/migrations/20261016000100_grant_staff_to_johny.sql
```

That migration grants staff access to a personal email address from the original project. Delete it, or replace it with a controlled migration for the new owner's email address.

A safer approach is to create the user first, then grant staff access manually:

```sql
update public.profiles
set role = 'staff'
where id = (
  select id
  from auth.users
  where email = 'your-email@example.com'
);
```

Only trusted administrators should receive the `staff` role.

## 6. Configure email and password authentication

In Supabase:

1. Open Authentication.
2. Enable email/password authentication.
3. Create a test user.
4. Confirm that a matching row appears in `public.profiles`.
5. Confirm that the new user has the `customer` role.

The application protects these routes:

```text
/checkout
/orders
/kitchen
/dashboard
```

The application also performs authorization checks on the server. Frontend route protection alone is not sufficient for protecting private data.

## 7. Configure Google sign-in

Google sign-in requires configuration in both Google Cloud and Supabase.

### 7.1 Create Google OAuth credentials

In Google Cloud Console:

1. Create or select a Google Cloud project.
2. Configure the OAuth consent screen.
3. Create an OAuth Client ID.
4. Select **Web application**.
5. Open Supabase **Authentication → Sign In / Providers → Google**.
6. Copy the Supabase callback URL.
7. Add the Supabase callback URL to Google Authorized redirect URIs.

The callback URL will look similar to:

```text
https://your-project-ref.supabase.co/auth/v1/callback
```

The Google redirect URI is the Supabase callback URL, not `http://localhost:3000/auth/callback`.

### 7.2 Enable Google in Supabase

In Supabase:

1. Open **Authentication → Sign In / Providers → Google**.
2. Enable Google.
3. Enter the Google Client ID.
4. Enter the Google Client Secret.
5. Save the settings.

Google credentials belong in Supabase provider settings. They do not belong in the application `.env.local` file.

### 7.3 Add application redirect URLs

In Supabase **Authentication → URL Configuration**, add:

```text
http://localhost:3000/auth/callback
https://your-production-domain.com/auth/callback
```

Set the production Site URL to the deployed application domain.

The application starts Google login at `/api/auth/google` and completes the login at `/auth/callback`.

## 8. Start the application locally

Run the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

Test the following pages and features:

- Home page: `/`
- Menu: `/menu`
- Sign-in: `/signin`
- Checkout: `/checkout`
- Orders: `/orders`
- Kitchen dashboard: `/kitchen`
- Staff dashboard: `/dashboard`
- Order tracking: `/track/<order-id>`
- Favorites
- Recipe search
- Category filtering
- Email sign-in
- Google sign-in
- Sign-out

## 9. Replace demo accounts

The original README contains demo accounts. Do not reuse those accounts or passwords in a new project.

Create new test users inside the new Supabase project instead. Remove or replace the original demo credentials in the README before publishing the clone.

## 10. Understand the project data

### Recipes

Recipes are loaded from:

```text
src/data/recipes.json
```

Edit that file to change the local menu.

### Profiles

Profiles are stored in:

```text
public.profiles
```

Each profile includes a user ID, name, role, and creation date.

### Orders

Orders are currently stored in:

```text
src/lib/orders.js
```

They are not permanently stored in Supabase. For a real production application, create persistent tables such as:

```text
dishes
orders
order_items
delivery_locations
```

Then replace the in-memory order functions with Supabase database queries.

## 11. Run checks before deployment

Run:

```bash
npm run lint
npm run build
npm run start
```

Check that the production server works at:

```text
http://localhost:3000
```

Check that no local secrets are tracked:

```bash
git status
git ls-files | grep -E '(^|/)\.env' || true
```

Only `.env.example` should be committed. `.env.local` must not appear in the tracked files.

## 12. Deploy a separate copy

For a Vercel deployment:

1. Create a new GitHub repository.
2. Push the cloned project to that repository.
3. Create a new Vercel project.
4. Import the GitHub repository.
5. Set the project root directory to `addis-eats` if required.
6. Add the environment variables from `.env.local` to Vercel.
7. Set the production URL:

```env
NEXT_PUBLIC_SITE_URL=https://your-production-domain.com
```

8. Add the production callback URL to Supabase.
9. Add the Supabase callback URL to Google Cloud Console.
10. Redeploy the application.

After deployment, test:

```text
/
/menu
/signin
/sitemap.xml
/robots.txt
/auth/callback
```

## 13. Security checklist

Before sharing or deploying the project:

- Use a separate Supabase project.
- Use separate Google OAuth credentials.
- Never share `.env.local`.
- Never share the Supabase database password.
- Never share a Supabase service-role key.
- Remove the personal staff migration or replace it safely.
- Remove original demo passwords.
- Do not put Google secrets in frontend code.
- Confirm `.env.local` is ignored by Git.
- Rotate credentials immediately if they were accidentally shared.

The correct ownership arrangement is:

```text
Original project  → original owner's Supabase and Google credentials
Cloned project    → new owner's Supabase and Google credentials
```

This prevents one project from accessing or changing the other project's users, authentication settings, profiles, and data.

## 14. Completion checklist

The clone is ready when all of these are true:

- Dependencies install successfully.
- `.env.local` contains only the new owner's values.
- A new Supabase project is connected.
- The profile migration runs successfully.
- Email login works.
- Google login works.
- Customer access works.
- Staff access works only for the intended staff account.
- Menu and search work.
- Checkout and order tracking work.
- Lint passes.
- Production build passes.
- No secrets are committed to GitHub.
- Production callback URLs are configured correctly.
