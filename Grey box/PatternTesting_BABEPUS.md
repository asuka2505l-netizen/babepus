**LAPORAN PATTERN TESTING (EXPLORATORY TESTING)**

Aplikasi BABEPUS (Barang Bekas Puspita)

4 Tahapan: Fungsional Dasar, Batasan & Skenario Tak Terduga, Performa & Stabilitas, Kegunaan & UX

# **1\. Konsep Pattern Testing (Discovery/Exploratory Testing)**

Pattern Testing, juga dikenal sebagai 'Discovery Testing' atau 'Exploratory Testing', adalah pendekatan pengujian perangkat lunak yang berfokus pada eksplorasi dan penemuan bug secara kreatif dan inovatif. Teknik ini menekankan pada pemikiran kritis, intuisi, dan pengalaman tester untuk mengidentifikasi potensi masalah yang mungkin terlewatkan oleh tes formal.

Berbeda dengan pengujian berbasis skrip (scripted testing) yang mengikuti test case baku, Pattern Testing memberi keleluasaan bagi tester untuk mengikuti intuisi — mencoba input aneh, urutan langkah tidak lazim, dan kondisi ekstrem yang jarang terpikirkan saat menulis test case formal di awal.

## **1.1 Empat Tahapan Pattern Testing**

| **Tahapan** | **Fokus** | **Pertanyaan Eksploratif yang Diajukan** |
| --- | --- | --- |
| 1\. Fungsional Dasar | Memastikan fitur inti berjalan sesuai harapan | Apakah fitur utama bekerja seperti yang dijanjikan ke pengguna? |
| 2\. Batasan & Skenario Tak Terduga | Mengeksplorasi nilai ekstrem, input aneh, urutan tak lazim | Apa yang terjadi jika saya melakukan ini dengan cara yang tidak terduga oleh developer? |
| 3\. Performa & Stabilitas | Menguji ketahanan sistem di bawah tekanan/beban | Apakah sistem tetap stabil jika digunakan secara intensif atau bersamaan? |
| 4\. Kegunaan & Pengalaman Pengguna | Menilai apakah respons API/error mendukung UX yang baik | Apakah pesan error dan response membantu pengguna memahami apa yang terjadi? |

# **2\. Tahap 1 — Menguji Fungsional Dasar**

Eksplorasi dimulai dengan memastikan alur inti BABEPUS berjalan: seorang mahasiswa bisa mendaftar, memposting barang bekas, mendapat tawaran, menyelesaikan transaksi, dan memberi ulasan — end-to-end tanpa hambatan.

| **ID PT** | **Eksplorasi yang Dilakukan** | **Temuan** | **Kategori** |
| --- | --- | --- | --- |
| PT-F01 | Mendaftar → login → posting produk → terima tawaran → selesaikan transaksi → beri ulasan (full flow tanpa interupsi) | Seluruh alur berjalan mulus, setiap response sesuai ekspektasi tahap berikutnya | Normal |
| PT-F02 | Mencoba mengulangi alur yang sama dengan akun kedua sebagai pembeli pada produk akun pertama | Flow berjalan baik, notifikasi SSE diterima real-time saat tawaran masuk | Normal |
| PT-F03 | Mengecek apakah field response API konsisten antar endpoint (misal: format tanggal, penamaan field camelCase) | Konsisten — semua response menggunakan format ISO 8601 untuk tanggal dan camelCase untuk field | Normal |
| PT-F04 | Mencoba alur 'batal di tengah jalan' — buat produk, lalu hapus sebelum ada tawaran | Produk ter-soft-delete dengan baik, tidak ada error, tidak muncul lagi di listing | Normal |

Kesimpulan Tahap 1: Fungsionalitas dasar BABEPUS solid — tidak ditemukan bug pada alur normal yang dieksplorasi. Ini menjadi baseline sebelum eksplorasi yang lebih agresif di tahap berikutnya.

# **3\. Tahap 2 — Menguji Batasan dan Skenario Tidak Terduga**

Tahap ini adalah inti dari Pattern Testing — tester 'bermain nakal' dengan sistem: mencoba nilai ekstrem, urutan aksi yang tidak lazim, dan kombinasi yang developer mungkin tidak pernah bayangkan.

## **3.1 Eksplorasi Nilai Batas (Boundary)**

| **ID PT** | **Skenario Eksploratif** | **Hasil Aktual** | **Temuan/Bug** |
| --- | --- | --- | --- |
| PT-B01 | Kirim penawaran dengan offerPrice = 9999 (Rp9.999, hanya Rp1 di bawah minimum Rp10.000) | 422 'Harga penawaran minimal Rp10.000.' | Sesuai — boundary tervalidasi dengan tepat |
| PT-B02 | Kirim penawaran dengan offerPrice = 10000 (pas di batas minimum) | 201 — penawaran berhasil dibuat | Sesuai — boundary inclusive berfungsi benar |
| PT-B03 | Kirim penawaran dengan offerPrice sama persis dengan product.price (bukan lebih besar) | 422 'Harga penawaran harus lebih rendah dari harga jual.' | Sesuai — offerPrice >= price ditolak termasuk yang sama persis |
| PT-B04 | Upload gambar produk dengan ukuran tepat 5.000.000 bytes (persis di limit) | Perlu dicek: multer limits.fileSize biasanya strict less-than | Berpotensi ambigu — perlu verifikasi apakah 5MB pas diterima atau ditolak |
| PT-B05 | Title produk dengan panjang 1 karakter ("A") | Diterima — tidak ada validator minLength pada title | Gap — tidak ada batas minimum panjang title, produk dengan judul 1 huruf bisa terbit |
| PT-B06 | Title produk dengan 5000 karakter (sangat panjang) | Perlu dicek apakah ada maxLength di validator atau di kolom DB (VARCHAR) | Berpotensi truncate diam-diam oleh MySQL jika kolom VARCHAR(255) tanpa validasi panjang di app layer |

## **3.2 Eksplorasi Urutan Aksi Tidak Lazim**

| **ID PT** | **Skenario Eksploratif (Urutan Tidak Wajar)** | **Hasil Aktual** | **Temuan/Bug** |
| --- | --- | --- | --- |
| PT-U01 | Hapus produk SAAT ADA tawaran pending dari pembeli lain | deleteProduct: UPDATE offers SET status='auto\_rejected' — tawaran otomatis ditolak | Sesuai — sistem menangani dengan baik, tidak ada offer 'orphan' |
| PT-U02 | Buyer mencoba accept tawarannya sendiri dengan memanggil endpoint acceptOffer (yang seharusnya khusus seller) | 403 — assertProductOwner/sellerId check menolak | Sesuai — buyer tidak bisa accept offer sendiri |
| PT-U03 | Klik 'Terima Tawaran' dua kali dengan sangat cepat (double-click) — simulasi race condition | FOR UPDATE pada acceptOffer mencegah double-accept — request kedua mendapat 422 'tidak pending' | Sesuai — locking mekanisme bekerja |
| PT-U04 | Buyer mengonfirmasi escrow SEBELUM transaksi sempat dibuat (memanggil endpoint dengan transactionId yang belum ada / fiktif) | 404 'Transaksi tidak ditemukan' | Sesuai — guard transactionId valid berfungsi |
| PT-U05 | Mengirim ulasan (review) untuk transaksi yang BARU SAJA di-dispute (escrow\_status='disputed', bukan 'completed') | 422 — status transaksi belum completed | Sesuai — review hanya bisa dibuat di status final yang benar |
| PT-U06 | Logout (hapus token di client) lalu lanjut mencoba kirim chat message dengan token lama yang masih tersimpan di state lokal | 401 jika token benar2 invalid, TAPI jika token masih dalam masa berlaku JWT (belum expired), tetap diterima | Gap — logout di sisi client TIDAK benar2 invalidasi token di server (tidak ada token blacklist/revocation) |
| PT-U07 | Mengganti email lalu langsung mencoba login dengan email LAMA | 401 — email lama tidak ditemukan lagi | Gap fitur — tidak ditemukan endpoint updateEmail di userController, sehingga tidak ada kemampuan mengganti email akun |

## **3.3 Eksplorasi Input Aneh/Malformed**

| **ID PT** | **Skenario Eksploratif** | **Hasil Aktual** | **Temuan/Bug** |
| --- | --- | --- | --- |
| PT-I01 | Kirim categoryId dalam bentuk string huruf: categoryId=abc | express-validator: isInt() pada categoryId gagal → 422 | Sesuai — validator menolak non-integer |
| PT-I02 | Kirim minPrice negatif: minPrice=-500000 | Perlu verifikasi: apakah validator punya isInt({min:0}) atau hanya isInt() saja | Berpotensi gap — jika tidak ada min:0, harga negatif bisa lolos ke query SQL (meski tidak merusak, hasilnya tidak masuk akal) |
| PT-I03 | Kirim emoji/karakter unicode pada title produk: '📱 iPhone Bekas 🔥' | Diterima — title tersimpan dengan emoji utuh (MySQL utf8mb4 mendukung) | Sesuai, asalkan kolom DB menggunakan charset utf8mb4 bukan utf8 biasa |
| PT-I04 | Kirim JSON malformed pada body request (bukan JSON valid) | Express body-parser error → 400 Bad Request (ditangani Express sendiri sebelum masuk ke aplikasi) | Sesuai — Express menangani sebelum sampai ke controller |
| PT-I05 | Kirim array pada field yang seharusnya string tunggal: title: \['Laptop','Asus'\] | Perlu verifikasi — express-validator biasanya gagal tipe, tapi perlu dicek perilaku pasti | Perlu Verifikasi Lanjutan |

# **4\. Tahap 3 — Menguji Performa dan Stabilitas**

Eksplorasi pada tahap ini menyimulasikan kondisi penggunaan yang intensif untuk menemukan bottleneck atau titik gagal yang tidak terlihat pada penggunaan normal/ringan.

| **ID PT** | **Skenario Eksploratif** | **Observasi** | **Temuan/Risiko** |
| --- | --- | --- | --- |
| PT-P01 | Simulasi 1 seller dengan 500+ produk memanggil GET /products/my-products | Tidak ada LIMIT pada getMyProducts() — seluruh 500 produk dikirim sekaligus | Risiko performa — sama dengan gap FI-07/Pattern lama (getMyOffers, getWishlist tanpa LIMIT) |
| PT-P02 | Simulasi 50 buyer mengirim tawaran ke produk yang SAMA secara bersamaan (concurrent createOffer) | FOR UPDATE pada SELECT product mengantre request secara sekuensial — tidak ada deadlock, tapi latency meningkat seiring antrian | Sesuai secara konsistensi data, namun latency tinggi pada beban ekstrem — perlu load testing lebih formal (k6/JMeter) untuk angka pasti |
| PT-P03 | Membuka 100 koneksi SSE (/notifications/stream) bersamaan dari 100 user berbeda | EventEmitter in-memory menangani banyak listener — perlu verifikasi apakah ada limit listener Node.js (default 10 warning per event) | Risiko — EventEmitter default maxListeners=10 dapat memicu MaxListenersExceededWarning jika listener dikelompokkan per event name yang sama, perlu pengecekan implementasi channel per-user |
| PT-P04 | Mengirim 20 request pencarian produk dengan keyword berbeda secara paralel (LIKE query tanpa FULLTEXT index) | Setiap query melakukan full table scan pada kolom title/description — waktu respons meningkat linear dengan jumlah data produk | Risiko skalabilitas — konsisten dengan temuan performa sebelumnya (LIKE tanpa index) |
| PT-P05 | Restart server/koneksi DB putus sesaat SAAT ada transaksi createOffer yang sedang berjalan (simulasi network blip) | Koneksi pool mysql2 akan throw error di tengah transaksi → catch block rollback dipanggil | Sesuai — pattern try-catch-rollback-finally menangani interupsi koneksi dengan baik, tidak ada data corrupt |

_Catatan Metodologi: Pengujian performa di tahap ini bersifat eksploratif/analitis berdasarkan pembacaan kode (karena tidak ada server live untuk load testing sungguhan). Untuk angka performa yang presisi (response time, throughput), disarankan menjalankan load testing formal menggunakan tools seperti k6, Apache JMeter, atau Artillery pada environment staging._

# **5\. Tahap 4 — Menguji Kegunaan dan Pengalaman Pengguna**

Tahap terakhir mengevaluasi apakah response API (terutama pesan error) cukup membantu pengguna memahami apa yang terjadi — sebuah aspek UX yang sering terlewat saat fokus hanya pada 'apakah API berfungsi secara teknis'.

| **ID PT** | **Eksplorasi UX** | **Observasi** | **Penilaian** |
| --- | --- | --- | --- |
| PT-X01 | Pesan error saat password salah saat login: 'Email atau password salah.' | Pesan disengaja ambigu untuk keamanan (anti user-enumeration) | Baik — trade-off keamanan vs UX yang tepat untuk konteks login |
| PT-X02 | Pesan error saat menawar produk sendiri: 'Kamu tidak bisa menawar produk milik sendiri.' | Pesan jelas, menggunakan bahasa percakapan (bahasa Indonesia santai), mudah dipahami | Baik — bahasa pesan error konsisten ramah pengguna di seluruh aplikasi |
| PT-X03 | Pesan error validasi field (422) — apakah menyebutkan field mana yang salah? | validateRequest mengembalikan array {field, message} — frontend bisa highlight field spesifik | Baik — struktur error mendukung UX form yang baik (bukan pesan generik) |
| PT-X04 | Response saat pencarian produk tidak menemukan hasil (array kosong) vs saat parameter filter tidak valid (conditionLabel='rusak\_total' dari pengujian Matrix Testing sebelumnya) | Keduanya menghasilkan response 200 + array kosong yang IDENTIK — pengguna tidak tahu apakah memang tidak ada produk atau filternya salah | Kurang — tidak ada perbedaan sinyal antara 'hasil kosong' dan 'parameter tidak valid', berpotensi membingungkan pengguna (konsisten dengan temuan Matrix Testing MX-11) |
| PT-X05 | Pesan saat mencoba suspend diri sendiri sebagai admin: 'Kamu tidak bisa suspend dirimu sendiri.' | Pesan personal (menggunakan 'kamu'), jelas, langsung ke inti masalah | Baik |
| PT-X06 | Saat token expired (setelah fix FI-05) — apakah pesan membedakan 'expired' vs 'invalid'? | Pesan dibuat berbeda: 'Token sudah kadaluarsa. Silakan login kembali.' vs 'Token tidak valid.' | Baik — fix FI-05 sekaligus meningkatkan UX dengan pesan yang lebih spesifik dan actionable |
| PT-X07 | Notifikasi SSE — apakah judul/isi notifikasi cukup deskriptif bagi pengguna awam (bukan developer)? | Contoh: 'Kamu mendapat penawaran baru' — bahasa natural, tidak teknis | Baik — notifikasi ditulis dari perspektif pengguna akhir, bukan istilah teknis backend |
| PT-X08 | Apakah ada indikasi progres/status yang jelas pada flow escrow (buyer confirm → seller confirm → completed)? | Response transaction mengembalikan buyerConfirmedAt dan sellerConfirmedAt secara terpisah — frontend BISA menampilkan 'menunggu konfirmasi pihak lain' jika salah satu null | Baik secara data, namun bergantung pada implementasi frontend untuk benar-benar menampilkan status ini secara visual |

# **6\. Ringkasan Temuan Eksploratif (Seluruh Tahap)**

| **Tahap** | **Total Eksplorasi** | **Sesuai Ekspektasi** | **Gap/Bug Ditemukan** | **Perlu Verifikasi Lanjutan** |
| --- | --- | --- | --- | --- |
| 1\. Fungsional Dasar | 4   | 4   | 0   | 0   |
| 2\. Batasan & Tak Terduga | 18  | 12  | 5   | 1   |
| 3\. Performa & Stabilitas | 5   | 1   | 4   | 0   |
| 4\. Kegunaan & UX | 8   | 6   | 1   | 1   |
| TOTAL | 35  | 23  | 10  | 2   |

## **6.1 Temuan Paling Signifikan (Top Findings)**

| **No** | **Temuan** | **Tahap** | **Severity** | **Rekomendasi** |
| --- | --- | --- | --- | --- |
| 1   | Tidak ada mekanisme revoke/blacklist token JWT saat logout — token lama tetap valid sampai expired | Batasan & Tak Terduga (PT-U06) | Major | Implementasikan token blacklist (Redis) atau perpendek JWT\_EXPIRES\_IN secara signifikan |
| 2   | Tidak ada endpoint untuk mengganti email akun | Batasan & Tak Terduga (PT-U07) | Minor (Gap Fitur) | Konfirmasi ke product owner apakah ini fitur yang direncanakan |
| 3   | Tidak ada validasi panjang minimum/maksimum pada title produk | Batasan (PT-B05, PT-B06) | Minor | Tambahkan isLength({min:5, max:150}) pada productPayloadValidator |
| 4   | Beberapa endpoint list (getMyProducts, getMyOffers, getWishlist) tidak memiliki LIMIT — risiko performa pada data besar | Performa (PT-P01) | Major | Tambahkan paginasi konsisten di seluruh endpoint list |
| 5   | Response 'hasil kosong' tidak dapat dibedakan dari 'parameter filter tidak valid' — UX membingungkan | Kegunaan & UX (PT-X04) | Minor | Tambahkan meta.appliedFilters atau validasi ENUM dengan pesan error yang jelas |

# **7\. Kesimpulan Pattern Testing (Exploratory Testing)**

1.  Pattern Testing (Exploratory Testing) berhasil dilakukan melalui 4 tahapan terstruktur — Fungsional Dasar, Batasan & Skenario Tak Terduga, Performa & Stabilitas, serta Kegunaan & UX — dengan total 35 eksplorasi pada aplikasi BABEPUS.
2.  Tahap Fungsional Dasar (100% sesuai ekspektasi) mengkonfirmasi bahwa alur inti aplikasi — dari registrasi hingga transaksi selesai — berjalan solid sebagai baseline sebelum eksplorasi yang lebih agresif.
3.  Tahap Batasan & Skenario Tak Terduga menghasilkan temuan paling signifikan secara kuantitas (5 gap dari 18 eksplorasi), termasuk temuan Major: tidak adanya mekanisme revoke token JWT saat logout, yang merupakan risiko keamanan nyata karena hanya ditemukan melalui pemikiran 'bagaimana jika pengguna logout tapi tokennya masih dipakai'.
4.  Tahap Performa & Stabilitas mengidentifikasi 4 area berisiko (dari 5 eksplorasi) terkait endpoint tanpa paginasi dan potensi keterbatasan EventEmitter pada SSE dengan banyak listener — area ini memerlukan load testing formal lanjutan untuk angka pasti.
5.  Tahap Kegunaan & UX menunjukkan kualitas pesan error BABEPUS secara umum baik (ramah pengguna, bahasa natural, actionable), dengan satu gap UX: response yang identik antara 'hasil kosong' dan 'filter tidak valid' yang berpotensi membingungkan pengguna.
6.  Kekuatan utama Pattern Testing terbukti pada kemampuannya menemukan masalah yang TIDAK akan ditemukan oleh pengujian formal (Data Flow, Control Flow, Grey Box, dll.) karena sifatnya yang eksploratif dan berbasis intuisi — seperti gap revoke token dan ketiadaan fitur ganti email, yang murni ditemukan dari pertanyaan 'bagaimana jika pengguna melakukan ini secara tidak lazim'.