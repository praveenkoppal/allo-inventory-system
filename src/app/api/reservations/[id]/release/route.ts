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
      });

    if (!reservation) {
      return NextResponse.json(
        { error: "Reservation not found" },
        { status: 404 }
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
        status: "RELEASED",
      },
    });

    // Release stock
    await prisma.inventory.update({
      where: {
        id: reservation.inventoryId,
      },
      data: {
        reservedStock: {
          decrement: reservation.quantity,
        },
      },
    });

    return NextResponse.json({
      message:
        "Reservation released successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to release reservation" },
      { status: 500 }
    );
  }
}