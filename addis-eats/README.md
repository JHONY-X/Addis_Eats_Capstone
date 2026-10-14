# Addis Eats

Addis Eats is a Next.js food-ordering demo with account-based ordering,
defence-in-depth route protection, server-seeded SWR polling, debounced menu
search, and SEO metadata.

## Canonical URL

Set `NEXT_PUBLIC_SITE_URL` to your production domain before deployment. The app uses this value for canonical metadata, sitemap, and robots output.

## Run from a fresh clone

```bash
git clone <your-repository-url>
cd Day_48/addis-eats
cp .env.example .env.local
npm install
npm run dev
```

Open `http://localhost:3000`. To check the production build locally:

```bash
npm run lint
npm run build
npm run start
```

## Demo accounts

| Account | Email | Password | Role |
| :--- | :--- | :--- | :--- |
| Almaz | `almaz@addis-eats.com` | `kitfo123` | Customer |
| Dawit | `dawit@addis-eats.com` | `tibs456` | Customer |
| Chef Hana | `staff@addis-eats.com` | `kitchen789` | Staff |

## Production setup

1. Set `NEXT_PUBLIC_SITE_URL` to your production domain.
2. Optionally set `NEXT_PUBLIC_GA_MEASUREMENT_ID` for deferred Google
   Analytics.
3. Verify `/`, `/menu`, `/sitemap.xml`, `/robots.txt`, and each Open Graph image
   route from the deployed site before submitting.

See [AUTH.md](./AUTH.md), [DATA.md](./DATA.md), and [PERF.md](./PERF.md) for
the implementation and verification records.
