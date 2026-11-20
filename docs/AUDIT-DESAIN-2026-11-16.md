# Audit desain dan kerapian — Michael Lapidary

**16 November 2026 · Skor keseluruhan: 7,3/10**

Michael Lapidary sudah punya identitas visual yang khas: tipografi editorial, palet hangat, dan foto batu menjadi fokus. Katalog desktop adalah bagian yang paling siap secara visual. Perbaikan paling bernilai ada pada kejelasan status produk, kerapian Lookbook, dan akses di layar kecil. Pertahankan arah desain saat ini; pembenahan terarah akan memberi hasil lebih besar daripada mengganti tema atau membangun ulang hero.

**Metode.** Inspeksi pratinjau lokal dari kondisi kode saat audit, dengan data lokal yang tampil di browser. Pemeriksaan visual utama pada 1440 × 900 dan 390 × 844; pemeriksaan khusus pada 820 × 700, 320 × 568, dan preferensi pengurangan animasi. Sampel: beranda, Lookbook, Shop, satu halaman detail produk, Custom, dan keadaan kosong Bag/Checkout. Halaman pendukung dan login admin diperiksa secara singkat. Pembayaran, pengiriman formulir, dan tampilan admin setelah login tidak dinilai. Ini penilaian desain publik, bukan skor Lighthouse, sertifikasi aksesibilitas, atau verifikasi situs produksi. Ikon Next.js di tangkapan layar berasal dari pratinjau pengembangan.

## Skor

Skor 10 berarti area tersebut terlihat rapi, konsisten, dan tetap bisa digunakan pada kondisi yang diuji. Nilai akhir adalah rata-rata berbobot, dibulatkan satu desimal.

| Aspek | Bobot | Skor | Alasan |
|---|---:|---:|---|
| Identitas visual | 20% | 9/10 | Tipografi, palet, dan komposisi hero mudah dikenali; foto mendukung karakter merek. |
| Hierarki dan konsistensi | 15% | 8/10 | Judul dan tombol utama jelas, grid desktop teratur; beberapa teks pendukung terlalu rapat atau kecil. |
| Kerapian foto, grid, dan Lookbook | 20% | 7/10 | Foto katalog konsisten; caption Lookbook melebar dan dua panel detail menampilkan foto yang sama. |
| Tata letak responsif | 15% | 7/10 | Halaman inti terbaca pada lebar 390 px; menu pendek terpotong, Lookbook masih memakai tata letak desktop pada 820 px. |
| Navigasi, fokus, dan pengurangan animasi | 15% | 6/10 | Navigasi utama jelas; fokus menu, tombol Escape, dan cara mengakses seluruh Lookbook saat animasi dikurangi belum berfungsi sebagaimana mestinya. |
| Kejelasan katalog dan alur pemesanan | 15% | 6/10 | Harga dan status mudah ditemukan, tetapi klaim stok bertentangan dengan keterangan ilustrasi; formulir Custom terlalu jauh dari bagian pembuka. |
| **Total** | **100%** | **7,3/10** | **Fondasi desain kuat; eksekusi perlu dirapikan sebelum dipakai sebagai etalase jual.** |

## Yang sebaiknya dipertahankan

- [Hero desktop](audit-visual-2026-11-16/home-desktop.png): foto opal dan tipografi besar menyampaikan karakter studio dalam satu layar; tombol belanja dan custom punya hierarki yang jelas.
- [Katalog desktop](audit-visual-2026-11-16/shop-desktop.png): empat kolom dengan rasio foto seragam membuat perbandingan antarbatu mudah.
- [Footer desktop](audit-visual-2026-11-16/footer-desktop.png): latar gelap, grup tautan, dan wordmark besar menutup halaman dengan jelas dan menjaga identitas merek.

## Temuan dan rekomendasi

| Prioritas | Temuan dan bukti | Rekomendasi dan kriteria selesai |
|---|---|---|
| **P0 — sebelum penjualan** | **Katalog memberi kesan barang siap dikirim, padahal sampel mengaku ilustratif.** Pada Shop, pengantar menyatakan “what you see is exactly what ships”. Produk yang dicek punya badge “Ready to ship” dan CTA “Add to bag”, tetapi deskripsinya menyebut “Illustrative AI concept” dan bahwa foto bukan spesimen inventaris yang persis. Bagian “How it is made” juga menyatakan bahwa batu difoto sebagaimana adanya. [Shop](audit-visual-2026-11-16/shop-desktop.png) · [Detail produk](audit-visual-2026-11-16/produk-desktop.png) | Jika ini data demo, tandai jelas sebagai ilustrasi dan jangan tampilkan status siap kirim atau CTA beli pada item demo. Untuk item jual, tampilkan foto stok aktual dan verifikasi asal, perlakuan, ukuran, serta berat sesuai produk. Kartu, halaman produk, dan tombol harus menyampaikan status yang sama. |
| **P1 — Lookbook** | **Caption memanjang, melampaui foto, dan terlihat terpotong.** Variasi rasio fotonya sudah memberi ritme. Namun teks `(concept locality; specimen unverified)` masih muncul di caption. Pada 820 px, caption kartu terakhir berukuran sekitar 516 px pada foto 349 px. [Desktop](audit-visual-2026-11-16/lookbook-desktop.png) · [820 px](audit-visual-2026-11-16/lookbook-820.png) · [Ponsel](audit-visual-2026-11-16/lookbook-ponsel.png) | Samakan lebar caption dengan foto, beri jarak konsisten, dan biarkan teks turun baris. Gunakan nama batu dan asal yang sudah diverifikasi; jika belum, pakai label singkat seperti “Origin unverified” dan pertahankan keterangan lengkap pada detail produk. Pertahankan variasi rasio, dengan dua atau tiga garis dasar yang konsisten. Pastikan caption kartu terakhir bisa dibaca utuh. |
| **P1 — Lookbook tanpa animasi** | Pada desktop dengan pengurangan animasi aktif, Lookbook masih memakai kontainer setinggi 2.700 px yang dipatok. Saat berada dekat akhir section, hanya dua dari delapan kartu yang masuk bidang pandang; track tidak bergerak dan menyembunyikan sisanya. [Bukti](audit-visual-2026-11-16/lookbook-reduced.png) | Gunakan galeri statis atau carousel yang bisa digeser dan dioperasikan dengan keyboard pada mode pengurangan animasi. Gunakan pola yang sama pada tablet jika ruangnya tidak cukup untuk tata letak yang dipatok. Semua 8 foto dan caption harus bisa diakses. |
| **P1 — Menu ponsel** | Pada 320 × 568, tautan Bag berakhir di sekitar y=603 dan terpotong. Panel menu tidak punya scroll sendiri. Fokus awal tetap pada tombol “Open menu”, dan Escape tidak menutupnya. [Bukti](audit-visual-2026-11-16/menu-320.png) | Buat panel bisa digulir, rapatkan jarak pada layar pendek, beri nama dialog, pindahkan dan tahan fokus di panel, tutup dengan Escape, lalu kembalikan fokus ke tombol pembuka. Uji seluruh tautan dengan sentuhan dan keyboard. |
| **P1 — Galeri detail produk** | Dua panel desktop pada sampel Lebak Banten menampilkan gambar yang sama. Di ponsel, panel kedua disembunyikan; pengguna tidak punya kontrol untuk memilih foto lain ketika tersedia. [Desktop](audit-visual-2026-11-16/produk-desktop.png) · [Ponsel](audit-visual-2026-11-16/produk-ponsel.png) | Tampilkan satu foto jika sumbernya sama. Jika stok punya beberapa foto yang berbeda, prioritaskan tampak utama, detail tekstur, dan foto pembanding ukuran. Beri tombol atau thumbnail yang juga bisa digunakan pada ponsel. |
| **P2 — Custom** | Hero Custom tidak punya tombol langsung ke formulir. Pada 390 × 844, formulir dimulai sekitar 5.331 px dari atas; bagian proses sendiri sekitar 3.038 px. Gambar tahap disembunyikan pada ponsel, sehingga durasi scroll terasa panjang dibanding isi yang terlihat. [Bukti](audit-visual-2026-11-16/custom-ponsel.png) | Tambahkan CTA “Start a custom piece” di hero yang menuju formulir. Jadikan empat langkah sebagai daftar ringkas atau accordion di ponsel dan ketika pengurangan animasi aktif. Pertahankan cerita visual desktop selama tetap mudah dilewati. |
| **P2 — Baca cepat di ponsel** | Pada sampel beranda 390 px, paragraf hero melintas di bagian opal berwarna terang. Katalog memakai satu kartu besar per baris; foto menonjol tetapi sedikit produk terlihat sekaligus. [Hero](audit-visual-2026-11-16/home-ponsel.png) · [Shop](audit-visual-2026-11-16/shop-ponsel.png) | Gelapkan area hanya di belakang teks dan ringkas intro menjadi dua atau tiga baris jika muat. Untuk Shop, uji alternatif grid dua kolom mulai sekitar 390–430 px; pertahankan satu kolom jika judul, harga, atau badge terlalu sesak. Utamakan teks kecil yang membawa informasi seperti status dan spesifikasi. |

## Urutan pengerjaan

1. **Selaraskan konten dan status barang.** Tentukan item demo dan item yang benar-benar dijual; pasangkan foto, deskripsi, status, dan CTA yang sesuai.
2. **Rapikan Lookbook dan menu ponsel.** Kunci lebar caption, pastikan foto terakhir terbaca, sediakan versi tanpa gerak, dan uji semua tautan menu pada layar pendek.
3. **Perpendek jalan menuju tindakan.** Ganti foto duplikat, buka akses galeri di ponsel, dan tambahkan jalan langsung ke formulir Custom. Setelah itu, cek keterbacaan hero dan ritme grid Shop.

Jika hanya mengerjakan perapian visual dalam satu tahap, mulai dari **Lookbook**: batas lebar caption, jarak antarfoto, dan tampilan tablet akan memberi perbaikan paling mudah terlihat. Untuk kesiapan penjualan, penyelarasan foto dan status katalog tetap yang pertama.
