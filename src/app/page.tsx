"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { Product } from "@/types/product";

import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

export default function HomePage() {
  const router = useRouter();

  const { data, isLoading, error } = useQuery<
    Product[]
  >({
    queryKey: ["products"],

     refetchInterval: 3000,

    queryFn: async () => {
      const response = await axios.get(
        "/api/products"
      );

      return response.data;
    },
  });

  async function handleReserve(
    productId: string,
    warehouseId: string
  ) {
    try {
      const response = await axios.post(
        "/api/reservations",
        {
          productId,
          warehouseId,
          quantity: 1,
        }
      );

      router.push(
        `/reservations/${response.data.id}`
      );
    } catch (error: any) {
      alert(
        error.response?.data?.error ||
          "Reservation failed"
      );
    }
  }

  if (isLoading) {
    return (
      <div className="p-10">
        Loading products...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-red-500">
        Failed to load products
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Inventory Reservation System
            </h1>

            <p className="text-gray-500 mb-0">
              Multi-warehouse stock reservation
              platform
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() =>
              router.push("/reservations")
            }
          >
            View My Reservations
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data?.map((product) => (
            <Card
              key={product.id}
              className="shadow-sm"
            >
              <CardHeader>
                <CardTitle className="text-2xl">
                  {product.name}
                </CardTitle>

                <p className="text-sm text-gray-500">
                  {product.description}
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                {product.warehouses.map(
                  (warehouse) => (
                    <div
                      key={warehouse.warehouseId}
                      className="border rounded-xl p-4 bg-white"
                    >
                      <div className="mb-3">
                        <p className="font-semibold text-lg">
                          {
                            warehouse.warehouseName
                          }
                        </p>

                        <p className="text-sm text-gray-500">
                          {warehouse.location}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <p>
                          Total Stock:{" "}
                          <span className="font-semibold">
                            {
                              warehouse.totalStock
                            }
                          </span>
                        </p>

                        <p>
                          Reserved Stock:{" "}
                          <span className="font-semibold">
                            {
                              warehouse.reservedStock
                            }
                          </span>
                        </p>

                        <p>
                          Available Stock:{" "}
                          <span className="font-bold text-green-600">
                            {
                              warehouse.availableStock
                            }
                          </span>
                        </p>
                      </div>

                      <Button
                        className="mt-4 w-full"
                        disabled={
                          warehouse.availableStock <=
                          0
                        }
                        onClick={() =>
                          handleReserve(
                            product.id,
                            warehouse.warehouseId
                          )
                        }
                      >
                        {warehouse.availableStock >
                        0
                          ? "Reserve Product"
                          : "Out of Stock"}
                      </Button>
                    </div>
                  )
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}