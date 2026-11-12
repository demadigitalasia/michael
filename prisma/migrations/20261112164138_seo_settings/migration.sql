-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "metaDescription" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "metaTitle" TEXT NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "metaTitle" TEXT NOT NULL DEFAULT '',
    "metaDescription" TEXT NOT NULL DEFAULT '',
    "ogImageUrl" TEXT NOT NULL DEFAULT '',
    "googleSiteVerification" TEXT NOT NULL DEFAULT '',
    "instagramUrl" TEXT NOT NULL DEFAULT '',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);
