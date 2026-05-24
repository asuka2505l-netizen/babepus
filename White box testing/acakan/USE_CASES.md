# Use Cases - BabePus Marketplace

## Ringkasan
BabePus adalah aplikasi marketplace untuk jual-beli barang bekas khusus untuk komunitas kampus. Pengguna dapat menjual produk, membeli, menawar, dan berinteraksi dengan buyer/seller lain.

---

## 1. USER REGISTRATION & AUTHENTICATION

### UC-001: Register Pengguna Baru
**Actor:** Guest (Calon pengguna)  
**Precondition:** User belum memiliki akun  
**Main Flow:**
1. User membuka halaman Register
2. User mengisi form dengan:
   - Email kampus
   - Password
   - Nama lengkap
   - Nomor telepon
   - Kampus
   - Fakultas
   - Program studi
   - Nomor induk mahasiswa (student ID)
3. Sistem validasi input
4. Sistem hash password menggunakan bcrypt
5. Sistem menyimpan user ke database
6. Sistem mengirim verification token ke email
7. User diarahkan ke halaman login

**Postcondition:** User berhasil terdaftar dan email verifikasi dikirim

---

### UC-002: Login Pengguna
**Actor:** Registered User  
**Precondition:** User sudah terdaftar  
**Main Flow:**
1. User membuka halaman Login
2. User mengisi email dan password
3. Sistem validasi kredensial terhadap database
4. Sistem generate JWT token
5. Token disimpan di localStorage
6. User diarahkan ke dashboard/marketplace
7. Header Authorization otomatis mengirim Bearer token

**Postcondition:** User berhasil login dan authenticated

---

### UC-003: Verifikasi Email
**Actor:** Registered User  
**Precondition:** User sudah register, email belum diverifikasi  
**Main Flow:**
1. User menerima email dengan link verifikasi
2. User klik link atau masukkan token manual
3. Sistem validasi token verifikasi email
4. Sistem update status `email_verified_at` di database
5. Sistem tampilkan notifikasi sukses

**Postcondition:** Email user terverifikasi, akun fully activated

---

### UC-004: Auto Logout (Token Expired)
**Actor:** Authenticated User  
**Precondition:** User sedang login  
**Main Flow:**
1. User melakukan request ke API
2. Server mengembalikan response 401 (Unauthorized)
3. Interceptor axios mendeteksi 401
4. Sistem trigger `unauthorizedHandler()`
5. Sistem hapus token dari localStorage
6. Sistem clear user state di AuthContext
7. User diarahkan otomatis ke halaman login

**Postcondition:** Session user berakhir, harus login ulang

---

## 2. PRODUCT MANAGEMENT (SELLER)

### UC-005: List Produk Baru
**Actor:** Authenticated User (Seller)  
**Precondition:** User sudah login  
**Main Flow:**
1. Seller membuka halaman "Tambah Produk" di Dashboard
2. Seller mengisi form:
   - Nama produk
   - Deskripsi
   - Kategori
   - Harga
   - Kondisi (baru/bekas)
   - Foto produk (multiple upload)
   - Lokasi/kampus
3. Sistem validasi input menggunakan express-validator
4. Sistem upload foto ke folder `/uploads`
5. Sistem simpan data produk ke table `products`
6. Sistem set status produk = "active"
7. Sistem tampilkan notifikasi sukses

**Postcondition:** Produk berhasil di-list di marketplace

---

### UC-006: Edit Produk
**Actor:** Authenticated User (Seller)  
**Precondition:** User sudah login, user adalah pemilik produk  
**Main Flow:**
1. Seller membuka halaman Dashboard > Products
2. Seller pilih produk untuk edit
3. Seller ubah detail produk (nama, harga, foto, dll)
4. Sistem validasi input
5. Sistem update record produk di database
6. Sistem update foto jika ada file baru
7. Sistem tampilkan notifikasi sukses

**Postcondition:** Produk berhasil diperbarui

---

### UC-007: Hapus Produk
**Actor:** Authenticated User (Seller)  
**Precondition:** User sudah login, user adalah pemilik produk  
**Main Flow:**
1. Seller membuka halaman Dashboard > Products
2. Seller pilih produk untuk dihapus
3. Sistem tampilkan konfirmasi dialog
4. Seller konfirmasi delete
5. Sistem soft-delete atau hard-delete record produk
6. Sistem hapus foto terkait
7. Sistem tampilkan notifikasi sukses

**Postcondition:** Produk dihapus dari marketplace

---

### UC-008: View Produk di Marketplace
**Actor:** Any User (authenticated or guest)  
**Precondition:** Ada produk aktif di database  
**Main Flow:**
1. User masuk ke halaman Marketplace
2. Sistem load daftar produk dari API
3. Sistem tampilkan produk dengan:
   - Foto
   - Nama
   - Harga
   - Kondisi
   - Lokasi/kampus
   - Rating seller
4. User dapat filter berdasarkan:
   - Kategori
   - Harga range (slider)
   - Kondisi
   - Lokasi
5. User dapat search by keyword
6. Sistem load produk sesuai filter

**Postcondition:** User melihat list produk sesuai filter

---

### UC-009: View Detail Produk
**Actor:** Any User  
**Precondition:** User sudah di halaman Marketplace  
**Main Flow:**
1. User klik produk di list
2. Sistem load detail produk dari API
3. Sistem tampilkan:
   - Foto carousel
   - Nama produk
   - Deskripsi lengkap
   - Harga
   - Kondisi
   - Lokasi
   - Seller info (nama, rating, avatar)
   - Tombol "Tawar" / "Chat Seller"
4. Jika user authenticated:
   - Tampilkan tombol "Tambah ke Wishlist"
   - Tampilkan chat history (jika ada)

**Postcondition:** User melihat detail produk secara lengkap

---

## 3. OFFER & NEGOTIATION

### UC-010: Buat Penawaran (Offer)
**Actor:** Authenticated User (Buyer)  
**Precondition:** User sudah login, melihat detail produk  
**Main Flow:**
1. Buyer klik tombol "Tawar" di halaman product detail
2. Sistem tampilkan form offer dengan:
   - Harga yang ditawarkan (pre-fill dengan harga produk)
   - Pesan penawaran (optional)
3. Buyer edit harga dan tulis pesan
4. Buyer submit form
5. Sistem validasi harga (harus lebih kecil dari harga jual)
6. Sistem simpan offer ke table `offers`
7. Sistem set status offer = "pending"
8. Sistem buat notification untuk seller

**Postcondition:** Offer berhasil dibuat, seller mendapat notifikasi

---

### UC-011: View Offers (Seller)
**Actor:** Authenticated User (Seller)  
**Precondition:** Seller sudah login, ada offer untuk produk seller  
**Main Flow:**
1. Seller buka Dashboard > Offers
2. Sistem load daftar offer untuk produk seller
3. Sistem tampilkan offer dengan:
   - Produk
   - Buyer info
   - Harga penawaran
   - Status (pending/rejected/accepted)
   - Waktu penawaran
4. Seller dapat filter by status

**Postcondition:** Seller melihat semua offer yang masuk

---

### UC-012: Terima/Tolak Penawaran
**Actor:** Authenticated User (Seller)  
**Precondition:** Seller melihat list offer  
**Main Flow:**
1. Seller klik offer yang ingin di-respond
2. Seller pilih "Terima" atau "Tolak"
3. Jika tolak:
   - Sistem tampilkan optional form untuk counter-offer harga
   - Seller bisa tulis alasan tolak
4. Sistem update status offer di database
5. Sistem buat notification untuk buyer
6. Sistem auto-create transaction jika offer diterima

**Postcondition:** Offer diterima/ditolak, transaction dibuat atau buyer diberitahu

---

## 4. TRANSACTION & PAYMENT

### UC-013: View Transactions
**Actor:** Authenticated User (Buyer atau Seller)  
**Precondition:** User sudah login, ada transaksi buyer/seller  
**Main Flow:**
1. User buka Dashboard > Transactions
2. Sistem load daftar transaksi user
3. Sistem tampilkan status transaksi:
   - Pending
   - Completed
   - Cancelled
4. User dapat filter by status
5. Sistem tampilkan detail:
   - Produk
   - Counterpart user info
   - Harga
   - Waktu transaksi
   - Lokasi meetup (jika ada)

**Postcondition:** User melihat semua transaksi mereka

---

### UC-014: Complete Transaction
**Actor:** Authenticated User (Buyer atau Seller)  
**Precondition:** Transaction dalam status "accepted" atau "pending"  
**Main Flow:**
1. Buyer dan Seller agree untuk meetup
2. Salah satu (atau keduanya) bisa mark transaksi as "completed"
3. Sistem update transaction status = "completed"
4. Sistem trigger notifikasi untuk sisi lain
5. Sistem activate review feature

**Postcondition:** Transaction marked as completed, review dapat dilakukan

---

## 5. REVIEW & RATING

### UC-015: Buat Review
**Actor:** Authenticated User (Buyer atau Seller)  
**Precondition:** User sudah complete transaction  
**Main Flow:**
1. User buka halaman transaction detail
2. User klik tombol "Buat Review"
3. Sistem tampilkan form review dengan:
   - Rating (1-5 stars)
   - Judul review
   - Deskripsi/komentar
   - Foto (optional)
4. User submit review
5. Sistem validasi input
6. Sistem simpan review ke table `reviews`
7. Sistem update average rating user:
   - `rating_average = SUM(rating) / COUNT(reviews)`
   - `rating_count = COUNT(reviews)`
8. Sistem buat notification untuk counterpart

**Postcondition:** Review berhasil dibuat, rating user terupdate

---

### UC-016: View Reviews
**Actor:** Any User  
**Precondition:** Ada review untuk user tertentu  
**Main Flow:**
1. User buka profile seller/buyer
2. Sistem load reviews dari table `reviews`
3. Sistem tampilkan:
   - Review list sorted by date
   - Rating
   - Judul
   - Deskripsi
   - Avatar reviewer
   - Rating average dan count di header

**Postcondition:** User melihat semua review untuk user tersebut

---

## 6. WISHLIST

### UC-017: Tambah ke Wishlist
**Actor:** Authenticated User (Buyer)  
**Precondition:** User sudah login, melihat product detail  
**Main Flow:**
1. User klik tombol "Tambah ke Wishlist" atau heart icon
2. Sistem simpan relasi user-product ke table `wishlist`
3. Sistem ubah icon heart menjadi filled
4. Sistem tampilkan notifikasi "Ditambahkan ke Wishlist"

**Postcondition:** Produk ditambahkan ke wishlist user

---

### UC-018: View Wishlist
**Actor:** Authenticated User (Buyer)  
**Precondition:** User sudah login  
**Main Flow:**
1. User buka Dashboard > Wishlist
2. Sistem load produk dari wishlist user
3. Sistem tampilkan grid/list produk wishlist
4. User dapat:
   - Klik produk untuk detail
   - Hapus dari wishlist
   - Sort/filter wishlist

**Postcondition:** User melihat semua wishlist mereka

---

### UC-019: Hapus dari Wishlist
**Actor:** Authenticated User  
**Precondition:** Ada produk di wishlist  
**Main Flow:**
1. User klik tombol hapus di wishlist item
2. Sistem tampilkan konfirmasi
3. User konfirmasi
4. Sistem delete relasi dari table `wishlist`
5. Sistem tampilkan notifikasi sukses

**Postcondition:** Produk dihapus dari wishlist

---

## 7. CHAT & MESSAGING

### UC-020: Buka Chat dengan User Lain
**Actor:** Authenticated User  
**Precondition:** User sudah login, melihat product atau user profile  
**Main Flow:**
1. User klik tombol "Chat" atau icon chat
2. Sistem check apakah conversation sudah exist
3. Jika tidak exist:
   - Sistem create conversation di table `chat` atau `conversations`
4. Sistem load chat history
5. Sistem tampilkan chat window dengan:
   - Nama user
   - Avatar
   - Message history
   - Input message box

**Postcondition:** Chat window dibuka

---

### UC-021: Kirim Pesan Chat
**Actor:** Authenticated User  
**Precondition:** Chat window sudah terbuka  
**Main Flow:**
1. User ketik pesan di input box
2. User klik tombol send atau press Enter
3. Sistem validasi pesan (tidak kosong)
4. Sistem simpan message ke database dengan:
   - Sender ID
   - Receiver ID
   - Message content
   - Timestamp
5. Sistem emit real-time update ke receiver (jika online)
6. Sistem tampilkan message di UI
7. Receiver dapat lihat message in real-time atau saat membuka chat

**Postcondition:** Message berhasil terkirim

---

### UC-022: View Chat List
**Actor:** Authenticated User  
**Precondition:** User sudah login  
**Main Flow:**
1. User buka Dashboard > Chat
2. Sistem load list conversation user
3. Sistem tampilkan:
   - Avatar user
   - Nama user
   - Last message preview
   - Timestamp
   - Unread badge (jika ada)
4. User dapat sort by recent atau search

**Postcondition:** User melihat list semua chat conversations

---

## 8. NOTIFICATIONS

### UC-023: View Notifications
**Actor:** Authenticated User  
**Precondition:** User sudah login, ada notification  
**Main Flow:**
1. User klik notification bell icon di navbar
2. Sistem load notification list:
   - Dari table `notifications`
   - Filter by user ID
   - Sorted by timestamp DESC
3. Sistem tampilkan notifikasi dengan:
   - Icon (based on type)
   - Message
   - Timestamp
   - Link/action
4. Notification dapat di-mark sebagai read
5. User dapat klik notification untuk navigate

**Postcondition:** User melihat notification list

---

### UC-024: Mark Notification as Read
**Actor:** Authenticated User  
**Precondition:** Ada unread notification  
**Main Flow:**
1. User buka notification panel
2. User klik notification atau tombol read
3. Sistem update `is_read = true` di database
4. Sistem remove badge dari notification

**Postcondition:** Notification marked as read

---

## 9. SELLER ANALYTICS

### UC-025: View Seller Analytics
**Actor:** Authenticated User (Seller)  
**Precondition:** User sudah login sebagai seller, ada transaction history  
**Main Flow:**
1. Seller buka Dashboard > Analytics
2. Sistem load analytics data:
   - Total products
   - Total completed transactions
   - Total revenue
   - Average rating
   - Product performance (popular products)
   - Time series chart (sales per period)
3. Sistem tampilkan dalam dashboard format
4. Seller dapat filter by date range

**Postcondition:** Seller melihat analytics lengkap

---

## 10. PROFILE MANAGEMENT

### UC-026: View/Edit Profile
**Actor:** Authenticated User  
**Precondition:** User sudah login  
**Main Flow:**
1. User buka Dashboard > Profile
2. Sistem load user data dari database
3. User dapat melihat/edit:
   - Nama lengkap
   - Email
   - Nomor telepon
   - Kampus
   - Fakultas
   - Program studi
   - Student ID
   - Bio
   - Avatar/Foto profil
4. User submit form
5. Sistem validasi input
6. Sistem update user record di database
7. Sistem tampilkan notifikasi sukses

**Postcondition:** Profile user berhasil diupdate

---

### UC-027: Upload Avatar
**Actor:** Authenticated User  
**Precondition:** User di halaman profile edit  
**Main Flow:**
1. User klik area upload avatar
2. User select file gambar dari device
3. Sistem validasi file (format, size)
4. Sistem upload ke folder `/uploads`
5. Sistem update `avatar_url` di database
6. Sistem tampilkan preview avatar baru
7. Sistem tampilkan notifikasi sukses

**Postcondition:** Avatar berhasil diupload

---

## 11. ADMIN FUNCTIONS

### UC-028: View Admin Dashboard
**Actor:** Authenticated Admin User  
**Precondition:** User sudah login dengan role = "admin"  
**Main Flow:**
1. Admin buka halaman `/admin`
2. Middleware `requireRole("admin")` verify role user
3. Sistem load admin dashboard dengan:
   - Total users
   - Total products
   - Total transactions
   - Total revenue
   - Reported items
   - Suspended users
   - Unverified sellers
4. Admin dapat navigate ke sub-sections

**Postcondition:** Admin melihat dashboard overview

---

### UC-029: Suspend/Ban User
**Actor:** Admin User  
**Precondition:** Admin sudah login  
**Main Flow:**
1. Admin masuk ke user management section
2. Admin cari atau filter user untuk di-suspend
3. Admin klik user
4. Admin klik tombol "Suspend"
5. Admin input alasan suspension (optional)
6. Sistem update `is_suspended = true` di database
7. Sistem trigger logout otomatis untuk user tersebut
8. Sistem kirim notifikasi ke user
9. User tidak bisa login sampai admin lifts suspension

**Postcondition:** User suspended, tidak bisa access aplikasi

---

### UC-030: Review & Moderate Reported Content
**Actor:** Admin User  
**Precondition:** Ada reported products atau users  
**Main Flow:**
1. Admin buka Reports section
2. Sistem load daftar report dari table `reports`
3. Sistem tampilkan:
   - Reported item (product/user)
   - Reason
   - Reporter info
   - Status (open/resolved)
4. Admin klik report untuk detail
5. Admin dapat:
   - Reject report
   - Approve report (dan take action)
   - Suspend related user
   - Delete reported product
6. Sistem update report status = "resolved"
7. Sistem create admin log/audit trail

**Postcondition:** Report di-resolve dan action diambil

---

## 12. REPORTING SYSTEM

### UC-031: Report Produk/User
**Actor:** Authenticated User  
**Precondition:** User sudah login  
**Main Flow:**
1. User di halaman product detail atau user profile
2. User klik menu "Report" atau "Laporkan"
3. Sistem tampilkan form report dengan:
   - Kategori (fraud, inappropriate, damage, dll)
   - Deskripsi detail
   - Attachment (optional)
4. User submit form
5. Sistem validasi input
6. Sistem simpan report ke table `reports`
7. Sistem set status = "open"
8. Sistem notify admin tentang report baru

**Postcondition:** Report berhasil dibuat, admin diberitahu

---

## 13. PRICING & COMMISSION

### UC-032: View Pricing Information
**Actor:** Any User  
**Precondition:** User di halaman marketplace atau profile  
**Main Flow:**
1. User cari informasi harga/komisi
2. User buka halaman Pricing (jika ada)
3. Sistem load pricing info dari API `/api/pricing`
4. Sistem tampilkan:
   - Commission rate
   - Fee structure
   - Payment terms
   - Example calculation

**Postcondition:** User melihat pricing information

---

## Summary Table

| UC ID | Aktor | Deskripsi | Status |
|-------|-------|-----------|--------|
| UC-001 | Guest | Register | Core |
| UC-002 | Guest | Login | Core |
| UC-003 | User | Verifikasi Email | Core |
| UC-004 | User | Auto Logout | Core |
| UC-005 | Seller | List Produk | Core |
| UC-006 | Seller | Edit Produk | Core |
| UC-007 | Seller | Hapus Produk | Core |
| UC-008 | Any | View Marketplace | Core |
| UC-009 | Any | View Product Detail | Core |
| UC-010 | Buyer | Buat Offer | Core |
| UC-011 | Seller | View Offers | Core |
| UC-012 | Seller | Accept/Reject Offer | Core |
| UC-013 | User | View Transactions | Core |
| UC-014 | User | Complete Transaction | Core |
| UC-015 | User | Buat Review | Core |
| UC-016 | Any | View Reviews | Core |
| UC-017 | Buyer | Tambah Wishlist | Feature |
| UC-018 | Buyer | View Wishlist | Feature |
| UC-019 | Buyer | Hapus Wishlist | Feature |
| UC-020 | User | Buka Chat | Feature |
| UC-021 | User | Kirim Pesan | Feature |
| UC-022 | User | View Chat List | Feature |
| UC-023 | User | View Notifications | Feature |
| UC-024 | User | Mark Notification Read | Feature |
| UC-025 | Seller | View Analytics | Feature |
| UC-026 | User | View/Edit Profile | Core |
| UC-027 | User | Upload Avatar | Feature |
| UC-028 | Admin | Admin Dashboard | Core |
| UC-029 | Admin | Suspend User | Core |
| UC-030 | Admin | Moderate Reports | Core |
| UC-031 | User | Report Content | Feature |
| UC-032 | Any | View Pricing | Info |

