# Penilaian Template Desain — Michael Lapidary

| | |
|---|---|
| **Referensi** | [Framer Marketplace — Templates](https://www.framer.com/marketplace/templates/) |
| **Tanggal** | 12 November 2026 (revisi 2 — gelombang pencarian kedua) |
| **PRD terkait** | [PRD.md](PRD.md) |

> **Catatan penting:** Website dibangun dengan **Next.js + PostgreSQL**, bukan Framer. Template di bawah dinilai sebagai **referensi desain** (layout, tipografi, palet warna, struktur section, pola UX) yang akan ditiru/diadaptasi saat membangun komponen Next.js — bukan sebagai solusi siap pakai. Template yang bergantung pada Shopify/Frameship tetap berguna untuk layout-nya, karena commerce kita custom (Stripe).
>
> **Total 16 template** dievaluasi dalam dua gelombang pencarian (jewelry, gemstone, arts & crafts, craft/studio, e-commerce roundup). Kandidat penguat gelombang 2: Bisque Studio, All Natural, Handsel, Tsubame, Fossil, Fieldstone, Aurelle, Boutiq/Kanva/Essentia (dari roundup).

---

## 1. Kriteria Penilaian

Kriteria diturunkan langsung dari kebutuhan PRD:

| Kriteria | Bobot | Alasan |
|---|---|---|
| **Kecocokan estetika/brand** | 30% | Batu semi-presiusi butuh mood *earthy/quiet-luxury/editorial* yang menonjolkan warna & tekstur batu — bukan "bling" perhiasan mewah berlebihan. |
| **Kelengkapan e-commerce** | 25% | Shop grid, halaman produk, cart, alur checkout — sebagai peta halaman yang akan dibangun. |
| **Showcase produk one-of-a-kind** | 20% | Setiap batu unik: butuh galeri foto besar, zoom/makro, layout yang memperlakukan 1 item sebagai "bintang". |
| **Story & craft pages** | 15% | PRD butuh About/proses lapidary/portofolio + halaman jasa custom (pendant, pair, carving, intarsia). |
| **Adaptabilitas ke Next.js** | 10% | Struktur section & pola komponen yang realistis direplikasi di React/Tailwind. |

Skor 1–10 per kriteria; total = jumlah tertimbang.

---

## 2. Hasil Penilaian (Ringkas)

| Rank | Template | Harga | Estetika (30%) | E-comm (25%) | Showcase (20%) | Story (15%) | Adapt. (10%) | **Total** |
|---|---|---|---|---|---|---|---|---|
| 🥇 1 | **[Jewelwright](https://www.framer.com/marketplace/templates/jewelwright)** | Free | 9 | 6 | 10 | 10 | 9 | **8.6** |
| 🥈 2 | **[Bisque Studio](https://www.framer.com/marketplace/templates/bisque-studio)** ★baru | $79 | 8.5 | 7 | 7 | 8 | 9.5 | **7.9** |
| 🥉 3 | **[Celesse](https://www.framer.com/marketplace/templates/celesse)** | Free | 8.5 | 6.5 | 7.5 | 7 | 8 | **7.5** |
| 🥉 3 | **[Moss & Stone](https://www.framer.com/marketplace/templates/moss-stone)** | Free | 9 | 6.5 | 7.5 | 6 | 8 | **7.5** |
| 🥉 3 | **[Charmant](https://www.framer.com/marketplace/templates/charmant)** | Free | 8 | 7 | 8 | 6.5 | 8 | **7.5** |
| 🥉 3 | **[PearlGem](https://www.framer.com/marketplace/templates/pearlgem)** | $80 | 7 | 9.5 | 7.5 | 5 | 7.5 | **7.5** |
| 7 | **[All Natural](https://www.framer.com/marketplace/templates/all-natural)** ★baru | $79 | 8 | 8.5 | 7 | 4 | 6.5 | **7.2** |
| 8 | **[Pottery](https://www.framer.com/marketplace/templates/pottery)** | Free | 9.5 | 3 | 6 | 9 | 7.5 | **6.9** |
| 8 | **[Handsel](https://www.framer.com/marketplace/templates/handsel)** ★baru | $69 | 9 | 3.5 | 6.5 | 9 | 7 | **6.9** |
| 10 | **[Tsubame](https://www.framer.com/marketplace/templates/tsubame)** ★baru | $59 | 9 | 1 | 8 | 9 | 7.5 | **6.7** |
| 11 | **[Caelora](https://www.framer.com/marketplace/templates/caelora)** | $59 | 7.5 | 5.5 | 7 | 5 | 6.5 | **6.4** |
| 12 | **[Jewelix](https://www.framer.com/marketplace/templates/jewelix)** | Free | 7 | 5.5 | 6.5 | 5.5 | 7 | **6.3** |
| 13 | **[NORELLE](https://www.framer.com/marketplace/templates/norelle)** | Free | 7.5 | 4.5 | 6.5 | 5 | 6 | **6.0** |
| 13 | **[Basalt](https://www.framer.com/marketplace/templates/basalt)** | $79 | 7 | 5 | 7 | 4 | 6 | **6.0** |
| 15 | **[Fossil](https://www.framer.com/marketplace/templates/fossil)** ★baru | $79 | 6.5 | 6 | 6.5 | 3.5 | 6 | **5.9** |
| 16 | **[ARTIACT](https://www.framer.com/marketplace/templates/artiact)** | Free | 7 | 4.5 | 6 | 4.5 | 6.5 | **5.8** |
| 16 | **[Aurelle](https://www.framer.com/marketplace/templates/aurelle)** ★baru | Free | 7.5 | 4 | 6.5 | 4.5 | 6 | **5.8** |

Tidak dinilai (di luar lingkup): [Fieldstone](https://www.framer.com/marketplace/templates/fieldstone) (konstruksi/renovasi — namanya saja yang "batu"), Boutiq/Kanva/Essentia/Axiom/Blockhaus (luxury fashion/tech/B2B — profil sama dengan yang sudah dinilai: Shopify-bound, tanpa craft story).

---

## 3. Catatan Detail Per Template

### 🥇 1. Jewelwright — 8.6 ⭐ (Rekomendasi Utama)
**Free · untuk pembuat perhiasan handmade / goldsmith**
- **Kenapa paling cocok:** Ini satu-satunya template yang didesain untuk *pembuat* (maker), bukan sekadar *penjual perhiasan*. Strukturnya nyaris peta 1:1 untuk Michael Lapidary:
  - Halaman **Custom Orders** → langsung memetakan fitur F-16–F-17 (halaman layanan + form custom order) di PRD.
  - Halaman **"The Bench"** dengan urutan proses (melebur → menempa → setting → polishing) → setara "proses lapidary" (rough → slabbing → shaping → polish) di About.
  - **Loupe inspection tool** (kaca pembesar interaktif) + drag-to-rotate → ideal untuk menampilkan detail permukaan cabochon — persis kebutuhan "showcase one-of-a-kind".
  - Halaman **Care & Repairs** + Journal → mendukung trust pages (FAQ, kebijakan).
- **Kelemahan:** Checkout cuma "buy button" (Checkout Link) — tidak ada full cart; perlu diambil dari template lain. Estetika "metals/jeweller bench" perlu di-remix ke arah batu/gemstone.
- **Pages:** Home (12 section), Shop, Collections, Collection, Product, **Custom Orders**, The Bench, Care & Repairs, Journal, Article, Contact, 404. CMS: 12 produk, 5 koleksi, 6 journal, 6 review.

### 🥈 2. Bisque Studio — 7.9 ★ (Temuan Terbaik Gelombang 2)
**$79 · "For makers who sell in batches" (Babak Mammadli)**
- **Kenapa penting:** Filosofinya **paling selaras dengan model bisnis Michael Lapidary** dari semua yang dievaluasi — dibangun untuk maker yang menjual run terbatas: satu batch dijual habis, lalu batch berikutnya. Konsep ini identik dengan menjual batu one-of-a-kind:
  - **Checkout tanpa store: tempel Stripe Payment Link** (atau Lemon Squeezy/Gumroad) ke field checkout produk → filosofi pembayarannya **sama persis dengan rencana Stripe kita** — logikanya paling portabel ke Next.js, bukan Shopify.
  - **Batch page** dengan tanggal produksi, jumlah piece, dan *kiln log* → bisa diadaptasi jadi halaman "koleksi/drop" atau bahkan log asal batu.
  - **Sold out state & remaining stock** siap pakai → cocok dengan model `available/reserved/sold` di PRD §6.3.
  - Satu CMS mengisi shop + category + batch + "also from this batch" → pola data bersih untuk dipetakan ke Postgres.
- **Pages:** Home, Shop, Product, Batch, Studio (About), Journal, Article, **Care & Shipping**, Contact, Checkout demo, 404, + halaman per kategori. Font: Instrument Serif + Instrument Sans (gratis, Google Fonts).
- **Kelemahan:** Tidak ada halaman custom orders, tidak ada halaman proses khusus (kiln log hanya di batch page), tidak ada fitur zoom/makro khusus, palet perlu dicek di preview. Estetika ceramic-neutral perlu diarahkan ke earthy-gemstone.

### 🥉 3. Celesse — 7.5
**Free · luxury editorial jewelry (DiverseKit)**
- *Quiet luxury* editorial dengan whitespace lega + storytelling brand — mood yang tepat untuk batu premium.
- Set halaman lengkap: Home, Collections, Product & Product Details, About Us, Blog & Blog Details, Contact, Privacy, 404 — peta halaman yang bersih untuk diadaptasi.
- Kelemahan: mekanik cart/checkout tidak eksplisit; tidak ada halaman proses/craft.

### 🥉 3. Moss & Stone — 7.5
**Free · earthy minimalist "quiet luxury" (SUJAL Makkar)**
- Palet earthy-minimalis, "less is more" — paling dekat dengan mood visual yang diinginkan (dan namanya sudah terasa seperti toko batu 😄).
- Home/Shop/About/Contact/Product + CMS + checkout flow responsif.
- Kelemahan: dirancang untuk fashion/clothing — section-sectionnya perlu dimaknai ulang untuk batu; story-nya dangkal; commerce bergantung Shopify (layout saja yang relevan).

### 🥉 3. Charmant — 7.5
**Free · boutique jewelry/artisans (Cristian Mielu)**
- Editorial terang, tipografi uppercase Kumbh Sans; **slide-out cart sitewide** + product page dengan **tabbed photo stack** → referensi UX bagus untuk galeri multi-foto per batu.
- 5 CMS collections dengan struktur rapi (produk, koleksi, kategori, legal) — pola data yang gampang dipetakan ke skema Postgres.
- Kelemahan: sync Shopify/Frameship (tak relevan untuk kita); tidak ada halaman custom-order/proses.

### 🥉 3. PearlGem — 7.5
**$80 · jewelry & luxury boutique (dirid studio)**
- **Alur e-commerce terlengkap dari semua kandidat**: Product Listing (CMS) → Product Detail (CMS) → My Cart → Select Address → Payment Method → Review Order (checkout multi-langkah 3 tahap) + halaman 404. Nilai utamanya: **peta checkout yang bisa langsung ditiru di Next.js**.
- Kelemahan: estetika "luxury boutique" generik, kurang earthy; hampir tanpa story/craft; berbayar.

### 7. All Natural — 7.2 ★
**$79 · organic/eco brands (ena supply)**
- **Fitur commerce terlengkap di gelombang 2**: cart penuh dengan quantity & variant, wishlist/favourites, filter by collections/tags/availability, market selector — tapi semuanya digerakkan Shopify (FramerCommerce plugin + store berbayar), jadi yang terpakai hanya layout & pola interaksi.
- Estetika "nature-inspired" sesuai deskripsi roundup, tapi palet/font/halaman tidak dirinci di listing — perlu dicek live preview.
- Kelemahan besar: sama sekali tidak ada story/craft sections (skor 4) — untuk bisnis yang menjual *keahlian lapidary*, ini fatal.

### 8. Pottery — 6.9
**Free · pottery studio & workshop (Jat Jat)**
- **Estetika tertinggi di daftar**: palet terracotta/cream/espresso, Playfair Display + DM Sans — mood hangat-alami yang paling pas untuk batu; halaman About dengan story/values/stats; "How it works" 4 langkah + FAQ — referensi bagus untuk halaman proses lapidary.
- Kelemahan fatal untuk skor total: **tidak ada e-commerce sama sekali** (flow-nya booking kelas). Dipakai hanya sebagai referensi palet warna & struktur About/proses.

### 8. Handsel — 6.9 ★
**$69 · craft studios & creative workshops**
- Warm clay tones, image-led, "slow crafted motion", 16 halaman + 7 CMS collections, full-screen menu, Journal dengan 7 cerita — kualitas produksi tinggi.
- Kelemahan: template booking/kelas (schedule, waitlist, tutor) — tanpa cart/checkout native; self-host full CMS butuh Framer Pro. Referensi estetika & struktur menu saja.

### 10. Tsubame — 6.7 ★
**$59 · craft & design portfolio (Lucas Eriksen)**
- "Japanese minimalism + Scandinavian functionalism", *reverence for the object*, halaman studio & method, advanced enquiry overlay — konsep visualnya sangat indah untuk objek fisik seperti batu.
- Kelemahan: **portfolio murni tanpa e-commerce** — hanya layak sebagai referensi estetika editorial.

### 11. Caelora — 6.4
**$59 · jewelry & gemstone (Mino Area)**
- Satu-satunya yang secara eksplisit menyebut *gemstone*; dark/black luxury dengan grid dinamis + micro-interaction.
- Kelemahan: halaman produk & contact tidak eksplisit; tanpa story/craft; mood gelap kurang menonjolkan warna alami batu (batu semi-presiusi butuh background netral/terang agar warnanya "pop"); commerce-nya Shopify.

### 12. Jewelix — 6.3
**Free · jewelry & watch (RedDevs)**
- Lengkap secara struktural (2 homepage, Shop CMS, Categories, Blog CMS, Contact) + AI-ready, tapi generik — tidak ada diferensiasi untuk batu unik maupun craft; cart tidak disebutkan.

### 13. NORELLE — 6.0
**Free · elegant jewelry**
- Estetika elegan-premium dengan section new arrivals/brand story, tapi listing tidak merinci halaman, cart, CMS, maupun checkout — informasi terlalu tipis untuk dinilai lebih tinggi.

### 13. Basalt — 6.0
**$79 · fashion/lifestyle (Flowit Supply)**
- Minimalis bersih & cepat, tapi bergantung penuh pada Framer Commerce + Shopify, tanpa detail halaman/section; isinya fashion generic.

### 15. Fossil — 5.9 ★
**$79 · street fashion (Flowit Supply)**
- Namanya batu, isinya street-fashion: quick add, filtering, layout standar Shopify — tidak relevan untuk lapidary.

### 16. ARTIACT — 5.8 / Aurelle — 5.8 ★
- **ARTIACT** (free): CMS shop sederhana untuk artis — minim fitur e-commerce dan story.
- **Aurelle** (free, Framebucket): luxury jewelry generik; halaman & mekanik commerce tidak dirinci.

---

## 4. Rekomendasi

**Kesimpulan dua gelombang pencarian:** Tidak ada template yang mengalahkan Jewelwright (8.6). Polanya konsisten: template dengan **e-commerce penuh** (All Natural, Boutiq, Kanva, Basalt) semuanya terikat Shopify dan **kosong di story/craft**; template dengan **story/estetika kuat** (Tsubame, Handsel, Pottery) **tidak punya cart**. Jewelwright unik karena justru menggabungkan keduanya di level struktur halaman. Temuan gelombang 2 yang paling berharga adalah **Bisque Studio** — skornya sedikit di bawah Jewelwright (7.9), tapi **filosofi komersialnya (batch selling, sold-out states, Stripe Payment Link checkout) paling dekat dengan model bisnis dan stack kita**, sehingga nilainya sebagai referensi teknis melebihi skornya.

**Pendekatan hibrida (design reference per area):**

| Area desain | Referensi utama | Alasan |
|---|---|---|
| **Struktur halaman & vibe keseluruhan** | 🥇 **Jewelwright** | Maker-focused, custom orders page, proses kerja, loupe zoom — paling dekat dengan PRD. |
| **Model jual one-of-a-kind & logika checkout** | 🆕 **Bisque Studio** | Batch/drop selling, sold-out & stock states, **checkout via Stripe Payment Link** — filosofi yang sama dengan integrasi Stripe kita; paling portabel ke Next.js. |
| **Palet warna & tipografi About/Story** | **Pottery** | Terracotta/cream/espresso + Playfair Display — mood earthy terbaik. |
| **Peta alur Cart & Checkout multi-langkah** | **PearlGem** | Checkout 3 langkah (address → payment → review) paling lengkap sebagai peta UI. |
| **UX galeri foto produk** | **Charmant** + **Jewelwright** | Tabbed photo stack + loupe/zoom untuk foto makro batu. |

**Ringkasan:** Mulai dari **Jewelwright** sebagai tulang punggung struktur (free — bisa langsung di-remix untuk dianalisis section per section), adopsi **model komersial Bisque Studio** (sold states + Stripe-first checkout → langsung sesuai PRD §6.3 dan §10), "pinjam" palet dari **Pottery**, alur checkout multi-langkah dari **PearlGem**, dan pola galeri dari **Charmant**. Semua diterjemahkan ke komponen React/Tailwind dengan commerce custom (Stripe) sesuai PRD — tidak ada dependensi Framer/Shopify yang ikut terbawa.

### Langkah lanjut yang disarankan
1. Buka live preview Jewelwright, Bisque Studio & Pottery, screenshot section yang disukai sebagai mood board.
2. Definisikan **style guide** (warna, font, spacing) di Fase 0 — PRD §12. Kandidat font: Instrument Serif + Instrument Sans (Bisque Studio) atau Playfair Display + DM Sans (Pottery).
3. Susun sitemap final: Home, Shop (+3 kategori), Product Detail, Cart, Checkout (3 langkah), Custom Services, About/Process, Portfolio, Journal (fase 2), FAQ, Shipping & Returns, Contact, 404.

---

## 5. Sumber

- [Framer Marketplace — Templates](https://www.framer.com/marketplace/templates/)
- [Tag: Arts & Crafts](https://www.framer.com/marketplace/templates/tags/arts-and-crafts) · [Tag: Jewelry](https://www.framer.com/marketplace/templates/tags/jewelry)
- Detail per template: [Jewelwright](https://www.framer.com/marketplace/templates/jewelwright) · [Bisque Studio](https://www.framer.com/marketplace/templates/bisque-studio) · [Celesse](https://www.framer.com/marketplace/templates/celesse) · [Moss & Stone](https://www.framer.com/marketplace/templates/moss-stone) · [Charmant](https://www.framer.com/marketplace/templates/charmant) · [PearlGem](https://www.framer.com/marketplace/templates/pearlgem) · [All Natural](https://www.framer.com/marketplace/templates/all-natural) · [Pottery](https://www.framer.com/marketplace/templates/pottery) · [Handsel](https://www.framer.com/marketplace/templates/handsel) · [Tsubame](https://www.framer.com/marketplace/templates/tsubame) · [Caelora](https://www.framer.com/marketplace/templates/caelora) · [Jewelix](https://www.framer.com/marketplace/templates/jewelix) · [NORELLE](https://www.framer.com/marketplace/templates/norelle) · [Basalt](https://www.framer.com/marketplace/templates/basalt) · [Fossil](https://www.framer.com/marketplace/templates/fossil) · [ARTIACT](https://www.framer.com/marketplace/templates/artiact) · [Aurelle](https://www.framer.com/marketplace/templates/aurelle)
- Rounding artikel: [15 Best Ecommerce Framer Templates 2026 — Gola](https://www.gola.supply/blog/best-ecommerce-framer-templates)
