**LAPORAN ORTHOGONAL ARRAY TESTING**

Aplikasi BABEPUS (Barang Bekas Puspita)

Metode: L9(3^4) & L8(2^7) Orthogonal Array — Pengujian Kombinasi Filter Produk dan Pricing

# **1\. Pendahuluan & Konsep Orthogonal Array Testing**

Orthogonal Array Testing (OAT) adalah teknik black-box yang menggunakan array ortogonal untuk membuat kasus uji. Teknik ini merupakan pendekatan pengujian statistik yang sangat berguna ketika sistem yang diuji memiliki input data yang besar (banyak parameter independen). OAT membantu memaksimalkan cakupan pengujian dengan memasangkan dan menggabungkan input (pairwise coverage), serta menguji sistem dengan jumlah kasus uji yang relatif lebih sedikit dibanding pengujian kombinatorial penuh (exhaustive testing), sehingga menghemat waktu dan biaya pengujian.

## **1.1 Manfaat Orthogonal Array**

*   Mengurangi jumlah test case secara signifikan dibanding full combinatorial testing
*   Tetap menjamin cakupan pairwise (setiap kombinasi 2 parameter diuji minimal sekali)
*   Efektif untuk fitur dengan banyak parameter independen seperti filter pencarian

## **1.2 Langkah-Langkah Pengujian OAT**

Penyusunan test case OAT pada laporan ini mengikuti 5 langkah baku sebagai berikut:

1.  Identifikasi variabel (faktor) independen untuk skenario yang diuji, beserta level/nilai yang mungkin untuk masing-masing faktor.
2.  Temukan array ortogonal standar terkecil yang cukup menampung jumlah faktor dan level tersebut.
3.  Petakan (map) faktor-faktor tersebut ke dalam kolom array yang terpilih.
4.  Pilih nilai untuk level pada kolom "sisa" (leftover) jika jumlah faktor lebih kecil dari kapasitas kolom array standar.
5.  Transkripsikan setiap baris array menjadi kasus uji konkret, lalu tambahkan kombinasi mencurigakan (suspicious combination) yang berisiko tinggi namun tidak otomatis terbentuk dari array.

## **1.3 Contoh Ilustrasi Penentuan Tipe Array**

Sebagai ilustrasi Langkah 1-2, perhatikan contoh pengujian fungsi mikroprosesor dengan 4 faktor, masing-masing 3 level: Suhu (100°C/150°C/200°C), Tekanan (2psi/5psi/8psi), Jumlah Doping (4%/6%/8%), dan Laju Deposisi (0.1/0.2/0.3 mg/s).

| **Atribut** | **Nilai** |
| --- | --- |
| Jumlah Faktor | 4 (Suhu, Tekanan, Jumlah Doping, Laju Deposisi) |
| Jumlah Level per Faktor | 3   |
| Notasi Array Terpilih | L9(3⁴) |
| Jumlah Kasus Uji | 9 (bukan 3⁴ = 81 jika full combinatorial) |

_Cara membaca notasi L9(3⁴): angka 9 di depan menunjukkan jumlah baris/kasus uji, angka 3 dalam kurung menunjukkan jumlah level setiap faktor, dan eksponen 4 menunjukkan jumlah kolom (faktor maksimum) yang dapat ditampung array tersebut. Karena ada tepat 4 faktor 3-level, seluruh kolom array terisi tanpa sisa. Prinsip pemilihan array yang sama digunakan pada Bagian 2 dan 3 di bawah untuk parameter BABEPUS._

## **1.4 Identifikasi Parameter & Level — Filter Pencarian Produk**

Endpoint GET /api/products memiliki banyak parameter query independen berdasarkan productService.js — getProducts(query, currentUserId). Berikut parameter yang dipilih untuk OAT:

| **Parameter** | **Level 1** | **Level 2** | **Level 3** |
| --- | --- | --- | --- |
| categoryId (Kategori) | Tidak diisi | categoryId=1 (Elektronik) | categoryId=2 (Buku) |
| minPrice/maxPrice (Harga) | Tidak diisi | 100000-500000 | 500000-2000000 |
| conditionLabel (Kondisi) | Tidak diisi | good | like\_new |
| search (Kata kunci) | Tidak diisi | 'laptop' | 'buku' |

# **2\. Matriks Ortogonal L9(3^4) — Filter Pencarian Produk**

Dengan 4 parameter dan 3 level masing-masing, full combinatorial membutuhkan 3^4 = 81 test case. Dengan matriks ortogonal standar L9(3^4), cukup 9 test case untuk mencapai pairwise coverage.

## **2.1 Tabel Matriks L9(3^4)**

| **TC** | **categoryId** | **Harga** | **conditionLabel** | **search** |
| --- | --- | --- | --- | --- |
| 1   | Level1 (kosong) | Level1 (kosong) | Level1 (kosong) | Level1 (kosong) |
| 2   | Level1 (kosong) | Level2 (100rb-500rb) | Level2 (good) | Level2 (laptop) |
| 3   | Level1 (kosong) | Level3 (500rb-2jt) | Level3 (like\_new) | Level3 (buku) |
| 4   | Level2 (Elektronik) | Level1 (kosong) | Level2 (good) | Level3 (buku) |
| 5   | Level2 (Elektronik) | Level2 (100rb-500rb) | Level3 (like\_new) | Level1 (kosong) |
| 6   | Level2 (Elektronik) | Level3 (500rb-2jt) | Level1 (kosong) | Level2 (laptop) |
| 7   | Level3 (Buku) | Level1 (kosong) | Level3 (like\_new) | Level2 (laptop) |
| 8   | Level3 (Buku) | Level2 (100rb-500rb) | Level1 (kosong) | Level3 (buku) |
| 9   | Level3 (Buku) | Level3 (500rb-2jt) | Level2 (good) | Level1 (kosong) |

## **2.2 Tabel Eksekusi Test Case (Request Aktual)**

| **TC** | **Request URL** | **Kondisi Internal (productService.js)** | **Expected Result** |
| --- | --- | --- | --- |
| OAT-1 | GET /api/products | conditions=\[deleted\_at IS NULL, status=active, suspended=0\] — tanpa filter tambahan | Semua produk aktif, tanpa filter |
| OAT-2 | GET /api/products?minPrice=100000&maxPrice=500000&conditionLabel=good&search=laptop | +price BETWEEN, +condition\_label=?, +LIKE %laptop% | Produk laptop kondisi baik, harga 100rb-500rb |
| OAT-3 | GET /api/products?minPrice=500000&maxPrice=2000000&conditionLabel=like\_new&search=buku | +price BETWEEN, +condition\_label=like\_new, +LIKE %buku% | Produk buku kondisi seperti baru, harga 500rb-2jt |
| OAT-4 | GET /api/products?categoryId=1&conditionLabel=good&search=buku | +category\_id=1, +condition=good, +LIKE %buku% | Produk kategori Elektronik berjudul 'buku' (kombinasi tidak lazim) |
| OAT-5 | GET /api/products?categoryId=1&minPrice=100000&maxPrice=500000&conditionLabel=like\_new | +category\_id=1, +price BETWEEN, +condition=like\_new | Produk Elektronik like\_new harga 100rb-500rb |
| OAT-6 | GET /api/products?categoryId=1&minPrice=500000&maxPrice=2000000&search=laptop | +category\_id=1, +price BETWEEN, +LIKE %laptop% | Produk Elektronik 'laptop' harga 500rb-2jt |
| OAT-7 | GET /api/products?categoryId=2&conditionLabel=like\_new&search=laptop | +category\_id=2 (Buku), +condition=like\_new, +LIKE %laptop% | Produk kategori Buku berjudul 'laptop' (kombinasi tidak lazim) |
| OAT-8 | GET /api/products?categoryId=2&minPrice=100000&maxPrice=500000&search=buku | +category\_id=2, +price BETWEEN, +LIKE %buku% | Produk Buku harga 100rb-500rb berjudul 'buku' |
| OAT-9 | GET /api/products?categoryId=2&minPrice=500000&maxPrice=2000000&conditionLabel=good | +category\_id=2, +price BETWEEN, +condition=good | Produk Buku kondisi baik harga 500rb-2jt |

// productService.js — dynamic WHERE builder yang diuji  
const conditions = \['p.deleted\_at IS NULL', 'p.status = "active"', 'u.is\_suspended = 0'\];  
if (query.search) conditions.push('(title LIKE ? OR description LIKE ?...)');  
if (query.categoryId) conditions.push('p.category\_id = ?');  
if (query.minPrice) conditions.push('p.price >= ?');  
if (query.maxPrice) conditions.push('p.price <= ?');  
if (query.conditionLabel) conditions.push('p.condition\_label = ?');  
// Setiap kombinasi parameter OAT menguji jalur AND gabungan yang berbeda

# **3\. Matriks Ortogonal L8(2^7) — Estimasi Harga (Pricing Service)**

Fungsi estimateUsedPrice() pada pricingService.js memiliki 5 parameter boolean/biner: includesBox, urgency (high/normal), kategori dikenal/tidak, kondisi dikenal/tidak, dan ageMonths (<=36/>36). Mengikuti Langkah 2 (penentuan array terkecil), dengan 5 faktor 2-level, array standar 2-level terkecil yang cukup besar adalah L8(2⁷) — L4(2³) tidak dipilih karena hanya menampung 3 kolom, tidak cukup untuk 5 faktor. Dengan matriks L8(2⁷) ini, 8 test case sudah cukup untuk mencapai pairwise coverage.

## **3.1 Parameter & Level Biner**

| **Parameter** | **Level 1 (Low)** | **Level 2 (High)** |
| --- | --- | --- |
| includesBox | false (tidak ada box) | true (ada box) |
| urgency | normal | high |
| conditionLabel dikenal | tidak dikenal (fallback 0.58) | dikenal (misal: 'like\_new') |
| categorySlug dikenal | tidak dikenal (fallback 'lainnya') | dikenal (misal: 'elektronik') |
| ageMonths | <= 36 (confidence high) | \> 36 (confidence medium) |

## **3.2 Penanganan Kolom Sisa (Leftover Levels)**

Array standar L8(2⁷) memiliki kapasitas 7 kolom, sedangkan hanya 5 faktor yang teridentifikasi pada Langkah 1 (Langkah 4: pilih nilai untuk level sisa). Dua kolom sisa ditangani sebagai berikut:

| **Kolom Sisa** | **Keputusan Penanganan** | **Alasan** |
| --- | --- | --- |
| Kolom ke-6 | Diabaikan / dianggap dummy (tidak dipetakan ke parameter apapun) | Tidak ada faktor independen ke-6 yang relevan pada estimateUsedPrice(); menambah faktor dummy hanya akan menambah noise tanpa nilai uji |
| Kolom ke-7 | Diabaikan / dianggap dummy (tidak dipetakan ke parameter apapun) | Sama seperti kolom ke-6 — kapasitas array tidak harus terisi penuh, yang penting 5 faktor yang relevan tetap mendapat cakupan pairwise |

_Catatan: pada Bagian 2 (L9(3⁴) untuk filter produk), jumlah faktor (4) tepat sama dengan kapasitas kolom array, sehingga tidak ada kolom sisa yang perlu ditangani._

## **3.3 Tabel Matriks L8(2^7) — Pricing**

| **TC** | **includesBox** | **urgency** | **conditionLabel** | **categorySlug** | **ageMonths** | **Expected boxBonus** | **Expected confidence** |
| --- | --- | --- | --- | --- | --- | --- | --- |
| OAT-P1 | false | normal | tidak dikenal | tidak dikenal | <=36 | 0.98 | high |
| OAT-P2 | false | normal | dikenal | dikenal | \>36 | 0.98 | medium |
| OAT-P3 | false | high | tidak dikenal | dikenal | <=36 | 0.98 | high |
| OAT-P4 | false | high | dikenal | tidak dikenal | \>36 | 0.98 | medium |
| OAT-P5 | true | normal | tidak dikenal | dikenal | \>36 | 1.04 | medium |
| OAT-P6 | true | normal | dikenal | tidak dikenal | <=36 | 1.04 | high |
| OAT-P7 | true | high | tidak dikenal | tidak dikenal | \>36 | 1.04 | medium |
| OAT-P8 | true | high | dikenal | dikenal | <=36 | 1.04 | high |

// pricingService.js — kombinasi parameter yang diuji OAT  
const boxBonus = payload.includesBox ? 1.04 : 0.98;  
const factor = (conditionFactor\[payload.conditionLabel\] || 0.58)  
\* (categoryFactor\[category.slug\] || categoryFactor.lainnya)  
\* depreciation \* boxBonus  
\* (urgencyFactor\[payload.urgency || 'normal'\] || 1);  
confidence: ageMonths <= 36 ? 'high' : 'medium',  
advice: payload.urgency === 'high' ? 'gunakan harga median...' : 'pasang harga atas...'

## **3.4 Kombinasi Mencurigakan Tambahan (Suspicious Combination)**

Mengikuti Langkah 5 (transkripsi ke kasus uji + tambahkan kombinasi mencurigakan), array L8(2⁷) di atas hanya menjamin cakupan pairwise — bukan kombinasi ekstrem di mana SEMUA faktor berada pada level "berisiko" sekaligus. Kombinasi seperti itu tidak otomatis terbentuk dari baris array manapun, namun berisiko memicu banyak fallback default secara bersamaan, sehingga ditambahkan sebagai test case tambahan di luar array murni.

| **TC Tambahan** | **Kombinasi Faktor** | **Alasan Dicurigai** | **Expected Result** |
| --- | --- | --- | --- |
| OAT-P9 (Suspicious) | includesBox=false, urgency=high, conditionLabel tidak dikenal, categorySlug tidak dikenal, ageMonths>36 — SEMUA level berisiko sekaligus | Tiga fallback default (condition 0.58, category 'lainnya', boxBonus 0.98) aktif bersamaan + urgency high + confidence medium — kombinasi 'worst case' yang tidak muncul di baris L8 manapun | boxBonus=0.98, confidence=medium, hasil estimasi tetap masuk akal (bukan NaN/negatif/crash) |
| OAT-P10 (Suspicious) | includesBox=true, urgency=normal, conditionLabel dikenal, categorySlug dikenal, ageMonths<=36 — SEMUA level 'terbaik' sekaligus | Kombinasi 'best case' di mana tidak ada fallback yang aktif sama sekali — perlu dipastikan tidak ada asumsi kode yang salah saat semua data lengkap | boxBonus=1.04, confidence=high, hasil estimasi maksimal sesuai faktor lengkap |

**Hasil verifikasi: OAT-P9 dan OAT-P10 tetap menghasilkan nilai estimasi yang valid (bukan NaN, bukan negatif, tidak crash), mengkonfirmasi bahwa fallback default pada pricingService.js aman digunakan secara bersamaan.**

# **4\. Hasil Eksekusi Test Case**

## **4.1 Hasil L9(3^4) — Filter Produk**

| **TC** | **Total Records Diharapkan** | **Kondisi SQL Tervalidasi** | **Status** |
| --- | --- | --- | --- |
| OAT-1 | Semua produk aktif (baseline) | 3 kondisi dasar saja | Pass |
| OAT-2 | Subset dengan 3 filter gabungan | price BETWEEN + condition + LIKE | Pass |
| OAT-3 | Subset dengan 3 filter gabungan berbeda | price BETWEEN + condition + LIKE | Pass |
| OAT-4 | 0 atau sedikit hasil (kombinasi tidak lazim) | category + condition + LIKE — kombinasi jarang cocok | Pass (hasil kosong wajar) |
| OAT-5 | Subset spesifik kategori+harga+kondisi | category + price BETWEEN + condition | Pass |
| OAT-6 | Subset kategori+harga+keyword | category + price BETWEEN + LIKE | Pass |
| OAT-7 | 0 atau sedikit hasil (kombinasi tidak lazim) | category Buku + condition + LIKE 'laptop' — jarang cocok | Pass (hasil kosong wajar) |
| OAT-8 | Subset kategori Buku+harga+keyword | category + price BETWEEN + LIKE | Pass |
| OAT-9 | Subset kategori Buku+harga+kondisi | category + price BETWEEN + condition | Pass |

## **4.2 Hasil L8(2^7) — Pricing**

| **TC** | **boxBonus Aktual** | **confidence Aktual** | **Status** |
| --- | --- | --- | --- |
| OAT-P1 | 0.98 | high | Pass |
| OAT-P2 | 0.98 | medium | Pass |
| OAT-P3 | 0.98 | high | Pass |
| OAT-P4 | 0.98 | medium | Pass |
| OAT-P5 | 1.04 | medium | Pass |
| OAT-P6 | 1.04 | high | Pass |
| OAT-P7 | 1.04 | medium | Pass |
| OAT-P8 | 1.04 | high | Pass |
| OAT-P9 (Suspicious) | 0.98 | medium | Pass |
| OAT-P10 (Suspicious) | 1.04 | high | Pass |

# **5\. Analisis Efisiensi Orthogonal Array**

| **Pengujian** | **Full Combinatorial** | **Orthogonal Array + Suspicious** | **Penghematan** |
| --- | --- | --- | --- |
| Filter Produk (4 param x 3 level) | 3⁴ = 81 test case | 9 test case (L9) | 88,9% lebih sedikit |
| Pricing (5 param x 2 level) | 2⁵ = 32 test case | 8 test case (L8) + 2 suspicious = 10 | 68,75% lebih sedikit |
| TOTAL | 113 test case | 19 test case | 83,2% lebih sedikit |

Meskipun jumlah test case berkurang drastis, matriks ortogonal tetap menjamin setiap pasangan nilai parameter (pairwise) diuji minimal satu kali, sehingga sebagian besar interaksi bug antara dua parameter tetap dapat terdeteksi. Dua test case suspicious (OAT-P9, OAT-P10) ditambahkan di luar array untuk menutup celah kombinasi ekstrem yang tidak terjamin oleh cakupan pairwise semata.

# **6\. Kesimpulan Orthogonal Array Testing**

1.  Sebanyak 19 test case (9 untuk filter produk L9(3^4), 8 untuk pricing L8(2^7), dan 2 kombinasi mencurigakan tambahan) berhasil dirancang dan dieksekusi mengikuti 5 langkah baku OAT, merepresentasikan 113 kemungkinan kombinasi penuh dengan efisiensi 83,2%.
2.  Seluruh 19 test case menunjukkan hasil Pass — query dinamis pada getProducts() dan kalkulasi pada estimateUsedPrice() menangani semua kombinasi parameter dengan benar, termasuk 2 kombinasi ekstrem (worst-case dan best-case) yang tidak terbentuk dari array murni.
3.  Dua kolom sisa (leftover) pada array L8(2^7) untuk pricing (yang hanya memuat 5 dari 7 faktor) ditangani secara eksplisit dengan diabaikan, karena tidak ada faktor independen tambahan yang relevan pada fungsi estimateUsedPrice().
4.  Dua test case (OAT-4 dan OAT-7) menghasilkan kombinasi parameter yang secara logis bisnis tidak lazim (misal: kategori Elektronik dicari dengan keyword 'buku') namun sistem tetap menangani dengan benar — mengembalikan hasil kosong tanpa error, bukan crash.
5.  Teknik Orthogonal Array Testing terbukti efektif untuk menguji fitur filter dengan banyak parameter independen seperti pencarian produk dan kalkulasi pricing, tanpa mengorbankan cakupan pairwise yang signifikan.