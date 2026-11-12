// Audit helper: buat 1 order PAID + 1 custom inquiry untuk menguji halaman admin.
// Jalankan: pnpm tsx scripts/audit-fixtures.ts
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not set");
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

async function main() {
  const stone = await prisma.product.findUnique({ where: { slug: "audit-test-stone" } });
  if (!stone) throw new Error("audit-test-stone not found");

  const existingOrder = await prisma.order.findFirst({ where: { orderNumber: "ML-AUDIT01" } });
  const order =
    existingOrder ??
    (await prisma.order.create({
      data: {
        orderNumber: "ML-AUDIT01",
        email: "buyer@example.com",
        status: "PAID",
        subtotalCents: stone.priceCents,
        shippingCents: 2400,
        totalCents: stone.priceCents + 2400,
        shippingAddress: { name: "Audit Buyer", line1: "1 Test Lane", city: "Testville", zip: "12345", country: "Narnia" },
        items: {
          create: {
            productId: stone.id,
            productTitleSnapshot: stone.title,
            productSlugSnapshot: stone.slug,
            priceCents: stone.priceCents,
          },
        },
      },
    }));
  console.log(`order: ${order.orderNumber} (${order.status})`);

  const inquiry =
    (await prisma.customOrder.findFirst({ where: { email: "commission@example.com" } })) ??
    (await prisma.customOrder.create({
      data: {
        name: "Audit Commissioner",
        email: "commission@example.com",
        serviceType: "INTARSIA",
        description: "Automated audit inquiry: an intarsia box with three local stones, roughly the size of a playing card.",
        budgetUsd: 350,
        timeline: "before March",
        status: "NEW",
      },
    }));
  console.log(`inquiry: ${inquiry.id} (${inquiry.status})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
