"use client";

import { useEffect, useState } from "react";

import axios from "axios";

import {
  useParams,
  useRouter,
} from "next/navigation";

import {
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import toast from "react-hot-toast";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { ArrowLeft } from "lucide-react";

export default function ReservationPage() {
  const params = useParams();

  const router = useRouter();

  const queryClient = useQueryClient();

  const reservationId = params.id;

  const [timeLeft, setTimeLeft] =
    useState("");

  const { data, refetch } = useQuery({
    queryKey: [
      "reservation",
      reservationId,
    ],

    queryFn: async () => {
      const response = await axios.get(
        `/api/reservations/${reservationId}`
      );

      return response.data;
    },

    refetchInterval: 5000,
  });

  // Countdown timer
  useEffect(() => {
    if (!data?.expiresAt) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();

      const expiry = new Date(
        data.expiresAt
      ).getTime();

      const distance = expiry - now;

      if (distance <= 0) {
        setTimeLeft("Expired");

        clearInterval(interval);

        refetch();

        return;
      }

      const minutes = Math.floor(
        distance / 1000 / 60
      );

      const seconds = Math.floor(
        (distance / 1000) % 60
      );

      setTimeLeft(
        `${minutes}m ${seconds}s`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [data, refetch]);

  async function handleConfirm() {
    try {
      const response = await axios.post(
        `/api/reservations/${reservationId}/confirm`
      );

      toast.success(response.data.message);

      await queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      await queryClient.invalidateQueries({
        queryKey: [
          "reservation",
          reservationId,
        ],
      });

      router.push("/");
    } catch (error: any) {
      toast.error(
        error.response?.data?.error ||
          "Confirmation failed"
      );
    }
  }

  async function handleCancel() {
    try {
      const response = await axios.post(
        `/api/reservations/${reservationId}/release`
      );

      toast.success(response.data.message);

      await queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      router.push("/");
    } catch (error: any) {
      toast.error(
        error.response?.data?.error ||
          "Cancellation failed"
      );
    }
  }

  if (!data) {
    return (
      <div className="p-10">
        Loading reservation...
      </div>
    );
  }

  return (
    <main className="p-10">
      <Button
        variant="outline"
        className="mb-6"
        onClick={() => router.push("/")}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Products
      </Button>

      <div className="flex justify-center">
        <Card className="w-full max-w-xl">
          <CardHeader>
            <CardTitle className="text-2xl">
              Reservation Checkout
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div>
              <p className="text-sm text-gray-500">
                Product
              </p>

              <p className="font-semibold text-lg">
                {
                  data.inventory.product.name
                }
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Warehouse
              </p>

              <p className="font-semibold">
                {
                  data.inventory.warehouse.name
                }
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Quantity
              </p>

              <p className="font-semibold">
                {data.quantity}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Status
              </p>

              <p className="font-bold text-blue-600">
                {data.status}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Time Remaining
              </p>

              <p className="text-2xl font-bold text-red-500">
                {timeLeft}
              </p>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={handleConfirm}
                disabled={
                  data.status !== "PENDING"
                }
              >
                Confirm Purchase
              </Button>

              <Button
                variant="destructive"
                onClick={handleCancel}
                disabled={
                  data.status !== "PENDING"
                }
              >
                Cancel Purchase
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}