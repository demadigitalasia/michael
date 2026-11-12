# PRD — Website Michael Lapidary

| | |
|---|---|
| **Produk** | Michael Lapidary — E-commerce batu semi-presiusi & jasa lapidary |
| **Versi Dokumen** | v1.0 (Draft) |
| **Tanggal** | 12 November 2026 |
| **Status** | Menunggu persetujuan |
| **Tech Stack** | Next.js (TypeScript) + PostgreSQL |

---

## 1. Ringkasan Eksekutif

Michael Lapidary adalah bisnis lapidary profesional yang menjual **batu semi-presiusi** (bukan berlian) dalam tiga bentuk: **cabochon, slab, dan rough**. Selain menjual batu, Michael juga menerima **jasa custom**: pembuatan pendant, pair (pasangan batu), carving, intarsia, dan karya sejenis lainnya.

Website ini adalah toko online (full e-commerce) berbahasa Inggris dengan harga dalam USD, menargetkan pembeli internasional — kolektor, perajin perhiasan (jewelry makers), dan penggemar lapidary. Karena hampir semua produk bersifat **one-of-a-kind**, model inventory dan pengelolaan stok dirancang khusus untuk item unik.

---

## 2. Latar Belakang & Masalah

**Situasi saat ini:** Penjualan kemungkinan berjalan lewat kanal manual (marketplace, media sosial, atau word-of-mouth) tanpa etalase digital yang profesional dan terpusat.

**Masalah yang diselesaikan:**

1. Tidak ada katalog online yang menampilkan setiap batu secara individual (foto, ukuran, berat, asal batu).
2. Proses pembelian manual (chat/DM) tidak skalabel dan rawan salah jual untuk item unik.
3. Jasa custom (pendant, pair, carving, intarsia) tidak punya etalase dan alur pemesanan yang jelas.
4. Kredibilitas & ketrustan pembeli internasional butuh dibangun lewat website profesional (profil lapidary, kebijakan pengiriman, garansi keaslian).

---

## 3. Tujuan & Sasaran

### 3.1 Tujuan Bisnis
- Menjadi kanal penjualan utama untuk cabochon, slab, dan rough ke pembeli internasional.
- Menumbuhkan permintaan jasa custom melalui halaman layanan + form pemesanan.
- Membangun brand "Michael Lapidary" sebagai lapidary profesional di pasar global.

### 3.2 Tujuan Produk
- Pembeli dapat menemukan, menelusuri, dan membeli batu dengan mudah (≤ 5 langkah dari landing ke pembayaran).
- Admin (Michael) dapat mengelola katalog, pesanan, dan inquiry custom sendiri tanpa bantuan developer.
- Setiap item unik tidak bisa terjual dua kali (mekanisme reserve/lock saat checkout).

### 3.3 Non-Goals (di luar sasaran fase ini)
- Menjual berlian atau batu presiusi (ruby, sapphire, emerald, dsb.) — **di luar ruang lingkup bisnis**.
- Multi-bahasa / multi-mata uang (ID/EN) — hanya EN/USD di fase 1.
- Marketplace multi-vendor.
- Bidding/auction untuk batu langka.
- Aplikasi mobile native.

---

## 4. Target Pengguna & Persona

| Persona | Deskripsi | Kebutuhan utama |
|---|---|---|
| **Jewelry Maker** (utama) | Perajin / wire-wrapper / silversmith yang butuh cabochon untuk di-setting. | Detail dimensi (L×W×D mm), ketebalan, bentuk, kemiringan back (flat/domed), harga wajar, foto tajam. |
| **Collector** | Kolektor batu/menara mineral. | Asal batu (locality), keunikan, treatment (natural vs treated), grade, foto makro. |
| **Lapidary Hobbyist** | Penggemar yang memotong sendiri. | Slab & rough: berat (gram/kg), ketebalan slab, kondisi material (crack-free), harga per berat. |
| **Custom Client** | Pembeli yang ingin karya dibuatkan (pendant, pair, carving, intarsia). | Portofolio karya, penjelasan proses, estimasi harga & waktu, cara mengajukan permintaan. |

---

## 5. Lingkup Produk

### 5.1 In-Scope (Fase 1 — MVP)
1. Storefront publik (katalog, detail produk, pencarian & filter).
2. Cart + Checkout dengan pembayaran kartu (Stripe).
3. Halaman layanan custom + form Custom Order Inquiry (tersimpan ke database).
4. Halaman konten & trust: About Michael, proses lapidary, galeri karya, FAQ, Shipping & Returns, Contact.
5. Admin dashboard: kelola produk (CRUD + upload foto), kelola pesanan, kelola inquiry custom, ubah status kiriman.
6. Email transaksional: konfirmasi pesanan, konfirmasi pembayaran, notifikasi pengiriman + nomor tracking, notifikasi admin untuk pesanan & inquiry baru.
7. SEO teknis + structured data (Product schema).

### 5.2 Out-of-Scope Fase 1 (Roadmap Fase 2+)
- PayPal & metode pembayaran tambahan.
- Ulasan/testimoni pembeli.
- Wishlist & "Notify me when back in stock" (untuk item sold).
- Newsletter & email marketing.
- Blog / artikel edukasi lapidary.
- Akun pembeli (guest checkout saja di fase 1).

---

## 6. Katalog Produk & Model Inventory

### 6.1 Kategori Produk
| Kategori | Unit jual | Cara harga |
|---|---|---|
| **Cabochons** | Per item (unik) | Harga tetap per cabochon |
| **Slabs** | Per item (unik) | Harga tetap per slab |
| **Rough** | Per lot/batch | Harga tetap per lot, atau per gram/kg (dengan min. order) |

Catatan: produk hasil jasa (pendant jadi, carving, intarsia yang siap dijual) dapat masuk kategori tambahan **"Finished Pieces"** bila diinginkan — disiapkan sebagai kategori di schema, tidak wajib diisi saat MVP.

### 6.2 Atribut Produk (domain lapidary)
Setiap listing wajib memiliki:
- **Identitas**: judul, slug, deskripsi, foto (min. 3, max. 12) dengan zoom.
- **Klasifikasi**: kategori (cabochon/slab/rough/finished), jenis batu/mineral (agate, jasper, opal, turquoise, labradorite, ...), warna dominan.
- **Spesifikasi fisik**:
  - Dimensi (panjang × lebar × tebal, dalam mm).
  - Berat: carat (cabochon) atau gram (slab/rough).
  - Bentuk & cut: oval, round, freeform, trillion, dsb.
  - Kondisi permukaan: polished / unfinished.
- **Asal & perlakuan**: locality/origin (mis. "Sonora, Mexico"), treatment (natural, dyed, stabilized, heat-treated) — **penting untuk kepercayaan**.
- **Harga**: USD (disimpan dalam cent, integer).
- **Status inventory**: `available` | `reserved` | `sold` | `hidden` | `draft`.

### 6.3 Mekanisme One-of-a-Kind
- Mayoritas item `quantity = 1`. Rough bisa `quantity > 1` per lot.
- Saat item masuk checkout, status berubah `available → reserved` dengan **reservation TTL 30 menit** (job/timeout melepaskan reservasi jika pembayaran tidak selesai).
- Setelah pembayaran terkonfirmasi (Stripe webhook), status `reserved → sold` dan item otomatis tidak tampil di katalog.
- Item `sold` tetap tampil di halaman produk (SEO & portofolio) dengan label "Sold", dan opsi fase 2 "notify me".

---

## 7. Fitur Fungsional

Prioritas: **P0 = wajib MVP**, **P1 = penting segera setelah MVP**, **P2 = nanti**.

### 7.1 Storefront Publik
| # | Fitur | Pri |
|---|---|---|
| F-01 | Homepage: hero + kurasi "New Arrivals" + featured categories + CTA custom services | P0 |
| F-02 | Halaman kategori (Cabochons / Slabs / Rough) dengan grid produk & paginasi | P0 |
| F-03 | Filter: jenis batu, harga (range), bentuk/cut, treatment, weight range; Sort: terbaru, harga asc/desc | P0 |
| F-04 | Pencarian full-text (nama, deskripsi, jenis batu) | P1 |
| F-05 | Halaman detail produk: galeri foto (zoom), spesifikasi lengkap (dimensi, carat, origin, treatment), badge "One of a Kind", status sold/reserved, tombol Add to Cart | P0 |
| F-06 | Badge & halaman "Sold Items" untuk referensi/portofolio | P2 |
| F-07 | Breadcrumb + related products (jenis batu sama) | P1 |

### 7.2 Cart & Checkout
| # | Fitur | Pri |
|---|---|---|
| F-08 | Cart: tambah/hapus item, ringkasan subtotal, indikator reservasi (timer 30 menit) | P0 |
| F-09 | Guest checkout (tanpa akun): alamat pengiriman, email, catatan | P0 |
| F-10 | Integrasi Stripe Checkout / Payment Element (kartu, Apple Pay, Google Pay) | P0 |
| F-11 | Perhitungan ongkir: flat rate berbasis zona + weight tier (fase 1), kurir prioritas internasional (mis. USPS Priority International / DHL) | P0 |
| F-12 | Webhook Stripe: konfirmasi pembayaran → order paid → item sold → kirim email | P0 |
| F-13 | Halaman order confirmation + email berisi ringkasan & nomor order | P0 |
| F-14 | Halaman order tracking untuk pembeli (via link unik, tanpa login) | P1 |
| F-15 | Insuransi paket opsional di checkout (upsell) | P2 |

### 7.3 Custom Order Services
| # | Fitur | Pri |
|---|---|---|
| F-16 | Halaman Services: menjelaskan kemampuan — Pendant, Pairs (matched pairs), Carving, Intarsia & sejenisnya — dengan foto karya per layanan | P0 |
| F-17 | Form Custom Order: nama, email, jenis jasa, deskripsi proyek, preferensi batu/budget/timeline, upload foto referensi (opsional) | P0 |
| F-18 | Inquiry tersimpan ke DB + email notifikasi ke admin; status inquiry dikelola admin (new → quoted → in progress → completed / declined) | P0 |
| F-19 | Galeri/Portfolio karya terdahulu (halaman terpisah atau section di Services) | P1 |
| F-20 | Penawaran harga & pembayaran deposit via link Stripe manual dari admin | P1 |

### 7.4 Halaman Konten & Trust
| # | Fitur | Pri |
|---|---|---|
| F-21 | About: profil Michael, kisah & pengalaman lapidary, foto workshop | P0 |
| F-22 | FAQ: keaslian batu, treatment disclosure, kebijakan pengiriman & retur | P0 |
| F-23 | Shipping & Returns: rincian kurir, estimasi waktu per zona, kebijakan retur (mis. 14 hari) & handling | P0 |
| F-24 | Contact: form + email + (opsional) sosial media | P0 |
| F-25 | Privacy Policy & Terms of Service | P0 |

### 7.5 Admin Dashboard
| # | Fitur | Pri |
|---|---|---|
| F-26 | Login admin (email+password, session aman) | P0 |
| F-27 | CRUD produk: form lengkap (semua atribut §6.2), upload multi-foto (drag & drop, reorder, set primary), status (draft/published), duplicate listing | P0 |
| F-28 | Daftar & detail pesanan: ubah status (paid → shipped → delivered → refunded), input tracking number (memicu email ke pembeli) | P0 |
| F-29 | Inbox custom order: daftar inquiry, ubah status, catatan internal, reply via email (mailto template atau integrasi email) | P0 |
| F-30 | Dashboard ringkas: pesanan baru, inquiry baru, item sold, revenue bulan berjalan | P1 |
| F-31 | Manajemen media library foto | P1 |
| F-32 | Export data (orders/inquiries ke CSV) | P2 |

### 7.6 Email & Notifikasi
| # | Fitur | Pri |
|---|---|---|
| F-33 | Email order confirmation & payment receipt (ke pembeli) | P0 |
| F-34 | Email shipped + tracking number | P0 |
| F-35 | Email notifikasi ke admin: pesanan baru, inquiry baru | P0 |
| F-36 | Email reply inquiry custom (manual dari admin) | P1 |

---

## 8. User Flow Utama

### 8.1 Pembelian (Guest Checkout)
```
Homepage/Katalog → Detail Produk → Add to Cart
  → Cart (item reserved 30 mnt) → Checkout (alamat + ongkir)
  → Bayar via Stripe → Webhook konfirmasi → item SOLD
  → Halaman konfirmasi + Email receipt
  → Admin packing & input tracking → Email shipped → Delivered
```

### 8.2 Custom Order
```
Services page → lihat layanan & galeri → isi Form Custom Order
  → Inquiry tersimpan + email notifikasi admin
  → Admin diskusi/quote via email → (jika deal) deposit via link Stripe
  → Pengerjaan → pelunasan → kirim → selesai
```

### 8.3 Admin (Michael)
```
Login → Dashboard → kelola produk (publish listing baru)
  → kelola pesanan (update status + tracking)
  → kelola inquiry custom (follow up)
```

---

## 9. Kebutuhan Non-Fungsional

| Area | Kebutuhan |
|---|---|
| **Performa** | Lighthouse ≥ 90 (mobile & desktop); gambar via `next/image` + lazy load; halaman katalog < 2s (LCP) pada 4G. |
| **Responsif** | Mobile-first — mayoritas trafik e-commerce dari ponsel. |
| **SEO** | SSR/SSG untuk halaman produk & katalog; sitemap.xml, robots.txt, metadata per halaman; JSON-LD `Product` (nama, harga, ketersediaan) dan `Organization`. |
| **Keamanan** | HTTPS, session httpOnly, sanitasi input, proteksi CSRF, rate limiting pada form publik, secret via env vars, validasi webhook Stripe (signature). |
| **Ketersediaan** | Target uptime 99.9% (hosting managed). |
| **Privasi** | Cookie policy, data pembeli hanya untuk fulfilment pesanan, GDPR-friendly (akses internasional termasuk EU). |
| **Aksesibilitas** | Semantic HTML, alt text pada semua foto produk, kontras WCAG AA. |
| **Backup** | Database harian otomatis (managed Postgres PITR); foto tersimpan di object storage. |

---

## 10. Arsitektur & Tech Stack

| Komponen | Pilihan | Catatan |
|---|---|---|
| Framework | **Next.js (App Router, TypeScript)** | SSR/ISR untuk SEO, API routes / server actions untuk backend. |
| Database | **PostgreSQL** | Managed (Neon / Supabase / RDS — ditentukan saat setup). |
| ORM | **Prisma** (default) | Alternatif Drizzle; keputusan final di tahap desain teknis. |
| Styling/UI | Tailwind CSS + shadcn/ui | Cepat, konsisten, komponen admin siap pakai. |
| Auth | Auth.js (credentials) untuk admin saja | Pembeli = guest checkout, tidak perlu akun di fase 1. |
| Payment | **Stripe** (Checkout/Payment Element + Webhooks) | Support kartu internasional, Apple/Google Pay. |
| File/Foto | Object storage (Cloudflare R2 / S3) + `next/image` | Upload dari admin dashboard. |
| Email | Resend (atau Postmark) | Template transaksional. |
| Hosting | Vercel | Integrasi native Next.js. |
| Monitoring | Vercel Analytics + error tracking (Sentry, P1) | |

### Pola penting
- **Reservation service**: cart item menahan produk via status `reserved` + `reserved_until` timestamp; cleanup job melepaskan yang kedaluwarsa.
- **Idempotent fulfillment**: hanya webhook Stripe yang boleh mengubah order → paid dan produk → sold (jangan percaya state dari client).
- **ISR**: katalog & detail produk pakai revalidate on-demand (trigger dari admin saat edit) untuk performa maksimal.

---

## 11. Skema Database (Draft)

```sql
-- Kategori & produk
products (
  id uuid PK, slug text UNIQUE, title text, description text,
  category enum('cabochon','slab','rough','finished_piece'),
  stone_type text,            -- agate, jasper, opal, ...
  color text,
  form text,                  -- oval, round, freeform, ... (cabochon)
  treatment enum('natural','dyed','stabilized','heat_treated','other'),
  origin text,                -- locality
  length_mm numeric, width_mm numeric, depth_mm numeric,
  weight_carat numeric,       -- untuk cabochon
  weight_gram numeric,        -- untuk slab/rough
  price_cents integer,        -- USD, integer cent
  quantity integer DEFAULT 1,
  status enum('draft','available','reserved','sold','hidden'),
  reserved_until timestamptz NULL,
  published_at timestamptz, created_at timestamptz, updated_at timestamptz
)

product_images (
  id uuid PK, product_id uuid FK, url text, alt text,
  sort_order integer, is_primary boolean
)

-- Transaksi
carts ( id uuid PK, token text UNIQUE, created_at, expires_at )
cart_items ( id uuid PK, cart_id FK, product_id FK, added_at )

orders (
  id uuid PK, order_number text UNIQUE, email text,
  status enum('pending','paid','processing','shipped','delivered','cancelled','refunded'),
  subtotal_cents, shipping_cents, total_cents integer,
  shipping_address jsonb, tracking_number text, courier text,
  stripe_payment_intent_id text, placed_at timestamptz
)
order_items ( id uuid PK, order_id FK, product_id FK,
  product_title_snapshot text, price_cents integer )

-- Custom order
custom_orders (
  id uuid PK, name text, email text, service_type
    enum('pendant','pair','carving','intarsia','other'),
  description text, budget_usd numeric NULL, timeline text,
  reference_images jsonb NULL,
  status enum('new','quoted','in_progress','completed','declined'),
  admin_notes text, created_at timestamptz
)

-- Admin
admin_users ( id uuid PK, email text UNIQUE, password_hash text,
  name text, created_at )
```

---

## 12. Roadmap

| Fase | Isi | Estimasi |
|---|---|---|
| **Fase 0 — Fondasi** | Setup repo Next.js + Postgres, desain skema final, setup Stripe & storage, desain UI (style guide: natural, earthy, clean — mengangkat warna batu). | 1 minggu |
| **Fase 1 — MVP** | Semua fitur P0: storefront, cart+checkout, admin, custom order form, halaman trust, email. | 3–4 minggu |
| **Fase 1.5** | Fitur P1: search, tracking page, portfolio, dashboard ringkas, order tracking email flow matang. | 1–2 minggu |
| **Fase 2** | PayPal, testimoni, wishlist/notify-me, newsletter, export CSV, insuransi ongkir. | sesuai permintaan |
| **Fase 3** | Blog/SEO content, (opsional) multi-bahasa ID/EN. | sesuai permintaan |

---

## 13. Metrik Sukses (90 hari setelah launch)

- ≥ 1 pesanan per minggu dari website (baseline organik).
- Conversion rate catalog → checkout ≥ 1.5%.
- ≥ 5 custom order inquiry per bulan.
- Bounce rate homepage < 50%; LCP < 2.5s pada ≥ 75% sesi.
- 0 insiden double-sell item unik.

---

## 14. Risiko & Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Double-sell item one-of-a-kind | Tinggi (reputasi) | Mekanisme reserve + TTL + fulfillment hanya lewat webhook (§6.3, §10). |
| Kehilangan/hilang di perjalanan internasional | Sedang–tinggi | Kebijakan shipping jelas, opsi asuransi, tracking wajib. |
| Kualitas foto menentukan konversi | Tinggi | Admin upload multi-foto + zoom; panduan foto di dokumentasi admin. |
| Chargeback/fraud | Sedang | Stripe Radar, hanya kirim ke alamat terverifikasi, bukti pengiriman. |
| Kepatuhan pajak (EU VAT/OSS, US sales tax) | Sedang | Catat sebagai pertimbangan bisnis; Stripe Tax (P2) bila diperlukan. |
| Kapasitas konten (foto & deskripsi tiap item) | Sedang | Form admin cepat + duplicate listing; deskripsi template per jenis batu. |

---

## 15. Pertanyaan Terbuka

1. Domain final (mis. `michaellapidary.com`) dan apakah sudah tersedia email bisnis?
2. Negara domisili pengiriman Michael (menentukan zona ongkir & kurir default)?
3. Apakah Finished Pieces (pendant jadi, carving siap jual) ikut dijual di fase 1, atau fokus 3 kategori dulu?
4. Keputusan final ORM (Prisma vs Drizzle) dan provider Postgres (Neon vs Supabase) — di fase desain teknis.
5. Kebijakan retur final: jangka waktu & siapa menanggung ongkir retur.
6. Kebutuhan Stripe Tax / pajak penjualan lintas negara?
