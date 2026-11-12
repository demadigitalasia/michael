# DESIGN-SPEC — Michael Lapidary

| | |
|---|---|
| **Referensi desain** | Jewelwright (Framer) — live preview: https://sparkling-tangerine-321189.framer.app/ |
| **Template dasar** | [Jewelwright](https://www.framer.com/marketplace/templates/jewelwright) — skor 8.6, rekomendasi #1 ([TEMPLATE-ASSESSMENT.md](TEMPLATE-ASSESSMENT.md)) |
| **Tanggal** | 12 November 2026 |
| **PRD terkait** | [PRD.md](PRD.md) |
| **Implementasi** | Next.js + Tailwind — token & spesifikasi di dokumen ini adalah acuan tunggal desain |

> **Cara pakai dokumen ini:** Semua halaman dan komponen Next.js **harus mengikuti struktur, mood, dan token di bawah**. Bagian yang mengutip situs aslinya (Aldersmith, brand fiktif perhiasan) ditandai `→ adaptasi` — itu perubahan konten yang wajib dilakukan supaya jadi toko batu Michael Lapidary, bukan toko perhiasan.

---

## 1. Identitas Desain

**Jewelwright** adalah template "studio jeweller" dengan karakter:

- **Photoreal craft-first** — foto besar nyata (bengkel, tangan, material), bukan ilustrasi atau render.
- **Restraint editorial** — banyak whitespace, tipografi besar, motif angka bernomor (`01`, `02`) sebagai bahasa visual.
- **Spesifik & jujur** — angka teknis di mana-mana: `6.4 g`, `1,064 °C`, `14 h`, `1.02 ct`. Kesan "workshop log", bukan marketing shouty. *"No discounts shouted in capitals."*
- **Interaktif ala kaca pembesar** — drag-to-rotate, hover-to-inspect (loupe), proses produksi scroll-driven dengan counter hidup.

Filosofi ini **pas untuk lapidary**: batu adalah objek fisik yang dijual lewat detail permukaan, ukuran, dan cerita proses pemotongannya.

---

## 2. Prinsip Desain (Wajib Dipatuhi di Semua Halaman)

1. **Objek dulu, UI kemudian** — foto produk mendominasi; chrome UI seminimal mungkin.
2. **Angka yang jujur** — setiap produk selalu menampilkan data konkret: berat (ct/g), dimensi (mm), origin, treatment. Format mono kecil, bukan bullet marketing.
3. **Motif bernomor** — label `01 / 02 / 03` di section, step, dan galeri. Konsisten satu gaya: Geist Mono, uppercase, tracking lebar.
4. **Satu aksen, dua aksen hangat** — brass untuk aksen utama, ember hanya untuk status penting. Tidak ada gradien warna-warni.
5. **Copy pelan, bukan berteriak** — kalimat pendek, gaya "studio note". Tanpa tanda seru, tanpa kata diskon berlebihan.
6. **Gerak yang terukur** — animasi halus (fade/slide kecil, counter angka), tidak ada bounce/parallax liar. Semua animasi punya `prefers-reduced-motion` fallback.
7. **Terang dengan strip gelap** — dasar bone (krem tulang); satu-dua section gelap (ink) untuk kontras ritme, seperti "The Bench" di template asli.

---

## 3. Design Tokens (Diekstrak Langsung dari Preview)

### 3.1 Warna (hex asli dari situs referensi)

| Token | Hex | Peran |
|---|---|---|
| `bone` | `#e9e5de` | Background utama (krem tulang hangat) — nama asli template: `paper` |
| `stone` | `#bdb8af` | Border, teks muted, background sekunder, pembatas |
| `ink` | `#121214` | Teks utama & background section gelap |
| `ink-2` | `#141415` | Varian background gelap (layer/kartu di section gelap) — nama asli: `bench` |
| `brass` | `#c9a24e` | Aksen utama: hover, badge, underline, detail kecil — nama asli: `gold` |
| `ember` | `#d9482b` | Aksen status: badge "Sold", indikator penting — nama asli: `oxide` |
| `milk` | `#ece8e1` ★ | **Teks di atas section gelap** (bukan bone!) — dipakai preset H2/H3 gelap & body gelap |
| `sketch` | `#F2EFE9` | Background "lembar sketsa" (CustomFlow stage) |
| `phold` | `#d8d2c8` | Placeholder foto sebelum load |

**Aturan opacity teks (terukur):** body text = ink dengan **72% alpha** (`#121214b8` di terang, `#ece8e1b8` di gelap) — bukan warna abu solid. Note/paragraph sekunder 66–72%; caption 60–66%.

```ts
// tailwind.config.ts (atau @theme di Tailwind v4)
colors: {
  bone:  "#e9e5de",   // nama asli template: "paper"
  stone: "#bdb8af",
  ink:   "#121214",
  "ink-2": "#141415", // nama asli template: "bench"
  brass: "#c9a24e",   // nama asli template: "gold"
  ember: "#d9482b",   // nama asli template: "oxide"
  sketch: "#F2EFE9",  // background "lembar sketsa" (CustomFlow stage)
  phold:  "#d8d2c8",  // placeholder foto sebelum load
}
```

> **Detail lengkap animasi, efek, dan transisi per halaman ada di [MOTION-SPEC.md](MOTION-SPEC.md)** — diekstrak dari kode asli situs referensi (easing tunggal `cubic-bezier(.22,1,.36,1)`, counter expo-out 1600ms, lookbook pinned horizontal, stepper sketsa, ticker hover-pause, dsb).

### 3.2 Tipografi (font asli dari situs referensi)

| Peran | Font | Cara pakai |
|---|---|---|
| **Display** | **Antonio** (Google Fonts, condensed) | Hero, judul section besar. SELALU uppercase, tracking sedikit rapat, weight 500–600. |
| **Body & UI** | **Geist** | Paragraf, tombol, navigasi, deskripsi produk. |
| **Spec / angka** | **Geist Mono** | Label `01`, baris spesifikasi (`42.6 ct · freeform`), counter, harga? (harga pakai Geist), timestamp, badge kecil. Uppercase + tracking lebar untuk label. |

```ts
// next/font/google
import { Antonio, Geist, Geist_Mono } from "next/font/google";
```

Skala tipe — **nilai persis preset asli** (responsif desktop→tablet→mobile):

| Preset | Font | Ukuran (D→T→M) | Detail |
|---|---|---|---|
| Hero/H2 section | Antonio 700 uppercase | **96 → 72 → 48px** | lh `.88em`, ls `-.005em`, paragraph-spacing 40px |
| H3 kartu (section gelap) | Antonio 700 uppercase | **40 → 34 → 30px** | lh `.94em`, ls `0`, warna `milk` |
| Body | Geist 400 | **18 → 17 → 16px** | lh `1.55em`, ls `-.006em`, ink/milk 72% |
| Small body | Geist 400 | 15px | lh `1.55em`, ls `-.004em` |
| Sub-heading kartu | Geist 500 | 17px | lh `1.25em`, ls `-.015em` |
| Judul produk (kartu & PDP) | Geist 500 | 17px | lh `1.2em`, ls `-.02em` — **bukan Antonio!** |
| Logo/wordmark | Antonio 700 | 22px | ls **`.14em`** (sangat lebar), uppercase |
| Counter angka | Antonio 700 | clamp(64→120px) | lh `.86em`, tabular-nums (lihat MOTION-SPEC) |
| Eyebrow/label section | Geist Mono 500 | 11px | ls `.07em`, uppercase — didahului nomor: `04 — Materials` |
| Spec line produk | Geist Mono 500 | 11–12px | ls `.06em`, uppercase, ink 66% |

### 3.3 Bentuk, Spasi, Motion

| Token | Nilai | Catatan |
|---|---|---|
| Radius | Foto/kartu produk **4px** · stage sketsa **6px** · pill/nav **999px** · sisanya 0 | `[T]` terukur — bukan "semua 0" |
| Border | `1px solid stone/40%` | Pembatas grid & kartu |
| Spacing section | `clamp(96px, 12vh, 160px)` vertikal | Lega, editorial |
| Grid konten | 12 kolom, `max-w` ~1280px, gutter 24px | |
| Durasi motion | 200–400ms, ease `cubic-bezier(.4,0,.2,1)` | Hover 200ms, entrance 400ms |
| Entrance | fade + translateY 12px, stagger 60ms | |

---

## 4. Bahasa Visual Khas (Signature Elements)

Elemen-elemen ini yang membuat situs terasa "Jewelwright" — wajib direplikasi:

1. **Annotation callout di foto** — garis tipis + label mono di atas foto hero/produk: `01 — Laguna agate · 42.6 ct · freeform`, `02 — Cut & polished at our bench`. (Di asli: `Round brilliant · 1.02 ct · four claws` → **adaptasi** ke data batu.)
2. **Stepper proses dengan counter hidup** — nomor step besar, deskripsi singkat, baris data mono yang berubah (lihat §6.3).
3. **Numbered lookbook** — galeri foto bernomor `01…08` dengan caption satu baris per foto.
4. **Statistik blok besar** — angka raksasa (Antonio) + caption mono kecil di bawahnya (lihat §6.7).
5. **Tombol panah** — CTA berbentuk teks + `→` (`Start a custom piece →`), plus tombol solid ink untuk CTA utama. Tidak ada tombol gradien.
6. **Hover inspect (loupe)** — kaca pembesar interaktif di foto produk: zoom mengikuti kursor, reveal detail inclusion. **Adaptasi sempurna untuk batu** — lihat §7.
7. **Nav pill frosted-glass** `[T]` — dua-dua terpisah dalam bentuk pil melayang (Logo pill + Links pill + Bag pill): `backdrop-filter: blur(18px)`, background `rgba(240,237,231,0.7)`, border 1px `rgba(255,255,255,0.55)`, radius 999. Badge count Bag: lingkaran kecil bg ink, teks milk. Logo: Antonio 700 22px ls `.14em`.

---

## 5. Peta Halaman (Sitemap)

Nav asli Aldersmith: `Shop · Collections · Custom · The bench · Care · Journal · Bag (0)`

**→ adaptasi nav Michael Lapidary:** `Shop · Collections · Custom · The Workshop · Care · Journal · Cart (n)`

| Halaman | Asal (Aldersmith) | Konten Michael Lapidary |
|---|---|---|
| `/` | Homepage 12 section | Blueprint lengkap di §6 |
| `/shop` | All pieces | Semua produk (grid + filter) |
| `/collections` | 5 koleksi | **→ Cabochons · Slabs · Rough · Finished Pieces · Parcels** |
| `/products/[slug]` | Product page (The Alder Solitaire…) | Detail batu: galeri + loupe, spec lengkap, status, Add to Cart |
| `/custom` | Custom orders | Jasa: **Pendant · Pairs · Carving · Intarsia** + form inquiry (PRD F-16/17) |
| `/the-workshop` | The bench | Proses lapidary + profil Michael (About) |
| `/care` | Care & repairs | Perawatan batu + Shipping & Returns (PRD F-22/23) |
| `/journal` (+ `[slug]`) | Journal | Artikel studio (fase 2, PRD) |
| `/contact` | Contact | Form + info studio |
| `/cart`, `/checkout/*` | *Bag hanya drawer + buy button* | **→ Deviasi sadar: full cart & checkout 3 langkah** (lihat §8) |
| `/faq`, `/privacy`, `/terms` | Legal pages | Kebijakan (PRD F-22/23/25) |

---

## 6. Blueprint Homepage (12 Section, Urutan Wajib Sama)

Urutan & proporsi mengikuti situs referensi 1:1. Tiap section: apa yang ada di asli → adaptasi kontennya.

### 6.1 Hero — full-bleed
- **Asli:** Foto full-bleed (cincin solitaire di tangan), display raksasa `MADE BY HAND / WORN FOR LIFE.`, intro 1 paragraf, 2 CTA (`Shop the collection` / `Start a custom piece`), annotation callout spesifikasi di foto.
- **→ adaptasi:** Foto makro cabochon di tangan/dop-stick dengan cahaya natural. Headline: **`CUT BY HAND / KEPT FOR LIFE.`** (kandidat lain: `FROM ROUGH, BY HAND.` / `ONE STONE AT A TIME.` — putuskan saat konten). Annotation: `01 — Laguna agate · 42.6 ct · freeform` + `02 — Slabbed, ground & polished at our bench`. CTA: `Shop new arrivals →` dan `Start a custom piece →`.

### 6.2 Interactive product viewer — 1 produk bintang
- **Asli:** Produk unggulan (The Alder Solitaire $3,880) dengan drag-to-rotate, hover-to-inspect, selector material/batu, badge nilai (hallmarked, made to order, free resizing, lifetime checks).
- **→ adaptasi:** **Satu batu unggulan minggu ini** (Admin bisa pilih: flag `featured`). Badge nilai: `100% treatment disclosed` · `Ships insured worldwide` · `14-day returns` · `One of a kind`. Harga USD. Interaksi: loupe inspect (wajib) + rotate (opsional, lihat §7.2).

### 6.3 Shop by collection
- **Asli:** `Five collections · one bench` — 5 kategori kartu dengan jumlah piece.
- **→ adaptasi:** `Three materials, one bench` atau langsung: **Cabochons (n) · Slabs (n) · Rough (n) · Finished Pieces (n) · Parcels (n)** — kartu foto + jumlah listing aktif.

### 6.4 Grid terbaru
- **Asli:** `Best sellers — Worn the most` (8 produk, harga, label made-to-order/ready-to-ship).
- **→ adaptasi:** ⚠️ "Best sellers" tidak berlaku untuk item one-of-a-kind → ganti jadi **`Fresh off the wheels — Just cut`** (8 listing terbaru). Label per kartu: `Ready to ship` / `Sold` / `Reserved`. Ini satu-satunya perubahan struktural dari asli.

### 6.5 The Workshop (section gelap)
- **Asli:** `The bench · how a ring gets made` — 5 step (Melt→Forge→Set→Polish→Hallmark), counter hidup (`Hours at the bench 00:00`, `Metal temperature 20 °C → 1,064 °C`), foto proses, ticker.
- **→ adaptasi:** `The workshop · how a stone gets cut` — 5 step standar cabochon cutting:
  `01 Slab` (saw) → `02 Preform` (shape) → `03 Grind` (wheels) → `04 Sand` (grades) → `05 Polish` (oxide).
  Counter hidup: `Hours at the wheels 00:00` (bertambah saat scroll) & `Wheel grit 80 → 50,000`. Baris data mono per step: `Laguna agate · 6.4 g · 220 grit`. Background ink, teks bone. Link ke `/the-workshop`.

### 6.6 Lookbook / galeri bernomor
- **Asli:** `Worn every day` — 8 foto lifestyle bernomor `01–08` dengan caption (`01 — The Alder Solitaire, 18k`), ditembak "on the people, on the stone, on the bench".
- **→ adaptasi:** `Where they come from` — 8 foto: batu di lokasi asalnya, makro inclusion, tangan memegang cabochon, meja kerja, slab di bawah cahaya matahari. Caption mono: `01 — Laguna agate, Mexico · slab #014`.

### 6.7 Transparency / ethics stats
- **Asli:** `Better metal, not new metal` — 4 stat besar: `100% recycled metal`, `1,240 pieces made last year`, `14 h bench hours per ring`, `0 mined metal`.
- **→ adaptasi:** `Nothing hidden, nothing guessed` — 4 stat:
  - `100%` — Treatment disclosed (dyed/stabilized ditulis apa adanya)
  - `412` — Stones cut last year *(angka riil dari Michael)*
  - `9 h` — Average hours per cabochon
  - `0` — Stones sold without origin notes
  (Angka diisi dengan data riil; strukturnya sama: angka besar Antonio + caption mono.)

### 6.8 Custom orders — 4 step
- **Asli:** `From a sketch to your hand` — 01 Talk it through (Free · no obligation) → 02 See it drawn (2 rounds of changes) → 03 We make it (3–5 weeks, photos along the way) → 04 Wear it for life (insured delivery). CTA `Start a custom piece →`.
- **→ adaptasi:** `From rough to yours` —
  `01 Talk it through` — konsultasi gratis, kirim referensi/ide (pendant, pair, carving, intarsia) — `Free · no obligation`
  `02 Pick the stone` — pilih dari koleksi kami atau kirim rough Anda — `We source or you send`
  `03 We cut it` — dipotong & dipoles di bench, foto progress dikirim — `2–6 weeks depending on the work`
  `04 It's yours` — delivered insured, dengan care card & origin note — `Insured delivery`
  CTA menuju **form custom order** (PRD F-17): `Start a custom piece →`.

### 6.9 Care
- **Asli:** `Looked after for life` — 3 layanan (resizing setahun, claw checks seumur hidup, repolish kapan saja).
- **→ adaptasi:** `Looked after for life` —
  `01 Free re-polish for a year` — gores halus dari pemakaian/setting, kami poles ulang gratis.
  `02 Setting advice for life` — panduan untuk jeweller yang akan men-setting cabochon Anda (bezel, prong, wire).
  `03 Care guides for every stone` — hardness, sensitivity, penyimpanan per mineral.
  Link ke `/care` (gabung Shipping & Returns di sana).

### 6.10 Reviews
- **Asli:** `In their words` — `4.9 from 612 orders` + 3 testimoni (nama + kutipan).
- **→ adaptasi:** format sama; skor riil dari Michael. Kutipan harus sebut detail batu (mis. *"The dimensions were exact to the tenth of a millimetre."*). Fase 1: kutipan statis dari admin; fase 2: review asli (PRD F-2).

### 6.11 Journal
- **Asli:** `From the journal` — 3 artikel (hallmarks, recycled gold, ring sizing).
- **→ adaptasi:** 3 artikel pembuka: `How to read a cabochon's measurements` · `Treatment, explained honestly` · `How a slab becomes a cabochon`. Fase 1 boleh 3 artikel statis (PRD: blog fase 2, tapi section tetap ada di homepage).

### 6.12 Newsletter + footer
- **Asli:** `Letter from the bench · monthly — First look at new pieces` (email 1×/bulan, early access seminggu, "no discounts shouted"). Footer: alamat studio, jam, email.
- **→ adaptasi:** `Letter from the workshop · monthly — New stones 48 hours before they go live.` Ini mekanik **drop** yang bagus untuk item unik. Footer: lokasi workshop Michael, jam, email, nav kecil, legal links.

---

## 7. Spesifikasi Interaksi & Motion

### 7.1 Wajib (fase 1)
| Interaksi | Detail implementasi |
|---|---|
| **Loupe inspect** | Kaca pembesar mengikuti kursor di foto produk (zoom 2–2.5×, lens 160px). Ideal untuk inclusion/garisan agate. Implement: komponen React custom + `next/image` hi-res. Label hint: `Hover to inspect`. |
| **Counter proses** | Angka Geist Mono bertambah saat section masuk viewport (scroll-driven, `framer-motion` `useScroll`): jam kerja `00:00 → 09:00`, grit `80 → 50,000`. |
| **Entrance stagger** | Fade + naik 12px, stagger 60ms antar item grid. |
| **Hover kartu produk** | Foto zoom 1.03 + caption muncul, border berubah ke brass. |
| **Ticker** | Baris teks berjalan pelan di section workshop (isi: jenis batu yang sedang dikerjakan). |
| **Transisi halaman** | Crossfade 250ms (view transitions / framer-motion). |
| **Reduced motion** | Semua di atas dinonaktifkan bila `prefers-reduced-motion`. |

### 7.2 Opsional / fase 2
- **Drag-to-rotate** — di asli untuk cincin 3D. Untuk batu: slider multi-angle foto (6–8 sisi) yang bisa di-drag, ATAU render 3D glTF batu (three.js) — mulai dari slider foto; 3D hanya jika Michael bisa ambil assetnya.
- **Selector material** (di asli: ganti emas/perak mengubah harga) → tidak dipakai; produk kita tidak punya varian. Dihapus.

---

## 8. Deviasi Sadar dari Template (Commerce)

Template asli memakai buy button sederhana (Checkout Link). Kita penuhi PRD (full e-commerce):

| Aspek | Jewelwright (asli) | Michael Lapidary (wajib) |
|---|---|---|
| Cart | Drawer "Bag" saja | Drawer cart + halaman cart, **reservasi timer** `held for 29:41` (PRD §6.3) |
| Checkout | Checkout Link per produk | 3 langkah: Address → Payment (Stripe) → Review (peta dari PearlGem) |
| Status produk | Made-to-order / ready | `Available` · `Reserved` (timer) · `Sold` (stamp ember di kartu & PDP, tetap tampil) |
| Harga | USD statis | USD (cent integer), format `$1,240.00`, tanpa diskon shouty |
| Custom order | Halaman informasi | Halaman + **form inquiry ke database** (PRD F-17) |

Visual state "Sold": stamp mono uppercase `SOLD` warna ember dengan border ember, opacity penuh di atas kartu — sesuai bahasa visual "studio log".

---

## 9. Araah Fotografi (Kualitas Konten = 50% dari Desain Ini)

Tanpa foto yang tepat, desain ini tidak akan terasa seperti referensinya. Ketentuan:

1. **Cahaya natural lembut** (window light), tanpa flash keras; bayangan lembut.
2. **Background netral** — bone/linen/stone, atau permukaan kerja nyata (meja kayu, batu asal).
3. **Tiga jenis foto per produk**: (a) makro permukaan (untuk loupe), (b) produk di tangan/tongsis untuk skala, (c) konteks (di atas slab asalnya / di bench).
4. **Foto proses**: tangan di wheels, serbuk, dop stick, cahaya samping — untuk section The Workshop & lookbook.
5. **Format caption wajib**: `NN — Mineral, locality · weight` (mono, uppercase, kecil).
6. Disarankan sesi foto batch 1×/bulan + standar retouch minimal (jangan over-sharpen permukaan batu).

---

## 10. Implementasi Next.js

| Kebutuhan | Pendekatan |
|---|---|
| Font | `next/font/google` — `Antonio` (display), `Geist` (sans), `Geist_Mono` (mono); variable CSS `--font-display/sans/mono` |
| Token warna | Tailwind v4 `@theme` (atau `tailwind.config.ts`) — nilai §3.1 persis |
| Motion | `framer-motion` (entrance, counter, ticker); `motion-reduce:` variants |
| Gambar | `next/image`, blur placeholder, `sizes` disiplin; foto loupe versi ≥1600px |
| Ikon | Garis tipis 1.5px (Lucide) — panah `→` pakai glyph teks, sesuai referensi |
| Komponen inti | `SiteHeader`, `HeroAnnotated`, `FeaturedStone`, `CollectionCards`, `ProductCard(status)`, `ProcessStepper(counters)`, `NumberedGallery`, `StatBlock`, `CustomSteps`, `Reviews`, `JournalTeaser`, `NewsletterSignup`, `SiteFooter`, `CartDrawer(timer)`, `CheckoutFlow(3 langkah)`, `LoupeInspect` |
| Halaman | Sesuai §5; homepage section sesuai §6 urut 1–12 |
| SEO | JSON-LD `Product` (harga USD, availability) + `Organization`; metadata per halaman |

**Definisi selesai (DoD) visual:** Dibanding live preview Aldersmith, situs Michael Lapidary harus: (1) struktur homepage & halaman identik urutan dan proporsinya; (2) token warna & font persis §3; (3) motif angka/mono/spesifikasi tampil di semua titik yang disebut; (4) interaksi §7.1 jalan (dengan reduced-motion); (5) deviasi §8 diterapkan penuh; (6) konten 100% lapidary — tidak ada sisa istilah perhiasan asli.

---

## 11. Checklist Acceptance Visual

- [ ] Hero: foto makro batu + `CUT BY HAND / KEPT FOR LIFE.` + annotation callout mono
- [ ] Loupe inspect bekerja di viewer produk & PDP
- [ ] Stepper workshop: 5 step + counter hidup (jam & grit) di section gelap
- [ ] Grid `Fresh off the wheels` 8 produk dengan status badge (Available/Reserved/Sold)
- [ ] Stat transparency 4 blok angka besar + caption mono
- [ ] Custom orders 4 step → CTA ke form inquiry (tersimpan ke DB)
- [ ] Cart drawer dengan timer reservasi
- [ ] Checkout 3 langkah + Stripe
- [ ] Newsletter `48 hours before they go live`
- [ ] Footer lengkap + halaman Care (gabung Shipping & Returns)
- [ ] Semua font: Antonio / Geist / Geist Mono; semua warna dari 6 token §3.1
- [ ] `prefers-reduced-motion` menghormati semua animasi
- [ ] Lighthouse ≥ 90 mobile; LCP < 2.5s
