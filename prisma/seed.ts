import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clear old data
  await prisma.reservation.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.product.deleteMany();
  await prisma.warehouse.deleteMany();

  // Create products
  const iphone = await prisma.product.create({
    data: {
      name: "iPhone 15",
      description: "Apple flagship smartphone",
    },
  });

  const macbook = await prisma.product.create({
    data: {
      name: "MacBook Pro",
      description: "Apple laptop",
    },
  });

  // Create warehouses
  const bangaloreWarehouse = await prisma.warehouse.create({
    data: {
      name: "Bangalore Warehouse",
      location: "Bangalore",
    },
  });

  const mumbaiWarehouse = await prisma.warehouse.create({
    data: {
      name: "Mumbai Warehouse",
      location: "Mumbai",
    },
  });

  // Create inventory
  await prisma.inventory.createMany({
    data: [
      {
        productId: iphone.id,
        warehouseId: bangaloreWarehouse.id,
        totalStock: 10,
        reservedStock: 0,
      },
      {
        productId: iphone.id,
        warehouseId: mumbaiWarehouse.id,
        totalStock: 5,
        reservedStock: 0,
      },
      {
        productId: macbook.id,
        warehouseId: bangaloreWarehouse.id,
        totalStock: 3,
        reservedStock: 0,
      },
    ],
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
