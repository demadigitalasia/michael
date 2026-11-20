ALTER TABLE "Product" ADD COLUMN "isConcept" BOOLEAN NOT NULL DEFAULT false;

UPDATE "Product"
SET "isConcept" = true,
    "featured" = false
WHERE "description" ILIKE 'Illustrative AI concept%'
   OR "id" IN (
     SELECT "productId"
     FROM "ProductImage"
     WHERE "url" LIKE '/products/indonesia/%'
   );
