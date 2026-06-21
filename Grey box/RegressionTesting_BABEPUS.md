**LAPORAN REGRESSION TESTING**

Aplikasi BABEPUS (Barang Bekas Puspita)

3 Skenario Pemicu: Fitur Baru, Bug Fix, dan Perubahan Infrastruktur

# **1\. Konsep Regression Testing**

Regression Testing adalah teknik pengujian yang dilakukan untuk memastikan bahwa perubahan yang dilakukan pada kode program tidak menyebabkan bug atau masalah baru pada fungsionalitas yang sudah ada. Teknik ini penting untuk menjaga stabilitas dan kualitas perangkat lunak selama proses pengembangan, terutama saat aplikasi terus berkembang dengan penambahan fitur, perbaikan bug, maupun perubahan infrastruktur.

## **1.1 Tiga Skenario Pemicu Regression Testing**

Regression Testing pada BABEPUS dipicu oleh tiga jenis skenario perubahan yang berbeda, masing-masing dengan strategi pengujian yang disesuaikan:

| **Skenario** | **Definisi** | **Contoh pada BABEPUS** | **Fokus Regression** |
| --- | --- | --- | --- |
| 1\. Menambah Fitur Baru | Penambahan fungsionalitas baru yang berpotensi berinteraksi dengan modul lama | Penambahan fitur Estimasi Harga (pricingService) yang terhubung ke modul Produk | Pastikan modul lama tidak terganggu oleh integrasi fitur baru |
| 2\. Memperbaiki Bug dan Gangguan | Perbaikan defect yang ditemukan dari pengujian sebelumnya (Formal Inspection, Grey Box) | Fix double commit() pada createOffer() dan TokenExpiredError pada authMiddleware | Pastikan fix tidak merusak fungsi yang sudah benar |
| 3\. Mengubah Infrastruktur | Perubahan pada konfigurasi, library, atau lingkungan tanpa mengubah logika bisnis | Upgrade dependency mysql2/express, perubahan konfigurasi JWT\_EXPIRES\_IN, migrasi koneksi DB pool | Pastikan seluruh fungsionalitas tetap berjalan meski fondasi teknis berubah |

# **2\. Skenario 1 — Regression Testing untuk Penambahan Fitur Baru**

Studi Kasus: Penambahan fitur Estimasi Harga Jual Otomatis (pricingService.estimateUsedPrice) yang terintegrasi dengan form Tambah Produk. Fitur ini baru dan tidak mengubah kode productService.js maupun productController.js secara langsung, namun frontend form Tambah Produk kini memanggil endpoint baru POST /api/pricing/estimate sebelum submit.

## **2.1 Analisis Dampak Fitur Baru**

| **Komponen** | **Apakah Berubah?** | **Potensi Dampak Regresi** |
| --- | --- | --- |
| pricingController.js / pricingService.js | Baru dibuat (tidak ada sebelumnya) | Tidak ada — modul baru, tidak ada fungsi lama yang diubah |
| pricingRoutes.js | Baru ditambahkan ke app.js | Berpotensi mempengaruhi urutan middleware global jika didaftarkan tidak tepat |
| app.js | Ditambahkan 1 baris: app.use('/api/pricing', pricingRoutes) | Berisiko konflik path jika ada endpoint lain yang tumpang tindih |
| productController.createProduct() | Tidak diubah sama sekali | Harus dipastikan TETAP tidak berubah meski ada fitur baru terkait |

## **2.2 Test Suite Regression — Memastikan Modul Lama Tidak Terganggu**

| **ID RT** | **Test Case** | **Modul yang Diuji Ulang** | **Hasil Sebelum Fitur Baru** | **Hasil Sesudah Fitur Baru** | **Status** |
| --- | --- | --- | --- | --- | --- |
| RT-N01 | POST /api/products — tambah produk tanpa memanggil pricing dulu | productController.createProduct() | 201 + product | 201 + product (tidak berubah) | Tidak Regresi |
| RT-N02 | GET /api/products — list & search produk | productService.getProducts() | 200 + array produk | 200 + array produk (tidak berubah) | Tidak Regresi |
| RT-N03 | Routing global — akses endpoint lain (/api/auth/login) | app.js routing | 200 + token | 200 + token (tidak terganggu oleh route baru) | Tidak Regresi |
| RT-N04 | POST /api/pricing/estimate — fitur baru (smoke test) | pricingController.estimate() | N/A (belum ada) | 200 + estimasi harga | Fitur Baru Berfungsi |
| RT-N05 | Akses /api/pricing/estimate tanpa login | authMiddleware pada pricingRoutes | N/A (belum ada) | Tergantung desain — perlu dicek apakah pricing wajib login | Perlu Verifikasi |
| RT-N06 | POST /api/products dengan field tambahan dari hasil estimasi (priceSuggestion) | productController.createProduct() — body baru dari frontend | 201 (field asing diabaikan) | 201 (field asing tetap diabaikan, tidak ada validator baru ditambahkan) | Tidak Regresi |

Temuan RT-N05: pricingRoutes.js perlu diverifikasi apakah menggunakan authMiddleware atau tidak. Berdasarkan tujuan fitur (membantu seller menentukan harga), estimate sebaiknya tetap dapat diakses publik (optionalAuthMiddleware) agar calon pengguna dapat mencoba fitur sebelum mendaftar.

# **3\. Skenario 2 — Regression Testing untuk Perbaikan Bug**

Studi Kasus: Perbaikan 2 bug Critical dari hasil Formal Inspection — FI-01 (double commit() pada createOffer) dan FI-05 (TokenExpiredError tidak ditangkap di authMiddleware).

## **3.1 Source Code Sebelum dan Sesudah Perbaikan**

// FIX FI-01 — SEBELUM  
await connection.commit(); // commit pertama  
await createNotification({ ... }); // di luar transaksi  
await connection.commit(); // commit KEDUA — BUG  
  
// FIX FI-01 — SESUDAH  
await connection.commit(); // hanya 1 commit  
connection.release();  
await createNotification({ ... });  
  
// FIX FI-05 — SEBELUM  
error.name === 'JsonWebTokenError' ? ApiError(401) : error // TokenExpiredError lolos  
  
// FIX FI-05 — SESUDAH  
\['JsonWebTokenError','TokenExpiredError','NotBeforeError'\].includes(error.name)  
? ApiError(401) : error

## **3.2 Test Suite Regression — Bug Fix**

| **ID RT** | **Test Case** | **Hasil Sebelum Fix** | **Hasil Setelah Fix** | **Status** |
| --- | --- | --- | --- | --- |
| RT-B01 | createOffer() — kirim penawaran valid (happy path) | 201 + offer (Pass) | 201 + offer (Pass) | Tidak Regresi |
| RT-B02 | createOffer() — validasi guard (422/409 berbagai skenario) | Sesuai (Pass) | Sesuai (Pass) | Tidak Regresi |
| RT-B03 | acceptOffer() — pattern transaksi serupa, dicek ikut bug atau tidak | Pass (tidak ada double commit di sini) | Pass | Tidak Regresi |
| RT-B04 | GET /auth/me dengan token expired | 500 Internal Server Error (BUG) | 401 Unauthorized (FIXED) | Bug Teratasi |
| RT-B05 | GET /auth/me dengan token valid (happy path) | 200 + user | 200 + user | Tidak Regresi |
| RT-B06 | GET /auth/me dengan token format salah (JsonWebTokenError) | 401 (sudah benar sebelumnya) | 401 (tetap benar) | Tidak Regresi |
| RT-B07 | POST /products dengan token expired | 500 (BUG, sama root cause dengan RT-B04) | 401 (FIXED, karena pakai middleware yang sama) | Bug Teratasi |
| RT-B08 | Endpoint lain yang pakai authMiddleware (sample: /wishlist, /admin/dashboard) | Pass (tidak terdampak token expired di test ini) | Pass (tidak ada regresi akibat fix) | Tidak Regresi |

# **4\. Skenario 3 — Regression Testing untuk Perubahan Infrastruktur**

Studi Kasus: Tiga jenis perubahan infrastruktur yang relevan untuk BABEPUS tanpa mengubah logika bisnis: (a) perubahan konfigurasi JWT\_EXPIRES\_IN, (b) upgrade versi dependency (mysql2, express, bcrypt), dan (c) perubahan connection pool database.

## **4.1 Perubahan Konfigurasi: JWT\_EXPIRES\_IN dari 7d ke 1d**

Berdasarkan rekomendasi keamanan (temuan FI-15), nilai JWT\_EXPIRES\_IN diubah dari default '7d' menjadi '1d' untuk environment production demi keamanan yang lebih baik.

// config/env.js — perubahan infrastruktur (bukan logika bisnis)  
JWT\_EXPIRES\_IN: process.env.JWT\_EXPIRES\_IN || '7d', // SEBELUM  
JWT\_EXPIRES\_IN: process.env.JWT\_EXPIRES\_IN || '1d', // SESUDAH (production)

| **ID RT** | **Test Case** | **Hasil Sebelum Perubahan** | **Hasil Setelah Perubahan** | **Status** |
| --- | --- | --- | --- | --- |
| RT-I01 | Login berhasil — cek field exp pada token JWT | exp = now + 7 hari | exp = now + 1 hari | Perilaku Berubah (Disengaja) |
| RT-I02 | Akses /auth/me dengan token berusia 12 jam | 200 (masih valid di kedua versi) | 200 (masih valid, < 1 hari) | Tidak Regresi |
| RT-I03 | Akses /auth/me dengan token berusia 2 hari | 200 (valid karena < 7 hari) | 401 Token Expired (valid karena fix FI-05 + config baru bekerja sama) | Perilaku Berubah (Disengaja, sesuai ekspektasi keamanan) |
| RT-I04 | Refresh/login ulang setelah token expired | User harus login ulang | User harus login ulang (frekuensi lebih sering, tapi flow sama) | Tidak Regresi pada flow, hanya frekuensi |

## **4.2 Upgrade Dependency (mysql2, bcrypt, express)**

Simulasi: upgrade mysql2 dari v3.6 ke v3.9, bcrypt dari v5.0 ke v5.1, express dari v4.18 ke v4.19. Tidak ada perubahan kode aplikasi, hanya package.json dan package-lock.json.

| **Library** | **Fungsi yang Bergantung** | **Risiko Breaking Change** | **Test Case Regression** |
| --- | --- | --- | --- |
| mysql2 | SEMUA service (pool.query, beginTransaction, FOR UPDATE) | Tinggi — perubahan API connection pool dapat merusak semua query | Full retest seluruh endpoint yang mengakses DB |
| bcrypt | authService (hashPassword, comparePassword) | Tinggi — jika algoritma hash berubah versi, password lama mungkin tidak cocok | RT-I05, RT-I06 (lihat di bawah) |
| express | Semua routing & middleware | Sedang — biasanya backward compatible pada minor version | Smoke test seluruh route utama |

| **ID RT** | **Test Case** | **Hasil Sebelum Upgrade** | **Hasil Setelah Upgrade** | **Status** |
| --- | --- | --- | --- | --- |
| RT-I05 | Login dengan password yang di-hash SEBELUM upgrade bcrypt | 200 + token (password match) | 200 + token (hash lama tetap valid — bcrypt backward compatible by design) | Tidak Regresi |
| RT-I06 | Register baru — hash password DENGAN bcrypt versi baru | 201 + password\_hash tersimpan | 201 + password\_hash tersimpan (format hash tetap kompatibel) | Tidak Regresi |
| RT-I07 | createOffer() — transaksi DB dengan FOR UPDATE (uji kompatibilitas mysql2 versi baru) | 201 + offer, lock bekerja | 201 + offer, lock tetap bekerja sama | Tidak Regresi |
| RT-I08 | Smoke test 10 endpoint utama (auth, products, offers, transactions, dst.) | Semua 200/201 sesuai skenario | Semua 200/201 sesuai skenario (express routing tidak berubah) | Tidak Regresi |

## **4.3 Perubahan Connection Pool Database**

Simulasi: konfigurasi pool.connectionLimit dinaikkan dari 10 ke 25 untuk mengantisipasi traffic lebih tinggi, dan idleTimeout ditambahkan. Tidak ada perubahan pada query atau logika service.

| **ID RT** | **Test Case** | **Tujuan** | **Hasil** | **Status** |
| --- | --- | --- | --- | --- |
| RT-I09 | Concurrent request — 20 user mengakses GET /products bersamaan | Pastikan connection pool baru menangani concurrency lebih baik | Semua request 200, tidak ada 'too many connections' | Tidak Regresi (Improvement) |
| RT-I10 | createOffer() dengan FOR UPDATE saat ada 5 request bersamaan pada produk yang sama | Pastikan locking mechanism tetap konsisten dengan pool baru | Hanya 1 yang berhasil INSERT, sisanya menunggu lock atau menerima 409 | Tidak Regresi |
| RT-I11 | Idle connection setelah 5 menit tidak ada aktivitas | Pastikan idleTimeout baru tidak memutus koneksi yang dibutuhkan tiba-tiba | Koneksi baru dibuat otomatis saat ada request setelah idle | Tidak Regresi |

# **5\. Ringkasan Hasil Ketiga Skenario**

| **Skenario** | **Total TC** | **Tidak Regresi** | **Perilaku Berubah (Disengaja)** | **Bug Teratasi** | **Perlu Verifikasi** |
| --- | --- | --- | --- | --- | --- |
| 1\. Fitur Baru (Pricing) | 6   | 4   | 0   | 0   | 1 (RT-N05) |
| 2\. Bug Fix (FI-01, FI-05) | 8   | 6   | 0   | 2   | 0   |
| 3\. Infrastruktur (Config, Dependency, DB Pool) | 11  | 9   | 2   | 0   | 0   |
| TOTAL | 25  | 19  | 2   | 2   | 1   |

# **6\. Kesimpulan Regression Testing**

1.  Regression Testing berhasil dilakukan terhadap 3 skenario pemicu yang berbeda — penambahan fitur baru (Pricing), perbaikan bug (FI-01, FI-05), dan perubahan infrastruktur (konfigurasi JWT, upgrade dependency, connection pool) — dengan total 25 test case.
2.  Skenario Fitur Baru (Pricing) mengkonfirmasi bahwa modul Produk yang sudah ada (createProduct, getProducts) tidak terganggu oleh penambahan endpoint dan service baru, sesuai prinsip pengembangan yang aman (additive, non-breaking).
3.  Skenario Bug Fix mengkonfirmasi 2 bug Critical (double commit, TokenExpiredError) berhasil diperbaiki tanpa menimbulkan regresi pada 6 test case lama yang di-retest.
4.  Skenario Infrastruktur menunjukkan bahwa perubahan konfigurasi (JWT\_EXPIRES\_IN) menghasilkan perubahan perilaku yang DISENGAJA (token lebih cepat expired) — bukan bug, melainkan dampak yang diharapkan dari keputusan keamanan. Upgrade dependency dan connection pool terbukti backward compatible tanpa regresi.
5.  Dari 25 total test case, 19 (76%) menunjukkan tidak ada regresi, 2 (8%) menunjukkan perubahan perilaku yang disengaja sesuai tujuan perubahan, 2 (8%) mengkonfirmasi bug berhasil diperbaiki, dan 1 (4%) memerlukan verifikasi desain lebih lanjut (apakah endpoint pricing wajib login atau tidak).