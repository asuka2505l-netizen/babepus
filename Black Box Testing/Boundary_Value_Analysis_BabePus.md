# Black Box Testing - Boundary Value Analysis (BVA) BabePus

Boundary Value Analysis digunakan untuk memvalidasi semua input utama aplikasi Babepus berdasarkan validator dan aturan bisnis yang terdapat di kode.

Dokumen ini mencakup:
- Equivalence Class untuk semua field input utama
- Batasan Equivalence Class / nilai batas
- Table Case untuk setiap domain fitur utama

## 1. Equivalence Class

| No | Domain | Field | Tipe | Batasan Validasi |
|----|--------|-------|------|------------------|
| 1 | Auth/Register | fullName | String | 3 ≤ length ≤ 100 |
| 2 | Auth/Register | email | String | valid email |
| 3 | Auth/Register | password | String | length ≥ 8 |
| 4 | Auth/Register | phone | String | optional, 8 ≤ length ≤ 20 |
| 5 | Auth/Register | campus | String | 2 ≤ length ≤ 120 |
| 6 | Auth/Register | faculty | String | optional, length ≤ 120 |
| 7 | Auth/Register | studyProgram | String | optional, length ≤ 120 |
| 8 | Auth/Register | studentId | String | optional, length ≤ 40 |
| 9 | Auth/Register | campusEmail | String | optional, valid email |
| 10 | Auth/Login | email | String | valid email |
| 11 | Auth/Login | password | String | not empty |
| 12 | Auth/Verify | token | String | 20 ≤ length ≤ 120 |
| 13 | Product | title | String | 5 ≤ length ≤ 140 |
| 14 | Product | description | String | 20 ≤ length ≤ 3000 |
| 15 | Product | categoryId | Integer | ≥ 1 |
| 16 | Product | price | Float | ≥ 1000 |
| 17 | Product | conditionLabel | String | one of `like_new`, `good`, `fair`, `needs_repair` |
| 18 | Product | campusLocation | String | 2 ≤ length ≤ 160 |
| 19 | Product | faculty | String | optional, length ≤ 120 |
| 20 | Product List | search | String | optional, length ≤ 120 |
| 21 | Product List | categoryId | Integer | optional, ≥ 1 |
| 22 | Product List | minPrice | Float | optional, ≥ 0 |
| 23 | Product List | maxPrice | Float | optional, ≥ 0 |
| 24 | Product List | faculty | String | optional, length ≤ 120 |
| 25 | Product List | sort | String | optional, one of `latest`, `oldest`, `price_asc`, `price_desc` |
| 26 | Offer | productId | Integer | ≥ 1 |
| 27 | Offer | offerPrice | Float | ≥ 1000 (plus business rule < product.price and ≥ 10000) |
| 28 | Offer | note | String | optional, length ≤ 500 |
| 29 | Review | transactionId | Integer | ≥ 1 |
| 30 | Review | rating | Integer | 1 ≤ value ≤ 5 |
| 31 | Review | communicationRating | Integer | optional, 1 ≤ value ≤ 5 |
| 32 | Review | itemAccuracyRating | Integer | optional, 1 ≤ value ≤ 5 |
| 33 | Review | meetupRating | Integer | optional, 1 ≤ value ≤ 5 |
| 34 | Review | tags | Array | optional, max 8 items |
| 35 | Review | tags.* | String | optional, 2 ≤ length ≤ 40 |
| 36 | Review | isAnonymous | Boolean | optional |
| 37 | Review | comment | String | optional, length ≤ 1000 |
| 38 | Pricing Estimate | categoryId | Integer | ≥ 1 |
| 39 | Pricing Estimate | originalPrice | Float | ≥ 1000 |
| 40 | Pricing Estimate | conditionLabel | String | one of `like_new`, `good`, `fair`, `needs_repair` |
| 41 | Pricing Estimate | ageMonths | Integer | optional, 0 ≤ value ≤ 240 |
| 42 | Pricing Estimate | includesBox | Boolean | optional |
| 43 | Pricing Estimate | urgency | String | optional, one of `low`, `normal`, `high` |
| 44 | Report | targetType | String | one of `product`, `user` |
| 45 | Report | targetProductId | Integer | required if targetType = product, ≥ 1 |
| 46 | Report | targetUserId | Integer | required if targetType = user, ≥ 1 |
| 47 | Report | reason | String | 5 ≤ length ≤ 160 |
| 48 | Report | details | String | optional, length ≤ 1000 |
| 49 | Chat | productId | Integer | ≥ 1 |
| 50 | Chat | message | String | 1 ≤ length ≤ 2000 |
| 51 | Admin | isSuspended | Boolean | required |
| 52 | Admin | status | String | one of `reviewed`, `resolved`, `rejected` |
| 53 | Admin | adminNote | String | optional, length ≤ 500 |
| 54 | Shared | id param | Integer | ≥ 1 |
| 55 | Shared | page | Integer | optional, ≥ 1 |
| 56 | Shared | limit | Integer | optional, 1 ≤ value ≤ 50 |

## 2. Batasan Equivalence Class (Boundary Values)

### 2.1 Auth / Register

| Field | Boundary | Nilai | Input | Expected |
|-------|----------|-------|-------|----------|
| fullName | below lower | 2 | "Ab" | error |
| fullName | lower | 3 | "Aga" | valid |
| fullName | upper | 100 | 100 chars | valid |
| fullName | above upper | 101 | 101 chars | error |
| email | invalid | "user@" | invalid email |
| email | valid | "user@campus.ac.id" | valid |
| password | below lower | 7 | "Abc123!" | error |
| password | lower | 8 | "Abc123!@" | valid |
| password | long | 50 | 50 chars | valid |
| phone | below lower | 7 | "0812345" | error |
| phone | lower | 8 | "08123456" | valid |
| phone | upper | 20 | 20 digits | valid |
| phone | above upper | 21 | 21 digits | error |
| campus | below lower | 1 | "A" | error |
| campus | lower | 2 | "UI" | valid |
| campus | upper | 120 | 120 chars | valid |
| faculty | upper | 120 | 120 chars | valid |
| faculty | above upper | 121 | 121 chars | error |
| studentId | upper | 40 | 40 chars | valid |
| studentId | above upper | 41 | 41 chars | error |
| campusEmail | invalid | "campus@" | error |
| campusEmail | valid | "user@campus.ac.id" | valid |

### 2.2 Auth / Login & Verify

| Field | Boundary | Nilai | Expected |
|-------|----------|-------|----------|
| email | invalid | "user@" | error |
| email | valid | "user@campus.ac.id" | valid |
| password | empty | "" | error |
| token | below lower | 19 | 19 chars | error |
| token | lower | 20 | 20 chars | valid |
| token | upper | 120 | 120 chars | valid |
| token | above upper | 121 | 121 chars | error |

### 2.3 Product

| Field | Boundary | Nilai | Expected |
|-------|----------|-------|----------|
| title | below lower | 4 | "Prod" | error |
| title | lower | 5 | "Phone" | valid |
| title | upper | 140 | 140 chars | valid |
| title | above upper | 141 | 141 chars | error |
| description | below lower | 19 | 19 chars | error |
| description | lower | 20 | 20 chars | valid |
| description | upper | 3000 | 3000 chars | valid |
| description | above upper | 3001 | 3001 chars | error |
| categoryId | below lower | 0 | 0 | error |
| categoryId | lower | 1 | 1 | valid |
| price | below lower | 999 | 999 | error |
| price | lower | 1000 | 1000 | valid |
| conditionLabel | invalid | "bad" | error |
| conditionLabel | valid | "good" | valid |
| campusLocation | below lower | 1 | "A" | error |
| campusLocation | lower | 2 | "UI" | valid |
| campusLocation | upper | 160 | 160 chars | valid |
| campusLocation | above upper | 161 | 161 chars | error |

### 2.4 Product List Query

| Field | Boundary | Nilai | Expected |
|-------|----------|-------|----------|
| search | above upper | 121 | 121 chars | error |
| categoryId | below lower | 0 | 0 | error |
| minPrice | below lower | -1 | -1 | error |
| maxPrice | below lower | -1 | -1 | error |
| sort | invalid | "asc" | error |
| sort | valid | "price_desc" | valid |

### 2.5 Offer

| Field | Boundary | Nilai | Expected |
|-------|----------|-------|----------|
| productId | below lower | 0 | 0 | error |
| productId | lower | 1 | 1 | valid |
| offerPrice | below validator min | 999 | 999 | error |
| offerPrice | validator lower | 1000 | 1000 | valid (API-level) |
| offerPrice | business min | 9999 | 9999 | error (service rejects <10000) |
| offerPrice | business lower | 10000 | 10000 | valid if < product.price |
| offerPrice | equal product price | 100000 | error |
| offerPrice | above product price | 100001 | error |
| note | upper | 500 | 500 chars | valid |
| note | above upper | 501 | 501 chars | error |

### 2.6 Review

| Field | Boundary | Nilai | Expected |
|-------|----------|-------|----------|
| transactionId | below lower | 0 | 0 | error |
| transactionId | lower | 1 | 1 | valid |
| rating | below lower | 0 | 0 | error |
| rating | lower | 1 | 1 | valid |
| rating | upper | 5 | 5 | valid |
| rating | above upper | 6 | 6 | error |
| tags | upper | 8 item | 8 tags | valid |
| tags | above upper | 9 item | 9 tags | error |
| tags.* | below lower | 1 | "A" | error |
| tags.* | lower | 2 | "OK" | valid |
| tags.* | upper | 40 | 40 chars | valid |
| comment | upper | 1000 | 1000 chars | valid |
| comment | above upper | 1001 | 1001 chars | error |
| isAnonymous | invalid | "yes" | error |
| isAnonymous | valid | true | valid |

### 2.7 Pricing Estimate

| Field | Boundary | Nilai | Expected |
|-------|----------|-------|----------|
| categoryId | below lower | 0 | 0 | error |
| originalPrice | below lower | 999 | 999 | error |
| originalPrice | lower | 1000 | 1000 | valid |
| conditionLabel | invalid | "bad" | error |
| ageMonths | below lower | -1 | -1 | error |
| ageMonths | lower | 0 | 0 | valid |
| ageMonths | upper | 240 | 240 | valid |
| ageMonths | above upper | 241 | 241 | error |
| includesBox | invalid | "yes" | error |
| urgency | invalid | "urgent" | error |
| urgency | valid | "high" | valid |

### 2.8 Report

| Field | Boundary | Nilai | Expected |
|-------|----------|-------|----------|
| targetType | invalid | "order" | error |
| targetType | valid | "product" | valid |
| targetProductId | below lower | 0 | 0 | error if targetType=product |
| targetUserId | below lower | 0 | 0 | error if targetType=user |
| reason | below lower | 4 | 4 chars | error |
| reason | lower | 5 | valid |
| reason | upper | 160 | valid |
| reason | above upper | 161 | error |
| details | upper | 1000 | valid |
| details | above upper | 1001 | error |

### 2.9 Chat

| Field | Boundary | Nilai | Expected |
|-------|----------|-------|----------|
| productId | below lower | 0 | 0 | error |
| message | below lower | 0 | empty | error |
| message | lower | 1 | valid |
| message | upper | 2000 | 2000 chars | valid |
| message | above upper | 2001 | error |

### 2.10 Admin / Shared

| Field | Boundary | Nilai | Expected |
|-------|----------|-------|----------|
| isSuspended | invalid | "true" | error? (must boolean) |
| isSuspended | valid | true | valid |
| status | invalid | "pending" | error |
| status | valid | "resolved" | valid |
| adminNote | upper | 500 | valid |
| adminNote | above upper | 501 | error |
| id param | below lower | 0 | error |
| page | below lower | 0 | error |
| page | lower | 1 | valid |
| limit | below lower | 0 | error |
| limit | lower | 1 | valid |
| limit | upper | 50 | valid |
| limit | above upper | 51 | error |

## 3. Table Case

### 3.1 Auth/Register

| No | Test Case | Input | Expected |
|----|-----------|-------|----------|
| A1 | fullName below lower | fullName = "Ab", email=
"user@campus.ac.id", password="Abc123!@" | Reject fullName |
| A2 | password below lower | fullName = "Angga S", password="Abc123!" | Reject password |
| A3 | campus boundary | campus="U" | Reject campus |
| A4 | studentId max | studentId = 40 chars | Accept if other field valid |
| A5 | campusEmail invalid | campusEmail="user@campus" | Reject campusEmail |

### 3.2 Auth/Login & Verify

| No | Test Case | Input | Expected |
|----|-----------|-------|----------|
| B1 | login empty password | email="user@campus.ac.id", password="" | Reject password |
| B2 | verify token below lower | token = 19 chars | Reject token |
| B3 | verify token upper | token = 120 chars | Accept |

### 3.3 Product

| No | Test Case | Input | Expected |
|----|-----------|-------|----------|
| C1 | title below lower | title="Prod" | Reject title |
| C2 | price below lower | price=999 | Reject price |
| C3 | condition invalid | conditionLabel="bad" | Reject conditionLabel |
| C4 | campusLocation upper | 160 chars | Accept |
| C5 | faculty above upper | faculty=121 chars | Reject faculty |

### 3.4 Offer

| No | Test Case | Input | Expected |
|----|-----------|-------|----------|
| D1 | offerPrice validator min | offerPrice=999 | Reject offerPrice |
| D2 | offerPrice business min | offerPrice=9999 | Reject with "Harga tawaran minimum Rp 10.000." |
| D3 | offerPrice equals price | offerPrice=product.price | Reject with "Harga tawaran harus lebih rendah dari harga jual." |
| D4 | note above upper | note=501 chars | Reject note |

### 3.5 Review

| No | Test Case | Input | Expected |
|----|-----------|-------|----------|
| E1 | rating above upper | rating=6 | Reject rating |
| E2 | tags above upper | tags=9 items | Reject tags |
| E3 | comment above upper | comment=1001 chars | Reject comment |
| E4 | isAnonymous invalid | isAnonymous="true" | Reject isAnonymous |

### 3.6 Pricing Estimate

| No | Test Case | Input | Expected |
|----|-----------|-------|----------|
| F1 | originalPrice below lower | originalPrice=999 | Reject originalPrice |
| F2 | ageMonths above upper | ageMonths=241 | Reject ageMonths |
| F3 | urgency invalid | urgency="urgent" | Reject urgency |

### 3.7 Report

| No | Test Case | Input | Expected |
|----|-----------|-------|----------|
| G1 | targetType invalid | targetType="order" | Reject targetType |
| G2 | targetProductId invalid | targetType="product", targetProductId=0 | Reject targetProductId |
| G3 | reason below lower | reason=4 chars | Reject reason |
| G4 | details above upper | details=1001 chars | Reject details |

### 3.8 Chat

| No | Test Case | Input | Expected |
|----|-----------|-------|----------|
| H1 | message empty | message="" | Reject message |
| H2 | message above upper | message=2001 chars | Reject message |

### 3.9 Admin / Shared

| No | Test Case | Input | Expected |
|----|-----------|-------|----------|
| I1 | status invalid | status="pending" | Reject status |
| I2 | limit above upper | limit=51 | Reject limit |
| I3 | page below lower | page=0 | Reject page |

---

### Catatan
- Aturan BVA diambil langsung dari validator `src/validators/*.js` dan konstanta di `src/config/constants.js`.
- `offerPrice` memiliki validator umum `≥ 1000`, tetapi bisnis tambahan memaksa `≥ 10000` dan `< product.price` dalam `offerService`.
- Field optional tetap diuji pada batas atas / batas invalid ketika diisi.
- Setiap test case harus dieksekusi menggunakan input boundary dan dievaluasi terhadap pesan validasi yang tepat.
