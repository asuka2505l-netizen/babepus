**LAPORAN MATRIX TESTING**

Fitur Pencarian & Filter Produk — Aplikasi BABEPUS

Studi Kasus: GET /api/products?search=...&categoryId=...&conditionLabel=...

# **1\. Konsep Matrix Testing**

Matrix Testing adalah teknik pengujian perangkat lunak yang sistematis dan terstruktur untuk menguji berbagai kombinasi input dan kondisi dalam suatu aplikasi. Teknik ini membantu mengidentifikasi bug yang disebabkan oleh interaksi antara parameter atau faktor yang berbeda dalam aplikasi — bug yang seringkali tidak muncul saat parameter diuji satu per satu, tetapi baru terlihat saat beberapa parameter dikombinasikan secara bersamaan.

## **1.1 Studi Kasus**

_Aplikasi BABEPUS memiliki fitur pencarian dan filter produk yang memungkinkan pengguna mencari barang bekas berdasarkan kata kunci (search), kategori (categoryId), dan kondisi barang (conditionLabel). Endpoint yang diuji: GET /api/products, diimplementasikan pada fungsi getProducts(query, currentUserId) di productService.js._

## **1.2 Empat Langkah Matrix Testing**

| **Langkah** | **Aktivitas** | **Output** |
| --- | --- | --- |
| 1\. Definisikan Parameter dan Kondisi | Identifikasi parameter input yang saling berinteraksi dan tentukan nilai/kondisi yang mewakili setiap parameter | Daftar parameter beserta nilai (kosong/terisi) untuk masing-masing |
| 2\. Membuat Tabel Matriks | Susun seluruh kombinasi parameter ke dalam tabel matriks — baris = kombinasi, kolom = parameter | Tabel matriks kombinasi lengkap |
| 3\. Menjalankan Test Case | Eksekusi setiap baris kombinasi sebagai request nyata ke endpoint, catat hasil aktual | Tabel hasil eksekusi dengan status Pass/Fail |
| 4\. Analisis Hasil | Bandingkan hasil aktual vs ekspektasi, identifikasi pola kegagalan akibat interaksi parameter | Daftar bug interaksi parameter (jika ada) dan kesimpulan |

# **2\. Langkah 1 — Definisikan Parameter dan Kondisi**

Berdasarkan fungsi getProducts() pada productService.js, fitur pencarian BABEPUS memiliki 3 parameter utama yang saling berinteraksi dan berpotensi menimbulkan bug kombinasi:

// productService.js — getProducts(query, currentUserId)  
const conditions = \['p.deleted\_at IS NULL', "p.status = 'active'", 'u.is\_suspended = 0'\];  
  
if (query.search) conditions.push('(p.title LIKE ? OR p.description LIKE ?...)');  
if (query.categoryId) conditions.push('p.category\_id = ?');  
if (query.conditionLabel) conditions.push('p.condition\_label = ?');  
// Ketiga parameter ini digabung dengan AND — berpotensi interaksi bug

| **Parameter** | **Kondisi A (Kosong/Tidak Diisi)** | **Kondisi B (Diisi Valid)** | **Kondisi C (Diisi Tidak Valid)** |
| --- | --- | --- | --- |
| search (kata kunci) | Tidak ada parameter search | search=laptop (produk dengan kata ini ada) | search=zzz\_tidak\_ada (tidak match produk apapun) |
| categoryId (kategori) | Tidak ada parameter categoryId | categoryId=1 (Elektronik, valid & ada produknya) | categoryId=999 (kategori tidak ada di DB) |
| conditionLabel (kondisi barang) | Tidak ada parameter conditionLabel | conditionLabel=good (nilai valid ENUM) | conditionLabel=rusak\_total (bukan nilai ENUM yang valid) |

Dengan 3 parameter dan 3 kondisi masing-masing, kombinasi penuh menghasilkan 3³ = 27 kemungkinan. Matrix Testing akan menyusun kombinasi yang paling relevan dan berisiko tinggi menimbulkan bug interaksi.

# **3\. Langkah 2 — Membuat Tabel Matriks**

Tabel matriks berikut menyusun kombinasi parameter search × categoryId × conditionLabel. Baris ditandai dengan kode kondisi: K=Kosong, V=Valid, X=Invalid.

| **No** | **search** | **categoryId** | **conditionLabel** | **Kombinasi** | **Ekspektasi Hasil** |
| --- | --- | --- | --- | --- | --- |
| MX-01 | K   | K   | K   | Baseline (tanpa filter) | Semua produk aktif ditampilkan |
| MX-02 | V   | K   | K   | Hanya keyword | Produk yang match kata kunci 'laptop' |
| MX-03 | K   | V   | K   | Hanya kategori | Produk kategori Elektronik saja |
| MX-04 | K   | K   | V   | Hanya kondisi | Produk dengan condition\_label='good' saja |
| MX-05 | V   | V   | K   | Keyword + Kategori | Produk 'laptop' DAN kategori Elektronik |
| MX-06 | V   | K   | V   | Keyword + Kondisi | Produk 'laptop' DAN kondisi 'good' |
| MX-07 | K   | V   | V   | Kategori + Kondisi | Produk Elektronik DAN kondisi 'good' |
| MX-08 | V   | V   | V   | Ketiga filter aktif | Produk 'laptop' DAN Elektronik DAN 'good' (interseksi ketat) |
| MX-09 | X   | K   | K   | Keyword tidak match | Array kosong (hasil 0 produk) |
| MX-10 | K   | X   | K   | Kategori tidak ada | Array kosong ATAU error (tergantung implementasi) |
| MX-11 | K   | K   | X   | Kondisi tidak valid (ENUM) | Array kosong ATAU error validasi |
| MX-12 | V   | X   | V   | Keyword valid + Kategori invalid + Kondisi valid | Interaksi 3 parameter dengan 1 parameter invalid |
| MX-13 | X   | V   | X   | Keyword invalid + Kategori valid + Kondisi invalid | Interaksi 3 parameter dengan 2 parameter invalid |

_13 baris kombinasi ini dipilih untuk mencakup: baseline, single-parameter, pairwise (2 parameter), triple intersection (ketat), dan kombinasi dengan nilai invalid — yang merupakan area paling rawan bug interaksi._

# **4\. Langkah 3 — Menjalankan Test Case**

Setiap baris matriks dieksekusi sebagai request HTTP nyata ke endpoint GET /api/products. Hasil aktual diverifikasi terhadap response API dan, jika perlu, terhadap query SQL yang terbentuk di productService.js.

| **No** | **Request Aktual (URL)** | **Hasil Aktual** | **Verifikasi Internal** | **Status** |
| --- | --- | --- | --- | --- |
| MX-01 | GET /api/products | 200 + semua produk aktif (tanpa filter tambahan) | conditions hanya 3 kondisi dasar (deleted\_at, status, suspended) | Pass |
| MX-02 | GET /api/products?search=laptop | 200 + produk dengan 'laptop' di title/description | +1 kondisi LIKE ditambahkan ke WHERE | Pass |
| MX-03 | GET /api/products?categoryId=1 | 200 + produk kategori Elektronik saja | +1 kondisi category\_id=1 | Pass |
| MX-04 | GET /api/products?conditionLabel=good | 200 + produk condition\_label='good' saja | +1 kondisi condition\_label='good' | Pass |
| MX-05 | GET /api/products?search=laptop&categoryId=1 | 200 + produk 'laptop' DAN kategori Elektronik (AND, bukan OR) | 2 kondisi LIKE + category\_id digabung AND | Pass |
| MX-06 | GET /api/products?search=laptop&conditionLabel=good | 200 + produk 'laptop' DAN kondisi 'good' | 2 kondisi LIKE + condition\_label digabung AND | Pass |
| MX-07 | GET /api/products?categoryId=1&conditionLabel=good | 200 + produk Elektronik DAN kondisi 'good' | 2 kondisi category\_id + condition\_label digabung AND | Pass |
| MX-08 | GET /api/products?search=laptop&categoryId=1&conditionLabel=good | 200 + interseksi ketat (laptop + Elektronik + good) | 3 kondisi tambahan + 3 kondisi dasar = 6 total di WHERE | Pass |
| MX-09 | GET /api/products?search=zzz\_tidak\_ada | 200 + array kosong (products: \[\]) | LIKE '%zzz\_tidak\_ada%' tidak match apapun — bukan error, hasil kosong wajar | Pass |
| MX-10 | GET /api/products?categoryId=999 | 200 + array kosong (products: \[\]) | category\_id=999 tidak ada di tabel categories — JOIN tidak match, hasil kosong | Pass |
| MX-11 | GET /api/products?conditionLabel=rusak\_total | 200 + array kosong, BUKAN error validasi | conditionLabel TIDAK divalidasi terhadap ENUM di validator — query tetap jalan dengan nilai apapun | Perhatian ⚠ |
| MX-12 | GET /api/products?search=laptop&categoryId=999&conditionLabel=good | 200 + array kosong (kategori 999 tidak ada, AND membuat seluruh hasil kosong) | Interaksi AND: 1 parameter invalid membuat seluruh kombinasi gagal match | Pass (sesuai desain AND) |
| MX-13 | GET /api/products?search=zzz&categoryId=1&conditionLabel=rusak\_total | 200 + array kosong | 3 kondisi AND, dua di antaranya tidak match apapun | Pass |

# **5\. Langkah 4 — Analisis Hasil**

## **5.1 Pola Interaksi yang Teridentifikasi**

| **Pola Interaksi** | **Kombinasi Terkait** | **Temuan** |
| --- | --- | --- |
| AND, bukan OR antar parameter | MX-05, MX-06, MX-07, MX-08 | Semua parameter filter digabung dengan AND di query SQL — perilaku ini konsisten dan sesuai ekspektasi pengguna pencarian bertingkat (mempersempit hasil), bukan menggabungkan (memperluas hasil) |
| Satu parameter invalid membuat seluruh hasil kosong | MX-10, MX-12, MX-13 | Karena operator AND, jika SATU parameter tidak match data apapun (misal categoryId=999), maka seluruh kombinasi gagal menghasilkan data, meskipun 2 parameter lain valid. Ini sesuai by-design, bukan bug. |
| Tidak ada validasi nilai ENUM untuk conditionLabel | MX-11 | conditionLabel='rusak\_total' (bukan nilai ENUM yang sah: new/like\_new/good/fair/needs\_repair) diterima begitu saja oleh query tanpa error — sistem TIDAK memvalidasi bahwa nilai tersebut valid sebelum query dijalankan |

## **5.2 Defect/Gap yang Ditemukan dari Interaksi Parameter**

| **No** | **Defect** | **Kombinasi Penyebab** | **Severity** | **Rekomendasi** |
| --- | --- | --- | --- | --- |
| 1   | Parameter conditionLabel tidak divalidasi terhadap daftar ENUM yang sah sebelum dieksekusi ke query | MX-11 (hanya terlihat saat conditionLabel diisi nilai sembarang) | Minor | Tambahkan validator isIn(\['new','like\_new','good','fair','needs\_repair'\]) pada conditionLabel di productListValidator |
| 2   | Tidak ada pesan yang membedakan 'hasil kosong karena tidak match' vs 'parameter tidak valid' — keduanya menghasilkan response 200 + array kosong yang identik | MX-09, MX-10, MX-11 menghasilkan response yang sama persis | Minor | Pertimbangkan menambahkan field meta.appliedFilters di response agar frontend dapat menampilkan pesan yang lebih informatif ke pengguna |

## **5.3 Kombinasi yang TIDAK Menimbulkan Bug (Confirmed Safe)**

*   Kombinasi 2 parameter valid (MX-05, MX-06, MX-07) — semua menghasilkan AND yang benar, tidak ada query SQL yang malformed
*   Kombinasi 3 parameter valid sekaligus (MX-08) — interseksi ketat tetap menghasilkan query yang valid secara sintaks dan benar secara logika
*   Kombinasi dengan kategori tidak ada (MX-10) — JOIN dengan categories tetap aman, tidak ada SQL error, hanya hasil kosong
*   Tidak ditemukan SQL Injection melalui kombinasi parameter manapun — parameterized query (placeholder ?) konsisten digunakan di semua push(conditions)

# **6\. Kesimpulan Matrix Testing**

1.  Sebanyak 13 kombinasi matriks dari 3 parameter (search, categoryId, conditionLabel) berhasil dirancang dan dieksekusi terhadap endpoint GET /api/products, mencakup baseline, single-parameter, pairwise, triple intersection, dan kombinasi dengan nilai invalid.
2.  11 dari 13 kombinasi (85%) menunjukkan hasil Pass sesuai ekspektasi — sistem menggabungkan parameter filter dengan logika AND yang konsisten dan dapat diprediksi.
3.  Ditemukan 1 gap validasi (MX-11): parameter conditionLabel tidak divalidasi terhadap daftar ENUM yang sah sebelum dieksekusi ke query database — nilai sembarang apapun diterima sistem tanpa pesan error yang jelas.
4.  Matrix Testing pada studi kasus ini membuktikan kekuatan utamanya: bug pada MX-11 HANYA dapat ditemukan dengan menguji kombinasi nilai parameter secara spesifik (nilai invalid pada conditionLabel) — pengujian satu-per-satu parameter (single parameter testing) tidak akan menemukan gap validasi ini.
5.  Dengan menambahkan validator ENUM untuk conditionLabel, fitur pencarian dan filter produk BABEPUS dapat dinyatakan robust terhadap seluruh kombinasi parameter yang mungkin diinput pengguna.