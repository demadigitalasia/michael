# Audit Desain Frontend vs Referensi Jewelwright — Michael Lapidary

**Tanggal:** 13 November 2026
**Referensi:** Jewelwright live preview (Aldersmith) — https://sparkling-tangerine-321189.framer.app/
**Acuan proyek:** `docs/DESIGN-SPEC.md` (§1–§11) & `docs/MOTION-SPEC.md`
**Metode:** Side-by-side screenshot (1440×900) situs referensi vs implementasi (dev port 3110) — hero, koleksi, grid produk, section gelap, lookbook, custom flow, stats, newsletter, footer, shop, PDP, /custom — plus verifikasi token di kode (`globals.css`, font `layout.tsx`, komponen).

---

## 1. Ringkasan Eksekutif

| Area | Skor kesesuaian | Catatan |
|---|---|---|
| Token warna & font (kode) | **10/10** | Hex persis §3.1, Antonio/Geist/Geist Mono, alpha 72% ✓ |
| Struktur & urutan homepage | **10/10** | 12 section, urutan persis §6, semua ada |
| Motion mekanik (terlihat) | **9/10** | Counter hidup, pinned lookbook & custom flow, ticker, accordion — jalan semua |
| Fidelity visual per komponen | **7.5/10** | Beberapa komponen memilih interpretasi sendiri (hero, kategori, stats, footer) |
| **Kesesuaian total vs referensi** | **≈ 8/10** | Terasa "Jewelwright", tapi 7 deviasi visual yang masih bisa ditutup |

**Kesimpulan:** Fondasi dan motion sudah sangat setia ke referensi. Kesenjangan terkonsentrasi di **keputusan visual besar** (hero gelap vs terang, kategori tanpa foto, stats terang vs gelap, footer tanpa wordmark) dan **2 bug render kecil** (baris berat featured, foto kedua PDP). Semua dapat diperbaiki tanpa restrukturisasi.

---

## 2. Fondasi — Sesuai Persis ✓

Diverifikasi di kode, bukan sekadar tampilan:

- **Warna** `globals.css`: paper `#e9e5de`, milk `#ece8e1`, ink `#121214`, bench `#141415`, stone `#bdb8af`, gold/brass `#c9a24e`, oxide/ember `#d9482b`, sketch `#f2efe9`, phold `#d8d2c8` — semua persis §3.1/MOTION-SPEC §1.
- **Font** `layout.tsx`: Antonio + Geist + Geist_Mono via `next/font/google` ✓.
- **Body text 72% alpha** via `color-mix(in srgb, var(--color-ink) 72%, ...)` ✓ (bukan abu solid).
- **Easing tunggal** `cubic-bezier(.22,1,.36,1)` dipakai konsisten (dicek di ProductCard, Reveal, tombol) ✓.
- **Radius**: foto/kartu 4px, pill 999 ✓.

---

## 3. Perbandingan Section Homepage (1:1 dengan §6)

| # | Section | Referensi (Aldersmith) | ML saat ini | Status |
|---|---|---|---|---|
| 1 | **Hero** | Latar **paper terang**; display raksasa ink; **objek 3D di tengah menimpa teks**; annotation dengan garis leader tipis; kartu konfigurator harga kanan-bawah; kicker + intro + 2 CTA kiri-bawah | **Foto full-bleed gelap**, teks milk di atas foto, annotation berbentuk chip, 2 CTA kanan-bawah | ⚠️ **Deviasi struktur** (lihat P1-1) |
| 2 | Interactive viewer | Produk 3D + hint `Drag to turn · hover to inspect` + **4 badge nilai** + kartu harga/CTA | Foto + loupe (`Hover to inspect` ✓), judul, deskripsi, harga, `View the stone →` — **4 badge nilai tidak ada** | ⚠️ P1-6 |
| 3 | Shop by collection | 5 kartu **foto** gelap + count mono + judul Antonio di atas foto | 4 kartu **teks** (border, judul, count, panah) — tanpa foto | ⚠️ P1-3 |
| 4 | Grid terbaru | 4 kolom × 2 baris, badge pill status, harga, caption mono | Identik: 4 kolom, badge pill, harga Geist, mono spec ✓ | ✅ |
| 5 | The Workshop (gelap) | Full-bleed scene + counter `00:46` raksasa kanan-atas + suhu tengah + progress langkah bawah | Ink ✓, counter `HOURS AT THE WHEELS 00:52` + `WHEEL GRIT 27.748` hidup ✓, 5 langkah accordion + baris data mono ✓, foto proses | ✅ (P2: foto kecil kiri, tidak full-bleed) |
| 6 | Lookbook | Pinned horizontal, judul hantu parallax 0.35× opacity .08, counter `08/08`, progress bar, caption mono nomor oxide | Identik jalan: pinned ✓, ghost text ✓, `03 / 08` ✓, progress ✓, caption oxide ✓; **13 Nov: ukuran foto kini bervariasi per rasio §2.3** (campuran portrait/landscape, sebelumnya 8 kotak identik 64×46vh) | ✅ diperbaiki |
| 7 | Custom flow | Pinned 2 kolom; stage **lembar sketsa** grid kertas 24px + wipe per langkah; accordion langkah; CTA pill | Pinned ✓, accordion ✓, meta mono ✓, CTA ✓; stage homepage = **foto tunggal berganti tag** (bukan lembar sketsa) — di halaman `/custom` stage grid kertas ✓ ada | ⚠️ P2-3 (hanya homepage) |
| 8 | Stats | **Section gelap (ink)**, kicker, H2 milk, 4 counter raksasa suffix oxide + hairline | Konten & format persis (100% / 412 / 9 h / 0, suffix oxide ✓, hairline ✓) tapi **latar terang** | ⚠️ P1-4 |
| 9 | Care | 3 layanan | 3 kolom bernomor ✓ | ✅ |
| 10 | Reviews | Skor + 3 testimoni | `IN THEIR WORDS` + kutipan + atribusi mono ✓ | ✅ |
| 11 | Journal | 3 artikel | `From the journal` ✓ | ✅ |
| 12 | Newsletter + footer | `Letter from the bench` + footer gelap + **wordmark raksasa** di kaki footer | `LETTER FROM THE WORKSHOP · MONTHLY` + `NEW STONES 48 HOURS…` ✓; footer gelap 4 kolom ✓ **tanpa wordmark raksasa**; ticker ✦ oxide ✓ ada di atas footer | ⚠️ P1-5 |

---

## 4. Halaman Lain

| Halaman | Sesuai | Temuan |
|---|---|---|
| `/shop` | Kicker `SHOP · 12 PIECES · CUT IN OUR STUDIO` ✓, H1 `ALL PIECES` ✓, intro ✓, grid ✓ | Referensi: kategori sebagai **5 baris list dengan panah**; ML: 4 pill sebaris. Deviasi kecil (P2-4) |
| `/products/[slug]` | 2 foto hero berdampingan ✓, loupe `HOVER TO INSPECT` ✓, kicker mono + H1 Antonio ✓, spec rows ✓ | **Bug**: foto kedua tidak mengisi container di desktop (P1-7) |
| `/custom` | Kicker `CUSTOM WORK · FROM $90` ✓, H1 `MADE FOR ONE PERSON` ✓ (persis adaptasi §3.3), flow stage grid kertas ✓ | Struktur sesuai; hero kanan kosong (mungkin menunggu foto — cek konten) |
| `/the-workshop`, `/collections`, `/care`, `/contact`, `/journal` | Reuse komponen homepage yang sudah terverifikasi (counter, lookbook, accordion) | Tidak di-capture satu per satu — risiko rendah |

---

## 5. Temuan Prioritas

### 🔴 P1 — Identitas visual & bug (7 item)

**P1-1 · Hero: struktur berbeda dari referensi.**
Referensi adalah momen tanda tangan template: **latar paper terang + tipografi raksasa ink + objek menimpa teks** dengan annotation garis-leader + kartu harga. ML memakai hero foto full-bleed gelap (indah, tapi nuansa "template lain" — foto gelap menutupi kekhasan tipografi terang).
*Catatan:* DESIGN-SPEC §6.1 sendiri menulis "Asli: foto full-bleed" — deskripsi ini kurang akurat terhadap preview; implementasi mengikuti spec, bukan preview.
**Rekomendasi:** Bangun ulang hero mengikuti referensi: bg paper, `CUT BY HAND / KEPT FOR LIFE.` Antonio ink raksasa 2 baris, foto batu (cut-out / berlatar netral) di tengah menimpa teks, 2 annotation **garis leader** (bukan chip), kartu mini kanan-bawah (nama batu + harga + `View the stone →`), kicker `MICHAEL LAPIDARY · STUDIO LAPIDARY` + intro + 2 CTA kiri-bawah. Foto hero yang sekarang tetap terpakai di section lain/OG.

**P1-2 · Bug: baris spesifikasi featured merender "· g ·" tanpa angka** saat berat kosong (`weightCarat ?? weightGram` = null → `null` + `" g"`).
→ `src/app/(site)/page.tsx:179`. Fix: sembunyikan segmen berat bila keduanya null.

**P1-3 · Kartu kategori tanpa foto.** Prinsip #1 "Objek dulu, UI kemudian" — referensi memakai kartu foto gelap dengan judul Antonio di atasnya; ML kartu teks polos. Fix: beri foto per kategori (bisa reuse foto produk terbaik per kategori) + overlay teks milk, seperti referensi.

**P1-4 · Stats section latar terang; referensi gelap.** Ritme gelap-terang homepage (prinsip #7) ML hanya punya 1 strip gelap (workshop) + footer; referensi 3 (bench, stats, footer). Fix: bungkus section stats dengan `bg-ink`, teks milk, hairline `milk/18`.

**P1-5 · Footer tanpa wordmark raksasa.** Signature element referensi (Antonio raksasa memenuhi lebar kaki footer). Fix: tambah `MICHAEL LAPIDARY` Antonio uppercase, `clamp()` memenuhi lebar, opacity penuh, di atas baris legal.

**P1-6 · Badge nilai featured hilang.** Spec §6.2: `100% treatment disclosed · Ships insured worldwide · 14-day returns · One of a kind`. Tambah baris 4 badge mono kecil di bawah harga featured.

**P1-7 · Bug PDP: foto kedua tidak mengisi container di desktop.** Container kedua `aspect-[4/5] lg:h-[560px]` tanpa `lg:aspect-auto` → lebar terkunci 4/5×560, menyisakan gap `phold` di kanan.
→ `src/app/(site)/products/[slug]/page.tsx:96`. Fix: `lg:aspect-auto lg:h-[560px]` seperti foto pertama.

### 🟠 P2 — Pola & konten (5 item)

- **P2-1 · Badge "One of a kind" di semua kartu** — informasi nol (semua item memang one-of-a-kind) dan berbeda dari pola referensi yang menginformasikan status. Saran: AVAILABLE → `Ready to ship`; Reserved/Sold tetap. (`status-badge.tsx`)
- **P2-2 · Workshop section tidak full-bleed** — foto kecil di kolom kiri; referensi memenuhi layar. Saran: foto besar full-bleed sebagai latar dengan overlay teks (atau minimal tinggi menyamai viewport) agar dramatik seperti aslinya.
- **P2-3 · Stage custom flow di homepage pakai foto**; halaman `/custom` sudah benar (grid kertas). Samakan homepage ke treatment lembar sketsa + wipe (reuse komponen yang sama).
- **P2-4 · Kategori /shop pakai pill**, referensi baris list dengan panah. Pilihan rasa; kalau ingin setia, ubah ke baris.
- **P2-5 · Caption lookbook kepanjangan** — `SILICIFIED WOOD WITH DRUSY QUARTZ, INDONESIA (CONCEPT LOCALITY; SPECIMEN UNVERIFIED)`; format referensi pendek: `01 — SLAB #014, GARUT`. Pindahkan disclaimer ke PDP; caption cukup `NN — Mineral, locality · weight`.

### 🟡 P3 — Polish (3 item)

- **P3-1** Logo pill memakai file gambar brand (serif), bukan wordmark Antonio `ls .14em` dari spec — identitas campur di nav. Keputusan: pakai logo gambar penuh (brand riil) ATAU wordmark teks Antonio; pilih satu dan konsisten dengan footer.
- **P3-2** Saat transisi accordion custom flow, teks body & meta tampak tumpang tindih sekejap (terlihat pada capture) — periksa `max-height` transition vs konten yang lebih tinggi dari 120px.
- **P3-3** Hero `/custom` sisi kanan kosong — pastikan ada foto seperti struktur §3.3 (foto besar setelah intro).

---

## 6. Yang Sudah Sangat Sesuai (patut dipertahankan)

1. **Urutan & proporsi 12 section homepage** — identik blueprint.
2. **Token & font** — presisi penuh di kode.
3. **Nav pill frosted-glass** 3 pil (Logo / Links / Bag) + badge count ink ✓.
4. **Counter hidup workshop** (`00:52`, grit `49.887` tween) + accordion langkah + baris data mono — perilaku scroll-driven seperti aslinya.
5. **Lookbook pinned** — ghost text parallax, counter `03/08`, progress bar, undulasi tinggi foto, caption nomor oxide.
6. **Custom flow pinned** — accordion opacity .42→1, meta mono, stage berganti per langkah (di `/custom` pakai grid kertas ✓).
7. **Ticker** Antonio dengan pemisah ✦ oxide di strip gelap.
8. **Kartu produk** — 4 kolom, badge pill, hover zoom `.45s` + swap foto `.6s` (di kode), harga mono, spec mono.
9. **Copy pelan** — "No discounts shouted in capitals" dijaga ("No discounts shouted in capitals." bahkan ditulis di newsletter ✓).
10. **Sold stamp** ember + badge Reserved gold sesuai §8.

---

## 7. Rekomendasi Eksekusi

**Batch A — Bug render (±30 menit):**
1. Fix baris berat featured (`page.tsx:179`).
2. Fix container foto kedua PDP (`products/[slug]/page.tsx:96` → tambah `lg:aspect-auto`).

**Batch B — Kesesuaian visual referensi (±1 sesi):**
3. Stats → section gelap (bg-ink + milk).
4. Badge nilai ×4 di featured.
5. Footer wordmark raksasa.
6. Badge kartu AVAILABLE → `Ready to ship`.
7. Caption lookbook dipendekkan.

**Batch C — Kerja visual besar (±1–2 sesi, butuh keputusan):**
8. **Hero terang ala referensi** (P1-1) — perlu persetujuan karena mengganti hero yang sekarang; foto batu cut-out bisa diambil dari foto produk existing.
9. Kartu kategori berfoto (butuh pemilihan 4 foto per kategori).
10. Workshop full-bleed + stage lembar sketsa di homepage custom flow.

**Keputusan yang diminta dari Anda:** (a) hero terang ala referensi atau pertahankan foto gelap? (b) badge AVAILABLE "Ready to ship"? (c) logo gambar vs wordmark Antonio di nav?

---

## 8. Limitasi Audit

- Hover states (swap foto, arrow shift) diverifikasi dari kode, bukan interaksi langsung.
- Halaman /the-workshop, /collections, /care, /contact, /journal tidak di-capture satu per satu (mereka reuse komponen homepage yang sudah diperiksa).
- Lighthouse/performance bukan bagian audit ini (masih item P1 terpisah dari audit sebelumnya).

---

## 9. STATUS EKSEKUSI (13 Nov 2026 — Batch A + B selesai & terverifikasi visual)

| Item | Status |
|---|---|
| A1 · Baris berat featured "· g ·" | ✅ Segmen berat kini disembunyikan bila kosong (format konsisten dengan ProductCard) |
| A2 · Foto kedua PDP tak mengisi | ✅ `lg:aspect-auto` ditambahkan — kedua foto penuh di desktop |
| B1 · Stats → gelap | ✅ Section `bg-ink` + teks milk; `StatsCounters` kini punya prop `dark` (hairline & teks milk) — ritme terang→gelap→terang seperti referensi |
| B2 · Badge nilai ×4 featured | ✅ `100% treatment disclosed · Ships insured worldwide · 14-day returns · One of a kind` |
| B3 · Wordmark footer | ✅ "MICHAEL LAPIDARY" Antonio raksasa di atas baris legal |
| B4 · Badge AVAILABLE | ✅ Kini "Ready to ship" (Reserved gold & Sold oxide tetap) |
| B5 · Caption lookbook | ✅ Parenthetical origin dibuang → `03 SILICIFIED WOOD WITH DRUSY QUARTZ, INDONESIA` |
| Bonus · Lint pre-existing | ✅ `set-state-in-effect` di stats-counters diperbaiki via rAF |

**Batch C (menunggu keputusan):** hero terang ala referensi · kartu kategori berfoto · workshop full-bleed · stage lembar sketsa di homepage · logo gambar vs wordmark Antonio di nav.

**Tambahan 14 Nov 2026 (atas masukan user "lookbook tidak rapi"):** ukuran foto lookbook kini **bervariasi per rasio MOTION-SPEC §2.3** (`[0.58,0.44] [0.46,0.68] [0.64,0.5] [0.42,0.62] [0.56,0.42] [0.5,0.74] [0.62,0.48] [0.46,0.64]` × 78vh — campuran portrait & landscape dengan undulasi organik), menggantikan 8 kotak identik 64×46vh; caption dibersihkan total dari keterangan dalam kurung (`Pancawarna jasper, Indonesia` — bukan `PANCawarna JASPER (TRADE NAME), INDONESIA`); import `useTransform` tak terpakai dihapus.

**Catatan deployment:** perubahan terlihat di dev (port 3110); server produksi port 3100 perlu `pnpm build && pnpm start` ulang.
