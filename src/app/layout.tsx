import type { Metadata } from "next";

import "./globals.css";

import { QueryProvider } from "@/providers/query-provider";

import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Allo Inventory System",

  description:
    "Multi-warehouse inventory reservation system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <QueryProvider>
          <Toaster position="top-right" />

          {children}
        </QueryProvider>
      </body>
    </html>
  );
}