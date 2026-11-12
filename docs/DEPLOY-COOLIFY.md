# Deploy ke VPS dengan Coolify

Website: Next.js 16 + PostgreSQL + Prisma 7. Semua state (DB + foto) tinggal di VPS Anda.

## 0. Prasyarat

- VPS dengan Coolify terpasang (v4)
- Postgres service di Coolify (atau Postgres mandiri di VPS yang sama)
- (Opsional, untuk checkout) Akun Stripe → API key test/live
- (Opsional, untuk email) Akun Resend → API key + domain terverifikasi

## 1. Database

1. Coolify → **New Resource → PostgreSQL**, catat koneksi internalnya, mis.:
   `postgres://michael:PASSWORD@postgres-service:5432/michael_lapidary`
2. Database ini dipakai aplikasi lewat env `DATABASE_URL` (internal URL, bukan publik).

## 2. Aplikasi

1. Push repo ini ke Git (GitHub/GitLab privat).
2. Coolify → **New Resource → Dockerfile** → pilih repo.
3. **Environment variables** (semua wajib kecuali bertanda opsional):

   | Key | Contoh |
   |---|---|
   | `DATABASE_URL` | `postgres://michael:…@postgres-service:5432/michael_lapidary` |
   | `NEXT_PUBLIC_SITE_URL` | `https://michaellapidary.com` |
   | `AUTH_SECRET` | `openssl rand -base64 32` |
   | `ADMIN_EMAIL` | email admin (untuk seed & notifikasi) |
   | `ADMIN_PASSWORD` | password admin awal — **hapus env ini setelah seed pertama** |
   | `STRIPE_SECRET_KEY` | `sk_live_…` / `sk_test_…` (opsional — checkout nonaktif tanpa ini) |
   | `STRIPE_WEBHOOK_SECRET` | `whsec_…` (lihat §4) |
   | `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_…` |
   | `RESEND_API_KEY` | `re_…` (opsional — email no-op tanpa ini) |
   | `EMAIL_FROM` | `Michael Lapidary <orders@michaellapidary.com>` |
   | `UPLOAD_DIR` | `/app/uploads` (sudah default di Dockerfile) |

4. **Persistent volume**: mount ke `/app/uploads` (di sinilah foto produk tersimpan).
5. **Port**: 3000. Health check: `/`.
6. Deploy — container otomatis menjalankan `prisma migrate deploy` lalu `next start`.

## 3. Seed admin (sekali saja, pertama kali)

```sh
# dari host VPS, masuk container:
docker exec -it <container-id> sh
pnpm prisma db seed
# Admin terbentuk dari ADMIN_EMAIL + ADMIN_PASSWORD. Lalu hapus ADMIN_PASSWORD dari env.
```

Seed juga mengisi 12 produk placeholder + review + tarif kirim — hapus/edit dari `/admin`.

## 4. Stripe webhook

Stripe Dashboard → Developers → **Webhook endpoint**:
- URL: `https://michaellapidary.com/api/webhooks/stripe`
- Event: `checkout.session.completed`
- Salin Signing secret ke env `STRIPE_WEBHOOK_SECRET`, lalu redeploy.

Tes lokal: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`

## 5. Domain & HTTPS

Coolify → aplikasi → **Domain**: `michaellapidary.com` (HTTPS otomatis via Let's Encrypt).
Pastikan `NEXT_PUBLIC_SITE_URL` = URL final ini (dipakai sitemap, JSON-LD, redirect Stripe).

## 6. Backup

- **DB**: dump harian (`pg_dump` cron di VPS, atau fitur backup Coolify).
- **Foto**: backup volume `/app/uploads` (rsync ke lokasi kedua).

## 7. Update aplikasi

Push ke branch utama → Coolify redeploy otomatis (webhook Git).
Migrasi skema baru: commit perubahan `prisma/schema.prisma` + `pnpm prisma migrate dev --name <nama>` di lokal → `migrate deploy` jalan otomatis saat container start.
