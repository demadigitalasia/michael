import type { Prisma } from "@prisma/client";

export const conceptListingWhere = { isConcept: true } satisfies Prisma.ProductWhereInput;
export const physicalListingWhere = { isConcept: false } satisfies Prisma.ProductWhereInput;

export function isConceptListing(product: { isConcept: boolean }) {
  return product.isConcept;
}

export function listingPhotos<T extends { url: string; isPrimary: boolean }>(images: T[]): T[] {
  const primary = images.find((image) => image.isPrimary) ?? images[0];
  if (!primary) return [];
  const photos = new Map([[primary.url, primary]]);
  for (const image of images) {
    if (!photos.has(image.url)) photos.set(image.url, image);
  }
  return [...photos.values()];
}

export function lookbookPhoto(product: {
  stoneType: string;
  origin: string;
  isConcept: boolean;
  images: { url: string; isPrimary: boolean }[];
}) {
  const photo = product.images.find(({ isPrimary }) => isPrimary) ?? product.images[0];
  if (!photo) return [];

  const stone = product.stoneType.replace(/\s*\([^)]*\)/g, "").trim();
  const origin = isConceptListing(product) || /unverified|unknown|unconfirmed/i.test(product.origin)
    ? "Origin unverified"
    : product.origin.split(",").at(-1)?.trim();

  return [{ src: photo.url, caption: [stone, origin].filter(Boolean).join(" · ") }];
}
