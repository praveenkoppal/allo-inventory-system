const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Checking reservations with invalid statuses...');

  const invalid = await prisma.$queryRaw`
    SELECT id, status FROM "Reservation" WHERE status IN ('CANCELLED', 'TIME_EXPIRED')
  `;

  console.log('Found', invalid.length, 'invalid reservations');

  if (invalid.length > 0) {
    const result = await prisma.reservation.updateMany({
      where: { status: { in: ['CANCELLED', 'TIME_EXPIRED'] } },
      data: { status: 'RELEASED' },
    });

    console.log('Updated rows:', result.count);
  } else {
    console.log('No invalid statuses to update.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
