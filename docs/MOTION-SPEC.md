# MOTION-SPEC — Animasi, Efek & Transisi (Michael Lapidary)

| | |
|---|---|
| **Sumber** | Jewelwright live preview — https://sparkling-tangerine-321189.framer.app/ |
| **Metode** | **Diekstrak dari kode asli situs** (HTML + modul JS: `JwTicker`, `JwCounters`, `JwLookbook`, `JwCustomFlow`, `JewelwrightMaking`) — angka di dokumen ini adalah nilai sungguhan, bukan perkiraan |
| **Tanggal** | 12 November 2026 (revisi 2 — hasil audit putaran kedua) |
| **Dokumen induk** | [DESIGN-SPEC.md](DESIGN-SPEC.md) · [PRD.md](PRD.md) |

> **Legenda:** `[T]` = terukur dari kode asli (pakai nilai persis). `[I]` = inferensi penempatan (nilai benar, posisi pemakaian disimpulkan dari observasi). Semua wajib diikuti agar hasil mirip referensi.

---

## 1. Fondasi Motion (Design System Asli)

Diekstrak langsung dari source komponen (objek design system yang sama dipakai semua komponen):

```js
// [T] Nama token resmi template + nilai persis
paper:  "#E9E5DE"   // background utama (di DESIGN-SPEC: "bone")
ink:    "#121214"   // teks & section gelap
bench:  "#141415"   // varian gelap
stone:  "#BDB8AF"   // muted/border
gold:   "#C9A24E"   // aksen
oxide:  "#D9482B"   // aksen hangat (nomor, counter, aksen ticker)
// warna tambahan hasil ekstraksi:
sketch: "#F2EFE9"   // background "stage" sketsa (CustomFlow)
phold:  "#d8d2c8"   // placeholder background foto sebelum load

display: "Antonio", "Arial Narrow", sans-serif
sans:    "Geist", ui-sans-serif, system-ui, sans-serif
mono:    "Geist Mono", ui-monospace, Menlo, monospace

out: cubic-bezier(.22, 1, .36, 1)   // [T] EASING TUNGGAL situs ini
```

**Font weights yang dimuat (persis):** Antonio `600,700` · Geist `400,500,600` · Geist Mono `400,500`.

**Aturan easing:** satu-satunya curve yang dipakai di seluruh situs adalah `out` di atas (expo-out-like). Semua `transition` di bawah memakainya kecuali yang diberi `linear` (ticker) atau `opacity .6s` (plain).

---

## 2. Katalog Komponen Motion (Spesifikasi Terukur)

### 2.1 Ticker — marquee teks berjalan (`JwTicker`) `[T]`

| Parameter | Nilai asli |
|---|---|
| Font | `700 {size}px/1 Antonio`, uppercase, letter-spacing `-0.005em` |
| Size default | 44px |
| Separator | `✦` — fontSize `0.42em`, warna **oxide**, `translateY(-0.1em)` |
| Gap antar item | `0.6 × size` (kiri-kanan, termasuk padding track) |
| Track | Konten **diduplikasi 2×** (`a` + `b`), `width: max-content` |
| Keyframes | `@keyframes jwTick { to { transform: translateX(-50%) } }` — `linear infinite` |
| Durasi | `max(10, panjangTeks × size × 0.5 / speed)` detik; param `speed` default **60** (px/detik) |
| Instance di homepage | 3 ticker dengan durasi **57.29s**, **42.35s**, **32.38s** |
| **Hover** | `animation-play-state: paused` — ticker BERHENTI saat hover |
| Reduced motion | `animation: none` |
| Isi default | `Recycled 18k gold and sterling silver ✦ Hallmarked at the assay office ✦ Made to order in 3–4 weeks ✦ Free resizing for a year ✦ Lifetime claw checks` |

**→ adaptasi konten (Michael Lapidary):** `100% treatment disclosed ✦ One of a kind, cut at our bench ✦ Ships insured worldwide ✦ 14-day returns ✦ New stones every week`

### 2.2 Counter statistik — angka menghitung naik (`JwCounters`) `[T]`

| Parameter | Nilai asli |
|---|---|
| **Trigger** | Viewport: elemen terlihat ≥ **25%** dari tingginya (`top < vh×0.75 && bottom > 0`); polling `setInterval 150ms`; fallback timeout **8s** |
| **Count-up** | **1600ms**, easing **expo-out** `1 − 2^(−10t)`, via `requestAnimationFrame` |
| Format angka | `toLocaleString('en-US')` (1,240) + `font-variant-numeric: tabular-nums` |
| Font angka | `700 clamp(64px, 7.4vw, 120px)/0.86 Antonio`, letter-spacing `-0.01em` |
| Suffix (`%`, ` h`) | `<small>` **0.42em**, warna **oxide**, margin-left 4px |
| Label | `500 11px/1 Geist Mono`, letter-spacing `0.07em`, uppercase, margin `18px 0 10px` |
| Note | `14.5px/1.5 Geist`, opacity `.72`, `max-width: 30ch` |
| **Garis atas** | hairline 1px ink/18% — `scaleX(0→1)`, origin kiri, `transition: transform 1.2s out`, **stagger `90ms` per kolom** (`transitionDelay: t*90ms`) |
| Layout | grid `repeat(auto-fit, minmax(220px,1fr))`, gap `0 clamp(16px,2.4vw,32px)`, sel padding `22px 0 8px` |
| Reduced motion | Langsung ke angka final, garis tanpa transition |
| Data default | `100% Recycled metal` · `1,240 Pieces made last year` · `14 h Bench hours per ring` · `0 Mined metal` |

**→ adaptasi:** `100% Treatment disclosed` · `412 Stones cut last year` · `9 h Hours per cabochon` · `0 Undisclosed treatments` (angka riil dari Michael).

### 2.3 Lookbook — galeri horizontal pinned (`JwLookbook`) `[T]`

**Mekanisme inti (desktop):** section **di-pin** (`position: sticky; top:0; height:100vh; min-height:560px; overflow:hidden`) sementara scroll vertikal menggerakkan track horizontal.

| Elemen | Spesifikasi |
|---|---|
| **Progres scroll** | `pin = clamp(−top / (height − vh))` — dihitung manual via rAF (loop) + polling 250ms; TIDAK pakai lib scroll |
| **Track horizontal** | `translate3d(−pin × (scrollWidth − vw) px, 0, 0)` — `will-change: transform` |
| **Judul raksasa background** | Antonio `700 clamp(120px, 19vw, 300px)/0.8`, uppercase, **opacity 0.08**, `white-space: nowrap` — parallax **0.35×** dari kecepatan track (`−pin × i × 0.35`) |
| **Parallax dalam frame** | Setiap img: `scale(1.18)` tetap + `translateX(−offset × 8%)` — offset = jarak horizontal pusat frame dari pusat viewport (−0.5…+0.5). Gambar "bergeser" di dalam bingkainya |
| **Counter** | `01 / 08` — update jadi `1 + floor(pin × count × 0.999)`, `padStart(2,'0')`, Geist Mono |
| **Progress bar** | 180px, hairline 1px ink/18%, inner `scaleX(pin)` origin kiri |
| Foto (8 buah) | Height = `ratio × 86vh`, width = `ratio2 × 86vh × 1.35`; rasio per foto `[[.58,.44],[.46,.68],[.64,.5],[.42,.62],[.56,.42],[.5,.74],[.62,.48],[.46,.64]]` |
| **Offset vertikal berjenjang** | `marginBottom: t % 3 × 3vh` (pola 0/3/6vh berulang) — foto bottom-aligned dengan undulasi |
| Track padding | `padding-left: 34vw` (ruang kosong besar di awal), gap `clamp(24px, 3vw, 56px)`, `padding-bottom: 13vh`, items `align-end` |
| Foto | radius **4px**, placeholder `#d8d2c8`, eager load 3 pertama, lazy sisanya |
| Caption | `500 11px/1.2 Geist Mono`, ls `0.06em`, uppercase, ink/66 — **nomor `01` warna oxide** |
| Kicker / H2 / Note | mono 11px ink/60 · Antonio `700 clamp(44px,5.4vw,84px)/0.9` · 15px/1.5 max-w 340px ink/72 |
| Head position | absolute, top `clamp(96px, 14vh, 140px)`, sisi `clamp(16px, 3.4vw, 48px)`, space-between |
| **Breakpoint mobile** | `width < 810px` ATAU tinggi section > `1.6 × vh` → mode **scroll-snap carousel**: `overflow-x: auto`, `scroll-snap-type: x mandatory`, `scroll-snap-align: start`, gap 14px, scrollbar disembunyikan, foto `min(64vw, 380px)`, judul raksasa & progress **di-hide**, semua parallax `transform: none !important` |

### 2.4 CustomFlow — stepper 4 langkah scroll-driven (`JwCustomFlow`) `[T]`

**Mekanisme inti:** dua kolom di-pin — kiri daftar langkah, kanan "lembar sketsa" yang berganti visual per langkah.

| Elemen | Spesifikasi |
|---|---|
| Pin | `sticky top:0; height:100vh; min-height:620px`, grid `minmax(320px,5fr) 7fr`, gap `clamp(24px,4vw,72px)`, padding-top `clamp(80px,10vh,104px)` |
| H2 | Antonio `700 clamp(44px, 5vw, 78px)/0.88` |
| **Langkah (li)** | border-top 1px ink/14%, grid `44px 1fr`, padding `12px 0` |
| Status aktif/nonaktif | Nonaktif: **opacity .42**; aktif: opacity 1 — `transition: opacity .5s out` |
| **Body langkah (accordion)** | `max-height: 0 → 120px` + margin-top 6px saat aktif — `transition: max-height .7s out, margin .7s out` (reveal ke bawah saat langkah menyala) |
| **Progress bar per langkah** | hairline **2px** ink/8%, inner `scaleX(1)` saat langkah lewat, `scaleX(0)` sebelum — mapping `scaleX(t<i ? 1 : t>i ? 0 : a)` (animasi penuh saat langkah INI berjalan) |
| **Opacity window per langkah** | step aktif pada window `t×n ∈ [1.1, 1.8]` (fungsi clamp b) — tiap langkah menyala bergantian mengikuti progres scroll |
| Nomor & meta | nomor `500 11px/1.6 Geist Mono` · meta `500 10.5px Geist Mono` |
| H3 langkah | `600 19px/1.2 Geist` |
| **Stage (lembar sketsa)** | height `min(70vh, 660px)`, radius **6px**, bg `#F2EFE9`, shadow: `inset 0 1px 0 rgba(255,255,255,.7)` + `0 40px 80px -50px rgba(40,30,20,.45)` (bayangan kertas) |
| **Grid kertas grafik** | overlay 2 linear-gradient garis 1px ink/6%, tile `24px × 24px` |
| **Wipe reveal visual** | `.ph { clip-path: inset(0 100% 0 0) }` (wipe kiri→kanan) dan `.ph.b { clip-path: inset(100% 0 0 0) }` (wipe bawah→atas) — dibuka sesuai langkah, `transition: clip-path .9s/1s out` |
| Ganti visual per langkah | Label stage: `""` → `Sketch 02 · with measurements` → `Finished · 18k, 1.02 ct` → `Worn` (sketsa → foto jadi → foto dipakai) |
| Tag & caption lembar | tag kiri-atas `500 11px Geist Mono` · caption bawah `ALDERSMITH · CUSTOM 0419 · SHEET 2 OF 2`, opacity .55 |
| **CTA pill** | height 46px, radius 999, padding `0 20px`, gap 10px — **hover: `translateY(-2px)`**, **active: `scale(0.97)`**, focus-visible: `outline 2px` |

**→ adaptasi konten langkah:** 01 Talk it through (Free · no obligation) → 02 Pick the stone (We source or you send) → 03 We cut it (2–6 weeks, progress photos) → 04 It's yours (Insured delivery). Label stage: `Rough #0419` → `Preform · 42.6 ct` → `Polished · 42.6 ct` → `On its new home`. Caption lembar: `MICHAEL LAPIDARY · CUSTOM 0419 · SHEET 2 OF 2`.

### 2.5 Making — viewer 3D + bench sequence (`JewelwrightMaking`) `[T]`

Modul 606KB yang **mengandung Three.js (WebGL)**:

- **Hero 3D viewer** (homepage section 2): objek cincin 3D asli — **drag-to-rotate** (pointer drag memutar objek WebGL), **hover-to-inspect** (zoom/loupe), **selector material/batu** yang mengubah material 3D dan harga secara live.
  - **→ keputusan adaptasi:** objek 3D ring diganti salah satu dari: (a) **slider multi-angle foto** yang bisa di-drag (paling realistis untuk batu), atau (b) WebGL bila Michael bisa menyediakan scan/glTF batu. Mekanik drag + hint text (`Drag to turn · hover to inspect`) tetap dipertahankan.
- **Bench sequence** (section 5 homepage + halaman `/the-bench`): urutan 5 langkah scroll-driven — `01 Melt → 02 Forge → 03 Set → 04 Polish → 05 Hallmark` — dengan **dua counter hidup**: `Hours at the bench 00:00` (mm:ss menghitung naik mengikuti scroll) dan `Metal temperature 20 °C → 1,064 °C` (angka tween). Baris data mono per langkah: `Recycled 18k grain · 6.4 g · 1,064 °C`.
  - **→ adaptasi:** langkah `01 Slab → 02 Preform → 03 Grind → 04 Sand → 05 Polish`; counter `Hours at the wheels 00:00` + `Wheel grit 80 → 50,000`; baris data `Laguna agate · 6.4 g · 220 grit`.

### 2.6 Inventaris CSS Transition (nilai persis dari HTML) `[T]`

| Deklarasi (persis) | Kegunaan [I] |
|---|---|
| `transform .45s cubic-bezier(.22,1,.36,1)` ×3 | Hover zoom kartu produk/koleksi |
| `transform 1.6s cubic-bezier(.22,1,.36,1)` | Entrée elemen hero besar (settle lambat) |
| `transform 1.2s cubic-bezier(.22,1,.36,1)` | Garis counter (cocok dgn JwCounters 1.2s) |
| `opacity .7s out, transform .9s out, clip-path .9s out` | **Kombo reveal foto/hero**: fade + rise + wipe |
| `clip-path 1s cubic-bezier(.22,1,.36,1)` | Wipe reveal gambar |
| `opacity .6s` ×2 · `opacity .5s out` | Crossfade konten/langkah |
| `max-height .7s out, margin .7s out` | Accordion FAQ (halaman Care) & body langkah |
| `border-color .3s, background .3s, transform .4s out` | Tombol hover |
| `background .35s out, color .35s` | Tombol/CTA hover |
| `color .4s` · `color .15s` | Link hover |
| `transition:var(--framer-input-focused-transition)` | Focus ring input form |

**Radius yang terukur:** foto/produk **4px** · stage sketsa **6px** · CTA **999 (pill)** · sisanya 0.

---

## 3. Peta Motion Per Halaman ("setiap hero dicatat")

### 3.1 `/` — Homepage
| Section | Hero/konten | Motion |
|---|---|---|
| **Hero** | Foto full-bleed + display raksasa `MADE BY HAND / WORN FOR LIFE.` + 2 annotation callout + 2 CTA | Entrance: fade-up teks + **kombo reveal foto** (opacity .7s + transform .9s + clip-path .9s) `[I]`; settle `transform 1.6s` `[I]`; annotation muncul delay setelah foto `[I]` |
| Interactive viewer | Produk bintang 3D (three.js) + badges | **Drag-to-rotate**, **hover-to-inspect**, selector material mengubah harga live; hint `Drag to turn · hover to inspect` |
| Collections | 5 kartu kategori (foto + count) | Hover: `transform .45s` zoom + arrow shift `[I]` |
| Grid terbaru | 8 Product card (2 foto, badge, harga) | Hover: swap foto utama↔kedua (`opacity .6s`) + zoom `.45s` `[I]`; badge status |
| **The bench (gelap)** | Making sequence 5 langkah + 2 counter hidup + ticker | Scroll-driven langkah; counter mm:ss & suhu; ticker `jwTick` |
| Lookbook | 8 foto pinned horizontal | Spesifikasi penuh §2.3 |
| Custom flow | 4 langkah + stage sketsa | Spesifikasi penuh §2.4 |
| Stats | 4 counter | Spesifikasi §2.2 |
| Care / Reviews / Journal / Newsletter | 3+3+3 kartu + form | Entrance stagger `90ms` `[I]`; hover kartu `.45s` |
| Footer | — | Link hover `color .15s/.4s` |

### 3.2 `/shop` — Hero katalog
- **Struktur:** kicker `Shop · 12 pieces · made in our studio` (mono) → H1 `All pieces` (Antonio besar) → intro 1 paragraf → **5 baris link kategori dengan panah `→`** → grid produk 2 kolom (foto rasio berselang landscape/portrait).
- **Motion:** entrance fade-up `[I]`; link kategori: panah bergeser `→` saat hover + `color .15s`; Product card: **2 foto — hover swap** (`opacity .6s`) + zoom `transform .45s`; badge (`Made to order`/`Ready to ship` → adaptasi `One of a kind`/`Ready to ship`/`Reserved`/`Sold`); setelah grid: **ticker** (32–57s); band custom CTA; 4 promises; reviews; footer besar.

### 3.3 `/custom` — Hero jasa
- **Struktur:** kicker `Custom orders · from $900` → H1 `Made for one person` → intro → foto → **JwCustomFlow pinned** (§2.4) → `Four ways to start` (4 kartu 01–04) → `Pricing guide` (4 baris harga "from $X") → **form** (name/email/idea/budget) → reviews.
- **Motion:** stepper pinned dengan wipe sketsa & accordion; kartu "Four ways" hover `.45s`; form: focus ring via `--framer-input-focused-transition`; CTA pill hover `-2px` / active `.97`.
- **→ adaptasi:** kicker `Custom work · pendant, pairs, carving, intarsia`; pricing: `Pendants from $X · Pairs from $X · Carvings from $X · Intarsia from $X`.

### 3.4 `/the-bench` (→ `/the-workshop`) — Hero proses
- **Struktur:** kicker `The bench · Studio 4, Anchor Yard` → H1 `Four people, one bench` → intro → **Making sequence penuh** (counter `Hours at the bench`, `Metal temperature`) → `The tools` (4 kartu foto 01–04) → **JwCounters** (4 stat) → sumber material (3 baris) → CTA visit.
- **Motion:** bench counter scroll-driven; kartu tools hover `.45s`; counter stats expo-out 1600ms + garis stagger 90ms.
- **→ adaptasi:** kicker `The workshop · Michael Lapidary`; H1 `One man, one set of wheels`; tools: `Saw & slabbing` · `Dop sticks` · `Diamond wheels & laps` · `Polish & loupe` (disesuaikan alat nyata Michael).

### 3.5 `/care` — Hero perawatan
- **Struktur:** kicker `Care and repairs` → H1 `Looked after for life` → intro → `Care by material` (3 kartu) → `What we do, and what it costs` (4 baris) → `Three steps, fully insured` → **FAQ accordion** → CTA.
- **Motion:** FAQ accordion `max-height .7s + margin .7s` (terukur — cocok dengan CustomFlow li); kartu hover `.45s`.
- **→ adaptasi:** care per material: `Agate & jasper` · `Turquoise (stabilized)` · `Opal & soft stones` (hardness, air, penyimpanan); services: `Re-polish · free first year`, `Setting advice · for life`, `Re-finish slab faces`, `Care cards · always`.

### 3.6 `/products/[slug]` — Hero produk
- **Struktur:** **2 foto hero berdampingan** (rasio berbeda) → harga (h4) + deskripsi 1 kalimat → **spec rows** (`Metal → 18k recycled…`, `Stone → 1.02 ct…`) → baris promises → `About this piece` (3 blok: How it is made / Materials / Delivery and care) → `With this piece` (4 layanan) → **`How it's made` teaser** (foto + `See every step, scrolled` → link bench) → `You may also like`.
- **Motion:** galeri dengan **loupe inspect**; hover zoom `.45s`; spec rows reveal; teaser bench membawa scroll-sequence.
- **→ adaptasi spec rows:** `Stone → Laguna agate, Mexico` · `Weight → 42.6 ct` · `Dimensions → 38 × 26 × 7 mm` · `Treatment → Natural, undisclosed-free` · `Status → One of a kind`. "You may also like" → `Also from this batch/collection` (pola Bisque Studio).

### 3.7 `/journal`, `/contact`, `/collections` *(hasil audit putaran 2 — terukur)*

**`/journal`:**
- Hero: kicker `Journal` → H1 `Notes from the bench` → intro → daftar artikel **baris berselang** (kicker kategori: Craft/Materials/Guides/Care/Custom/Studio · judul · excerpt · **read time** `5 min read` mono) — thumbnail berselang kiri/kanan `[I]` dari urutan gambar.
- Setelah daftar: **ticker ×6** (baris berulang) → band CTA guide (`Not sure of your size?` → adaptasi: `Not sure which cabochon fits your setting?` dengan link guide ukuran) → band newsletter (`One email a month`) → footer.
- Motion: hover artikel `.45s` + arrow `[I]`; kicker kategori warna stone/muted.
- **→ adaptasi artikel:** `How to read a cabochon's measurements` · `Treatment, explained honestly` · `Caring for agate & turquoise` · `A week at the wheels` · `Commission: an intarsia box, start to finish`.

**`/contact`:**
- Hero: kicker `Visit the studio` → H1 `Come and see the bench` → intro → foto besar → **grid info 4 sel** (Address / Opening hours / Email / Getting here — masing-masing kicker mono + h4) → form `Book a visit` (name/email/preferred day/notes + note `We confirm by email within one working day.`) → `What happens at a visit` 3 kartu bernomor 01–03 → band `Can't visit? Start a custom piece online`.
- Motion: form focus ring; kartu hover `.45s`; entrance stagger.
- **→ adaptasi:** Michael mungkin tanpa toko fisik → sel info: `Email` / `Response time` / `Workshop` / `Shipping from`; form jadi `Start a conversation` (atau langsung ke custom form).

**`/collections`:**
- **Penting — halaman ini ME-reuse komponen homepage:** bukti `modulepreload` memuat `JwLookbook` + `JwCounters`. Struktur: hero (kicker `Collections` + H1 `Five collections` + intro) → grid kartu koleksi → **JwLookbook** (§2.3 utuh) → **JwCounters** (§2.2 utuh) → band custom CTA (`Can't find it? We'll draw it`) → teaser journal.
- **→ adaptasi:** H1 `Five categories` atau `From rough to finished`; CTA: `Can't find the stone? We'll cut it`.

**Temuan tambahan audit:** di template, tombol **`Bag` di nav hanya badge + link ke `/shop`** (tidak ada halaman/drawer cart nyata) — konfirmasi bahwa **full cart + reservasi timer kita adalah deviasi sadar** (DESIGN-SPEC §8) dan harus dibangun dari nol.

---

## 4. Pola Hover & Interaksi Global

| Elemen | Interaksi (nilai persis) |
|---|---|
| **Nav pill** | Pil melayang terpisah (Logo/Links/Bag): `blur(18px)` + bg `rgba(240,237,231,0.7)` + border putih 55% + radius 999; hover item `color .15s`; badge count bg ink lingkaran kecil |
| Kartu produk/koleksi | foto `transform .45s out` (zoom 1.03–1.05 `[I]`); swap foto kedua `opacity .6s`; arrow `→` bergeser 4px `[I]` |
| CTA pill | hover `translateY(-2px)`; **active `scale(0.97)`**; focus `outline 2px` |
| Tombol solid | `border-color .3s, background .3s, transform .4s` + `background .35s, color .35s` |
| Link | `color .15s` (nav) · `color .4s` (konten) |
| Ticker | **hover = pause** |
| Form input | focus ring via var transition |
| Accordion | `max-height .7s out` |
| Scroll cue | panah kecil berdenyut halus `[I]` — verifikasi di preview |

---

## 5. Reduced Motion & Aksesibilitas (Perilaku Asli) `[T]`

- Ticker: `@media (prefers-reduced-motion: reduce) { animation: none }`.
- Counter: bila reduced-motion → **langsung angka final** (tanpa count-up), garis tanpa transition.
- Framer appear: attribute `data-framer-appear-animation="no-preference"` — animasi entrance dimatikan untuk preferensi reduced.
- Semua interaktif punya `:focus-visible` outline 2px.
- Ticker pakai `role="marquee"` + `aria-label` gabungan item; judul raksasa lookbook `aria-hidden`.
- Implementasi Next.js wajib: semua animasi custom dibungkus cek `prefers-reduced-motion` + `motion-reduce:` variant Tailwind.

---

## 6. Implementasi Next.js

| Motion asli | Implementasi |
|---|---|
| Ticker | Komponen React + CSS keyframes persis (§2.1) — murni CSS, `animation-play-state: paused` on hover |
| Counter | `useInView` (threshold .25) + `requestAnimationFrame` 1600ms expo-out `1−2^(−10t)`; **jangan** pakai spring — pakai tween/rAF agar identik |
| Lookbook pinned | `framer-motion` `useScroll({target, offset:["start start","end end"]})` + `useTransform`; fallback polling 250ms tidak perlu. Mobile: scroll-snap CSS murni via matchMedia 810px |
| CustomFlow pinned | Pola sama dengan Lookbook; accordion step pakai `max-height` CSS transition `.7s`; wipe via `clip-path` transition `.9s` |
| Bench counters | `useTransform` scroll → format mm:ss (`Hours 00:00`) + nilai grit; tabular-nums |
| Hero 3D | Fase 1: drag-slider multi-angle (pointer events + translateX antar frame foto) + hint `Drag to turn · hover to inspect`. Fase 2 (opsional): three.js |
| Loupe inspect | Komponen custom: lens 160px, zoom 2–2.5×, ikuti kursor, hanya pointer:fine |
| Entrance global | `framer-motion` `whileInView` fade-up 12px, durasi .4s–.6s, stagger 90ms, easing `cubic-bezier(.22,1,.36,1)` |
| Reveal foto | `clip-path: inset(0 100% 0 0)` → `inset(0 0 0 0)` transition `.9s out` saat in-view |

**Urutan file yang dibangun:** token §1 → komponen dasar (Ticker, Counter, Reveal) → Lookbook & CustomFlow → Making/bench → loupe → polish detail hover.

---

## 7. Checklist QA Motion

- [ ] Easing **semua** elemen = `cubic-bezier(.22,1,.36,1)` (kecuali ticker `linear`)
- [ ] **Nav pill frosted-glass** (blur 18, bg 70%, border putih 55%) + badge count ink
- [ ] **Teks di section gelap = `#ece8e1` (milk)**, body 72% alpha — bukan `#E9E5DE`
- [ ] Skala tipe responsif persis preset: H2 96/72/48 · H3 40/34/30 · body 18/17/16 · logo ls .14em
- [ ] Ticker: duplikat track, translateX(-50%), hover-pause jalan, durasi terasa 30–60s
- [ ] Counter: mulai tepat saat 25% terlihat, 1600ms expo-out, format `en-US`, suffix oxide
- [ ] Garis atas counter: scaleX 1.2s + stagger 90ms
- [ ] Lookbook: pin sticky, judul raksasa parallax 0.35× opacity 0.08, parallax gambar ±8% scale 1.18, counter 01/08 live, progress bar, stagger 0/3/6vh, mobile scroll-snap
- [ ] CustomFlow: pin 2 kolom, langkah opacity .42→1, accordion max-height .7s, progress 2px per langkah, wipe sketsa kiri→kanan & bawah→atas, stage grid 24px + shadow kertas, CTA hover -2px / active .97
- [ ] Bench: counter mm:ss + grit tween mengikuti scroll, 5 langkah
- [ ] PDP: 2 foto hero, spec rows, loupe inspect jalan
- [ ] Kartu: hover swap foto (opacity .6s) + zoom .45s
- [ ] FAQ accordion .7s
- [ ] `prefers-reduced-motion`: ticker mati, counter langsung final, entrance mati
- [ ] Focus-visible outline 2px di semua interaktif
