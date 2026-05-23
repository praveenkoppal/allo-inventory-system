import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { createReservationSchema } from "@/schemas/reservation";

export async function GET(req: NextRequest) {
  try {
    const reservations =
      await prisma.reservation.findMany({
        include: {
          inventory: {
            include: {
              product: true,
              warehouse: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    return NextResponse.json(reservations);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch reservations" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const validatedData =
      createReservationSchema.parse(body);

    const { productId, warehouseId, quantity } =
      validatedData;

    // Find inventory
    const inventory = await prisma.inventory.findUnique({
      where: {
        productId_warehouseId: {
          productId,
          warehouseId,
        },
      },
    });

    if (!inventory) {
      return NextResponse.json(
        { error: "Inventory not found" },
        { status: 404 }
      );
    }

    // Atomic stock reservation
    const updatedInventory =
      await prisma.inventory.updateMany({
        where: {
          id: inventory.id,

          // IMPORTANT CONDITION
          reservedStock: {
            lte:
              inventory.totalStock - quantity,
          },
        },

        data: {
          reservedStock: {
            increment: quantity,
          },
        },
      });

    // No rows updated = insufficient stock
    if (updatedInventory.count === 0) {
      return NextResponse.json(
        {
          error: "Not enough stock available",
        },
        { status: 409 }
      );
    }

    // Create reservation
    const reservation =
      await prisma.reservation.create({
        data: {
          inventoryId: inventory.id,
          quantity,
          status: "PENDING",

          expiresAt: new Date(
            Date.now() + 10 * 60 * 1000
          ),
        },
      });

    return NextResponse.json(
      reservation,
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to create reservation" },
      { status: 500 }
    );
  }
}