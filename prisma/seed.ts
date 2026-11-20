import { scryptSync, randomBytes } from "node:crypto";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not set");
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

async function main() {
  // ---------- Admin ----------
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@michaellapidary.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "changeme123";
  const salt = randomBytes(16).toString("hex");
  const passwordHash = `${salt}:${scryptSync(adminPassword, salt, 64).toString("hex")}`;
  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: { email: adminEmail, passwordHash, name: "Michael" },
  });
  console.log(`✔ admin: ${adminEmail} (password: ${adminPassword} — ganti di production!)`);

  // ---------- Shipping rates ----------
  const shipping = [
    { zone: "Domestic", name: "Domestic tracked", minWeightG: 0, maxWeightG: 500, priceCents: 900 },
    { zone: "Domestic", name: "Domestic insured", minWeightG: 500, maxWeightG: 5000, priceCents: 1800 },
    { zone: "International", name: "International tracked", minWeightG: 0, maxWeightG: 500, priceCents: 2400 },
    { zone: "International", name: "International insured", minWeightG: 500, maxWeightG: 5000, priceCents: 4500 },
  ];
  for (const s of shipping) {
    await prisma.shippingRate.create({ data: s });
  }
  console.log(`✔ ${shipping.length} shipping rates`);

  // ---------- Products ----------
  type P = {
    legacySlug: string; slug: string; title: string; category: "CABOCHON" | "SLAB" | "ROUGH" | "FINISHED_PIECE";
    stoneType: string; color: string; form?: string; treatment?: "NATURAL" | "DYED" | "STABILIZED" | "HEAT_TREATED" | "OTHER";
    origin: string; price: number; desc: string; featured?: boolean; image: string;
  };
  const products: P[] = [
    {
      legacySlug: "laguna-lace-agate-cabochon-01", slug: "opal-banten-dark-body-cabochon-01",
      title: "Banten Dark-Body Opal Cabochon", category: "CABOCHON",
      stoneType: "Banten opal (dark body)", color: "Charcoal brown / localized green-blue play-of-colour",
      form: "Oval cabochon", treatment: "OTHER", origin: "Lebak, Banten, Indonesia (concept locality; specimen unverified)",
      price: 28000, featured: true, image: "/products/indonesia/01-opal-banten-dark-body.jpg",
      desc: "Illustrative AI concept of a dark-body Banten opal with localized play-of-colour. This is not an exact inventory specimen; verify provenance, treatment, dimensions, weight, and price against physical stock before sale.",
    },
    {
      legacySlug: "kingman-turquoise-cabochon-01", slug: "opal-banten-pale-body-cabochon-01",
      title: "Banten Pale-Body Opal Cabochon", category: "CABOCHON",
      stoneType: "Banten opal (pale body)", color: "Cream / pale honey with localized play-of-colour",
      form: "Freeform cabochon", treatment: "OTHER", origin: "Lebak, Banten, Indonesia (concept locality; specimen unverified)",
      price: 14500, image: "/products/indonesia/02-opal-banten-pale-body.jpg",
      desc: "Illustrative AI concept of pale-body Banten opal with subtle, localized colour patches. This is not an exact inventory specimen; verify provenance, treatment, dimensions, weight, and price against physical stock before sale.",
    },
    {
      legacySlug: "labradorite-cabochon-01", slug: "garut-blue-green-opal-wood-rough-01",
      title: "Garut Blue-Green Opal in Silicified Wood — Rough", category: "ROUGH",
      stoneType: "Blue-green common opal / silicified wood", color: "Blue-green opal / cream, tan, and brown matrix",
      form: "Rough cut-face specimen", treatment: "OTHER", origin: "Garut, West Java, Indonesia (concept locality; specimen unverified)",
      price: 19000, image: "/products/indonesia/03-blue-green-opal-garut-silicified-wood.jpg",
      desc: "Illustrative AI concept based on the user's blue-green boulder reference and reported Garut opal-bearing silicified wood. This is not the pictured specimen; verify provenance, treatment, dimensions, weight, and price against physical stock before sale.",
    },
    {
      legacySlug: "ocean-jasper-cabochon-01", slug: "bacan-chrysocolla-quartz-cabochon-01",
      title: "Bacan Chrysocolla Quartz Cabochon", category: "CABOCHON",
      stoneType: "Chrysocolla-bearing quartz / chalcedony", color: "Sky blue to blue-green mottled",
      form: "Oval cabochon", treatment: "OTHER", origin: "Kasiruta, South Halmahera, North Maluku, Indonesia (concept locality; specimen unverified)",
      price: 16500, image: "/products/indonesia/04-bacan-chrysocolla-quartz.jpg",
      desc: "Illustrative AI concept of blue-to-blue-green Bacan chrysocolla-bearing quartz with natural mottling. This is not an exact inventory specimen; verify provenance, treatment, dimensions, weight, and price against physical stock before sale.",
    },
    {
      legacySlug: "picture-jasper-slab-01", slug: "ciremai-bumble-bee-stone-cabochon-01",
      title: "Ciremai Bumble Bee Stone Cabochon", category: "CABOCHON",
      stoneType: "Bumble Bee Stone (carbonate-rich material)", color: "Yellow / orange / black / gray",
      form: "Freeform cabochon", treatment: "OTHER", origin: "Ciremai–Kuningan, West Java, Indonesia (concept locality; specimen unverified)",
      price: 12000, image: "/products/indonesia/05-bumble-bee-stone-ciremai.jpg",
      desc: "Illustrative AI concept of opaque yellow-orange-black Bumble Bee Stone, a carbonate-rich gem material rather than jasper. This is not an exact inventory specimen; verify provenance, treatment, dimensions, weight, and price against physical stock before sale.",
    },
    {
      legacySlug: "laguna-agate-slab-01", slug: "garut-red-jasper-cabochon-01",
      title: "Southern Java Red Jasper Cabochon", category: "CABOCHON",
      stoneType: "Red jasper", color: "Brick red to reddish brown",
      form: "Oval cabochon", treatment: "OTHER", origin: "Bungbulang, Garut, West Java, Indonesia (concept locality; specimen unverified)",
      price: 9500, image: "/products/indonesia/06-red-jasper-garut.jpg",
      desc: "Illustrative AI concept of opaque brick-red southern Java jasper with subtle earthy variation. This is not an exact inventory specimen; verify provenance, treatment, dimensions, weight, and price against physical stock before sale.",
    },
    {
      legacySlug: "botswana-agate-slab-01", slug: "garut-pancawarna-jasper-cabochon-01",
      title: "Garut Pancawarna Jasper Cabochon", category: "CABOCHON",
      stoneType: "Pancawarna jasper (trade name)", color: "Red / yellow / orange / green / brown / cream",
      form: "Freeform cabochon", treatment: "OTHER", origin: "Bungbulang, Garut, West Java, Indonesia (concept locality; specimen unverified)",
      price: 7500, image: "/products/indonesia/07-pancawarna-jasper-garut.jpg",
      desc: "Illustrative AI concept of opaque multicolour jasper with irregular natural colour fields. This is not an exact inventory specimen; verify provenance, treatment, dimensions, weight, and price against physical stock before sale.",
    },
    {
      legacySlug: "moroccan-seam-agate-rough-01", slug: "manakarra-quartz-cluster-01",
      title: "Manakarra Botryoidal Quartz Cluster", category: "ROUGH",
      stoneType: "Manakarra quartz", color: "Lavender / amethyst purple / pale gray-green",
      form: "Botryoidal quartz cluster", treatment: "OTHER", origin: "Mamuju, West Sulawesi, Indonesia (concept locality; specimen unverified)",
      price: 6500, image: "/products/indonesia/08-manakarra-quartz-mamuju.jpg",
      desc: "Illustrative AI concept of the grape-like botryoidal quartz sold as Manakarra; it is not presented as true agate. This is not an exact inventory specimen; verify provenance, treatment, dimensions, weight, and price against physical stock before sale.",
    },
    {
      legacySlug: "coconut-geode-rough-01", slug: "indonesian-silicified-coral-slab-01",
      title: "Indonesian Silicified Coral Cross-Section", category: "SLAB",
      stoneType: "Silicified coral", color: "Reddish brown / muted orange / cream / dark gray",
      form: "Polished cross-section", treatment: "OTHER", origin: "Indonesia (concept visual; specimen locality unverified)",
      price: 8500, image: "/products/indonesia/09-silicified-coral-indonesia.jpg",
      desc: "Illustrative AI concept of silicified coral with radial and branching fossil patterns. This is not an exact inventory specimen; verify locality, treatment, dimensions, weight, and price against physical stock before sale.",
    },
    {
      legacySlug: "laguna-agate-pendant-01", slug: "sumatra-drusy-petrified-wood-slab-01",
      title: "Sumatra Silicified Wood with Drusy Quartz", category: "SLAB",
      stoneType: "Silicified wood with drusy quartz", color: "Natural gray-white banding / brown wood matrix",
      form: "Polished slice with drusy pocket", treatment: "OTHER", origin: "Sumatra, Indonesia (concept locality; specimen unverified)",
      price: 22000, image: "/products/indonesia/10-sumatra-drusy-petrified-wood.jpg",
      desc: "Illustrative AI concept of silicified wood with a small pocket lined by drusy quartz. This is not an exact inventory specimen; verify locality, treatment, dimensions, weight, and price against physical stock before sale.",
    },
    {
      legacySlug: "worry-carving-onyx-01", slug: "gorontalo-silicified-wood-slice-01",
      title: "Gorontalo Silicified Fossil Wood Slice", category: "FINISHED_PIECE",
      stoneType: "Silicified fossil wood", color: "Cream / warm gray / muted brown",
      form: "Polished slice", treatment: "OTHER", origin: "Tohupo–Molannihu, Gorontalo, Indonesia (concept locality; specimen unverified)",
      price: 9500, image: "/products/indonesia/11-gorontalo-silicified-wood.jpg",
      desc: "Illustrative AI concept of polished silicified wood with preserved wood fibres. The visual does not add blue opal or play-of-colour. This is not an exact inventory specimen; verify provenance, treatment, dimensions, weight, and price against physical stock before sale.",
    },
    {
      legacySlug: "matched-pair-ocean-jasper-01", slug: "lebak-banten-silicified-wood-slice-01",
      title: "Lebak Banten Silicified Fossil Wood Slice", category: "FINISHED_PIECE",
      stoneType: "Quartz-bearing silicified wood", color: "Tan / pale gray / cream / brown",
      form: "Polished freeform slice", treatment: "OTHER", origin: "Sajira, Lebak, Banten, Indonesia (concept locality; specimen unverified)",
      price: 14000, image: "/products/indonesia/12-lebak-banten-silicified-wood.jpg",
      desc: "Illustrative AI concept of quartz-bearing silicified fossil wood with visible growth structure. It is not labelled as opal and has no play-of-colour. This is not an exact inventory specimen; verify provenance, treatment, dimensions, weight, and price against physical stock before sale.",
    },
  ];

  for (const p of products) {
    const data = {
        title: p.title,
        description: p.desc,
        category: p.category,
        stoneType: p.stoneType,
        color: p.color,
        form: p.form ?? "",
        treatment: p.treatment ?? "OTHER" as const,
        origin: p.origin,
        lengthMm: null, widthMm: null, depthMm: null,
        weightCarat: null, weightGram: null,
        priceCents: p.price,
        isConcept: true,
        featured: false,
        slug: p.slug,
    };
    const images = {
      deleteMany: {},
      create: [
        { url: p.image, alt: `AI concept image of ${p.stoneType}; not the exact specimen`, sortOrder: 0, isPrimary: true },
      ],
    };
    const existing = await prisma.product.findFirst({
      where: { OR: [{ slug: p.slug }, { slug: p.legacySlug }] },
      select: { id: true },
    });
    if (existing) {
      console.log(`↷ kept existing product matching ${p.slug}`);
      continue;
    }
    await prisma.product.create({
      data: { ...data, status: "AVAILABLE", publishedAt: new Date(), images: { create: images.create } },
    });
  }
  console.log(`✔ ${products.length} products`);

  // ---------- Reviews ----------
  const reviews = [
    { author: "Hana O.", location: "Leeds", quote: "It arrived with a photo of the stone on the wheel, half polished. I have never felt so involved in something I bought.", productName: "Banten Opal Cabochon" },
    { author: "Tom & Priya", location: "Bristol", quote: "The measurements were exact to the tenth of a millimetre. Both cabs sit flush in the bezels we made.", productName: "Bacan Chrysocolla Quartz Cabochons" },
    { author: "Ines M.", location: "Lisbon", quote: "Third order this year. The treatment notes are more honest than anyone else I buy from.", productName: "Garut Red Jasper Cabochon" },
  ];
  for (const r of reviews) await prisma.review.create({ data: r });
  console.log(`✔ ${reviews.length} reviews`);

  console.log("Seed selesai.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
