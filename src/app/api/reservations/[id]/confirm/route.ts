import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: reservationId } = await params;

    // Find reservation
    const reservation =
      await prisma.reservation.findUnique({
        where: {
          id: reservationId,
        },
        include: {
          inventory: true,
        },
      });

    if (!reservation) {
      return NextResponse.json(
        { error: "Reservation not found" },
        { status: 404 }
      );
    }

    // Expired
    if (reservation.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "Reservation expired" },
        { status: 410 }
      );
    }

    // Already processed
    if (reservation.status !== "PENDING") {
      return NextResponse.json(
        {
          error: "Reservation already processed",
        },
        { status: 400 }
      );
    }

    // Update reservation
    await prisma.reservation.update({
      where: {
        id: reservation.id,
      },
      data: {
        status: "CONFIRMED",
      },
    });

    // Update inventory
    await prisma.inventory.update({
      where: {
        id: reservation.inventoryId,
      },
      data: {
        totalStock: {
          decrement: reservation.quantity,
        },

        reservedStock: {
          decrement: reservation.quantity,
        },
      },
    });

    return NextResponse.json({
      message:
        "Reservation confirmed successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to confirm reservation" },
      { status: 500 }
    );
  }
}