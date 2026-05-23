# Allo Inventory Reservation System

A full-stack inventory reservation system built using Next.js, Prisma, PostgreSQL, and React Query.

The application supports multi-warehouse inventory management, product reservations, reservation expiry handling, and concurrency-safe stock updates.

---

# Live Demo

Deployed Application:

https://YOUR-VERCEL-URL.vercel.app

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
