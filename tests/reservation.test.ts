import "dotenv/config";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";
import { releaseProduct, reserveProduct } from "@/lib/cart";

// Integration test — butuh Postgres. Skip otomatis bila DB tidak jalan
// (dev tanpa Docker tetap bisa menjalankan unit test).
const dbUp = await prisma
  .$queryRaw`SELECT 1`
  .then(() => true)
  .catch(() => false);

const runId = Date.now();
let productId: string;
let cartA: string;
let cartB: string;

beforeAll(async () => {
  if (!dbUp) return;
  const product = await prisma.product.create({
    data: {
      slug: `test-reserve-${runId}`,
      title: "Reserve test stone",
      description: "temporary",
      category: "CABOCHON",
      stoneType: "test",
      priceCents: 100,
      status: "AVAILABLE",
      weightGram: 10,
      publishedAt: new Date(),
    },
  });
  productId = product.id;
  const a = await prisma.cart.create({ data: { token: `test-a-${runId}`, expiresAt: new Date(Date.now() + 86_400_000) } });
  const b = await prisma.cart.create({ data: { token: `test-b-${runId}`, expiresAt: new Date(Date.now() + 86_400_000) } });
  cartA = a.id;
  cartB = b.id;
});

afterAll(async () => {
  if (!dbUp) return;
  await prisma.product.deleteMany({ where: { slug: `test-reserve-${runId}` } });
  await prisma.cart.deleteMany({ where: { id: { in: [cartA, cartB] } } });
  await prisma.$disconnect();
});

describe.skipIf(!dbUp)("reserveProduct (integration)", () => {
  it("AVAILABLE → RESERVED milik cart A", async () => {
    await expect(reserveProduct(productId, cartA)).resolves.toBe(true);
    const p = await prisma.product.findUniqueOrThrow({ where: { id: productId } });
    expect(p.status).toBe("RESERVED");
    expect(p.reservedByCartId).toBe(cartA);
  });

  it("cart B ditolak selama hold A valid", async () => {
    await expect(reserveProduct(productId, cartB)).resolves.toBe(false);
  });

  it("cart A menambah lagi → perpanjang (bukan gagal)", async () => {
    await expect(reserveProduct(productId, cartA)).resolves.toBe(true);
    const p = await prisma.product.findUniqueOrThrow({ where: { id: productId } });
    expect(p.reservedUntil!.getTime()).toBeGreaterThan(Date.now());
  });

  it("hold kedaluwarsa → cart B bisa claim, atribusi pindah", async () => {
    await prisma.product.update({ where: { id: productId }, data: { reservedUntil: new Date(Date.now() - 1000) } });
    await expect(reserveProduct(productId, cartB)).resolves.toBe(true);
    const p = await prisma.product.findUniqueOrThrow({ where: { id: productId } });
    expect(p.reservedByCartId).toBe(cartB);
  });

  it("releaseProduct → AVAILABLE tanpa atribusi", async () => {
    await releaseProduct(productId);
    const p = await prisma.product.findUniqueOrThrow({ where: { id: productId } });
    expect(p.status).toBe("AVAILABLE");
    expect(p.reservedByCartId).toBeNull();
    expect(p.reservedUntil).toBeNull();
  });

  it("produk tanpa berat tidak bisa direserve (butuh berat utk checkout)", async () => {
    const wless = await prisma.product.create({
      data: {
        slug: `test-reserve-wless-${runId}`,
        title: "Weightless",
        description: "temporary",
        category: "CABOCHON",
        stoneType: "test",
        priceCents: 100,
        status: "AVAILABLE",
        publishedAt: new Date(),
      },
    });
    await expect(reserveProduct(wless.id, cartA)).resolves.toBe(false);
    await prisma.product.delete({ where: { id: wless.id } });
  });
});
