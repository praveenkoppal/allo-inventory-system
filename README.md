<<<<<<< HEAD
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Project: Inventory Reservation (Allo take-home)

Run locally (summary):

1. Copy `.env.example` to `.env` and set `DATABASE_URL` to your hosted Postgres.
2. Install deps:

```bash
npm install
```

3. Run Prisma migrations and seed the DB:

```bash
npx prisma migrate deploy
npm run seed
```

4. Start dev server:

```bash
npm run dev
```

APIs implemented:
- `GET /api/products` - list products with inventory per warehouse
- `GET /api/warehouses` - list warehouses
- `POST /api/reservations` - create a reservation (returns 409 if insufficient stock)
- `POST /api/reservations/:id/confirm` - confirm reservation (returns 410 if expired)
- `POST /api/reservations/:id/release` - release reservation early

Expiry mechanism:
- A cron endpoint is available at `/api/cron/release-expired`. In production you should schedule this (Vercel Cron or a background worker) to run every minute. It finds expired pending reservations, marks them released, and decrements reserved stock.

Notes / trade-offs:
- Concurrency: reservations use an atomic `updateMany` on the `Inventory` row with a condition on `reservedStock` vs `totalStock` to guarantee only one writer can reserve the last unit. This keeps the critical section entirely in the database (single-node Postgres) and avoids application-level locks.
- Idempotency: not implemented in this iteration. For production, I'd add idempotency keys stored in Redis and persist responses for repeat-safe retries.
- Migrations: enum additions are applied via controlled SQL migration to avoid destroying the existing enum type.

If you'd like, I can prepare a `deploy` checklist and add a Live demo URL.
=======
# Allo Inventory Reservation System

A full-stack inventory reservation system built with Next.js, Prisma, PostgreSQL, and React Query.

## Features

- Multi-warehouse inventory management
- Product reservation system
- Reservation expiry handling
- Concurrency-safe stock reservation
- Reservation confirmation and cancellation
- Live stock updates
- Countdown timer for reservations

## Tech Stack

- Next.js App Router
- TypeScript
- Prisma ORM
- PostgreSQL (Neon)
- Tailwind CSS
- shadcn/ui
- React Query
- Zod

## Running Locally

```bash
npm install
npx prisma generate
npx prisma db push
npm run seed
npm run dev
>>>>>>> 79c520953a6d8d67046a02320337eff5a527ade4
