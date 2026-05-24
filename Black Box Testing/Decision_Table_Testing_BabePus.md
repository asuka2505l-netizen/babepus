# Model Decision Table Testing - BabePus

Decision table testing adalah pengujian gabungan dari berbagai kondisi dalam pengambilan keputusan. Dokumen ini dibuat sesuai format `1234.png` dengan:
- Equivalence Partitioning
- Decision Table Testing

Seluruh fungsi aplikasi Babepus dicakup berdasarkan route dan validator yang ada di `babepus-server/src`.

---

## 1. Equivalence Partitioning

### 1.1 Auth / Register

| ID | Test Case | Expected Output | Actual Output |
|----|-----------|-----------------|---------------|
| EP-A1 | fullName valid, email valid, password valid | Register berhasil | |
| EP-A2 | fullName terlalu pendek | Gagal: Nama lengkap minimal 3 karakter | |
| EP-A3 | email invalid | Gagal: Email tidak valid | |
| EP-A4 | password terlalu pendek | Gagal: Password minimal 8 karakter | |
| EP-A5 | campus optional valid | Register berhasil | |

### 1.2 Auth / Login

| ID | Test Case | Expected Output | Actual Output |
|----|-----------|-----------------|---------------|
| EP-B1 | email valid, password terisi | Login berhasil | |
| EP-B2 | email invalid | Gagal: Email tidak valid | |
| EP-B3 | password kosong | Gagal: Password wajib diisi | |

### 1.3 Auth / Verify Email

| ID | Test Case | Expected Output | Actual Output |
|----|-----------|-----------------|---------------|
| EP-C1 | token 20-120 karakter | Verifikasi berhasil | |
| EP-C2 | token terlalu pendek | Gagal: Token verifikasi tidak valid | |
| EP-C3 | token terlalu panjang | Gagal: Token verifikasi tidak valid | |

### 1.4 Product

| ID | Test Case | Expected Output | Actual Output |
|----|-----------|-----------------|---------------|
| EP-D1 | title 5-140, description 20-3000, price ≥ 1000, condition valid, campusLocation 2-160 | Produk berhasil dibuat | |
| EP-D2 | title < 5 karakter | Gagal: Judul produk 5-140 karakter | |
| EP-D3 | description < 20 karakter | Gagal: Deskripsi produk minimal 20 karakter | |
| EP-D4 | price < 1000 | Gagal: Harga minimal Rp1.000. | |
| EP-D5 | conditionLabel invalid | Gagal: Kondisi barang tidak valid | |
| EP-D6 | campusLocation < 2 karakter | Gagal: Lokasi kampus wajib diisi | |

### 1.5 Product Update

| ID | Test Case | Expected Output | Actual Output |
|----|-----------|-----------------|---------------|
| EP-E1 | update valid | Produk berhasil diperbarui | |
| EP-E2 | title invalid pada update | Gagal: Judul produk 5-140 karakter | |
| EP-E3 | price invalid pada update | Gagal: Harga minimal Rp1.000. | |

### 1.6 Product List / Search

| ID | Test Case | Expected Output | Actual Output |
|----|-----------|-----------------|---------------|
| EP-F1 | search ≤ 120, categoryId ≥ 1, minPrice ≥ 0, maxPrice ≥ 0, sort valid | List hasil ditemukan | |
| EP-F2 | search > 120 | Gagal: Pencarian terlalu panjang | |
| EP-F3 | categoryId 0 | Gagal: Kategori tidak valid | |
| EP-F4 | sort invalid | Gagal: Sort tidak valid | |

### 1.7 Offer

| ID | Test Case | Expected Output | Actual Output |
|----|-----------|-----------------|---------------|
| EP-G1 | productId valid, offerPrice ≥ 10000, offerPrice < product.price | Tawaran berhasil dibuat | |
| EP-G2 | productId 0 | Gagal: Produk tidak valid | |
| EP-G3 | offerPrice 999 | Gagal: Nominal tawaran minimal Rp1.000. | |
| EP-G4 | offerPrice 9999 | Gagal: Harga tawaran minimum Rp 10.000. | |

### 1.8 Offer Accept / Reject

| ID | Test Case | Expected Output | Actual Output |
|----|-----------|-----------------|---------------|
| EP-H1 | offer pending, produk active, seller sama pemilik | Tawaran diterima/ditolak | |
| EP-H2 | offer tidak ditemukan | Gagal: Tawaran tidak ditemukan | |
| EP-H3 | offer sudah diproses | Gagal: Tawaran ini sudah diproses | |

### 1.9 Review

| ID | Test Case | Expected Output | Actual Output |
|----|-----------|-----------------|---------------|
| EP-I1 | rating 1-5, comment ≤ 1000, tags ≤ 8 | Review berhasil dibuat | |
| EP-I2 | rating 0 | Gagal: Rating harus 1 sampai 5 | |
| EP-I3 | tags 9 item | Gagal: Tag review maksimal 8 item | |
| EP-I4 | comment > 1000 | Gagal: Komentar maksimal 1000 karakter | |

### 1.10 Pricing Estimate

| ID | Test Case | Expected Output | Actual Output |
|----|-----------|-----------------|---------------|
| EP-J1 | categoryId ≥ 1, originalPrice ≥ 1000, conditionLabel valid | Estimasi berhasil | |
| EP-J2 | originalPrice 999 | Gagal: Harga beli awal minimal Rp1.000. | |
| EP-J3 | ageMonths 241 | Gagal: Umur barang maksimal 240 bulan | |
| EP-J4 | urgency invalid | Gagal: Urgensi tidak valid | |

### 1.11 Report

| ID | Test Case | Expected Output | Actual Output |
|----|-----------|-----------------|---------------|
| EP-K1 | targetType product, targetProductId ≥ 1, reason 5-160 | Laporan berhasil dibuat | |
| EP-K2 | targetType user, targetUserId ≥ 1 | Laporan berhasil dibuat | |
| EP-K3 | reason 4 chars | Gagal: Alasan laporan 5-160 karakter | |

### 1.12 Chat

| ID | Test Case | Expected Output | Actual Output |
|----|-----------|-----------------|---------------|
| EP-L1 | productId ≥ 1, message 1-2000 | Pesan berhasil dikirim | |
| EP-L2 | message kosong | Gagal: Pesan wajib 1-2000 karakter | |
| EP-L3 | message 2001 chars | Gagal: Pesan wajib 1-2000 karakter | |

### 1.13 Notification

| ID | Test Case | Expected Output | Actual Output |
|----|-----------|-----------------|---------------|
| EP-M1 | mark as read dengan id valid | Notifikasi terbaca | |
| EP-M2 | id 0 | Gagal: ID tidak valid | |

### 1.14 User Profile

| ID | Test Case | Expected Output | Actual Output |
|----|-----------|-----------------|---------------|
| EP-N1 | update profile valid | Profil berhasil diperbarui | |
| EP-N2 | fullName invalid | Gagal: Nama lengkap minimal 3 karakter | |
| EP-N3 | phone invalid | Gagal: Nomor HP tidak valid | |

### 1.15 Wishlist

| ID | Test Case | Expected Output | Actual Output |
|----|-----------|-----------------|---------------|
| EP-O1 | tambah wishlist productId ≥ 1 | Item ditambahkan ke wishlist | |
| EP-O2 | hapus wishlist productId ≥ 1 | Item dihapus dari wishlist | |
| EP-O3 | productId 0 | Gagal: ID tidak valid | |

### 1.16 Transaction

| ID | Test Case | Expected Output | Actual Output |
|----|-----------|-----------------|---------------|
| EP-P1 | complete transaction id valid | Transaksi selesai | |
| EP-P2 | buyer confirm id valid | Escrow buyer confirm | |
| EP-P3 | dispute id valid | Escrow dispute diproses | |
| EP-P4 | id 0 | Gagal: ID tidak valid | |

### 1.17 Admin

| ID | Test Case | Expected Output | Actual Output |
|----|-----------|-----------------|---------------|
| EP-Q1 | suspend user id valid, isSuspended boolean | User disuspend | |
| EP-Q2 | update report status valid | Status laporan diperbarui | |
| EP-Q3 | status invalid | Gagal: Status laporan tidak valid | |
| EP-Q4 | limit 51 | Gagal: Limit maksimal 50 | |

### 1.18 Category

| ID | Test Case | Expected Output | Actual Output |
|----|-----------|-----------------|---------------|
| EP-R1 | daftar kategori | Kategori ditampilkan | |

---

## 2. Decision Table Testing

### 2.1 Login

| ID | CONDITION / ACTION | TC1 | TC2 | TC3 |
|----|--------------------|-----|-----|-----|
| C1 | Email invalid | T | F | F |
| C2 | Password kosong | F | T | F |
| C3 | Email & password valid | F | F | T |
| A1 | Redirect / login success | F | F | E |
| A2 | Return error message | E | E | F |

### 2.2 Register

| ID | CONDITION / ACTION | TC1 | TC2 | TC3 | TC4 |
|----|--------------------|-----|-----|-----|-----|
| C1 | fullName < 3 | T | F | F | F |
| C2 | email invalid | F | T | F | F |
| C3 | password < 8 | F | F | T | F |
| C4 | semua field valid | F | F | F | T |
| A1 | Register success | F | F | F | E |
| A2 | Show validation error | E | E | E | F |

### 2.3 Verify Email

| ID | CONDITION / ACTION | TC1 | TC2 | TC3 |
|----|--------------------|-----|-----|-----|
| C1 | token < 20 | T | F | F |
| C2 | token 20-120 | F | T | F |
| C3 | token > 120 | F | F | T |
| A1 | Verify success | F | E | F |
| A2 | Show token error | E | F | E |

### 2.4 Create Product

| ID | CONDITION / ACTION | TC1 | TC2 | TC3 | TC4 |
|----|--------------------|-----|-----|-----|-----|
| C1 | title < 5 | T | F | F | F |
| C2 | price < 1000 | F | T | F | F |
| C3 | conditionLabel invalid | F | F | T | F |
| C4 | image file missing | F | F | F | T |
| C5 | semua valid | F | F | F | F |
| A1 | Create product success | F | F | F | E |
| A2 | Show validation/error message | E | E | E | F |

### 2.5 Update Product

| ID | CONDITION / ACTION | TC1 | TC2 | TC3 |
|----|--------------------|-----|-----|-----|
| C1 | title invalid pada update | T | F | F |
| C2 | price invalid pada update | F | T | F |
| C3 | semua valid | F | F | T |
| A1 | Update success | F | F | E |
| A2 | Show validation error | E | E | F |

### 2.6 Create Offer

| ID | CONDITION / ACTION | TC1 | TC2 | TC3 | TC4 | TC5 |
|----|--------------------|-----|-----|-----|-----|-----|
| C1 | product tidak ditemukan | T | F | F | F | F |
| C2 | product tidak active | F | T | F | F | F |
| C3 | buyer = seller | F | F | T | F | F |
| C4 | offerPrice ≥ product.price | F | F | F | T | F |
| C5 | offerPrice < 10000 | F | F | F | F | T |
| C6 | semua valid | F | F | F | F | F |
| A1 | Offer created | F | F | F | F | E |
| A2 | Show correct error | E | E | E | E | E |

### 2.7 Accept Offer

| ID | CONDITION / ACTION | TC1 | TC2 | TC3 | TC4 |
|----|--------------------|-----|-----|-----|-----|
| C1 | offer tidak ditemukan | T | F | F | F |
| C2 | offer status bukan pending | F | T | F | F |
| C3 | product sudah tidak available | F | F | T | F |
| C4 | semua valid | F | F | F | T |
| A1 | Offer accepted, transaction created | F | F | F | E |
| A2 | Show error | E | E | E | F |

### 2.8 Reject Offer

| ID | CONDITION / ACTION | TC1 | TC2 |
|----|--------------------|-----|-----|
| C1 | offer not found or not pending | T | F |
| C2 | offer pending and seller valid | F | T |
| A1 | Reject offer success | F | E |
| A2 | Show error | E | F |

### 2.9 Review Create

| ID | CONDITION / ACTION | TC1 | TC2 | TC3 | TC4 |
|----|--------------------|-----|-----|-----|-----|
| C1 | rating < 1 | T | F | F | F |
| C2 | rating > 5 | F | T | F | F |
| C3 | tags > 8 | F | F | T | F |
| C4 | comment > 1000 | F | F | F | T |
| C5 | semua valid | F | F | F | F |
| A1 | Review success | F | F | F | E |
| A2 | Show validation error | E | E | E | F |

### 2.10 Pricing Estimate

| ID | CONDITION / ACTION | TC1 | TC2 | TC3 | TC4 |
|----|--------------------|-----|-----|-----|-----|
| C1 | originalPrice < 1000 | T | F | F | F |
| C2 | ageMonths > 240 | F | T | F | F |
| C3 | urgency invalid | F | F | T | F |
| C4 | semua valid | F | F | F | T |
| A1 | Estimate success | F | F | F | E |
| A2 | Show validation error | E | E | E | F |

### 2.11 Report Create

| ID | CONDITION / ACTION | TC1 | TC2 | TC3 | TC4 |
|----|--------------------|-----|-----|-----|-----|
| C1 | targetType invalid | T | F | F | F |
| C2 | targetType=product, targetProductId invalid | F | T | F | F |
| C3 | reason < 5 | F | F | T | F |
| C4 | semua valid | F | F | F | T |
| A1 | Create report success | F | F | F | E |
| A2 | Show validation error | E | E | E | F |

### 2.12 Chat Start Conversation

| ID | CONDITION / ACTION | TC1 | TC2 | TC3 |
|----|--------------------|-----|-----|-----|
| C1 | productId invalid | T | F | F |
| C2 | message kosong | F | T | F |
| C3 | semua valid | F | F | T |
| A1 | Conversation started | F | F | E |
| A2 | Show validation error | E | E | F |

### 2.13 Chat Send Message

| ID | CONDITION / ACTION | TC1 | TC2 | TC3 |
|----|--------------------|-----|-----|-----|
| C1 | message kosong | T | F | F |
| C2 | message > 2000 | F | T | F |
| C3 | semua valid | F | F | T |
| A1 | Message sent | F | F | E |
| A2 | Show validation error | E | E | F |

### 2.14 Notification Mark As Read

| ID | CONDITION / ACTION | TC1 | TC2 |
|----|--------------------|-----|-----|
| C1 | notification id invalid | T | F |
| C2 | id valid | F | T |
| A1 | Mark read success | F | E |
| A2 | Show validation error | E | F |

### 2.15 User Update Profile

| ID | CONDITION / ACTION | TC1 | TC2 | TC3 |
|----|--------------------|-----|-----|-----|
| C1 | fullName invalid | T | F | F |
| C2 | phone invalid | F | T | F |
| C3 | semua valid | F | F | T |
| A1 | Update profile success | F | F | E |
| A2 | Show validation error | E | E | F |

### 2.16 Wishlist Add / Remove

| ID | CONDITION / ACTION | TC1 | TC2 | TC3 |
|----|--------------------|-----|-----|-----|
| C1 | productId invalid | T | F | F |
| C2 | add wishlist valid | F | T | F |
| C3 | remove wishlist valid | F | F | T |
| A1 | Wishlist action success | F | E | E |
| A2 | Show validation error | E | F | F |

### 2.17 Transaction Actions

| ID | CONDITION / ACTION | TC1 | TC2 | TC3 | TC4 |
|----|--------------------|-----|-----|-----|-----|
| C1 | transaction id invalid | T | F | F | F |
| C2 | complete transaction valid | F | T | F | F |
| C3 | buyer confirm valid | F | F | T | F |
| C4 | dispute valid | F | F | F | T |
| A1 | Transaction action success | F | E | E | E |
| A2 | Show validation error | E | F | F | F |

### 2.18 Admin Actions

| ID | CONDITION / ACTION | TC1 | TC2 | TC3 | TC4 |
|----|--------------------|-----|-----|-----|-----|
| C1 | suspend payload invalid | T | F | F | F |
| C2 | report status invalid | F | T | F | F |
| C3 | admin request valid | F | F | T | F |
| C4 | list query limit invalid | F | F | F | T |
| A1 | Admin action success | F | F | E | E |
| A2 | Show validation error | E | E | F | F |

### 2.19 Product Actions Without Body

| ID | CONDITION / ACTION | TC1 | TC2 |
|----|--------------------|-----|-----|
| C1 | product id invalid | T | F |
| C2 | product id valid | F | T |
| A1 | Get product success | F | E |
| A2 | Show validation error | E | F |

### 2.20 Category List

| ID | CONDITION / ACTION | TC1 |
|----|--------------------|-----|
| C1 | request category list | E |
| A1 | Return categories | E |

### 2.21 Notification Stream

| ID | CONDITION / ACTION | TC1 |
|----|--------------------|-----|
| C1 | request notification stream | E |
| A1 | Stream connection open | E |

### 2.22 Chat Stream

| ID | CONDITION / ACTION | TC1 |
|----|--------------------|-----|
| C1 | request chat stream | E |
| A1 | Stream connection open | E |

---

## 3. Coverage Summary

Dokumen ini mencakup semua endpoint dan fungsi input utama di aplikasi Babepus sesuai struktur route berikut:
- `authRoutes` (register, login, me, email-verification)
- `productRoutes` (list, search, mine, detail, create, update, sold, delete)
- `offerRoutes` (create, incoming, my, accept, reject)
- `reviewRoutes` (create review)
- `transactionRoutes` (my, complete, buyer-confirm, seller-confirm, dispute)
- `categoryRoutes` (get categories)
- `chatRoutes` (stream, get conversations, start conversation, get messages, send message)
- `notificationRoutes` (stream, get notifications, read all, read single)
- `pricingRoutes` (estimate)
- `reportRoutes` (create report)
- `userRoutes` (dashboard, analytics, update profile, upload avatar)
- `wishlistRoutes` (get, add, remove)
- `adminRoutes` (dashboard, users, suspend, products, reports, update report status)

> Semua kasus telah disusun tanpa pengurangan atau penambahan fitur, sesuai dengan aplikasi Babepus yang ada di repository.