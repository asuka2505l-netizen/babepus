# Model Comparison Testing - BabePus

Dokumen ini memetakan model Comparison Testing sesuai proses `12345.png` dan kode aplikasi Babepus.
Semua fungsi aplikasi dimasukkan tanpa pengurangan atau penambahan fitur.

## 1. Proses Comparison Testing

1. Identify Software to Test
2. Identify Competitors or Benchmarks
3. Define Testing Criteria (UI, Functionality, Performance, Security)
4. Conduct Benchmark Testing
5. Conduct Competitor Comparison
6. Analyze Test Results
7. Identify Areas of Improvement
8. Implement Changes
9. Retest
10. Evaluate if Software is Ready for Release

## 2. Identify Software to Test

Target aplikasi: Babepus.
Fokus pada backend dan fungsi yang tersedia di:
- `authRoutes.js`
- `productRoutes.js`
- `offerRoutes.js`
- `reviewRoutes.js`
- `transactionRoutes.js`
- `categoryRoutes.js`
- `chatRoutes.js`
- `notificationRoutes.js`
- `pricingRoutes.js`
- `reportRoutes.js`
- `userRoutes.js`
- `wishlistRoutes.js`
- `adminRoutes.js`

Fungsi utama yang diuji:
- Auth: register, login, profile, email verification
- Product: listing, pencarian, detail, create, update, sold, delete
- Offer: create, incoming, my, accept, reject
- Review: create review
- Transaction: complete, buyer confirm, seller confirm, dispute
- Pricing estimate: estimate harga
- Report: create report
- Chat: start conversation, send message, stream
- Notification: get, stream, mark read
- Wishlist: add/remove
- Admin: dashboard, users, suspend, reports

## 3. Identify Benchmarks / Comparison Criteria

Benchmark dibuat dari:
- validator input di `babepus-server/src/validators`
- business rules di `babepus-server/src/services`
- controller checks di `babepus-server/src/controllers`
- standard marketplace expectations

Kriteria yang digunakan:
- Functionality: validasi input, aturan bisnis, status endpoint
- UI / Response: pesan kesalahan tepat, status HTTP benar
- Performance: query pagination, list/search, transaction atomicity
- Security: auth middleware, role checks, validasi ID

## 4. Define Testing Criteria

| Area | Kriteria |
|------|----------|
| UI / Response | Pesan error konsisten, status HTTP sesuai, hasil JSON terstruktur |
| Functionality | Semua endpoint memenuhi aturan validasi dan business rule |
| Performance | Listing/search menggunakan pagination, transaksi thread-safe |
| Security | Authenticated access, role-based admin, numeric ID validation |
| Reliability | Semua kondisi error ditangani, operasi database rollback saat gagal |

## 5. Equivalence Partitioning

Equivalence Partitioning dibuat dari field validator utama.

### 5.1 Auth / Register

| Field | Valid Partition | Invalid Partition |
|-------|-----------------|-------------------|
| fullName | 3-100 karakter | < 3 atau > 100 |
| email | email valid | format invalid |
| password | ≥ 8 karakter | < 8 |
| phone | 8-20 digit | < 8 atau > 20 |
| campus | 2-120 karakter | < 2 atau > 120 |
| faculty | ≤ 120 karakter | > 120 |
| studentId | ≤ 40 karakter | > 40 |
| campusEmail | email valid | format invalid |

### 5.2 Product

| Field | Valid Partition | Invalid Partition |
|-------|-----------------|-------------------|
| title | 5-140 karakter | < 5 atau > 140 |
| description | 20-3000 karakter | < 20 atau > 3000 |
| categoryId | integer ≥ 1 | 0 atau negatif |
| price | float ≥ 1000 | < 1000 |
| conditionLabel | valid label | invalid label |
| campusLocation | 2-160 karakter | < 2 atau > 160 |

### 5.3 Offer

| Field | Valid Partition | Invalid Partition |
|-------|-----------------|-------------------|
| productId | integer ≥ 1 | 0 atau negatif |
| offerPrice | float ≥ 10000, < product.price | < 10000 atau ≥ product.price |
| note | ≤ 500 karakter | > 500 |

### 5.4 Review

| Field | Valid Partition | Invalid Partition |
|-------|-----------------|-------------------|
| rating | 1-5 | 0 atau > 5 |
| tags | array ≤ 8 | > 8 |
| tags.* | 2-40 karakter | < 2 atau > 40 |
| comment | ≤ 1000 karakter | > 1000 |

### 5.5 Pricing Estimate

| Field | Valid Partition | Invalid Partition |
|-------|-----------------|-------------------|
| categoryId | integer ≥ 1 | 0 |
| originalPrice | ≥ 1000 | < 1000 |
| conditionLabel | valid label | invalid label |
| ageMonths | 0-240 | < 0 atau > 240 |
| urgency | low/normal/high | invalid value |

### 5.6 Chat

| Field | Valid Partition | Invalid Partition |
|-------|-----------------|-------------------|
| productId | integer ≥ 1 | 0 |
| message | 1-2000 karakter | kosong atau > 2000 |

### 5.7 Admin / Shared ID

| Field | Valid Partition | Invalid Partition |
|-------|-----------------|-------------------|
| id (param) | integer ≥ 1 | 0 atau negatif |
| page | integer ≥ 1 | 0 |
| limit | 1-50 | < 1 atau > 50 |

## 6. Decision Table Testing

Decision table untuk fitur kritikal berdasarkan kondisi nyata dari kode.

### 6.1 Register

| Condition | C1 fullName invalid | C2 email invalid | C3 password invalid | Outcome |
|-----------|---------------------|------------------|---------------------|---------|
| TC-R1 | T | F | F | Error nama |
| TC-R2 | F | T | F | Error email |
| TC-R3 | F | F | T | Error password |
| TC-R4 | F | F | F | Success |

### 6.2 Login

| Condition | C1 email invalid | C2 password empty | Outcome |
|-----------|------------------|-------------------|---------|
| TC-L1 | T | F | Error email |
| TC-L2 | F | T | Error password |
| TC-L3 | F | F | Success |

### 6.3 Create Product

| Condition | C1 title invalid | C2 price invalid | C3 condition invalid | C4 image missing | Outcome |
|-----------|------------------|------------------|-----------------------|-----------------|---------|
| TC-P1 | T | F | F | F | Error title |
| TC-P2 | F | T | F | F | Error price |
| TC-P3 | F | F | T | F | Error condition |
| TC-P4 | F | F | F | T | Error image |
| TC-P5 | F | F | F | F | Success |

### 6.4 Create Offer

| Condition | C1 product missing | C2 offerPrice < 10000 | C3 offerPrice ≥ product.price | Outcome |
|-----------|-------------------|-----------------------------|-----------------------------|---------|
| TC-O1 | T | F | F | Error produk |
| TC-O2 | F | T | F | Error min offer |
| TC-O3 | F | F | T | Error harga tawaran |
| TC-O4 | F | F | F | Success |

### 6.5 Review

| Condition | C1 rating invalid | C2 tags invalid | C3 comment invalid | Outcome |
|-----------|------------------|------------------|--------------------|---------|
| TC-RV1 | T | F | F | Error rating |
| TC-RV2 | F | T | F | Error tags |
| TC-RV3 | F | F | T | Error comment |
| TC-RV4 | F | F | F | Success |

### 6.6 Transaction Complete

| Condition | C1 id invalid | C2 transaction not found | Outcome |
|-----------|----------------|----------------------------|---------|
| TC-T1 | T | F | Error id |
| TC-T2 | F | T | Error not found |
| TC-T3 | F | F | Success |

### 6.7 Chat

| Condition | C1 productId invalid | C2 message invalid | Outcome |
|-----------|--------------------|--------------------|---------|
| TC-C1 | T | F | Error productId |
| TC-C2 | F | T | Error message |
| TC-C3 | F | F | Success |

### 6.8 Wishlist

| Condition | C1 productId invalid | Outcome |
|-----------|--------------------|---------|
| TC-W1 | T | Error id |
| TC-W2 | F | Success |

## 7. Comparison Tables

### 7.1 Funktionalitas vs Benchmark

| Feature | Benchmark / Expected | Current Babepus Implementation | Status |
|---------|----------------------|-------------------------------|--------|
| Register | validasi fullName, email, password, campus | `authValidators.js` menyatakan validasi lengkap | OK |
| Login | validasi email + password Tidak kosong | `authValidators.js` loginValidator | OK |
| Product create | validasi title, description, category, price, condition, campusLocation | `productValidators.js` + controller image check | OK |
| Offer create | validasi productId, offerPrice, bisnis < product.price, min 10000 | `offerValidators.js` + `offerService.js` | OK |
| Review create | validasi rating 1-5, tags, comment | `reviewValidators.js` | OK |
| Pricing estimate | validasi originalPrice, ageMonths, urgency | `pricingValidators.js` | OK |
| Report create | validasi targetType, reason, detail | `reportValidators.js` | OK |
| Chat conversation | validasi productId, message length | `chatValidators.js` | OK |
| Notification read | id param validation | `notificationValidators.js` | OK |
| Wishlist actions | productId id param validation | `wishlistValidators.js` | OK |
| Admin actions | role admin, status validation, suspend boolean | `adminValidators.js` + middleware | OK |

### 7.2 Security / Access Control

| Feature | Benchmark | Current Babepus | Status |
|---------|-----------|-----------------|--------|
| Auth-protected routes | hanya akses jika login | `authMiddleware` di route | OK |
| Admin-only routes | hanya admin | `requireRole("admin")` | OK |
| ID validation | param `id` harus > 0 | `sharedValidators.js` | OK |

### 7.3 Performance / Data Handling

| Feature | Benchmark | Current Babepus | Status |
|---------|-----------|-----------------|--------|
| List pagination | page ≥ 1, limit ≤ 50 | `paginationQuery` dan `productListValidator` | OK |
| Transaction atomicity | rollback jika gagal | `offerService.js` gunakan transaction | OK |
| Search length limit | search ≤ 120 | validator `productListValidator` | OK |

## 8. Analysis of Test Results

Hasil analisis berdasarkan kode menunjukkan bahwa:
- Validasi input di semua route sudah terdefinisi dengan jelas.
- Aturan bisnis penting seperti `offerPrice < product.price` dan `offerPrice ≥ 10000` sudah ada di service.
- Role-based access control tersedia untuk admin routes.
- Pagination dan query validation disediakan untuk daftar produk.

## 9. Areas of Improvement

Berdasarkan perbandingan ini, area perbaikan yang mungkin:
- Pastikan pesan error respons konsisten di semua controller / middleware.
- Periksa implementasi rate limiting atau throttle jika diperlukan untuk endpoint stream/chat.
- Verifikasi bahwa file upload avatar/produk mengembalikan error jelas jika tidak ada file.

## 10. Retest dan Evaluasi Siap Rilis

Setelah perubahan, ulangi pengujian:
- Equivalence Partitioning untuk setiap field
- Decision Table untuk tiap use case
- Comparison Table untuk mengecek kesesuaian implementasi dengan benchmark

Evaluasi apakah aplikasi siap dirilis jika semua kriteria fungsi, keamanan, dan performa terpenuhi.
