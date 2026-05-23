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
