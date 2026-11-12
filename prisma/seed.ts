import { randomUUID, scryptSync, randomBytes } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not set");
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

// ---------- Placeholder SVG generator (dev only — ganti dengan foto asli via admin) ----------
const PALETTES: Record<string, string[]> = {
  agate: ["#b7a48c", "#8d7a63", "#e9e5de"],
  turquoise: ["#5f9ea0", "#31708e", "#dfe7e4"],
  labradorite: ["#4a5a6a", "#22303c", "#9fb4c7"],
  jasper: ["#b05f3c", "#7d3f2a", "#e8d5c4"],
  opal: ["#a8c3c9", "#6e8f9c", "#eef3f2"],
  onyx: ["#2b2b2e", "#141416", "#c9c4bb"],
};

function makeSvg(title: string, kind: string, w = 900, h = 640): string {
  const [a, b, c] = PALETTES[kind] ?? PALETTES.agate;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <radialGradient id="g" cx="38%" cy="34%" r="80%">
      <stop offset="0%" stop-color="${c}"/>
      <stop offset="45%" stop-color="${a}"/>
      <stop offset="100%" stop-color="${b}"/>
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#d8d2c8"/>
  <ellipse cx="${w / 2}" cy="${h / 2 + 20}" rx="${w * 0.33}" ry="${h * 0.3}" fill="url(#g)"/>
  <ellipse cx="${w / 2}" cy="${h / 2 + 20}" rx="${w * 0.33}" ry="${h * 0.3}" fill="none" stroke="rgba(18,18,20,.25)"/>
  <text x="24" y="h-24" y="${h - 26}" font-family="monospace" font-size="22" fill="rgba(18,18,20,.55)" letter-spacing="2">PLACEHOLDER — ${title.toUpperCase()}</text>
</svg>`;
}

async function seedImage(title: string, kind: string, slug: string): Promise<{ url: string; alt: string }> {
  const dir = join(process.cwd(), "public", "seed");
  mkdirSync(dir, { recursive: true });
  const file = `${slug}.svg`;
  writeFileSync(join(dir, file), makeSvg(title, kind), "utf8");
  return { url: `/seed/${file}`, alt: title };
}

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
    slug: string; title: string; category: "CABOCHON" | "SLAB" | "ROUGH" | "FINISHED_PIECE";
    stoneType: string; color: string; form?: string; treatment?: "NATURAL" | "DYED" | "STABILIZED" | "HEAT_TREATED" | "OTHER";
    origin: string; l?: number; w?: number; d?: number; ct?: number; g?: number; price: number;
    desc: string; featured?: boolean; palette?: string;
  };
  const products: P[] = [
    {
      slug: "laguna-lace-agate-cabochon-01", title: "Laguna Lace Agate Cabochon", category: "CABOCHON",
      stoneType: "Laguna agate", color: "Red / cream bands", form: "Freeform", origin: "Chihuahua, Mexico",
      l: 38, w: 26, d: 7, ct: 42.6, price: 28000, featured: true, palette: "agate",
      desc: "Tight lace banding in cream and brick red, polished to a mirror on both faces. Cut from slab #014 of a 2024 lot; back is flat and slightly domed for easy bezel work.",
    },
    {
      slug: "kingman-turquoise-cabochon-01", title: "Kingman Turquoise Cabochon", category: "CABOCHON",
      stoneType: "Turquoise", color: "Sky blue / matrix", form: "Oval", treatment: "STABILIZED", origin: "Kingman, Arizona, USA",
      l: 24, w: 18, d: 6, ct: 18.2, price: 14500,
      desc: "Even sky blue with a fine spiderweb of golden matrix. Stabilized for durability — disclosed plainly, as with everything we sell.",
    },
    {
      slug: "labradorite-cabochon-01", title: "Labradorite Cabochon — Full Flash", category: "CABOCHON",
      stoneType: "Labradorite", color: "Blue-green flash", form: "Round", origin: "Tabor, Madagascar",
      l: 30, w: 30, d: 8, ct: 51.4, price: 19000,
      desc: "Oriented for a full-face electric blue flash that fills the stone at 15°. Dark field, clean polish, no pits.",
    },
    {
      slug: "ocean-jasper-cabochon-01", title: "Ocean Jasper Cabochon", category: "CABOCHON",
      stoneType: "Ocean jasper", color: "Green orbs", form: "Trillion", origin: "Marovato, Madagascar",
      l: 27, w: 24, d: 6, ct: 22.8, price: 16500,
      desc: "Druzy orbs floating in green gel — the classic 2000s-vein material. One tiny druzy cave on the edge, photographed.",
    },
    {
      slug: "picture-jasper-slab-01", title: "Picture Jasper Slab", category: "SLAB",
      stoneType: "Picture jasper", color: "Tan / brown landscape", origin: "Owyhee, Oregon, USA",
      l: 120, w: 80, d: 7, g: 210, price: 12000,
      desc: "A landscape in stone: layered hills and sky, ready for cabbing or display. Both faces polished flat for preview.",
    },
    {
      slug: "laguna-agate-slab-01", title: "Laguna Agate Slab", category: "SLAB",
      stoneType: "Laguna agate", color: "Red / white banding", origin: "Chihuahua, Mexico",
      l: 95, w: 60, d: 6, g: 118, price: 9500,
      desc: "Tight tube and band structure across the full face. Enough for two mid-size cabs or one large freeform.",
    },
    {
      slug: "botswana-agate-slab-01", title: "Botswana Agate Slab", category: "SLAB",
      stoneType: "Botswana agate", color: "Grey / pink bands", origin: "Botswana",
      l: 85, w: 55, d: 6, g: 92, price: 7500,
      desc: "Fine, even banding in smoke and blush. No cracks, no filler — checked under the loupe.",
    },
    {
      slug: "moroccan-seam-agate-rough-01", title: "Moroccan Seam Agate Rough — 1.2 kg lot", category: "ROUGH",
      stoneType: "Seam agate", color: "Grey / white", origin: "Kerrouchen, Morocco",
      g: 1200, price: 6500,
      desc: "One kilo-plus lot of fresh seam agate, pressure-washed and graded. Good banding on at least a third of the pieces, from experience with this lot.",
    },
    {
      slug: "coconut-geode-rough-01", title: "Coconut Geode Rough — pair lot", category: "ROUGH",
      stoneType: "Coconut geode", color: "Grey exterior", origin: "Chihuahua, Mexico",
      g: 2400, price: 8500,
      desc: "Two uncracked geodes from the same pocket. Sold as a pair — crack one open to find out together.",
    },
    {
      slug: "laguna-agate-pendant-01", title: "Laguna Agate Pendant — Sterling", category: "FINISHED_PIECE",
      stoneType: "Laguna agate", color: "Red / cream", origin: "Cut & set at our bench",
      l: 45, w: 22, d: 9, ct: 30.1, price: 22000,
      desc: "One of our cabochons, bezel-set in sterling silver with a hand-formed bail. Chain not included; 18\" chains sold separately.",
    },
    {
      slug: "worry-carving-onyx-01", title: "Black Onyx Worry Stone — Carved", category: "FINISHED_PIECE",
      stoneType: "Black onyx", color: "Jet", form: "Palm", origin: "Carved at our bench",
      l: 52, w: 34, d: 12, g: 88, price: 9500,
      desc: "Hand-carved palm stone with a thumb groove worn smooth. A quiet piece for a desk or pocket.",
    },
    {
      slug: "matched-pair-ocean-jasper-01", title: "Matched Pair — Ocean Jasper Cabs", category: "FINISHED_PIECE",
      stoneType: "Ocean jasper", color: "Pink / green orbs", form: "Oval pair", origin: "Cut from one slab",
      l: 16, w: 12, d: 4, ct: 11.9, price: 14000,
      desc: "Two cabs cut from adjacent positions on the same slab — orbs line up across the pair. Made for earrings.",
    },
  ];

  for (const p of products) {
    const img = await seedImage(p.title, p.palette ?? "agate", p.slug);
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        slug: p.slug,
        title: p.title,
        description: p.desc,
        category: p.category,
        stoneType: p.stoneType,
        color: p.color,
        form: p.form ?? "",
        treatment: p.treatment ?? "NATURAL",
        origin: p.origin,
        lengthMm: p.l, widthMm: p.w, depthMm: p.d,
        weightCarat: p.ct, weightGram: p.g,
        priceCents: p.price,
        status: "AVAILABLE",
        featured: p.featured ?? false,
        publishedAt: new Date(),
        images: {
          create: [
            { url: img.url, alt: `${p.title} — front`, sortOrder: 0, isPrimary: true },
            { url: img.url, alt: `${p.title} — detail`, sortOrder: 1 },
          ],
        },
      },
    });
  }
  console.log(`✔ ${products.length} products`);

  // ---------- Reviews ----------
  const reviews = [
    { author: "Hana O.", location: "Leeds", quote: "It arrived with a photo of the stone on the wheel, half polished. I have never felt so involved in something I bought.", productName: "Laguna Lace Agate Cabochon" },
    { author: "Tom & Priya", location: "Bristol", quote: "The measurements were exact to the tenth of a millimetre. Both cabs sit flush in the bezels we made.", productName: "Matched Pair — Ocean Jasper" },
    { author: "Ines M.", location: "Lisbon", quote: "Third order this year. The treatment notes are more honest than anyone else I buy from.", productName: "Kingman Turquoise Cabochon" },
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
