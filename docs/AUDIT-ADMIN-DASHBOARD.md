# Audit Dashboard Admin — Michael Lapidary

**Tanggal:** 13 November 2026
**Scope:** Seluruh menu & sub-menu `/admin`, API admin, keamanan akses, UX, dan kelengkapan fungsi.
**Metode:** Review kode (semua page/API/komponen admin) + uji fungsional di browser (localhost:3100, login aktif) + uji akses tanpa kredensial via curl.

---

## 1. Ringkasan Eksekutif

| Aspek | Hasil |
|---|---|
| Struktur menu | 5 menu datar (tanpa sub-menu) + halaman login |
| Proteksi halaman (`/admin/*`) | ✅ `proxy.ts` → redirect 307 ke login tanpa cookie (terverifikasi) |
| Proteksi API admin | ✅ Semua endpoint → 401 tanpa cookie (terverifikasi: orders, products POST/DELETE, upload, settings) |
| Temuan P0 | **0** — tidak ada celah kritis |
| Temuan P1 (production blocker) | **7** — keamanan konfigurasi, rate limit, gap fulfilment, gap menu |
| Temuan P2 (UX/kualitas) | **9** |
| Temuan P3 (polish) | **6** |

Inti masalah bukan pada keamanan akses (sudah baik), melainkan pada: **(a)** admin tidak bisa menjalankan bisnis sepenuhnya dari UI (alamat kirim tidak tampil, review/ongkir/pelanggan tak terkelola), **(b)** beberapa angka & interaksi admin bisa menyesatkan (kartu overview, save diam-diam), **(c)** hardening konfigurasi produksi.

---

## 2. Peta Menu & Sub-menu

| # | Menu | Route | Fungsi | Sumber data | Status |
|---|---|---|---|---|---|
| 1 | Overview | `/admin` | 4 kartu KPI + recent orders/products/inquiries | Order, CustomOrder, Product | ⚠️ Angka kartu terpotong di 5 (P2-1) |
| 2 | Products | `/admin/products` (+`?new=1`, `?edit=id` sebagai "sub-view") | List semua produk, form create/edit lengkap (atribut batu, SEO per-produk, upload multi-foto) | Product, ProductImage | ⚠️ Tanpa delete di UI, tanpa alt text, tanpa pagination (P1-4, P2-5/6) |
| 3 | Orders | `/admin/orders` | List semua order + ubah status/courier/tracking (auto-email saat SHIPPED, lepas reservasi saat CANCELLED) | Order, OrderItem | ❌ Alamat kirim tidak tampil (P1-1) |
| 4 | Custom inbox | `/admin/custom-orders` | Daftar inquiry custom + status + catatan internal | CustomOrder | ⚠️ Reference images tidak berfungsi (P2-7) |
| 5 | Settings | `/admin/settings` | SEO global, OG image, verifikasi GSC, Instagram | SiteSettings | ✅ Berfungsi; masih ada field yang layak ditambah (P3) |
| — | Login | `/admin/login` | Form email+password → JWT cookie 7 hari | AdminUser | ⚠️ Tanpa rate limit (P1-2) |

**Menu yang SEHARUSNYA ada tapi belum ada (model DB sudah tersedia, dipakai frontend, tak terkelola dari admin):**

| Menu hilang | Model DB | Dipakai di | Dampak |
|---|---|---|---|
| **Reviews** | `Review` (ada flag `published`) | Homepage §10 (`prisma.review.findMany`) | Konten sosial-proof homepage tak bisa dikelola/Dimatikan dari admin |
| **Shipping rates** | `ShippingRate` | Checkout & `/api/checkout` | Ongkir per-zona hanya bisa diubah via SQL/seed |
| **Subscribers** | `NewsletterSubscriber` | `/api/newsletter` (footer) | Daftar email tak bisa dilihat/diekspor untuk dikirim newsletter-nya |

---

## 3. Temuan Detail

### 🔴 P1 — Wajib sebelum production

**P1-1 · Alamat pengiriman tidak tampil di halaman Orders.**
DB menyimpan `Order.shippingAddress` (Json) tetapi UI hanya menampilkan email, item, total, dan status. Admin tidak bisa mengemas/mengirim pesanan tanpa membuka database langsung.
→ `src/app/admin/orders/page.tsx:12-35`

**P1-2 · `/api/admin/login` tanpa rate limiting / lockout.**
Brute force password bisa berjalan tanpa hambatan. Email admin juga publik secara pola (`admin@…`).
→ `src/app/api/admin/login/route.ts:10-25`
Rekomendasi: rate limit per-IP+email (mis. 5 percobaan / 15 menit, in-memory atau tabel DB), plus delay acak kecil saat gagal.

**P1-3 · `AUTH_SECRET` punya fallback default yang bisa dipakai memalsukan sesi.**
`process.env.AUTH_SECRET ?? "dev-only-secret-ganti-di-production"` dipakai di **dua tempat** (proxy & auth). Jika env lupa di-set di production, siapa pun bisa menempa cookie `ml_admin` yang valid.
→ `src/proxy.ts:15` dan `src/lib/auth.ts:5`
Rekomendasi: throw saat build/startup bila `NODE_ENV === "production"` dan `AUTH_SECRET` kosong/pendek (<32 byte).

**P1-4 · Alt text foto produk tidak bisa diisi dari admin.**
Upload selalu menyimpan `alt: ""` dan form tidak punya input alt — padahal kolom `ProductImage.alt` ada. Ini mengulang temuan audit frontend sebelumnya (alt text P1) dan akarnya di sini: sumbernya tak tersedia.
→ `src/components/admin/product-form.tsx:178-188`
Rekomendasi: tambah input alt per gambar (wajib untuk gambar pertama), kirim lewat `images` JSON yang sudah ada.

**P1-5 · Menu Reviews tidak ada** (lihat tabel di atas). Form CRUD + toggle `published` cukup.

**P1-6 · Menu Shipping rates tidak ada.** CRUD zona/harga/berkas + flag `active`.

**P1-7 · Daftar pelanggan newsletter tidak bisa dilihat/diekspor.** Tambah sub-menu sederhana: daftar + tombol export CSV.

### 🟠 P2 — UX & kualitas

**P2-1 · Kartu Overview terpotong di angka 5.**
"Orders to ship" & "New inquiries" dihitung dari `findMany({ take: 5 }).length` — jika ada 12 order terbuka, kartu menampilkan **5**. Harusnya `prisma.order.count(...)` / `customOrder.count(...)`.
→ `src/app/admin/page.tsx:8-9,16-17`

**P2-2 · Save diam-diam pada Order & Inquiry controls.**
`fetch()` tidak memeriksa `res.ok`; jika 400/401/500, admin tidak diberi tahu apa pun (tombol hanya berhenti "Saving…").
→ `src/components/admin/order-controls.tsx:24-36`, `src/components/admin/inquiry-controls.tsx:14-26`
Rekomendasi: pola sama dengan ProductForm/SettingsForm (state error + pesan).

**P2-3 · Judul tab duplikat: "Admin · Michael Lapidary · Michael Lapidary".**
Admin layout mengembalikan `title: "Admin · Michael Lapidary"` sementara root layout memakai template `%s · Michael Lapidary`. Fix: `title: { absolute: "Admin · Michael Lapidary" }`.
→ `src/app/admin/layout.tsx:54-56`

**P2-4 · Navigasi admin: tidak ada penanda halaman aktif, dan di ponsel (375px) menu terpotong** — "Custom inbox" & "Settings" tersembunyi di luar layar (harus scroll horizontal). Rekomendasi: highlight via `usePathname()`/segmen aktif + nav `flex-wrap` atau dropdown di mobile.

**P2-5 · Orders & Custom inbox tanpa filter/pagination; Products tanpa pagination/search.** Semua baris dimuat sekaligus. Untuk volume kecil OK, tapi tambahkan minimal filter status di Orders dan pencarian slug/title di Products.

**P2-6 · Tidak ada tombol hapus produk di UI**, padahal `DELETE /api/admin/products` sudah ada (orphan). Tambah tombol Delete + konfirmasi di form edit.

**P2-7 · Reference images untuk custom order tidak berfungsi end-to-end.** Kolom `CustomOrder.referenceImages` ada di DB, tapi form publik tidak mengumpulkan gambar dan inbox admin tidak menampilkannya. Putuskan: bangun fiturnya (upload → tampil di inbox) atau hapus kolom.

**P2-8 · Upload memercayai MIME type dari client** (`ALLOWED.get(file.type)`) — mudah dipalsukan; tidak ada validasi magic-byte, dan file terhapus dari form tetap tersisa di disk (orphan).
→ `src/app/api/admin/upload/route.ts:31-40`

**P2-9 · `next.images.remotePatterns: https **` + `dangerouslyAllowSVG: true` terlalu longgar** — semua gambar hanya dilayani dari `/media` lokal; remotePatterns bisa dilepas total (mengurangi permukaan abuse optimasi gambar).
→ `next.config.ts`

### 🟡 P3 — Polish

- **P3-1** `onUnauthorized()` di `src/app/admin/layout.tsx:58-61` bukan konvensi Next.js (tidak pernah dipanggil) — dead code yang memberi ilusi guard tambahan. Hapus, atau ganti dengan guard nyata di layout (`if (!email) redirect(...)`) sebagai defense-in-depth.
- **P3-2** Path check `/media` memakai `startsWith(normalize(dir))` — bisa lolos untuk direktori sibling (`/srv/uploads` vs `/srv/uploads2`). Pakai `normalize(dir) + path.sep`. Juga ada decode ganda (`decodeURIComponent` di atas decode Next).
  → `src/app/media/[...path]/route.ts:21-22`
- **P3-3** Transisi status order bebas (DELIVERED → PENDING bisa), dan **REFUNDED tidak melepas status produk** (hanya CANCELLED yang melepas RESERVED). Pertimbangkan state machine sederhana + perlakuan REFUNDED.
- **P3-4** Bahasa campur EN/ID di admin ("Inbox kosong — belum ada inquiry.", deskripsi Settings, label OG) — pilih satu.
- **P3-5** `PUT /api/admin/products` tidak menangani error slug duplikat (hanya POST yang balas "Slug already exists") → pesan generik "Update failed".
- **P3-6** Halaman login masih menampilkan header admin saat sesi aktif; sesi JWT 7 hari tidak bisa dicabut (tidak ada revocation). Minor untuk skala ini.

---

## 4. Bukti Uji Fungsional

| Uji | Hasil |
|---|---|
| `GET /admin` & `/admin/products` tanpa cookie | **307 → /admin/login** ✅ |
| `PUT /api/admin/orders`, `POST/DELETE /api/admin/products`, `POST /api/admin/upload`, `PUT /api/admin/settings` tanpa cookie | **401 Unauthorized** semua ✅ |
| Login sesi aktif → semua 5 menu | Render benar, data seed tampil ✅ |
| Form produk (new/edit) | Lengkap 15+ field; validasi client-side jalan ✅ |
| Orders (1 order CANCELLED tersimpan) | Item & total benar; alamat tidak ada ❌ |
| Settings | Data tersimpan & OG preview tampil ✅ |
| Mobile 375px | Kartu KPI rapi; nav admin terpotong ❌ |

---

## 5. Rekomendasi Eksekusi (urutan pengerjaan)

**Batch 1 — Production blocker (±1 sesi):**
1. Tampilkan alamat pengiriman di Orders (P1-1) — render `shippingAddress` terformat.
2. Fail-fast `AUTH_SECRET` di production (P1-3).
3. Rate limit login (P1-2).
4. Input alt text gambar di ProductForm (P1-4) — sekaligus menutup P1 alt text audit frontend.

**Batch 2 — Lengkapi menu (±1–2 sesi):**
5. Menu **Reviews** (list + toggle published + edit/hapus).
6. Menu **Shipping** (CRUD zona/harga).
7. Menu **Subscribers** (list + export CSV).
   → Nav menjadi: Overview · Products · Orders · Custom inbox · Reviews · Shipping · Subscribers · Settings.

**Batch 3 — Admin UX (±1 sesi):**
8. Count kartu Overview (P2-1), error handling save (P2-2), judul absolute (P2-3).
9. Active nav + mobile nav wrap (P2-4), filter status Orders (P2-5), tombol delete produk (P2-6).

**Batch 4 — Hardening (sebelum deploy Coolify):**
10. Validasi magic-byte upload + kebijakan hapus file orphan (P2-8), rapikan `remotePatterns`/SVG (P2-9), perbaiki prefix check `/media` (P3-2), keputusan referenceImages (P2-7), konsistensi bahasa (P3-4).

---

## 6. Catatan Tambahan

- **Port 3000 sedang dipakai project lain (RPMX).** Dev server Michael Lapidary berjalan di **port 3100**. Perlu diperhatikan: admin RPMX di localhost:3000 tampaknya **tanpa login** sama sekali — di luar scope audit ini, tapi layak diperiksa pada project tersebut.
- Seed masih memuat password default `changeme123` bila `ADMIN_PASSWORD` tidak di-set di `.env` (saat ini tidak di-set) — pastikan password production di-set sebelum deploy pertama.

---

## 7. STATUS IMPLEMENTASI (13 Nov 2026 — semua batch selesai & terverifikasi)

Semua rekomendasi di atas telah dieksekusi dan diuji (tsc ✓, eslint ✓, uji browser & curl end-to-end ✓):

| Temuan | Status | Implementasi |
|---|---|---|
| P1-1 Alamat kirim | ✅ | Blok "Ship to" terformat di kartu order (`orders/page.tsx`) |
| P1-2 Rate limit login | ✅ | `lib/rate-limit.ts` — 5 percobaan/15 mnt per IP+email → 429 + Retry-After; teruji (6th attempt = 429) |
| P1-3 AUTH_SECRET fail-fast | ✅ | `lib/auth-secret.ts` dipakai proxy & auth — throw di production bila kosong/<32 char |
| P1-4 Alt text | ✅ | Input alt per foto di ProductForm; alt primary wajib (validasi client) |
| P1-5/6/7 Menu hilang | ✅ | **Reviews** (CRUD + publish toggle), **Shipping** (CRUD per zona), **Subscribers** (list + export CSV + delete) — nav kini 8 menu |
| P2-1 Kartu Overview | ✅ | `prisma.order.count` / `customOrder.count` |
| P2-2 Save diam-diam | ✅ | Semua kontrol (order/inquiry/review/shipping/subscriber) kini cek `res.ok` + pesan error |
| P2-3 Judul dobel | ✅ | `title: { absolute: "Admin · Michael Lapidary" }` |
| P2-4 Nav aktif & mobile | ✅ | `AdminNav` client (usePathname, `aria-current`), flex-wrap — 8 menu terlihat semua di 375px |
| P2-5 Filter orders | ✅ | Pills status dengan hitungan (`?status=…`) |
| P2-6 Delete produk | ✅ | Tombol "Delete stone" + konfirmasi; file foto ikut dibersihkan |
| P2-7 ReferenceImages | ✅ | Diputuskan **URL-based** (tanpa upload anonim): field "Reference links" di form publik (maks 5 URL), tampil sebagai thumbnail di inbox + disertakan di email admin |
| P2-8 Upload hardening | ✅ | Validasi magic-byte (JPEG/PNG/WEBP/AVIF); teruji: PNG asli 200, palsu 415 |
| P2-9 Image config | ✅ | `remotePatterns` dikosongkan + `dangerouslyAllowSVG` dilepas (0 SVG di DB) |
| P3-1 Dead guard | ✅ | `onUnauthorized` dihapus; header admin disembunyikan saat belum login |
| P3-2 Prefix /media | ✅ | `startsWith(root + sep)` + tanpa decode ganda; traversal → 404 |
| P3-3 REFUNDED | ⏸️ | Sengaja belum diubah (keputusan bisnis terpisah) |
| P3-4 Bahasa | ✅ | Admin kini konsisten Inggris |
| P3-5 Slug PUT | ✅ | Unique error → 409 "Slug already exists" |
| Orphan files | ✅ | `lib/media-cleanup.ts` — foto yang dilepas di PUT / produk dihapus dihapus dari disk bila tak direferensikan (cek ProductImage lain + OG image) |

**Bug ditemukan & diperbaiki saat pengujian:** route login baru sempat memanggil `req.json()` dua kali (body terkonsumsi → selalu 400) — diperbaiki dengan parsing sekali.

**File baru:** `src/lib/auth-secret.ts`, `src/lib/rate-limit.ts`, `src/lib/media-cleanup.ts`, `src/components/admin/{admin-nav,review-controls,review-create,shipping-controls,shipping-create,subscriber-delete}.tsx`, `src/app/admin/{reviews,shipping,subscribers}/page.tsx`, `src/app/api/admin/{reviews,shipping,subscribers,subscribers/export}/route.ts`.

**Catatan deployment:** server di port 3100 adalah `pnpm start` (build produksi lama) — jalankan ulang `pnpm build && pnpm start` agar perubahan ini tampil. Dev server verifikasi berjalan di port 3110.
