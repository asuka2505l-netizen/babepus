# Software Test Plan

## 1. Introduction

### 1.1 Purpose
Dokumen ini menyajikan rencana pengujian profesional untuk aplikasi BabePus yang telah diamati dalam kode sumber. Rencana ini dirancang untuk memastikan kualitas fungsional, antarmuka pengguna, kompatibilitas, API, dan keamanan dasar dari aplikasi marketplace web.

### 1.2 Scope
Rencana ini mencakup pengujian untuk semua fitur yang ditemukan dalam kode frontend dan backend, termasuk autentikasi, browsing produk, manajemen daftar jual, wishlist, offer, transaksi, chat, review, laporan, notifikasi, dan fungsi admin. Fokus pengujian adalah pada aplikasi web; tidak termasuk pengujian APK Android karena aplikasi yang dianalisis adalah web-based.

### 1.3 Testing Objectives
- Memverifikasi bahwa fitur utama marketplace berfungsi sesuai spesifikasi kode yang ada.
- Menilai konsistensi UI dan pengalaman pengguna pada halaman kunci.
- Menguji integritas API dan aliran data antara frontend dan backend.
- Menemukan masalah keamanan dasar pada otentikasi, validasi input, dan session handling.
- Menyediakan data risiko dan rekomendasi perbaikan untuk pemangku kepentingan.

## 2. Application Overview
Aplikasi BabePus adalah platform marketplace berbasis web untuk pembelian dan penjualan barang bekas di lingkungan kampus. Fitur utama yang diamati meliputi:
- Pembuat akun, login, dan retrieval data pengguna.
- Halaman marketplace dengan filter kategori, pencarian, harga, dan paging.
- Detail produk dengan tombol wishlist, pembuatan offer, chat realtime, dan laporan produk/user.
- Dashboard pengguna untuk melihat produk saya, penawaran masuk, transaksi, wishlist, dan profil.
- Modul admin untuk dashboard ringkasan, manajemen pengguna, daftar produk, dan laporan.
- Backend API RESTful untuk autentikasi, produk, penawaran, transaksi, chat, review, report, wishlist, notifikasi, kategori, dan pricing estimate.

## 3. Features To Be Tested
1. User registration dan login.
2. Autentikasi JWT dan akses endpoint terproteksi.
3. Viewing marketplace products with filtering, sorting, dan pagination.
4. Product detail view termasuk informasi seller, status produk, dan review.
5. Wishlist add/remove.
6. Product creation, edit, delete, dan mark sold.
7. Pricing estimate pada form produk.
8. Offer submission, incoming offers, accept/reject flow.
9. Transaction history dan status update.
10. Chat initiation dan pengiriman pesan dalam conversation.
11. Review submission untuk transaksi selesai.
12. Report submission untuk produk atau pengguna.
13. Notification fetch, stream, mark read, mark all read.
14. Admin dashboard, user list, suspend user, product list, reports list, update report status.

## 4. Features Not Tested
- Mekanisme pengiriman email notifikasi backend dan isi email untuk user suspend belum dapat diverifikasi hanya dari frontend. **Perlu Verifikasi**.

## 5. Testing Scope

### 5.1 Functional testing
- Validasi semua alur fungsionalitas utama berdasarkan use case aktual.
- Pengujian end-to-end untuk register, login, daftar produk, penawaran, transaksi, review, dan laporan.

### 5.2 UI/UX testing
- Evaluasi konsistensi tampilan pada halaman utama, detail produk, dashboard, dan modal input.
- Verifikasi responsif layout untuk resolusi desktop umum.
- Pemeriksaan teks pesan toast, tombol, label form, dan error validation.

### 5.3 Compatibility testing
- Uji pada browser modern: Chrome, Firefox, Edge.
- Verifikasi tampilan pada resolusi desktop standar: 1366x768, 1440x900, 1920x1080.
- Karena aplikasi berbasis web, uji WebView hanya dilakukan jika aplikasi ditempatkan dalam wrapper hybrid.

### 5.4 API testing
- Uji endpoint RESTful utama menggunakan koleksi API (Postman/Insomnia).
- Verifikasi respons status, payload, dan header Authorization.
- Uji endpoint terproteksi tanpa token, token tidak valid, dan token valid.

### 5.5 Security testing dasar
- Validasi input pada formulir autentikasi, pembuatan produk, offer, review, dan report.
- Verifikasi session handling JWT dan penolakan akses pada endpoint tanpa otorisasi.
- Uji error handling untuk input invalid dan resource tidak ditemukan.

### 5.6 Performance testing dasar
- Pengujian beban ringan pada halaman marketplace dengan jumlah produk dan paginasi.
- Memeriksa kecepatan render halaman marketplace, detail produk, dan dashboard di browser.
- Memantau waktu respons API untuk request utama seperti `GET /products`, `POST /offers`, `GET /transactions/my`.

## 6. Test Environment

### 6.1 Device
- Desktop / laptop (Windows atau macOS).
- Perangkat dengan layar standar untuk pengujian responsive.

### 6.2 Android version
- Tidak berlaku: aplikasi yang dianalisis adalah web-based marketplace, bukan APK Android.

### 6.3 Browser/WebView
- Google Chrome (versi terbaru stabil).
- Mozilla Firefox (versi terbaru stabil).
- Microsoft Edge (versi terbaru stabil).

### 6.4 Internet connection
- Koneksi broadband stabil.
- Uji juga pada kondisi jaringan biasa untuk memeriksa perilaku loading dan timeout.

### 6.5 Testing tools
- Postman / Insomnia untuk API testing.
- Browser DevTools untuk inspeksi network dan console error.
- Lightshot / Greenshot untuk screenshot bug.
- Spreadsheet atau bug tracker untuk pencatatan hasil.
- Optional: Lighthouse untuk analisis performa dasar.

## 7. Testing Strategy

Pendekatan pengujian yang digunakan adalah gabungan:
- **Black-box testing** untuk memvalidasi output terhadap input tanpa mengetahui detail internal.
- **API testing** untuk endpoint backend utama.
- **Functional testing** untuk memeriksa aliran transaksi dari user action hingga hasil backend.
- **Regression testing** pada modul kritikal seperti autentikasi, produk, dan penawaran setelah perubahan.
- **Exploratory testing** di area UI dan notifikasi untuk menemukan problem usability atau inkonsistensi.

## 8. Test Scenarios
1. Registrasi dan login user baru.
2. Akses marketplace sebagai guest dan authenticated user.
3. Filter produk berdasarkan kategori, harga, dan kata kunci.
4. Menambahkan dan menghapus produk dari wishlist.
5. Membuka detail produk dan memeriksa informasi seller, gambar, dan review.
6. Mengirim chat ke seller dan memastikan pesan dikirim.
7. Membuat penawaran pada produk aktif.
8. Seller melihat penawaran masuk dan menerima/menolak penawaran.
9. Buyer melihat history transaksi dan status offer.
10. User membuat review setelah transaksi selesai.
11. User melaporkan produk atau seller.
12. Admin melihat dashboard ringkasan, daftar produk, daftar laporan, serta mengubah status laporan.
13. Endpoint API menolak akses tanpa Authorization header yang valid.
14. Form input validasi untuk harga, komentar review, dan data laporan.

## 9. Sample Test Cases

| Test Case ID | Feature Name | Preconditions | Steps | Expected Result | Actual Result | Status |
|--------------|--------------|---------------|-------|-----------------|---------------|--------|
| TC-001 | User Registration | Tidak login, halaman register terbuka | 1. Buka halaman register 2. Isi nama, email, password valid 3. Klik Register | Akun dibuat, user diarahkan login atau dashboard | TBD | Pending |
| TC-002 | User Login | Akun terdaftar tersedia | 1. Buka halaman login 2. Isi email/password benar 3. Klik Login | Terima JWT, redirect ke marketplace/dashboard | TBD | Pending |
| TC-003 | Product Browsing | User terautentikasi / guest | 1. Buka halaman marketplace 2. Gunakan filter kategori 3. Klik halaman berikutnya | Produk tampil sesuai filter, pagination bekerja | TBD | Pending |
| TC-004 | Create Offer | User login, buka detail produk aktif milik orang lain | 1. Buka Product Detail 2. Isi offer amount 3. Kirim offer | Offer tersimpan, notifikasi dibuat, status pending | TBD | Pending |
| TC-005 | Admin Update Report Status | Login sebagai admin | 1. Buka admin reports 2. Pilih laporan 3. Ubah status | Status laporan terupdate, response API sukses | TBD | Pending |

## 10. Defect Management

### 10.1 Severity
- **Critical**: Sistem tidak dapat login, data utama hilang, transaksi gagal total, keamanan bocor.
- **High**: Fitur offer/transaction/chat/wishlist gagal, endpoint terproteksi bisa diakses tanpa otorisasi.
- **Medium**: Fitur harga/pricing estimation, review, dan report tidak konsisten.
- **Low**: Masalah tampilan, teks salah ketik, dan peringatan minor.

### 10.2 Priority
- **P1**: Perbaikan segera sebelum rilis (Critical/High).
- **P2**: Perbaikan penting tetapi tidak menghentikan rilis (High/Medium).
- **P3**: Perbaikan optional di sprint berikutnya (Medium/Low).

### 10.3 Bug lifecycle
1. New / Open
2. Assigned
3. In Progress
4. Fixed
5. Retest
6. Closed
7. Reopened (jika masih gagal)

## 11. Risk Analysis

| Risk | Impact | Mitigation |
|------|--------|------------|
| Login/Register gagal | High | Prioritaskan pengujian autentikasi dan validasi input |
| Offer/transaction incoherence | High | Uji alur end-to-end dengan data real; cek status offer/transaction |
| Access control missing | High | Verifikasi semua endpoint terproteksi JWT |
| UI broken pada pagination/filter | Medium | Uji halaman marketplace di resolusi berbeda |
| Data review/report tidak tersimpan | Medium | Buat test case insert review/report dan verifikasi response |
| Notifikasi realtime tidak muncul | Medium | Verifikasi stream dan mark-as-read endpoint |

## 11.1 Test Schedule

| Phase | Description | Duration | Output |
|-------|-------------|----------|--------|
| Requirement review | Analisis fitur aktual dari frontend/backend dan dokumen use case | 1 hari | Daftar test case awal |
| Test design | Penyusunan skenario, test case, dan environment | 1 hari | Dokumen test case dan test plan |
| Test execution | Eksekusi test case fungsional, API, dan UI | 2-3 hari | Hasil eksekusi dan bug report |
| Regression & retest | Validasi perbaikan bug dan pemeriksaan ulang | 1-2 hari | Hasil retest dan status bug |
| Test summary | Penyusunan laporan akhir dan rekomendasi | 1 hari | Test summary report |

## 12. Compatibility Testing

- Verifikasi pada resolusi 1366x768, 1440x900, dan 1920x1080.
- Uji pada Chrome, Firefox, dan Edge.
- Periksa elemen penting seperti navigasi, tombol action, form input, dan tabel dashboard.
- Jika aplikasi ditempatkan dalam WebView, verifikasi header authorization dan modal produk tetap responsif.

## 13. Security Testing

### 13.1 Input validation
- Uji `login` dengan email invalid dan password kosong.
- Uji `register` dengan password pendek atau email format salah.
- Uji `createProduct`, `createOffer`, `createReview`, dan `createReport` dengan data kosong atau invalid.

### 13.2 Session handling
- Uji akses API terproteksi tanpa token.
- Uji akses API terproteksi dengan token kadaluwarsa / invalid.
- Verifikasi bahwa logout atau token tidak valid memaksa redirect login.

### 13.3 Authentication
- Pastikan endpoint `POST /auth/login` hanya menerima kredensial valid.
- Pastikan endpoint `GET /auth/me` hanya mengembalikan data ketika token valid.

### 13.4 Error handling
- Pastikan status code HTTP sesuai: 400 untuk validation, 401 untuk unauthorized, 404 untuk resource tidak ditemukan.
- Verifikasi pesan error tidak mengekspos informasi sensitif.

## 14. Test Deliverables
- Bug report lengkap dengan severity, priority, langkah reproduksi, dan screenshot.
- Daftar test case yang disusun dan hasil eksekusi.
- Screenshot bukti masalah UI, error response API, dan perbedaan tampilan.
- Ringkasan pengujian dengan cakupan, hasil, dan rekomendasi.

## 15. Conclusion
Rencana pengujian ini difokuskan pada fitur yang benar-benar tersedia dalam kode sumber aplikasi BabePus. Semua skenario dikembangkan berdasarkan observasi aktual dari halaman marketplace, product detail, dashboard pengguna, API backend, dan modul admin. Area yang tidak jelas diklasifikasikan sebagai **Perlu Verifikasi** untuk memastikan tidak ada asumsi fitur baru.
