import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Find expired pending reservations
    const expiredReservations =
      await prisma.reservation.findMany({
        where: {
          status: "PENDING",

          expiresAt: {
            lte: new Date(),
          },
        },
      });

    // Release each reservation
    for (const reservation of expiredReservations) {
      // Update reservation status
      await prisma.reservation.update({
        where: {
          id: reservation.id,
        },

        data: {
          status: "RELEASED",
        },
      });

      // Release reserved stock
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
    }

    return NextResponse.json({
      success: true,

      releasedReservations:
        expiredReservations.length,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Failed to release expired reservations",
      },
      { status: 500 }
    );
  }
}