# Michael Lapidary

Website e-commerce batu semi-presiusi — **cabochons, slabs, rough** + jasa custom lapidary
(pendant, matched pair, carving, intarsia). One stone at a time.

**Stack:** Next.js 16 (App Router, TS) · PostgreSQL + Prisma 7 · Tailwind v4 · Stripe · Resend · framer-motion
**Desain:** Jewelwright reference — token & motion terukur ([docs/DESIGN-SPEC.md](docs/DESIGN-SPEC.md), [docs/MOTION-SPEC.md](docs/MOTION-SPEC.md))

## Mulai cepat (lokal)

```sh
pnpm install
docker compose up -d          # Postgres lokal di :5433
cp .env.example .env          # edit bila perlu
pnpm prisma migrate dev       # buat tabel
pnpm prisma db seed           # admin + 12 produk contoh + review + ongkir
pnpm dev                      # http://localhost:3000
```

**Admin:** `/admin` — `admin@michaellapidary.com` / `changeme123` (dari seed; ganti di production).

## Struktur

```
src/
  app/(site)/        # publik: home, shop, collections, products/[slug], custom,
                     # the-workshop, care, journal, contact, cart, checkout, legal
  app/admin/         # bench desk: overview, products CRUD, orders, custom inbox
  app/api/           # cart, checkout, webhooks/stripe, admin, media (foto dari volume)
  components/        # Ticker, StatsCounters, Lookbook, CustomFlow, ProcessSteps,
                     # Loupe, ProductCard, ReservationTimer, CheckoutFlow, …
  lib/               # prisma, cart (reservasi TTL), products, auth, mail, site
prisma/              # schema + seed
uploads/             # foto produk (volume VPS di production, dilayani /media/*)
docs/                # PRD, DESIGN-SPEC, MOTION-SPEC, TEMPLATE-ASSESSMENT, DEPLOY-COOLIFY
```

## Aturan bisnis inti (PRD §6.3)

- **One-of-a-kind**: `AVAILABLE → RESERVED (TTL 30 menit) → SOLD`.
  Kedaluwarsa dicek dari DB saat akses — tanpa cron.
- **Fulfillment hanya lewat Stripe webhook** (`checkout.session.completed` → order PAID →
  produk SOLD → email → kosongkan cart). Idempoten.
- Treatment selalu ditulis di listing (natural/dyed/stabilized/heat).

## Scripts

| Perintah | Fungsi |
|---|---|
| `pnpm dev` / `pnpm build` / `pnpm start` | dev / build produksi / jalankan |
| `pnpm prisma migrate dev` | migrasi lokal |
| `pnpm prisma db seed` | seed admin + data contoh |
| `pnpm lint` | ESLint |

## Deploy

Lihat [docs/DEPLOY-COOLIFY.md](docs/DEPLOY-COOLIFY.md) — Dockerfile siap pakai,
volume `/app/uploads`, migrasi otomatis saat start.
