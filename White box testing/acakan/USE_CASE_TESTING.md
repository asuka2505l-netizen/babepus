# Use Case Testing - BabePus

Use Case Testing fokus pada testing alur/flow dari aplikasi berdasarkan use case yang sudah didefinisikan. Setiap test case mencakup happy path, alternative path, dan exception handling.

---

## UC-001: Register Pengguna Baru

### Happy Path (Normal Flow)

**Test Case ID:** UTC-001-001  
**Title:** Successful User Registration  
**Precondition:** User belum terdaftar, di halaman Register

**Steps:**
```
1. User membuka halaman Register
2. User mengisi form dengan data valid:
   - Email: student@campus.ac.id
   - Password: SecurePass123!
   - Confirm Password: SecurePass123!
   - Nama Lengkap: Ahmad Rizki
   - Nomor Telepon: 08123456789
   - Kampus: Universitas ABC
   - Fakultas: FMIPA
   - Program Studi: Teknik Informatika
   - Student ID: 20220001
3. User klik tombol "Register"
4. Sistem validasi input
5. Sistem hash password
6. Sistem simpan user ke database
7. Sistem buat email verification token
8. Sistem kirim email verifikasi
```

**Expected Result:**
- User berhasil terdaftar
- Email verifikasi dikirim
- User diarahkan ke halaman "Check Your Email"
- Status code: 201 Created

**Actual Result:** _______________  
**Status:** PASS / FAIL

---

### Alternative Path: Email Already Exists

**Test Case ID:** UTC-001-002  
**Title:** Registration with Duplicate Email  
**Precondition:** Email sudah terdaftar sebelumnya

**Steps:**
```
1. User membuka halaman Register
2. User mengisi form dengan:
   - Email: existing@campus.ac.id (sudah ada di DB)
   - Password dan data lainnya valid
3. User klik tombol "Register"
4. Sistem validasi email di database
```

**Expected Result:**
- Tampilkan error: "Email sudah terdaftar"
- Form tidak di-submit
- User tetap di halaman Register
- User dapat menggunakan email lain atau login

**Actual Result:** _______________  
**Status:** PASS / FAIL

---

### Exception Path: Invalid Password

**Test Case ID:** UTC-001-003  
**Title:** Registration with Invalid Password  
**Precondition:** -

**Steps:**
```
1. User membuka halaman Register
2. User mengisi form dengan password: "weak"
3. User klik tombol "Register"
4. Sistem validasi password
```

**Expected Result:**
- Tampilkan error: "Password harus minimum 8 karakter, mengandung huruf besar, angka, dan karakter khusus"
- Form tidak di-submit
- User dapat memperbaiki password

**Actual Result:** _______________  
**Status:** PASS / FAIL

---

## UC-002: Login Pengguna

### Happy Path (Normal Flow)

**Test Case ID:** UTC-002-001  
**Title:** Successful User Login  
**Precondition:** User sudah terdaftar dan email terverifikasi

**Steps:**
```
1. User membuka halaman Login
2. User mengisi:
   - Email: user@campus.ac.id
   - Password: SecurePass123!
3. User klik tombol "Login"
4. Sistem validasi email di database
5. Sistem bandingkan password dengan hashed password
6. Sistem generate JWT token
7. Sistem simpan token ke localStorage
8. Sistem set user state di AuthContext
```

**Expected Result:**
- Login berhasil
- JWT token tersimpan di localStorage
- User diarahkan ke halaman Dashboard/Marketplace
- Navbar menampilkan nama user dan logout button
- Status code: 200 OK

**Actual Result:** _______________  
**Status:** PASS / FAIL

---

### Exception Path: Wrong Password

**Test Case ID:** UTC-002-002  
**Title:** Login with Wrong Password  
**Precondition:** User terdaftar

**Steps:**
```
1. User membuka halaman Login
2. User mengisi:
   - Email: user@campus.ac.id
   - Password: WrongPassword123!
3. User klik tombol "Login"
4. Sistem bandingkan password
```

**Expected Result:**
- Tampilkan error: "Email atau password salah"
- Login gagal, token tidak dibuat
- User tetap di halaman Login
- Status code: 401 Unauthorized
- Tampilkan counter attempt (1 of 5)

**Actual Result:** _______________  
**Status:** PASS / FAIL

---

### Exception Path: Account Suspended

**Test Case ID:** UTC-002-003  
**Title:** Login with Suspended Account  
**Precondition:** User terdaftar tapi is_suspended = true

**Steps:**
```
1. User membuka halaman Login
2. User mengisi email & password dengan benar
3. User klik tombol "Login"
4. Sistem validasi di database, find user dengan is_suspended = true
```

**Expected Result:**
- Tampilkan error: "Akun Anda telah disuspend oleh admin"
- Login ditolak
- User tidak dapat akses aplikasi
- Status code: 403 Forbidden

**Actual Result:** _______________  
**Status:** PASS / FAIL

---

## UC-005: List Produk Baru

### Happy Path (Normal Flow)

**Test Case ID:** UTC-005-001  
**Title:** Successfully List New Product  
**Precondition:** User sudah login sebagai seller, di halaman Dashboard

**Steps:**
```
1. Seller membuka Dashboard > "Tambah Produk"
2. Seller mengisi form:
   - Nama Produk: Laptop ASUS ROG Gaming
   - Deskripsi: "Laptop bekas, kondisi mulus, 2 tahun pemakaian"
   - Kategori: Elektronik
   - Harga: Rp 3,500,000
   - Kondisi: Bekas
   - Foto: (upload 3 gambar)
   - Lokasi: Jakarta
3. Seller klik tombol "List Produk"
4. Sistem validasi input
5. Sistem upload foto ke /uploads
6. Sistem simpan data produk ke database
7. Sistem set status = "active"
```

**Expected Result:**
- Produk berhasil di-list
- Tampilkan success message: "Produk berhasil dipublikasikan"
- Produk muncul di marketplace
- Produk bisa dilihat buyer
- Status code: 201 Created

**Actual Result:** _______________  
**Status:** PASS / FAIL

---

### Exception Path: Invalid Price

**Test Case ID:** UTC-005-002  
**Title:** List Product with Invalid Price  
**Precondition:** -

**Steps:**
```
1. Seller membuka form tambah produk
2. Seller mengisi form dengan Harga: Rp 5,000 (< Rp 10,000 minimum)
3. Seller klik tombol "List Produk"
4. Sistem validasi harga
```

**Expected Result:**
- Tampilkan error: "Harga minimum Rp 10.000"
- Form tidak di-submit
- Seller dapat memperbaiki harga

**Actual Result:** _______________  
**Status:** PASS / FAIL

---

### Exception Path: Upload Photo Failed

**Test Case ID:** UTC-005-003  
**Title:** List Product with Failed Photo Upload  
**Precondition:** -

**Steps:**
```
1. Seller membuka form tambah produk
2. Seller mengisi form lengkap
3. Seller upload foto dengan ukuran > 5MB
4. Seller klik tombol "List Produk"
5. Sistem validasi foto (format, size)
```

**Expected Result:**
- Tampilkan error: "Ukuran foto maksimal 5MB"
- Form tidak di-submit
- Seller dapat upload foto lain

**Actual Result:** _______________  
**Status:** PASS / FAIL

---

## UC-010: Buat Penawaran (Offer)

### Happy Path (Normal Flow)

**Test Case ID:** UTC-010-001  
**Title:** Successfully Make Offer  
**Precondition:** Buyer sudah login, melihat product detail

**Steps:**
```
1. Buyer membuka halaman Product Detail
   - Produk: Laptop ASUS (Harga: Rp 3,500,000)
2. Buyer klik tombol "Tawar"
3. Sistem tampilkan form offer dengan pre-fill harga produk
4. Buyer ubah harga menjadi: Rp 3,200,000
5. Buyer tulis pesan: "Bisa nego lebih? Barangnya masih bagus?"
6. Buyer klik tombol "Kirim Penawaran"
7. Sistem validasi harga < original price
8. Sistem simpan offer ke database dengan status = "pending"
9. Sistem buat notification untuk seller
```

**Expected Result:**
- Offer berhasil dibuat
- Tampilkan success message: "Penawaran berhasil dikirim"
- Seller mendapat notifikasi baru
- Buyer dapat lihat offer di Dashboard > Offers
- Status code: 201 Created

**Actual Result:** _______________  
**Status:** PASS / FAIL

---

### Exception Path: Offered Price >= Original Price

**Test Case ID:** UTC-010-002  
**Title:** Make Offer with Price >= Original  
**Precondition:** -

**Steps:**
```
1. Buyer membuka Product Detail (Original: Rp 3,500,000)
2. Buyer klik tombol "Tawar"
3. Buyer mengubah harga menjadi: Rp 3,500,000 (sama dengan original)
4. Buyer klik tombol "Kirim Penawaran"
5. Sistem validasi
```

**Expected Result:**
- Tampilkan error: "Harga penawaran harus lebih rendah dari harga jual"
- Offer tidak dibuat
- Buyer dapat mengubah harga

**Actual Result:** _______________  
**Status:** PASS / FAIL

---

### Exception Path: Duplicate Offer (Same Buyer)

**Test Case ID:** UTC-010-003  
**Title:** Make Duplicate Offer for Same Product  
**Precondition:** Buyer sudah pernah membuat offer untuk produk ini dengan status pending

**Steps:**
```
1. Buyer membuat offer untuk produk X (status: pending)
2. Buyer coba membuat offer baru untuk produk X yang sama
3. Sistem cek apakah buyer sudah punya pending offer
```

**Expected Result:**
- Tampilkan warning: "Anda sudah memiliki penawaran pending untuk produk ini"
- Offer baru tidak dibuat (atau replace yang lama)
- Buyer disarankan untuk menunggu atau mengubah offer yang ada

**Actual Result:** _______________  
**Status:** PASS / FAIL

---

## UC-012: Terima/Tolak Penawaran (Seller)

### Happy Path: Accept Offer

**Test Case ID:** UTC-012-001  
**Title:** Successfully Accept Offer  
**Precondition:** Seller melihat pending offer di Dashboard

**Steps:**
```
1. Seller membuka Dashboard > Offers
2. Seller melihat offer pending dari Buyer:
   - Produk: Laptop ASUS
   - Buyer: Ahmad Rizki
   - Harga: Rp 3,200,000 (dari Rp 3,500,000)
   - Status: Pending
3. Seller klik tombol "Terima"
4. Sistem update status offer = "accepted"
5. Sistem auto-create transaction record
6. Sistem buat notification untuk buyer
```

**Expected Result:**
- Offer diterima
- Status berubah menjadi "accepted"
- Transaction dibuat dengan status = "accepted"
- Buyer mendapat notifikasi: "Penawaran Anda diterima!"
- Buyer & Seller dapat melihat transaction di Dashboard
- Status code: 200 OK

**Actual Result:** _______________  
**Status:** PASS / FAIL

---

### Alternative Path: Reject Offer

**Test Case ID:** UTC-012-002  
**Title:** Reject Offer with Reason  
**Precondition:** -

**Steps:**
```
1. Seller membuka Dashboard > Offers
2. Seller klik tombol "Tolak" untuk offer tertentu
3. Sistem tampilkan form reject dengan optional alasan
4. Seller tulis alasan: "Harga terlalu rendah, silakan tawar lebih tinggi"
5. Seller klik tombol "Tolak Penawaran"
6. Sistem update status offer = "rejected"
7. Sistem buat notification untuk buyer dengan alasan
```

**Expected Result:**
- Offer ditolak
- Status berubah menjadi "rejected"
- Buyer mendapat notifikasi dengan alasan
- Buyer dapat membuat offer baru dengan harga berbeda
- Status code: 200 OK

**Actual Result:** _______________  
**Status:** PASS / FAIL

---

### Alternative Path: Counter Offer

**Test Case ID:** UTC-012-003  
**Title:** Send Counter Offer to Buyer  
**Precondition:** -

**Steps:**
```
1. Seller membuka Dashboard > Offers
2. Seller klik tombol "Counter" untuk offer tertentu
3. Sistem tampilkan form counter dengan input harga
4. Seller ubah harga menjadi: Rp 3,350,000
5. Seller klik tombol "Kirim Counter Offer"
6. Sistem update status offer = "countered"
7. Sistem simpan counter_price = 3,350,000
8. Sistem buat notification untuk buyer
```

**Expected Result:**
- Counter offer dikirim
- Status berubah menjadi "countered"
- Buyer mendapat notifikasi dengan counter price
- Buyer dapat accept/reject counter offer
- Status code: 200 OK

**Actual Result:** _______________  
**Status:** PASS / FAIL

---

## UC-014: Complete Transaction

### Happy Path (Normal Flow)

**Test Case ID:** UTC-014-001  
**Title:** Successfully Complete Transaction  
**Precondition:** Transaction dalam status "accepted", buyer & seller sudah agree meeting

**Steps:**
```
1. Buyer membuka Dashboard > Transactions
2. Buyer melihat transaction dengan status "accepted"
3. Buyer telah bertemu seller dan produk sudah ditukar
4. Buyer klik tombol "Mark Complete"
5. Sistem tampilkan confirmation dialog
6. Buyer confirm "Produk sudah diterima"
7. Sistem update transaction status = "completed"
8. Sistem buat notification untuk seller
9. Sistem enable review feature untuk buyer & seller
```

**Expected Result:**
- Transaction marked complete
- Status berubah menjadi "completed"
- Review button menjadi available
- Seller & Buyer dapat saling memberi review
- Status code: 200 OK

**Actual Result:** _______________  
**Status:** PASS / FAIL

---

### Exception Path: Dispute

**Test Case ID:** UTC-014-002  
**Title:** Dispute During Transaction  
**Precondition:** Transaction dalam status "accepted"

**Steps:**
```
1. Buyer atau Seller merasa ada masalah dengan transaksi
2. User membuka Dashboard > Transactions
3. User klik tombol "Ajukan Dispute"
4. Sistem tampilkan form dispute dengan:
   - Kategori masalah (produk rusak, tidak sesuai, dll)
   - Deskripsi
   - Bukti foto (optional)
5. User submit dispute
6. Sistem update transaction status = "disputed"
7. Sistem notify admin
```

**Expected Result:**
- Dispute dibuat
- Transaction status berubah menjadi "disputed"
- Admin mendapat notifikasi untuk review
- Admin dapat investigate dan resolve
- Status code: 201 Created

**Actual Result:** _______________  
**Status:** PASS / FAIL

---

## UC-015: Buat Review

### Happy Path (Normal Flow)

**Test Case ID:** UTC-015-001  
**Title:** Successfully Leave Review  
**Precondition:** Transaction completed, review feature enabled

**Steps:**
```
1. Buyer membuka Dashboard > Transactions
2. Buyer melihat completed transaction
3. Buyer klik tombol "Beri Review"
4. Sistem tampilkan form review dengan:
   - Rating: (star selector)
   - Judul: (text field)
   - Komentar: (textarea)
   - Foto: (upload optional)
5. Buyer mengisi:
   - Rating: 5 stars
   - Judul: "Seller Sangat Responsif"
   - Komentar: "Barang sesuai deskripsi, seller sangat helpful, packing rapi"
   - Foto: (upload 2 foto)
6. Buyer klik tombol "Submit Review"
7. Sistem validasi input
8. Sistem simpan review ke database
9. Sistem update seller's rating_average dan rating_count
10. Sistem buat notification untuk seller
```

**Expected Result:**
- Review berhasil dibuat
- Tampilkan success message: "Review berhasil dipublikasikan"
- Seller melihat review di profile
- Seller rating terupdate
- Review visible di marketplace (untuk seller yang direview)
- Status code: 201 Created

**Actual Result:** _______________  
**Status:** PASS / FAIL

---

### Exception Path: Comment Too Short

**Test Case ID:** UTC-015-002  
**Title:** Review with Invalid Comment Length  
**Precondition:** -

**Steps:**
```
1. Buyer membuka form review
2. Buyer mengisi:
   - Rating: 4 stars
   - Judul: "Good"
   - Komentar: "Nice" (5 characters, < 10 minimum)
3. Buyer klik tombol "Submit Review"
4. Sistem validasi panjang komentar
```

**Expected Result:**
- Tampilkan error: "Komentar minimal 10 karakter"
- Form tidak di-submit
- Buyer dapat memperbaiki komentar

**Actual Result:** _______________  
**Status:** PASS / FAIL

---

## UC-020: Buka Chat dengan User Lain

### Happy Path (Normal Flow)

**Test Case ID:** UTC-020-001  
**Title:** Successfully Open Chat  
**Precondition:** User sudah login, melihat product atau user profile

**Steps:**
```
1. Buyer membuka Product Detail
2. Buyer klik tombol "Chat Seller"
3. Sistem check apakah conversation sudah exist
4. Jika belum exist:
   - Sistem create conversation record di database
   - Sistem simpan buyer_id, seller_id, created_at
5. Sistem load chat history (jika ada)
6. Sistem tampilkan chat window dengan:
   - Nama seller
   - Avatar seller
   - Status (online/offline)
   - Message history
   - Input message box
```

**Expected Result:**
- Chat window berhasil dibuka
- Conversation tercipta atau loaded dari database
- Chat history ditampilkan (jika ada)
- User dapat ketik dan kirim pesan
- Status code: 200 OK

**Actual Result:** _______________  
**Status:** PASS/FAIL

---

### Exception Path: Block User

**Test Case ID:** UTC-020-002  
**Title:** Open Chat with Blocked User  
**Precondition:** Seller sudah memblock buyer ini sebelumnya

**Steps:**
```
1. Buyer mencoba membuka chat dengan seller
2. Sistem check apakah buyer di block list seller
```

**Expected Result:**
- Tampilkan message: "Anda tidak bisa menghubungi user ini"
- Chat window tidak dibuka
- Buyer dapat unblock atau hubungi support
- Status code: 403 Forbidden

**Actual Result:** _______________  
**Status:** PASS / FAIL

---

## UC-028: View Admin Dashboard

### Happy Path (Normal Flow)

**Test Case ID:** UTC-028-001  
**Title:** Admin Successfully View Dashboard  
**Precondition:** User sudah login dengan role = "admin"

**Steps:**
```
1. Admin membuka URL /admin
2. Middleware requireRole("admin") verify user role
3. Sistem check role di database = "admin"
4. Sistem load dashboard data:
   - Total users
   - Total products
   - Total transactions
   - Total revenue
   - Reported items count
   - Suspended users count
   - Unverified sellers count
5. Sistem tampilkan dalam dashboard format dengan charts
```

**Expected Result:**
- Admin dashboard berhasil ditampilkan
- Semua metrics ter-load dengan benar
- Charts & data visualization muncul
- Admin dapat navigate ke sub-sections
- Status code: 200 OK

**Actual Result:** _______________  
**Status:** PASS / FAIL

---

### Exception Path: Non-Admin Access

**Test Case ID:** UTC-028-002  
**Title:** Non-Admin User Access Admin Page  
**Precondition:** User sudah login dengan role = "user" atau "seller"

**Steps:**
```
1. User membuka URL /admin
2. Middleware requireRole("admin") verify user role
3. Sistem check role di database != "admin"
```

**Expected Result:**
- Tampilkan error: "Akses ditolak"
- Redirect ke /marketplace atau /dashboard
- User tidak dapat akses admin panel
- Status code: 403 Forbidden

**Actual Result:** _______________  
**Status:** PASS / FAIL

---

## UC-029: Suspend/Ban User

### Happy Path (Normal Flow)

**Test Case ID:** UTC-029-001  
**Title:** Successfully Suspend User  
**Precondition:** Admin sudah login, di user management section

**Steps:**
```
1. Admin membuka Admin Dashboard > Users
2. Admin cari user untuk di-suspend: "BadSeller123"
3. Admin klik user profile
4. Admin klik tombol "Suspend"
5. Sistem tampilkan confirmation dialog dengan alasan input
6. Admin input alasan: "Menjual produk ilegal"
7. Admin klik tombol "Konfirmasi Suspend"
8. Sistem update user.is_suspended = true
9. Sistem simpan alasan suspension
10. Sistem trigger logout otomatis untuk user tersebut
11. Sistem buat notification untuk user
```

**Expected Result:**
- User berhasil di-suspend
- is_suspended flag di-update ke true di database
- User diarahkan logout secara otomatis (jika online)
- User mendapat email notification tentang suspension
- User tidak bisa login sampai admin lift suspension
- Admin dapat lihat suspension record di history
- Status code: 200 OK

**Actual Result:** _______________  
**Status:** PASS / FAIL

---

## UC-031: Report Produk/User

### Happy Path (Normal Flow)

**Test Case ID:** UTC-031-001  
**Title:** Successfully Report Product  
**Precondition:** User sudah login, melihat product detail

**Steps:**
```
1. User membuka Product Detail
2. User melihat produk mencurigakan/melanggar policy
3. User klik menu "Report" atau icon flag
4. Sistem tampilkan form report dengan:
   - Kategori: dropdown (fraud, inappropriate, damage, illegal, dll)
   - Deskripsi: textarea
   - Foto: upload optional
5. User pilih kategori: "Produk tidak sesuai deskripsi"
6. User tulis deskripsi: "Foto produk tidak match dengan barang asli"
7. User upload bukti foto
8. User klik tombol "Submit Report"
9. Sistem validasi input
10. Sistem simpan report ke database dengan status = "open"
11. Sistem buat notification untuk admin
```

**Expected Result:**
- Report berhasil dibuat
- Tampilkan success message: "Laporan berhasil dikirim"
- Admin mendapat notifikasi report baru
- Report tersimpan dengan timestamp
- Admin dapat review dan take action
- Status code: 201 Created

**Actual Result:** _______________  
**Status:** PASS / FAIL

---

## Summary Test Results

| Use Case | Happy Path | Alternative/Exception | Total Tests | Status |
|----------|-----------|----------------------|------------|--------|
| UC-001 Register | 1 | 2 | 3 | PASS/FAIL |
| UC-002 Login | 1 | 2 | 3 | PASS/FAIL |
| UC-005 List Product | 1 | 2 | 3 | PASS/FAIL |
| UC-010 Make Offer | 1 | 2 | 3 | PASS/FAIL |
| UC-012 Accept/Reject | 3 | 0 | 3 | PASS/FAIL |
| UC-014 Complete | 1 | 1 | 2 | PASS/FAIL |
| UC-015 Review | 1 | 1 | 2 | PASS/FAIL |
| UC-020 Chat | 1 | 1 | 2 | PASS/FAIL |
| UC-028 Admin Dashboard | 1 | 1 | 2 | PASS/FAIL |
| UC-029 Suspend User | 1 | 0 | 1 | PASS/FAIL |
| UC-031 Report | 1 | 0 | 1 | PASS/FAIL |
| **TOTAL** | | | **26** | |

---

## Testing Notes

- **Happy Path Testing:** Memastikan alur normal berjalan sesuai requirement
- **Alternative Path Testing:** Menguji branching logic dan conditional flows
- **Exception Path Testing:** Menguji error handling dan validation
- **Important:** Setiap test case harus repeatable dan independent
- **Documentation:** Catat actual result dan status (PASS/FAIL) untuk setiap test

---

**Last Updated:** April 24, 2026  
**File:** USE_CASE_TESTING.md
