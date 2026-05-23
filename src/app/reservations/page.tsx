"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ActiveReservationsPage() {
  const router = useRouter();

  const { data: reservations, isLoading } = useQuery({
    queryKey: ["reservations"],
    queryFn: async () => {
      const response = await axios.get(
        "/api/reservations"
      );
      return response.data;
    },
    refetchInterval: 5000,
  });

  const getDisplayStatus = (res: any) => {
    if (res.status === "RELEASED") {
      if (new Date(res.expiresAt) < new Date()) {
        return "TIME_EXPIRED";
      }
      return "CANCELLED";
    }
    return res.status;
  };

  if (isLoading) {
    return (
      <div className="p-10">
        Loading reservations...
      </div>
    );
  }

  const pendingReservations = reservations?.filter(
    (res: any) => res.status === "PENDING"
  ) || [];

  const confirmedReservations =
    reservations?.filter(
      (res: any) => res.status === "CONFIRMED"
    ) || [];

  const cancelledReservations =
    reservations?.filter((res: any) => {
      const display = getDisplayStatus(res);
      return (
        res.status === "RELEASED" &&
        new Date(res.expiresAt) >=
          new Date()
      );
    }) || [];

  const expiredReservations =
    reservations?.filter((res: any) => {
      const display = getDisplayStatus(res);
      return (
        res.status === "RELEASED" &&
        new Date(res.expiresAt) < new Date()
      );
    }) || [];

  return (
    <main className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Active Reservations
            </h1>
            <p className="text-gray-500">
              Manage your reservations and
              checkout
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push("/")}
          >
            Back to Home
          </Button>
        </div>

        {pendingReservations.length === 0 &&
        confirmedReservations.length === 0 &&
        cancelledReservations.length === 0 &&
        expiredReservations.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center">
              <p className="text-gray-500">
                No active reservations
              </p>
              <Button
                className="mt-4"
                onClick={() => router.push("/")}
              >
                Create Reservation
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {pendingReservations.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">
                  Pending Reservations
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  {pendingReservations.map(
                    (reservation: any) => (
                      <Card
                        key={reservation.id}
                        className="shadow-sm hover:shadow-md transition-shadow"
                      >
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle>
                              {
                                reservation.inventory
                                  .product.name
                              }
                            </CardTitle>
                            <Badge
                              className="bg-yellow-100 text-yellow-800"
                              variant="outline"
                            >
                              PENDING
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-500">
                                Warehouse
                              </p>
                              <p className="font-semibold">
                                {
                                  reservation.inventory
                                    .warehouse.name
                                }
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">
                                Quantity
                              </p>
                              <p className="font-semibold">
                                {reservation.quantity}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">
                                Status
                              </p>
                              <p className="font-semibold text-yellow-600">
                                {reservation.status}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">
                                Expires At
                              </p>
                              <p className="font-semibold text-red-600">
                                {new Date(
                                  reservation.expiresAt
                                ).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                          <Button
                            className="w-full"
                            onClick={() =>
                              router.push(
                                `/reservations/${reservation.id}`
                              )
                            }
                          >
                            Complete Checkout
                          </Button>
                        </CardContent>
                      </Card>
                    )
                  )}
                </div>
              </div>
            )}

            {confirmedReservations.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">
                  Confirmed Reservations
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  {confirmedReservations.map(
                    (reservation: any) => (
                      <Card
                        key={reservation.id}
                        className="shadow-sm"
                      >
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle>
                              {
                                reservation.inventory
                                  .product.name
                              }
                            </CardTitle>
                            <Badge
                              className="bg-green-100 text-green-800"
                              variant="outline"
                            >
                              CONFIRMED
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">
                                Warehouse
                              </p>
                              <p className="font-semibold">
                                {
                                  reservation.inventory
                                    .warehouse.name
                                }
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">
                                Quantity
                              </p>
                              <p className="font-semibold">
                                {reservation.quantity}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">
                                Status
                              </p>
                              <p className="font-semibold text-green-600">
                                {reservation.status}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">
                                Confirmed At
                              </p>
                              <p className="font-semibold">
                                {new Date(
                                  reservation.updatedAt
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  )}
                </div>
              </div>
            )}

            {cancelledReservations.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">
                  Cancelled Reservations
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  {cancelledReservations.map(
                    (reservation: any) => (
                      <Card
                        key={reservation.id}
                        className="shadow-sm opacity-75"
                      >
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle>
                              {
                                reservation.inventory
                                  .product.name
                              }
                            </CardTitle>
                            <Badge
                              className="bg-red-100 text-red-800"
                              variant="outline"
                            >
                              CANCELLED
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">
                                Warehouse
                              </p>
                              <p className="font-semibold">
                                {
                                  reservation.inventory
                                    .warehouse.name
                                }
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">
                                Quantity
                              </p>
                              <p className="font-semibold">
                                {reservation.quantity}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">
                                Status
                              </p>
                              <p className="font-semibold text-red-600">
                                {reservation.status}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">
                                Cancelled At
                              </p>
                              <p className="font-semibold">
                                {new Date(
                                  reservation.updatedAt
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  )}
                </div>
              </div>
            )}

            {expiredReservations.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">
                  Expired Reservations
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  {expiredReservations.map(
                    (reservation: any) => (
                      <Card
                        key={reservation.id}
                        className="shadow-sm opacity-75"
                      >
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle>
                              {
                                reservation.inventory
                                  .product.name
                              }
                            </CardTitle>
                            <Badge
                              className="bg-orange-100 text-orange-800"
                              variant="outline"
                            >
                              TIME EXPIRED
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">
                                Warehouse
                              </p>
                              <p className="font-semibold">
                                {
                                  reservation.inventory
                                    .warehouse.name
                                }
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">
                                Quantity
                              </p>
                              <p className="font-semibold">
                                {reservation.quantity}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">
                                Status
                              </p>
                              <p className="font-semibold text-orange-600">
                                {reservation.status}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">
                                Expired At
                              </p>
                              <p className="font-semibold">
                                {new Date(
                                  reservation.expiresAt
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
