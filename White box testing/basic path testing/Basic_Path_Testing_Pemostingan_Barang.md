~~~ mermaid
graph TD
  0((Start)) --> 1[1. User login/auth]
  1 --> 2[2. POST /products]
  2 --> 3[3. authMiddleware]
  3 --> 4[4. productImageUpload]
  4 --> 5{5. Apakah gambar ada?}

  5 -->|Ya| 6[6. productPayloadValidator]
  5 -->|Tidak| 7[7. Error: gambar wajib diunggah]

  6 --> 8[8. validateRequest]
  8 --> 9[9. productController.createProduct]
  9 --> 10[10. productService.createProduct]
  10 --> 11[11. ensureCategoryExists]
  11 --> 12[12. generateUniqueSlug]
  12 --> 13[13. Insert produk ke database]
  13 --> 14[14. Respon success]
  14 --> 15((End))

  0 --> 16[16. Update Product]
  16 --> 17[17. PUT /products/:id]
  17 --> 18[18. authMiddleware]
  18 --> 19[19. productImageUpload]
  19 --> 20[20. productUpdateValidator]
  20 --> 21[21. productController.updateProduct]
  21 --> 22((End))

  0 --> 23[23. Mark Product Sold]
  23 --> 24[24. PATCH /products/:id/sold]
  24 --> 25[25. authMiddleware]
  25 --> 26[26. productController.markProductSold]
  26 --> 27((End))

  0 --> 28[28. Delete Product]
  28 --> 29[29. DELETE /products/:id]
  29 --> 30[30. authMiddleware]
  30 --> 31[31. productController.deleteProduct]
  31 --> 32((End))
~~~
![REGION](12.png)

# Basic Path Testing – Flow Posting Produk

## A. Create Product

| No | Process |
|----|----------|
| 1 | User login/auth |
| 2 | POST /products |
| 3 | authMiddleware |
| 4 | productImageUpload |
| 5 | Cek gambar ada |
| 6 | productPayloadValidator |
| 7 | validateRequest |
| 8 | productController.createProduct |
| 9 | productService.createProduct |
| 10 | ensureCategoryExists |
| 11 | generateUniqueSlug |
| 12 | Insert produk ke database |
| 13 | Response success |
| 14 | End |

### Basic Path
```text
1 → 2 → 3 → 4 → 5(Ya) → 6 → 7 → 8 → 9 → 10 → 11 → 12 → 13 → 14
```

---

## Alternate/Error Path – Create Product

| No | Process |
|----|----------|
| 1 | User login/auth |
| 2 | POST /products |
| 3 | authMiddleware |
| 4 | productImageUpload |
| 5 | Cek gambar ada |
| 6 | Error: gambar wajib diunggah |
| 7 | End |

### Alternate Path
```text
1 → 2 → 3 → 4 → 5(Tidak) → 6 → 7
```

---

# B. Update Product

| No | Process |
|----|----------|
| 16 | Update Product |
| 17 | PUT /products/:id |
| 18 | authMiddleware |
| 19 | productImageUpload |
| 20 | productUpdateValidator |
| 21 | productController.updateProduct |
| 22 | End |

### Basic Path
```text
16 → 17 → 18 → 19 → 20 → 21 → 22
```

---

# C. Mark Product Sold

| No | Process |
|----|----------|
| 23 | Mark Product Sold |
| 24 | PATCH /products/:id/sold |
| 25 | authMiddleware |
| 26 | productController.markProductSold |
| 27 | End |

### Basic Path
```text
23 → 24 → 25 → 26 → 27
```

---

# D. Delete Product

| No | Process |
|----|----------|
| 28 | Delete Product |
| 29 | DELETE /products/:id |
| 30 | authMiddleware |
| 31 | productController.deleteProduct |
| 32 | End |

### Basic Path
```text
28 → 29 → 30 → 31 → 32
```

# Graph Matrix – Flow Produk

## A. Create Product

### Node
| Node | Keterangan |
|------|-------------|
| 1 | User login/auth |
| 2 | POST /products |
| 3 | authMiddleware |
| 4 | productImageUpload |
| 5 | Decision: gambar ada? |
| 6 | productPayloadValidator |
| 7 | Error gambar wajib diunggah |
| 8 | validateRequest |
| 9 | productController.createProduct |
| 10 | productService.createProduct |
| 11 | ensureCategoryExists |
| 12 | generateUniqueSlug |
| 13 | Insert produk |
| 14 | Response success |
| 15 | End |

---

## Edge / Graph Matrix

| Edge | Path |
|------|------|
| E1 | 1 → 2 |
| E2 | 2 → 3 |
| E3 | 3 → 4 |
| E4 | 4 → 5 |
| E5 | 5 → 6 |
| E6 | 5 → 7 |
| E7 | 6 → 8 |
| E8 | 8 → 9 |
| E9 | 9 → 10 |
| E10 | 10 → 11 |
| E11 | 11 → 12 |
| E12 | 12 → 13 |
| E13 | 13 → 14 |
| E14 | 14 → 15 |
| E15 | 7 → 15 |

---

## Adjacency Matrix

| Node | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 |
|------|---|---|---|---|---|---|---|---|---|----|----|----|----|----|----|
| 1 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 2 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 3 | 0 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 4 | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 5 | 0 | 0 | 0 | 0 | 0 | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 6 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 7 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| 8 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 |
| 9 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 |
| 10 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 0 | 0 |
| 11 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 0 |
| 12 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 0 |
| 13 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 |
| 14 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| 15 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

---

# Cyclomatic Complexity

## Rumus
```text
V(G) = E - N + 2
```

Keterangan:
- E = Jumlah edge
- N = Jumlah node

## Perhitungan
```text
E = 15
N = 15

V(G) = 15 - 15 + 2
V(G) = 2
```

## Hasil
```text
Cyclomatic Complexity = 2
```

Artinya terdapat:
- 2 jalur independen
- 2 test case minimum untuk pengujian basis path
