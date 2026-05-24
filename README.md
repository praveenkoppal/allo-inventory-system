# Allo Inventory Reservation System

A full-stack inventory reservation system built using Next.js, Prisma, PostgreSQL, and React Query.

The application supports multi-warehouse inventory management, product reservations, reservation expiry handling, and concurrency-safe stock updates.

---

# Live Demo

Deployed Application:

(https://allo-inventory-system-lovat.vercel.app/)

---

# GitHub Repository

https://github.com/praveenkoppal/allo-inventory-system

---

# Features

- Multi-warehouse inventory management
- Product reservation system
- Reservation confirmation flow
- Reservation cancellation flow
- Reservation expiry handling
- Countdown timer for reservations
- Real-time inventory updates
- Concurrency-safe reservation logic
- Atomic stock reservation updates
- API-driven architecture
- Responsive UI

---

# Tech Stack

## Frontend
- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Query

## Backend
- Next.js API Routes
- Prisma ORM
- PostgreSQL (Neon)

## Validation & Utilities
- Zod
- Axios

## Deployment
- Vercel
- Neon PostgreSQL

---

# Database Schema

The system contains the following core entities:

- Product
- Warehouse
- Inventory
- Reservation

Each warehouse maintains independent inventory counts for products.

Reservations temporarily lock stock using reservedStock until either:
- the purchase is confirmed
- the reservation expires
- the reservation is cancelled

---

# Reservation Flow

1. User views available products and warehouse inventory.
2. User clicks "Reserve Product".
3. Inventory stock is reserved immediately.
4. A reservation record is created with:
   - PENDING status
   - expiry timestamp
5. User can:
   - Confirm Purchase
   - Cancel Purchase
6. Expired reservations are automatically released.

---

# Concurrency Handling

The reservation flow prevents overselling using atomic conditional inventory updates in PostgreSQL through Prisma.

When a reservation request arrives, inventory is only reserved if enough stock is still available.

This guarantees that simultaneous requests for the last available unit cannot both succeed.

If concurrent requests occur:
- one request succeeds
- the other correctly receives HTTP 409

This ensures correctness under concurrency and prevents race-condition-based overselling.

---

# Expiry Mechanism

Reservations contain an expiresAt timestamp and remain in PENDING status until confirmed or released.

Expired reservations are automatically released through a cleanup API endpoint:

/api/cron/release-expired

Due to Vercel Hobby plan limitations on high-frequency cron jobs, the endpoint can be triggered manually or integrated with external schedulers in production environments.

When a reservation expires:
- reservation status becomes RELEASED
- reserved stock is returned to inventory

---

# API Endpoints

## Products

### Get Products
GET /api/products

Returns all products and warehouse inventory.

---

## Reservations

### Create Reservation
POST /api/reservations

Creates a reservation and reserves stock.

---

### Get Reservation
GET /api/reservations/:id

Returns reservation details.

---

### Confirm Reservation
POST /api/reservations/:id/confirm

Confirms reservation and permanently reduces inventory.

---

### Release Reservation
POST /api/reservations/:id/release

Cancels reservation and restores reserved inventory.

---

### Release Expired Reservations
GET /api/cron/release-expired

Automatically releases expired reservations.

---

# Running Locally

## 1. Clone Repository

```bash
git clone https://github.com/praveenkoppal/allo-inventory-system.git
cd allo-inventory-system

2. Install Dependencies
npm install
3. Configure Environment Variables

Create a .env file in the root directory:

DATABASE_URL="postgresql://neondb_owner:npg_QRHUoqk0Y5xu@ep-plain-violet-apd6yyjy.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require"
4. Generate Prisma Client
npx prisma generate
5. Create Database Schema
npx prisma db push
6. Seed Database
npm run seed
7. Start Development Server
npm run dev

Application runs at:

http://localhost:3000

Trade-offs & Design Decisions

Interactive Prisma transactions were initially explored for concurrency handling, but Neon pooled serverless connections introduced transaction startup timeout issues.

To simplify the architecture while maintaining correctness under concurrency, the final implementation uses atomic conditional PostgreSQL updates instead of long-running interactive transactions or distributed Redis locks.

This reduced operational complexity while still guaranteeing inventory consistency.

Future Improvements

With more time, the following improvements could be added:

Redis-based distributed locking
Idempotency key support
WebSocket/SSE real-time updates
Background job queue
Authentication & authorization
Admin inventory dashboard
Reservation analytics
Automated scheduled cleanup service
Integration tests and stress testing
Testing

The application was tested for:

Reservation creation
Reservation confirmation
Reservation cancellation
Reservation expiry
Automatic stock restoration
Concurrent reservation requests
Overselling prevention
API error handling
Live inventory updates
Concurrency Test Example

To verify overselling prevention:

Set inventory stock to 1
Send two simultaneous reservation requests
Observe:
one request succeeds
one request receives HTTP 409

This demonstrates race-condition-safe reservation handling.

Author

Praveen Koppal
