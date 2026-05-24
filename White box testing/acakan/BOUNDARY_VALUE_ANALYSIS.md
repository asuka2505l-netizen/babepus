# Boundary Value Analysis (BVA) Testing - BabePus

Boundary Value Analysis fokus pada testing nilai-nilai di perbatasan (boundary) antara partisi. Biasanya bug terjadi pada edge cases dan boundary values.

---

## 1. REGISTRATION TESTING

### Test Case: Student ID Field

**Requirements:** 8-10 digit numerik

| Test Case | Input | Type | Expected | Test ID |
|-----------|-------|------|----------|---------|
| **Below Lower Boundary** | 2022001 (7 digits) | Off-point | Reject - Too short | BVA-REG-S-001 |
| **At Lower Boundary** | 20220001 (8 digits) | On-point | Accept | BVA-REG-S-002 |
| **Just Above Lower** | 202200001 (9 digits) | In-point | Accept | BVA-REG-S-003 |
| **Just Below Upper** | 202200001 (9 digits) | In-point | Accept | BVA-REG-S-004 |
| **At Upper Boundary** | 2022000001 (10 digits) | On-point | Accept | BVA-REG-S-005 |
| **Above Upper Boundary** | 20220000001 (11 digits) | Off-point | Reject - Too long | BVA-REG-S-006 |

**Test Cases Detail:**
```
BVA-REG-S-001: Student ID - Below Boundary (7 digits)
Input: 2022001
Expected: Show error "Minimal 8 digit"
Actual: [Test Result]
Status: PASS/FAIL

BVA-REG-S-002: Student ID - At Lower Boundary (8 digits)
Input: 20220001
Expected: Accept
Actual: [Test Result]
Status: PASS/FAIL

BVA-REG-S-005: Student ID - At Upper Boundary (10 digits)
Input: 2022000001
Expected: Accept
Actual: [Test Result]
Status: PASS/FAIL

BVA-REG-S-006: Student ID - Above Boundary (11 digits)
Input: 20220000001
Expected: Show error "Maksimal 10 digit"
Actual: [Test Result]
Status: PASS/FAIL
```

---

### Test Case: Phone Number Field

**Requirements:** 10-15 digit numerik

| Test Case | Input | Type | Expected | Test ID |
|-----------|-------|------|----------|---------|
| **Below Lower Boundary** | 081234567 (9 digits) | Off-point | Reject - Too short | BVA-REG-P-001 |
| **At Lower Boundary** | 0812345678 (10 digits) | On-point | Accept | BVA-REG-P-002 |
| **Just Above Lower** | 08123456789 (11 digits) | In-point | Accept | BVA-REG-P-003 |
| **Just Below Upper** | 081234567890123 (15 digits) | In-point | Accept | BVA-REG-P-004 |
| **At Upper Boundary** | 0812345678901234 (16 digits) | On-point | Reject - Too long | BVA-REG-P-005 |
| **Above Upper Boundary** | 08123456789012345 (17 digits) | Off-point | Reject - Too long | BVA-REG-P-006 |

---

## 2. PRODUCT LISTING TESTING

### Test Case: Price Field

**Requirements:** Rp 10,000 - Rp 999,999,999

| Test Case | Input | Type | Expected | Test ID |
|-----------|-------|------|----------|---------|
| **Below Lower Boundary** | 9,999 | Off-point | Reject - Below min | BVA-PROD-P-001 |
| **At Lower Boundary** | 10,000 | On-point | Accept | BVA-PROD-P-002 |
| **Just Above Lower** | 10,001 | In-point | Accept | BVA-PROD-P-003 |
| **Just Below Upper** | 999,999,998 | In-point | Accept | BVA-PROD-P-004 |
| **At Upper Boundary** | 999,999,999 | On-point | Accept | BVA-PROD-P-005 |
| **Above Upper Boundary** | 1,000,000,000 | Off-point | Reject - Above max | BVA-PROD-P-006 |

**Test Cases Detail:**
```
BVA-PROD-P-001: Price - Below Lower Boundary (9999)
Input: 9999
Expected: Show error "Harga minimum Rp 10.000"
Actual: [Test Result]
Status: PASS/FAIL

BVA-PROD-P-002: Price - At Lower Boundary (10000)
Input: 10000
Expected: Accept
Actual: [Test Result]
Status: PASS/FAIL

BVA-PROD-P-005: Price - At Upper Boundary (999999999)
Input: 999999999
Expected: Accept
Actual: [Test Result]
Status: PASS/FAIL

BVA-PROD-P-006: Price - Above Upper Boundary (1000000000)
Input: 1000000000
Expected: Show error "Harga maksimal Rp 999.999.999"
Actual: [Test Result]
Status: PASS/FAIL
```

---

### Test Case: Product Name Field

**Requirements:** 3-100 characters

| Test Case | Input | Type | Expected | Test ID |
|-----------|-------|------|----------|---------|
| **Below Lower Boundary** | AB (2 chars) | Off-point | Reject - Too short | BVA-PROD-N-001 |
| **At Lower Boundary** | ABC (3 chars) | On-point | Accept | BVA-PROD-N-002 |
| **Just Above Lower** | ABCD (4 chars) | In-point | Accept | BVA-PROD-N-003 |
| **Mid Range** | "Laptop ASUS Gaming" (18 chars) | In-point | Accept | BVA-PROD-N-004 |
| **Just Below Upper** | "L..."(99 chars) | In-point | Accept | BVA-PROD-N-005 |
| **At Upper Boundary** | "L..."(100 chars) | On-point | Accept | BVA-PROD-N-006 |
| **Above Upper Boundary** | "L..."(101 chars) | Off-point | Reject - Too long | BVA-PROD-N-007 |

---

## 3. OFFER/NEGOTIATION TESTING

### Test Case: Offered Price vs Original Price

**Requirements:** Offered Price harus < Original Price (minimal 10% discount)

| Test Case | Original | Offered | Type | Expected | Test ID |
|-----------|----------|---------|------|----------|---------|
| **Equal to Original** | 100,000 | 100,000 | Boundary | Accept (no discount) | BVA-OFFER-P-001 |
| **Just Below Original** | 100,000 | 99,999 | On-point | Accept | BVA-OFFER-P-002 |
| **At 10% Below** | 100,000 | 90,000 | Boundary | Accept | BVA-OFFER-P-003 |
| **Just Below 10%** | 100,000 | 89,999 | Off-point | Accept (very aggressive) | BVA-OFFER-P-004 |
| **50% of Original** | 100,000 | 50,000 | In-point | Accept | BVA-OFFER-P-005 |
| **Very Low (5%)** | 100,000 | 5,000 | Off-point | Accept (but warning?) | BVA-OFFER-P-006 |
| **Above Original** | 100,000 | 100,001 | Off-point | Reject - Cannot exceed | BVA-OFFER-P-007 |

**Test Cases Detail:**
```
BVA-OFFER-P-002: Offered Price - Just Below Original
Original: 100000, Offered: 99999
Expected: Accept
Actual: [Test Result]
Status: PASS/FAIL

BVA-OFFER-P-003: Offered Price - At 10% Discount
Original: 100000, Offered: 90000
Expected: Accept
Actual: [Test Result]
Status: PASS/FAIL

BVA-OFFER-P-006: Offered Price - Very Aggressive (5%)
Original: 100000, Offered: 5000
Expected: Accept (or Warning)
Actual: [Test Result]
Status: PASS/FAIL

BVA-OFFER-P-007: Offered Price - Above Original
Original: 100000, Offered: 100001
Expected: Show error "Harga tidak boleh melebihi ask price"
Actual: [Test Result]
Status: PASS/FAIL
```

---

## 4. REVIEW/RATING TESTING

### Test Case: Star Rating Field

**Requirements:** 1-5 stars

| Test Case | Input | Type | Expected | Test ID |
|-----------|-------|------|----------|---------|
| **Below Lower Boundary** | 0 stars | Off-point | Reject - Minimum 1 | BVA-REVIEW-R-001 |
| **At Lower Boundary** | 1 star | On-point | Accept | BVA-REVIEW-R-002 |
| **Just Above Lower** | 2 stars | In-point | Accept | BVA-REVIEW-R-003 |
| **Mid Range** | 3 stars | In-point | Accept | BVA-REVIEW-R-004 |
| **Just Below Upper** | 4 stars | In-point | Accept | BVA-REVIEW-R-005 |
| **At Upper Boundary** | 5 stars | On-point | Accept | BVA-REVIEW-R-006 |
| **Above Upper Boundary** | 6 stars | Off-point | Reject - Maximum 5 | BVA-REVIEW-R-007 |

---

### Test Case: Comment Length

**Requirements:** 10-500 characters (if comment provided)

| Test Case | Input | Type | Expected | Test ID |
|-----------|-------|------|----------|---------|
| **Below Lower Boundary** | "Nice!" (5 chars) | Off-point | Reject - Min 10 | BVA-REVIEW-C-001 |
| **At Lower Boundary** | "Nice prod!" (10 chars) | On-point | Accept | BVA-REVIEW-C-002 |
| **Just Above Lower** | "Nice prod!!" (11 chars) | In-point | Accept | BVA-REVIEW-C-003 |
| **Just Below Upper** | 499 characters | In-point | Accept | BVA-REVIEW-C-004 |
| **At Upper Boundary** | 500 characters | On-point | Accept | BVA-REVIEW-C-005 |
| **Above Upper Boundary** | 501 characters | Off-point | Reject - Max 500 | BVA-REVIEW-C-006 |

---

## 5. LOGIN TESTING

### Test Case: Failed Login Attempts

**Requirements:** Max 5 failed attempts before account locked

| Test Case | Attempt # | Password | Type | Expected | Test ID |
|-----------|-----------|----------|------|----------|---------|
| **First Failure** | 1 | wrong1 | In-point | Error, try again | BVA-LOGIN-F-001 |
| **Multiple Failures** | 2-4 | wrong2-4 | In-point | Error each time | BVA-LOGIN-F-002 |
| **At Boundary (5th)** | 5 | wrong5 | On-point | Account locked | BVA-LOGIN-F-003 |
| **Over Boundary (6th)** | 6 | correct | Off-point | Account locked (cannot login) | BVA-LOGIN-F-004 |

**Test Cases Detail:**
```
BVA-LOGIN-F-001: First Failed Attempt
Input: correct_email, wrong_password
Expected: Show error "Email atau password salah", show "Attempt 1 of 5"
Actual: [Test Result]
Status: PASS/FAIL

BVA-LOGIN-F-003: Fifth Failed Attempt (At Boundary)
Input: correct_email, wrong_password (5th time)
Expected: Show error "Akun terkunci. Hubungi admin"
Actual: [Test Result]
Status: PASS/FAIL

BVA-LOGIN-F-004: Sixth Attempt After Locked
Input: correct_email, correct_password
Expected: Show error "Akun terkunci"
Actual: [Test Result]
Status: PASS/FAIL
```

---

## 6. TRANSACTION QUANTITY TESTING

### Test Case: Quantity Field (if applicable)

**Requirements:** 1-100 items per transaction

| Test Case | Input | Type | Expected | Test ID |
|-----------|-------|------|----------|---------|
| **Below Lower Boundary** | 0 | Off-point | Reject - Minimum 1 | BVA-TRANS-Q-001 |
| **At Lower Boundary** | 1 | On-point | Accept | BVA-TRANS-Q-002 |
| **Just Above Lower** | 2 | In-point | Accept | BVA-TRANS-Q-003 |
| **Just Below Upper** | 99 | In-point | Accept | BVA-TRANS-Q-004 |
| **At Upper Boundary** | 100 | On-point | Accept | BVA-TRANS-Q-005 |
| **Above Upper Boundary** | 101 | Off-point | Reject - Maximum 100 | BVA-TRANS-Q-006 |

---

## 7. PASSWORD RESET TESTING

### Test Case: Reset Token Expiration

**Requirements:** Token valid untuk 24 jam (1440 menit)

| Test Case | Time Since Generated | Type | Expected | Test ID |
|-----------|----------------------|------|----------|---------|
| **Just Created** | 0 minutes | On-point | Valid | BVA-PWD-T-001 |
| **Near Expiration** | 1439 minutes (23h 59m) | In-point | Valid | BVA-PWD-T-002 |
| **At Expiration (24h)** | 1440 minutes | Boundary | Expired/Invalid | BVA-PWD-T-003 |
| **After Expiration** | 1441 minutes | Off-point | Expired/Invalid | BVA-PWD-T-004 |

---

## 8. RATING AVERAGE CALCULATION

### Test Case: Average Rating Update

**Requirements:** Average rating = SUM(all_ratings) / COUNT(reviews)

| Test Case | Reviews | Ratings | Expected Avg | Test ID |
|-----------|---------|---------|--------------|---------|
| **First Review** | 1 | [5] | 5.0 | BVA-RATING-A-001 |
| **Second Review** | 2 | [5, 4] | 4.5 | BVA-RATING-A-002 |
| **Multiple Reviews (Avg=3)** | 5 | [1,2,3,4,5] | 3.0 | BVA-RATING-A-003 |
| **All Perfect** | 3 | [5,5,5] | 5.0 | BVA-RATING-A-004 |
| **All Poor** | 3 | [1,1,1] | 1.0 | BVA-RATING-A-005 |

**Test Cases Detail:**
```
BVA-RATING-A-002: Average with 2 Reviews
Reviews: [5 stars, 4 stars]
Expected Average: 4.5
Calculation: (5 + 4) / 2 = 4.5
Actual: [Test Result]
Status: PASS/FAIL
```

---

## BVA Test Summary

| Feature | Boundaries | Total BVA Cases | Priority |
|---------|-----------|-----------------|----------|
| Student ID | 8-10 digits | 6 | High |
| Phone Number | 10-15 digits | 6 | High |
| Product Price | 10K-999.9M | 6 | Critical |
| Product Name | 3-100 chars | 7 | Medium |
| Offer Price | < Original | 7 | Critical |
| Star Rating | 1-5 | 7 | High |
| Comment Length | 10-500 chars | 6 | Medium |
| Failed Login | 0-5 attempts | 4 | Critical |
| Quantity | 1-100 | 6 | Medium |
| Token Expiry | 0-1440 min | 4 | High |
| **TOTAL** | | **59** | **Critical Testing** |

---

## Checklist untuk BVA Testing

- [ ] Identifikasi semua boundaries untuk setiap field
- [ ] Test nilai: below, at, above, just inside/outside boundary
- [ ] Catat expected hasil untuk setiap test case
- [ ] Dokumentasi akurat tentang boundary values
- [ ] Prioritas testing berdasarkan criticality
- [ ] Test kombinasi multiple boundaries
- [ ] Verifikasi error messages yang ditampilkan
- [ ] Repeat testing setelah bug fixes

---

**Last Updated:** April 24, 2026  
**File:** BOUNDARY_VALUE_ANALYSIS.md
