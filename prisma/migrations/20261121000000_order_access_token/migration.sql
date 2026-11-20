-- Token akses halaman sukses: order lama di-backfill dulu (sebelum NOT NULL + UNIQUE)
ALTER TABLE "Order" ADD COLUMN "accessToken" TEXT;
UPDATE "Order" SET "accessToken" = substr(replace(gen_random_uuid()::text, '-', ''), 1, 32);
ALTER TABLE "Order" ALTER COLUMN "accessToken" SET NOT NULL;
CREATE UNIQUE INDEX "Order_accessToken_key" ON "Order"("accessToken");
