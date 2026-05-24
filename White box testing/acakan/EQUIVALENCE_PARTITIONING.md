# Equivalence Partitioning (EP) Testing - BabePus

Equivalence Partitioning membagi input data menjadi kelompok-kelompok (partisi) yang seharusnya berperilaku sama. Jika satu nilai dalam partisi lulus testing, diasumsikan semua nilai dalam partisi yang sama juga lulus.

---

## 1. REGISTRATION FORM TESTING

### Test Case: Email Input

**Field:** Email (campusEmail)

| Partition | Range/Contoh | Expected | Test ID |
|-----------|-------------|----------|---------|
| **Valid Email** | user@campus.ac.id | Accept | EP-REG-E-001 |
| | mahasiswa@univ.edu | Accept | EP-REG-E-002 |
| | test.user+tag@kampus.org | Accept | EP-REG-E-003 |
| **Empty Email** | (empty string) | Reject - Required | EP-REG-E-004 |
| **Invalid Format** | user@.com | Reject - Invalid format | EP-REG-E-005 |
| | user@@campus.ac.id | Reject - Invalid format | EP-REG-E-006 |
| | user@campus | Reject - Invalid format (no TLD) | EP-REG-E-007 |
| | user campus@.ac.id | Reject - Invalid format (space) | EP-REG-E-008 |
| **Duplicate Email** | (already exist di DB) | Reject - Email already used | EP-REG-E-009 |

**Test Case:**
```
TC-EP-REG-E-001: Valid Email
Input: user@campus.ac.id
Expected: Accept, proceed to next field
Result: PASS/FAIL

TC-EP-REG-E-004: Empty Email
Input: (empty)
Expected: Show error "Email is required"
Result: PASS/FAIL

TC-EP-REG-E-009: Duplicate Email
Input: existing@campus.ac.id
Expected: Show error "Email sudah terdaftar"
Result: PASS/FAIL
```

---

### Test Case: Password Input

**Field:** Password

| Partition | Range/Contoh | Expected | Test ID |
|-----------|-------------|----------|---------|
| **Strong Password** | Abc123!@#xyz | Accept | EP-REG-P-001 |
| | SecurePass2024$ | Accept | EP-REG-P-002 |
| **Too Short** | Pass1! (6 chars) | Reject - Min 8 chars | EP-REG-P-003 |
| **No Uppercase** | password123! | Reject - Require uppercase | EP-REG-P-004 |
| **No Number** | Password!@# | Reject - Require number | EP-REG-P-005 |
| **No Special Char** | Password123 | Reject - Require special char | EP-REG-P-006 |
| **Empty** | (empty string) | Reject - Required | EP-REG-P-007 |
| **Space in Password** | Pass 123! | Reject or Accept (tergantung requirement) | EP-REG-P-008 |

**Test Case:**
```
TC-EP-REG-P-001: Strong Password
Input: Abc123!@#xyz
Expected: Accept
Result: PASS/FAIL

TC-EP-REG-P-003: Password Too Short
Input: Pass1!
Expected: Show error "Minimal 8 karakter"
Result: PASS/FAIL

TC-EP-REG-P-006: No Special Character
Input: Password123
Expected: Show error "Harus mengandung karakter khusus"
Result: PASS/FAIL
```

---

### Test Case: Student ID Input

**Field:** Student ID (Nomor Induk Mahasiswa)

| Partition | Range/Contoh | Expected | Test ID |
|-----------|-------------|----------|---------|
| **Valid Student ID** | 20220001 (8 digits) | Accept | EP-REG-S-001 |
| | 202200001 (9 digits) | Accept | EP-REG-S-002 |
| **Too Short** | 2022001 (7 digits) | Reject - Minimum 8 digits | EP-REG-S-003 |
| **Too Long** | 202200012345 (12 digits) | Reject - Maximum 10 digits | EP-REG-S-004 |
| **Contains Letters** | 2022A001 | Reject - Numeric only | EP-REG-S-005 |
| **Empty** | (empty) | Reject - Required | EP-REG-S-006 |
| **Special Characters** | 2022-0001 | Reject - No special chars | EP-REG-S-007 |

**Test Case:**
```
TC-EP-REG-S-001: Valid Student ID
Input: 20220001
Expected: Accept
Result: PASS/FAIL

TC-EP-REG-S-003: Student ID Too Short
Input: 2022001
Expected: Show error "Minimal 8 digit"
Result: PASS/FAIL

TC-EP-REG-S-005: Contains Letters
Input: 2022A001
Expected: Show error "Hanya angka"
Result: PASS/FAIL
```

---

## 2. PRODUCT LISTING TESTING

### Test Case: Price Input

**Field:** Product Price (Harga)

| Partition | Range | Expected | Test ID |
|-----------|-------|----------|---------|
| **Valid Price** | 10,000 - 999,999,999 Rp | Accept | EP-PROD-PR-001 |
| | 50,000 Rp | Accept | EP-PROD-PR-002 |
| | 1,000,000 Rp | Accept | EP-PROD-PR-003 |
| **Price Too Low** | < 10,000 Rp (e.g., 5,000) | Reject - Min 10K | EP-PROD-PR-004 |
| **Price Too High** | > 999,999,999 Rp | Reject - Max exceeded | EP-PROD-PR-005 |
| **Zero/Negative** | 0 | Reject - Must > 0 | EP-PROD-PR-006 |
| | -50,000 | Reject - Cannot be negative | EP-PROD-PR-007 |
| **Empty** | (empty) | Reject - Required | EP-PROD-PR-008 |
| **Non-Numeric** | "lima ribu" | Reject - Numeric only | EP-PROD-PR-009 |
| **Decimal** | 50,000.50 | Accept or Reject (tergantkan requirement) | EP-PROD-PR-010 |

**Test Case:**
```
TC-EP-PROD-PR-001: Valid Price
Input: 50000
Expected: Accept
Result: PASS/FAIL

TC-EP-PROD-PR-004: Price Too Low
Input: 5000
Expected: Show error "Harga minimum Rp 10.000"
Result: PASS/FAIL

TC-EP-PROD-PR-006: Zero Price
Input: 0
Expected: Show error "Harga harus lebih dari 0"
Result: PASS/FAIL
```

---

### Test Case: Product Name

**Field:** Product Name (Nama Produk)

| Partition | Range | Expected | Test ID |
|-----------|-------|----------|---------|
| **Valid Name** | 3-100 chars, alphanumeric + space | Accept | EP-PROD-N-001 |
| | "Laptop ASUS" | Accept | EP-PROD-N-002 |
| | "HP Bekas - Mulus Semua" | Accept | EP-PROD-N-003 |
| **Too Short** | 1-2 chars (e.g., "HP") | Reject - Min 3 chars | EP-PROD-N-004 |
| **Too Long** | > 100 chars | Reject - Max 100 chars | EP-PROD-N-005 |
| **Empty** | (empty) | Reject - Required | EP-PROD-N-006 |
| **Special Chars** | "Laptop @#$%" | Accept or Reject (depending on rules) | EP-PROD-N-007 |
| **Numbers Only** | "12345" | Accept (should be allowed) | EP-PROD-N-008 |

**Test Case:**
```
TC-EP-PROD-N-001: Valid Product Name
Input: Laptop ASUS ROG Gaming
Expected: Accept
Result: PASS/FAIL

TC-EP-PROD-N-004: Product Name Too Short
Input: HP
Expected: Show error "Minimal 3 karakter"
Result: PASS/FAIL

TC-EP-PROD-N-005: Product Name Too Long
Input: (101 characters)
Expected: Show error "Maksimal 100 karakter"
Result: PASS/FAIL
```

---

## 3. OFFER/PRICE NEGOTIATION TESTING

### Test Case: Offered Price

**Field:** Offered Price (Harga yang ditawarkan)

| Partition | Kondisi | Expected | Test ID |
|-----------|---------|----------|---------|
| **Valid Offer** | < Original Price | Accept | EP-OFFER-OP-001 |
| | Original: 100K, Offer: 80K | Accept | EP-OFFER-OP-002 |
| **Equal to Original** | Offered Price = Original Price | Accept (tapi tidak ada negotiation) | EP-OFFER-OP-003 |
| **Higher than Original** | Offered Price > Original Price | Reject or Warning | EP-OFFER-OP-004 |
| | Original: 100K, Offer: 120K | Reject - Cannot exceed ask price | EP-OFFER-OP-005 |
| **Negative or Zero** | ≤ 0 | Reject - Must > 0 | EP-OFFER-OP-006 |
| **Too Low** | < 10% dari original price (e.g., Original: 100K, Offer: 5K) | Warning or Accept? | EP-OFFER-OP-007 |
| **Empty** | (empty) | Reject - Required | EP-OFFER-OP-008 |

**Test Case:**
```
TC-EP-OFFER-OP-001: Valid Offer (Lower than Original)
Input: Original Price: 100000, Offered Price: 80000
Expected: Accept, show success message
Result: PASS/FAIL

TC-EP-OFFER-OP-004: Offered Higher than Original
Input: Original Price: 100000, Offered Price: 120000
Expected: Show warning "Harga penawaran tidak boleh melebihi harga ask"
Result: PASS/FAIL

TC-EP-OFFER-OP-007: Extremely Low Offer
Input: Original Price: 100000, Offered Price: 5000
Expected: Accept (or show warning)
Result: PASS/FAIL
```

---

## 4. RATING/REVIEW TESTING

### Test Case: Review Rating

**Field:** Star Rating (1-5)

| Partition | Range | Expected | Test ID |
|-----------|-------|----------|---------|
| **Valid Rating** | 1 star | Accept | EP-REVIEW-R-001 |
| | 2 stars | Accept | EP-REVIEW-R-002 |
| | 3 stars | Accept | EP-REVIEW-R-003 |
| | 4 stars | Accept | EP-REVIEW-R-004 |
| | 5 stars | Accept | EP-REVIEW-R-005 |
| **Below Range** | 0 stars | Reject - Minimum 1 star | EP-REVIEW-R-006 |
| | -1 star | Reject - Invalid | EP-REVIEW-R-007 |
| **Above Range** | 6 stars | Reject - Maximum 5 stars | EP-REVIEW-R-008 |
| | 10 stars | Reject - Invalid | EP-REVIEW-R-009 |
| **Non-Numeric** | "Good" | Reject - Numeric only | EP-REVIEW-R-010 |
| **Empty** | (no selection) | Reject - Required | EP-REVIEW-R-011 |

**Test Case:**
```
TC-EP-REVIEW-R-005: Valid 5-Star Rating
Input: 5
Expected: Accept, display filled 5 stars
Result: PASS/FAIL

TC-EP-REVIEW-R-006: Zero Rating
Input: 0
Expected: Show error "Minimal 1 bintang"
Result: PASS/FAIL

TC-EP-REVIEW-R-008: 6-Star Rating
Input: 6
Expected: Show error "Maksimal 5 bintang"
Result: PASS/FAIL
```

---

### Test Case: Review Comment

**Field:** Review Comment (Komentar)

| Partition | Range | Expected | Test ID |
|-----------|-------|----------|---------|
| **Valid Comment** | 10-500 chars | Accept | EP-REVIEW-C-001 |
| | "Barang bagus, cepat sampai" | Accept | EP-REVIEW-C-002 |
| **Too Short** | < 10 chars (e.g., "Bagus!") | Reject - Min 10 chars | EP-REVIEW-C-003 |
| **Too Long** | > 500 chars | Reject - Max 500 chars | EP-REVIEW-C-004 |
| **Empty** | (optional field) | Accept | EP-REVIEW-C-005 |
| **Special Characters** | "Great! @#$%" | Accept | EP-REVIEW-C-006 |
| **Numbers Only** | "1234567890" | Accept | EP-REVIEW-C-007 |

**Test Case:**
```
TC-EP-REVIEW-C-002: Valid Comment
Input: Barang bagus sekali, seller responsif, dan pengiriman cepat
Expected: Accept
Result: PASS/FAIL

TC-EP-REVIEW-C-003: Comment Too Short
Input: Bagus!
Expected: Show error "Minimal 10 karakter"
Result: PASS/FAIL

TC-EP-REVIEW-C-004: Comment Too Long
Input: (501+ characters)
Expected: Show error "Maksimal 500 karakter"
Result: PASS/FAIL
```

---

## 5. LOGIN TESTING

### Test Case: Email (Login)

**Field:** Email (Login)

| Partition | Contoh | Expected | Test ID |
|-----------|---------|----------|---------|
| **Valid Email Format** | registered@campus.ac.id | Try to authenticate | EP-LOGIN-E-001 |
| **Valid Format, Not Registered** | notregistered@campus.ac.id | Reject - Email not found | EP-LOGIN-E-002 |
| **Empty Email** | (empty) | Reject - Required | EP-LOGIN-E-003 |
| **Invalid Format** | user@.com | Reject - Invalid format | EP-LOGIN-E-004 |
| **Case Variation** | USER@CAMPUS.AC.ID | Accept (case-insensitive) | EP-LOGIN-E-005 |

**Test Case:**
```
TC-EP-LOGIN-E-001: Valid Email Registered
Input: user@campus.ac.id (with correct password)
Expected: Login success
Result: PASS/FAIL

TC-EP-LOGIN-E-002: Valid Format But Not Registered
Input: notregistered@campus.ac.id
Expected: Show error "Email tidak ditemukan"
Result: PASS/FAIL

TC-EP-LOGIN-E-003: Empty Email
Input: (empty)
Expected: Show error "Email is required"
Result: PASS/FAIL
```

---

### Test Case: Password (Login)

**Field:** Password (Login)

| Partition | Contoh | Expected | Test ID |
|-----------|---------|----------|---------|
| **Correct Password** | (matching email password) | Accept | EP-LOGIN-P-001 |
| **Wrong Password** | (not matching) | Reject - Invalid credentials | EP-LOGIN-P-002 |
| **Empty Password** | (empty) | Reject - Required | EP-LOGIN-P-003 |
| **Too Short** | Pass1 | Reject or Accept based on validation | EP-LOGIN-P-004 |
| **Case Sensitive** | CORRECTPASS (if correct is lowercase) | Reject - Password incorrect | EP-LOGIN-P-005 |

**Test Case:**
```
TC-EP-LOGIN-P-001: Correct Password
Input: (correct password for registered email)
Expected: Login success
Result: PASS/FAIL

TC-EP-LOGIN-P-002: Wrong Password
Input: wrongpassword123
Expected: Show error "Email atau password salah"
Result: PASS/FAIL

TC-EP-LOGIN-P-003: Empty Password
Input: (empty)
Expected: Show error "Password is required"
Result: PASS/FAIL
```

---

## Summary Tabel EP Test Cases

| Module | Partitions | Total Test Cases | Coverage |
|--------|-----------|-----------------|----------|
| Registration | Email: 9 | 27 | Comprehensive |
| | Password: 8 | | |
| | Student ID: 7 | | |
| Product Listing | Price: 10 | 19 | Comprehensive |
| | Product Name: 8 | | |
| Offer | Offered Price: 8 | 8 | Good |
| Review | Rating: 11 | 19 | Comprehensive |
| | Comment: 7 | | |
| Login | Email: 5 | 10 | Good |
| | Password: 5 | | |
| **TOTAL** | | **83** | **Good Coverage** |

---

## Best Practices untuk EP Testing

1. **Identifikasi Partition dengan Clear Boundaries**
   - Pisahkan input valid dan invalid dengan jelas

2. **Test Representative dari Setiap Partition**
   - Ambil 1 nilai per partition (tidak perlu semua)

3. **Include Boundary Values**
   - Minimum, maximum, one below, one above

4. **Dokumentasi yang Jelas**
   - Catat partition definitions dan test cases

5. **Expected vs Actual**
   - Bandingkan hasil actual dengan expected result

---

**Last Updated:** April 24, 2026  
**File:** EQUIVALENCE_PARTITIONING.md
