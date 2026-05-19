# 📚 Dokumentasi Fungsi dan Method Aplikasi BabePus

Dokumentasi lengkap semua fungsi dan method dalam aplikasi BabePus, dijelaskan dengan bahasa Indonesia yang sederhana.

---

## 🔧 **FRONTEND (React) - Client Side**

### 📁 `src/services/api/client.js`
File ini mengatur komunikasi dengan server API menggunakan Axios.

#### `API_BASE_URL`
- **Fungsi**: Menyimpan alamat dasar server API
- **Kegunaan**: Digunakan sebagai base URL untuk semua request HTTP
- **Contoh**: `"http://localhost:5000/api"`

#### `API_ORIGIN`
- **Fungsi**: Menyimpan alamat asal server tanpa path `/api`
- **Kegunaan**: Digunakan untuk mengakses file gambar dan resource lainnya
- **Contoh**: `"http://localhost:5000"`

#### `setUnauthorizedHandler(handler)`
- **Fungsi**: Mengatur fungsi yang akan dipanggil saat token tidak valid (401)
- **Kegunaan**: Biasanya digunakan untuk logout otomatis saat session habis
- **Parameter**: `handler` - fungsi callback yang akan dieksekusi

#### `processQueue(error, token)`
- **Fungsi**: Memproses antrian request yang tertunda saat token sedang di-refresh
- **Kegunaan**: Menghindari request gagal saat token expired dan sedang diperbaharui

#### `api` (Axios Instance)
- **Fungsi**: Instance Axios yang sudah dikonfigurasi untuk aplikasi
- **Kegunaan**: Digunakan untuk semua HTTP request ke server
- **Fitur**: Auto-inject token, error handling, request queueing

---

### 📁 `src/context/AuthContext.jsx`
File ini mengelola state autentikasi pengguna di seluruh aplikasi.

#### `AuthProvider`
- **Fungsi**: Komponen React yang menyediakan context autentikasi
- **Kegunaan**: Membungkus aplikasi agar semua komponen bisa akses data user dan fungsi auth

#### `useState(user)` & `useState(token)`
- **Fungsi**: State untuk menyimpan data user dan token autentikasi
- **Kegunaan**: Menyimpan informasi user yang sedang login

#### `logout()`
- **Fungsi**: Keluar dari akun dan membersihkan data autentikasi
- **Kegunaan**: Menghapus token dan data user dari storage dan state

#### `refreshUser()`
- **Fungsi**: Mengambil ulang data user dari server
- **Kegunaan**: Memastikan data user selalu up-to-date, dipanggil saat aplikasi start

#### `login(payload)`
- **Fungsi**: Masuk ke akun dengan email dan password
- **Kegunaan**: Mengautentikasi user dan menyimpan token
- **Parameter**: `{email, password}`

#### `register(payload)`
- **Fungsi**: Mendaftarkan akun baru
- **Kegunaan**: Membuat akun user baru dengan data lengkap
- **Parameter**: `{fullName, email, password, phone, campus, faculty, studyProgram, studentId}`

---

### 📁 `src/services/authService.js`
File ini menangani semua operasi autentikasi di frontend.

#### `authService.register(payload)`
- **Fungsi**: Mendaftarkan user baru melalui API
- **Kegunaan**: Mengirim data registrasi ke server
- **Parameter**: Data user untuk registrasi

#### `authService.login(payload)`
- **Fungsi**: Login user dengan kredensial
- **Kegunaan**: Mengautentikasi dan mendapat token
- **Parameter**: `{email, password}`

#### `authService.me()`
- **Fungsi**: Mengambil data user yang sedang login
- **Kegunaan**: Mendapat informasi profil user saat ini

#### `authService.requestEmailVerification()`
- **Fungsi**: Meminta token verifikasi email
- **Kegunaan**: Mengirim email verifikasi ke user

#### `authService.verifyEmail(token)`
- **Fungsi**: Memverifikasi email dengan token
- **Kegunaan**: Mengaktifkan akun setelah klik link verifikasi

---

### 📁 `src/services/userService.js`
File ini mengelola operasi terkait data user.

#### `userService.getDashboard()`
- **Fungsi**: Mengambil data dashboard user
- **Kegunaan**: Menampilkan statistik dan ringkasan aktivitas user

#### `userService.getAnalytics()`
- **Fungsi**: Mengambil data analitik user
- **Kegunaan**: Menampilkan grafik dan statistik detail aktivitas

#### `userService.updateProfile(payload)`
- **Fungsi**: Update data profil user
- **Kegunaan**: Mengubah informasi personal user
- **Parameter**: Data profil yang akan diupdate

#### `userService.uploadAvatar(formData)`
- **Fungsi**: Upload foto profil baru
- **Kegunaan**: Mengganti avatar user dengan gambar baru

---

### 📁 `src/services/productService.js`
File ini menangani semua operasi produk.

#### `productService.getProducts(params)`
- **Fungsi**: Mengambil daftar produk dengan filter
- **Kegunaan**: Menampilkan produk di marketplace dengan pagination
- **Parameter**: Filter seperti kategori, harga, lokasi

#### `productService.searchProducts(params)`
- **Fungsi**: Mencari produk berdasarkan keyword
- **Kegunaan**: Pencarian produk di marketplace

#### `productService.getProduct(id)`
- **Fungsi**: Mengambil detail produk tertentu
- **Kegunaan**: Menampilkan halaman detail produk

#### `productService.getMyProducts()`
- **Fungsi**: Mengambil produk milik user yang sedang login
- **Kegunaan**: Menampilkan produk yang dijual user

#### `productService.createProduct(formData)`
- **Fungsi**: Membuat produk baru
- **Kegunaan**: Menambah produk untuk dijual

#### `productService.updateProduct(id, formData)`
- **Fungsi**: Update data produk
- **Kegunaan**: Mengubah informasi produk yang sudah ada

#### `productService.deleteProduct(id)`
- **Fungsi**: Hapus produk
- **Kegunaan**: Menghapus produk dari marketplace

#### `productService.markSold(id)`
- **Fungsi**: Menandai produk sudah terjual
- **Kegunaan**: Mengubah status produk menjadi sold

---

### 📁 `src/services/offerService.js`
File ini mengelola sistem penawaran produk.

#### `offerService.createOffer(payload)`
- **Fungsi**: Membuat penawaran baru untuk produk
- **Kegunaan**: Buyer mengajukan harga tawaran ke seller

#### `offerService.getIncoming()`
- **Fungsi**: Mengambil tawaran yang masuk ke produk user
- **Kegunaan**: Seller melihat tawaran dari buyer

#### `offerService.getMyOffers()`
- **Fungsi**: Mengambil tawaran yang dikirim user
- **Kegunaan**: Buyer melihat status tawaran yang dikirim

#### `offerService.accept(id)`
- **Fungsi**: Menerima tawaran
- **Kegunaan**: Seller menyetujui harga tawaran

#### `offerService.reject(id)`
- **Fungsi**: Menolak tawaran
- **Kegunaan**: Seller menolak harga tawaran

---

### 📁 `src/services/transactionService.js`
File ini menangani transaksi jual beli.

#### `transactionService.getMyTransactions()`
- **Fungsi**: Mengambil semua transaksi user
- **Kegunaan**: Menampilkan riwayat transaksi buyer dan seller

#### `transactionService.complete(id)`
- **Fungsi**: Menyelesaikan transaksi
- **Kegunaan**: Menandai transaksi selesai setelah bertemu

#### `transactionService.buyerConfirm(id)`
- **Fungsi**: Konfirmasi dari pembeli
- **Kegunaan**: Buyer mengonfirmasi transaksi siap dilakukan

#### `transactionService.sellerConfirm(id)`
- **Fungsi**: Konfirmasi dari penjual
- **Kegunaan**: Seller mengonfirmasi transaksi siap dilakukan

#### `transactionService.dispute(id, note)`
- **Fungsi**: Membuat dispute pada transaksi
- **Kegunaan**: Melaporkan masalah dalam transaksi

---

### 📁 `src/services/reviewService.js`
File ini mengelola sistem review dan rating.

#### `reviewService.createReview(payload)`
- **Fungsi**: Membuat review untuk transaksi
- **Kegunaan**: Buyer memberikan rating dan komentar ke seller

---

### 📁 `src/services/wishlistService.js`
File ini mengelola wishlist produk.

#### `wishlistService.getWishlist()`
- **Fungsi**: Mengambil produk favorit user
- **Kegunaan**: Menampilkan produk yang disimpan user

#### `wishlistService.add(productId)`
- **Fungsi**: Menambah produk ke wishlist
- **Kegunaan**: Menyimpan produk untuk dilihat nanti

#### `wishlistService.remove(productId)`
- **Fungsi**: Hapus produk dari wishlist
- **Kegunaan**: Menghapus produk dari daftar favorit

---

### 📁 `src/services/notificationService.js`
File ini menangani notifikasi real-time.

#### `notificationService.getNotifications()`
- **Fungsi**: Mengambil daftar notifikasi
- **Kegunaan**: Menampilkan pesan notifikasi ke user

#### `notificationService.markAsRead(id)`
- **Fungsi**: Menandai notifikasi sudah dibaca
- **Kegunaan**: Mengubah status notifikasi menjadi read

#### `notificationService.markAllAsRead()`
- **Fungsi**: Menandai semua notifikasi sudah dibaca
- **Kegunaan**: Membersihkan badge notifikasi

#### `notificationService.createStream()`
- **Fungsi**: Membuat koneksi real-time untuk notifikasi
- **Kegunaan**: Mendapat notifikasi secara real-time

---

### 📁 `src/services/chatService.js`
File ini mengelola sistem chat antar user.

#### `chatService.getConversations()`
- **Fungsi**: Mengambil daftar percakapan
- **Kegunaan**: Menampilkan chat room yang aktif

#### `chatService.startConversation(payload)`
- **Fungsi**: Memulai percakapan baru
- **Kegunaan**: Membuat chat room untuk diskusi produk

#### `chatService.getMessages(conversationId)`
- **Fungsi**: Mengambil pesan dalam percakapan
- **Kegunaan**: Menampilkan history chat

#### `chatService.sendMessage(conversationId, message)`
- **Fungsi**: Mengirim pesan baru
- **Kegunaan**: Mengirim teks ke lawan chat

#### `chatService.createStream()`
- **Fungsi**: Koneksi real-time untuk chat
- **Kegunaan**: Mendapat pesan baru secara langsung

---

### 📁 `src/services/reportService.js`
File ini menangani pelaporan masalah.

#### `reportService.createReport(payload)`
- **Fungsi**: Membuat laporan baru
- **Kegunaan**: Melaporkan user atau produk yang bermasalah

---

### 📁 `src/services/categoryService.js`
File ini mengelola kategori produk.

#### `categoryService.getCategories()`
- **Fungsi**: Mengambil daftar kategori
- **Kegunaan**: Menampilkan pilihan kategori untuk filter produk

---

### 📁 `src/services/pricingService.js`
File ini menangani estimasi harga.

#### `pricingService.estimate(payload)`
- **Fungsi**: Mengestimasi harga produk
- **Kegunaan**: Memberikan saran harga berdasarkan kondisi produk

---

### 📁 `src/services/adminService.js`
File ini menangani fungsi admin.

#### `adminService.getDashboard()`
- **Fungsi**: Mengambil statistik dashboard admin
- **Kegunaan**: Menampilkan overview sistem untuk admin

#### `adminService.getUsers(params)`
- **Fungsi**: Mengambil daftar user dengan filter
- **Kegunaan**: Admin mengelola user dalam sistem

#### `adminService.suspendUser(id, isSuspended)`
- **Fungsi**: Suspend atau unsuspend user
- **Kegunaan**: Admin menghukum atau mengampuni user

#### `adminService.getProducts()`
- **Fungsi**: Mengambil semua produk untuk moderation
- **Kegunaan**: Admin memantau produk di marketplace

#### `adminService.getReports()`
- **Fungsi**: Mengambil laporan yang masuk
- **Kegunaan**: Admin menangani laporan dari user

#### `adminService.updateReportStatus(id, payload)`
- **Fungsi**: Update status laporan
- **Kegunaan**: Admin menandai laporan sudah ditangani

---

### 📁 `src/utils/storage.js`
File ini mengelola penyimpanan data di browser.

#### `tokenStorage.get()`
- **Fungsi**: Mengambil token dari localStorage
- **Kegunaan**: Mendapat token untuk autentikasi

#### `tokenStorage.set(token)`
- **Fungsi**: Menyimpan token ke localStorage
- **Kegunaan**: Menyimpan token setelah login

#### `tokenStorage.clear()`
- **Fungsi**: Menghapus token dari storage
- **Kegunaan**: Membersihkan token saat logout

---

### 📁 `src/utils/currency.js`
File ini memformat mata uang.

#### `formatCurrency(value)`
- **Fungsi**: Memformat angka menjadi format rupiah
- **Kegunaan**: Menampilkan harga dalam format IDR
- **Contoh**: `formatCurrency(50000)` → "Rp 50.000"

---

### 📁 `src/utils/date.js`
File ini memformat tanggal.

#### `formatDate(value)`
- **Fungsi**: Memformat tanggal menjadi format Indonesia
- **Kegunaan**: Menampilkan tanggal dalam format yang mudah dibaca
- **Contoh**: `formatDate('2024-01-15')` → "15 Jan 2024"

---

### 📁 `src/utils/image.js`
File ini menangani URL gambar.

#### `resolveImageUrl(imageUrl)`
- **Fungsi**: Mengubah path gambar menjadi URL lengkap
- **Kegunaan**: Menampilkan gambar dari server dengan URL yang benar

---

### 📁 `src/utils/query.js`
File ini memproses parameter query.

#### `compactParams(params)`
- **Fungsi**: Membersihkan parameter kosong dari object
- **Kegunaan**: Menghilangkan nilai null/undefined sebelum kirim ke API

---

### 📁 `src/hooks/useAuth.js`
Hook untuk menggunakan context autentikasi.

#### `useAuth()`
- **Fungsi**: Hook untuk mengakses data autentikasi
- **Kegunaan**: Mendapat user, token, dan fungsi auth di komponen

---

### 📁 `src/hooks/useDebounce.js`
Hook untuk menunda eksekusi fungsi.

#### `useDebounce(value, delay)`
- **Fungsi**: Menunda update nilai selama delay waktu
- **Kegunaan**: Mencegah request berlebihan saat user mengetik

---

### 📁 `src/hooks/useTheme.js`
Hook untuk mengelola tema aplikasi.

#### `useTheme()`
- **Fungsi**: Hook untuk mengakses pengaturan tema
- **Kegunaan**: Mengubah tema terang/gelap aplikasi

---

### 📁 `src/hooks/useToast.js`
Hook untuk menampilkan notifikasi toast.

#### `useToast()`
- **Fungsi**: Hook untuk menampilkan pesan notifikasi
- **Kegunaan**: Memberikan feedback ke user setelah aksi

---

### 📁 `src/pages/LoginPage.jsx`
Halaman login aplikasi.

#### `LoginPage`
- **Fungsi**: Komponen halaman login
- **Kegunaan**: Form untuk user masuk ke akun

#### `handleSubmit(event)`
- **Fungsi**: Menangani submit form login
- **Kegunaan**: Memproses login dan redirect ke dashboard

---

### 📁 `src/pages/DashboardOverviewPage.jsx`
Halaman dashboard utama.

#### `DashboardOverviewPage`
- **Fungsi**: Komponen halaman dashboard
- **Kegunaan**: Menampilkan statistik dan ringkasan user

---

### 📁 `src/layouts/MainLayout.jsx`
Layout utama aplikasi.

#### `MainLayout`
- **Fungsi**: Layout dengan navbar untuk halaman umum
- **Kegunaan**: Membungkus halaman yang perlu navbar

---

### 📁 `src/layouts/DashboardLayout.jsx`
Layout dashboard.

#### `DashboardLayout`
- **Fungsi**: Layout dengan sidebar untuk halaman dashboard
- **Kegunaan**: Membungkus halaman dashboard dengan sidebar

---

## 🔧 **BACKEND (Node.js/Express) - Server Side**

### 📁 `src/services/authService.js`
File ini menangani logika autentikasi di server.

#### `serializeUser(row)`
- **Fungsi**: Mengubah data database menjadi format API
- **Kegunaan**: Memformat data user untuk response JSON

#### `findUserById(userId)`
- **Fungsi**: Mencari user berdasarkan ID
- **Kegunaan**: Mendapat data user untuk operasi internal

#### `register(payload)`
- **Fungsi**: Mendaftarkan user baru di database
- **Kegunaan**: Membuat akun user dengan validasi dan hash password

#### `login(payload)`
- **Fungsi**: Mengautentikasi user dan membuat token
- **Kegunaan**: Verifikasi kredensial dan generate JWT token

#### `requestEmailVerification(userId)`
- **Fungsi**: Membuat token verifikasi email
- **Kegunaan**: Menyiapkan email verifikasi untuk user

#### `verifyEmail(token)`
- **Fungsi**: Memverifikasi email dengan token
- **Kegunaan**: Mengaktifkan akun setelah verifikasi email

---

### 📁 `src/controllers/authController.js`
File ini menangani HTTP request untuk autentikasi.

#### `register(req, res)`
- **Fungsi**: Handler untuk endpoint registrasi
- **Kegunaan**: Memproses request registrasi dan kirim response

#### `login(req, res)`
- **Fungsi**: Handler untuk endpoint login
- **Kegunaan**: Memproses request login dan kirim response

#### `me(req, res)`
- **Fungsi**: Handler untuk endpoint data user saat ini
- **Kegunaan**: Mengembalikan data profil user yang sedang login

#### `requestEmailVerification(req, res)`
- **Fungsi**: Handler untuk request verifikasi email
- **Kegunaan**: Mengirim token verifikasi ke email user

#### `verifyEmail(req, res)`
- **Fungsi**: Handler untuk verifikasi email
- **Kegunaan**: Memproses token verifikasi dan aktifkan akun

---

### 📁 `src/services/reviewService.js`
File ini menangani logika review dan rating.

#### `parseJsonArray(value)`
- **Fungsi**: Mengubah string JSON menjadi array
- **Kegunaan**: Memproses data tags yang disimpan sebagai JSON

#### `createReview(reviewerId, payload)`
- **Fungsi**: Membuat review baru dengan transaksi
- **Kegunaan**: Menyimpan review dan update rating seller secara atomik

---

### 📁 `src/services/offerService.js`
File ini menangani logika penawaran produk.

#### `formatOffer(row)`
- **Fungsi**: Memformat data offer untuk response API
- **Kegunaan**: Mengubah data database menjadi format JSON yang rapi

#### `createOffer(buyerId, payload)`
- **Fungsi**: Membuat penawaran baru dengan validasi atomik
- **Kegunaan**: Mencegah race condition saat multiple user membuat offer

#### `getOfferById(id)`
- **Fungsi**: Mengambil detail offer berdasarkan ID
- **Kegunaan**: Mendapat data lengkap offer untuk response

---

### 📁 `src/services/transactionService.js`
File ini menangani logika transaksi.

#### `formatTransaction(row, currentUserId)`
- **Fungsi**: Memformat data transaksi berdasarkan role user
- **Kegunaan**: Menampilkan data yang sesuai dengan konteks user (buyer/seller)

#### `getMyTransactions(userId)`
- **Fungsi**: Mengambil semua transaksi user
- **Kegunaan**: Menampilkan riwayat transaksi buyer dan seller

#### `completeTransaction(transactionId, userId)`
- **Fungsi**: Menyelesaikan transaksi dengan validasi
- **Kegunaan**: Mengubah status transaksi menjadi completed

---

### 📁 `src/services/adminService.js`
File ini menangani operasi admin.

#### `getDashboardStats()`
- **Fungsi**: Mengambil statistik untuk dashboard admin
- **Kegunaan**: Menampilkan overview sistem (user, produk, transaksi)

#### `getUsers(query)`
- **Fungsi**: Mengambil daftar user dengan filter pencarian
- **Kegunaan**: Admin mencari dan mengelola user

#### `suspendUser(adminId, userId, isSuspended)`
- **Fungsi**: Suspend atau unsuspend user
- **Kegunaan**: Admin mengontrol akses user ke sistem

#### `getProducts()`
- **Fungsi**: Mengambil semua produk untuk moderation
- **Kegunaan**: Admin memantau dan mengelola produk

---

### 📁 `src/middlewares/uploadMiddleware.js`
File ini menangani upload file.

#### `imageUpload`
- **Fungsi**: Middleware multer untuk upload gambar
- **Kegunaan**: Memproses upload file dengan validasi dan penyimpanan

#### `fileFilter(req, file, callback)`
- **Fungsi**: Memvalidasi tipe file yang diupload
- **Kegunaan**: Hanya menerima gambar dengan format yang aman

#### `cleanupFailedUpload(filePath)`
- **Fungsi**: Menghapus file yang gagal diupload
- **Kegunaan**: Membersihkan file temporary yang tidak berhasil

---

### 📁 `src/middlewares/requireRole.js`
File ini menangani autorisasi berdasarkan role.

#### `requireRole(...allowedRoles)`
- **Fungsi**: Middleware untuk cek role user
- **Kegunaan**: Membatasi akses endpoint berdasarkan role user

---

## 📋 **Ringkasan**

Aplikasi BabePus memiliki **2 bagian utama**:

1. **Frontend (React)**: Mengelola UI, state management, dan komunikasi dengan API
2. **Backend (Node.js)**: Mengelola database, business logic, dan API endpoints

**Fitur utama**:
- ✅ Autentikasi dan autorisasi user
- ✅ Manajemen produk (CRUD)
- ✅ Sistem penawaran (offer)
- ✅ Transaksi dengan escrow
- ✅ Review dan rating
- ✅ Chat real-time
- ✅ Notifikasi
- ✅ Admin panel
- ✅ File upload dengan validasi

Semua fungsi dan method telah didokumentasikan dengan penjelasan sederhana dalam bahasa Indonesia untuk memudahkan pemahaman dan maintenance kode.