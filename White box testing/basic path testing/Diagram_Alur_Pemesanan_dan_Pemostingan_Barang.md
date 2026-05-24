# Diagram Alur Pemesanan dan Pemostingan Barang - BabePus

Diagram berikut menggambarkan alur backend untuk:
1. Pemostingan barang baru oleh penjual
2. Proses pemesanan barang oleh pembeli melalui tawaran dan transaksi escrow

## A. Alur Pemostingan Barang

```mermaid
graph TD
  StartA((Start)) --> A[User login/auth]
  A --> B[POST /products]
  B --> C[authMiddleware]
  C --> D[productImageUpload]
  D --> E[productPayloadValidator]
  E --> F[validateRequest]
  F --> G[productController.createProduct]
  G --> H[productService.createProduct]
  H --> I[Insert produk ke database]
  I --> J[Respon success: produk terposting]
  J --> EndA((End))

  StartA --> K[Update Product]
  K --> L[PUT /products/:id]
  L --> M[authMiddleware]
  M --> N[productImageUpload]
  N --> O[productUpdateValidator]
  O --> P[productController.updateProduct]
  P --> EndUpdate((End))

  StartA --> Q[Mark Product Sold]
  Q --> R[PATCH /products/:id/sold]
  R --> S[authMiddleware]
  S --> T[productController.markProductSold]
  T --> EndSold((End))

  StartA --> U[Delete Product]
  U --> V[DELETE /products/:id]
  V --> W[authMiddleware]
  W --> X[productController.deleteProduct]
  X --> EndDelete((End))
```
## easy to read
```mermaid
graph TD
  StartA((Start)) --> A[User Login]
  A --> B[Tambah Produk Baru]
  B --> C[Cek Login User]
  C --> D[Upload Gambar Produk]
  D --> E[Validasi Data Produk]
  E --> F[Periksa Request]
  F --> G[Controller Produk]
  G --> H[Service Produk]
  H --> I[Simpan Produk ke Database]
  I --> J[Produk Berhasil Diposting]
  J --> EndA((End))

  StartA --> K[Edit Produk]
  K --> L[Update Produk]
  L --> M[Cek Login User]
  M --> N[Upload Gambar Baru]
  N --> O[Validasi Update Produk]
  O --> P[Controller Update Produk]
  P --> EndUpdate((End))

  StartA --> Q[Tandai Produk Terjual]
  Q --> R[Ubah Status Produk]
  R --> S[Cek Login User]
  S --> T[Controller Produk Terjual]
  T --> EndSold((End))

  StartA --> U[Hapus Produk]
  U --> V[Delete Produk]
  V --> W[Cek Login User]
  W --> X[Controller Hapus Produk]
  X --> EndDelete((End))
```
## B. Alur Pemesanan Barang

```mermaid
graph TD
  StartB((Start)) --> A[Buyer login/auth]
  A --> B[POST /offers]
  B --> C[authMiddleware]
  C --> D[createOfferValidator]
  D --> E[validateRequest]
  E --> F[offerController.createOffer]
  F --> G[offerService.createOffer]
  G --> H[Validasi, cek produk, buat offer]
  H --> I[Insert offer ke database]
  I --> J[Respon: tawaran berhasil dikirim]
  J --> EndOffer((End))

  StartB --> K[Seller lihat tawaran incoming]
  K --> L[GET /offers/incoming]
  L --> M[offerController.getIncomingOffers]
  M --> N[offerService.getIncomingOffers]
  N --> EndIncoming((End))

  StartB --> O[Seller accept offer]
  O --> P[PATCH /offers/:id/accept]
  P --> Q[idParam + validateRequest]
  Q --> R[offerController.acceptOffer]
  R --> S[offerService.acceptOffer]
  S --> T[Buat transaksi baru dari offer]
  T --> U[Insert transactions & escrow data]
  U --> V[Respon: transaksi dibuat otomatis]
  V --> EndAccept((End))

  StartB --> W[Seller reject offer]
  W --> X[PATCH /offers/:id/reject]
  X --> Y[idParam + validateRequest]
  Y --> Z[offerController.rejectOffer]
  Z --> AA[offerService.rejectOffer]
  AA --> EndReject((End))

  StartB --> AB[Buyer/Seller konfirmasi escrow]
  AB --> AC[PATCH /transactions/:id/escrow/buyer-confirm]
  AB --> AD[PATCH /transactions/:id/escrow/seller-confirm]
  AC --> AE[completeTransactionValidator]
  AD --> AE
  AE --> AF[transactionController.confirmBuyer / confirmSeller]
  AF --> AG[transactionService.confirmEscrow]
  AG --> AH[Update buyer/seller confirm timestamps]
  AH --> AI[Jika kedua pihak confirm -> update status completed, release escrow]
  AI --> EndEscrow((End))

  StartB --> AJ[Buyer selesaikan transaksi manual]
  AJ --> AK[PATCH /transactions/:id/complete]
  AK --> AL[completeTransactionValidator]
  AL --> AM[transactionController.completeTransaction]
  AM --> AN[transactionService.completeTransaction]
  AN --> AO[Update status completed, release escrow]
  AO --> EndManual((End))

  AG --> AP[Create notification ke pihak lain]
  AP --> AQ[User menerima notifikasi status escrow]
  AQ --> EndNotification((End))
```
## easy to Read
```mermaid
graph TD
  StartB((Start)) --> A[Pembeli Login]
  A --> B[Buat Tawaran Harga]
  B --> C[Cek Login User]
  C --> D[Validasi Tawaran]
  D --> E[Periksa Request]
  E --> F[Controller Tawaran]
  F --> G[Service Tawaran]
  G --> H[Cek Produk & Buat Tawaran]
  H --> I[Simpan Tawaran ke Database]
  I --> J[Tawaran Berhasil Dikirim]
  J --> EndOffer((End))

  StartB --> K[Penjual Melihat Tawaran]
  K --> L[Ambil Data Tawaran Masuk]
  L --> M[Controller Tawaran Masuk]
  M --> N[Service Tawaran Masuk]
  N --> EndIncoming((End))

  StartB --> O[Penjual Menerima Tawaran]
  O --> P[Accept Tawaran]
  P --> Q[Validasi ID & Request]
  Q --> R[Controller Accept Tawaran]
  R --> S[Service Accept Tawaran]
  S --> T[Buat Data Transaksi]
  T --> U[Simpan Transaksi & Escrow]
  U --> V[Transaksi Berhasil Dibuat]
  V --> EndAccept((End))

  StartB --> W[Penjual Menolak Tawaran]
  W --> X[Reject Tawaran]
  X --> Y[Validasi ID & Request]
  Y --> Z[Controller Reject Tawaran]
  Z --> AA[Service Reject Tawaran]
  AA --> EndReject((End))

  StartB --> AB[Konfirmasi Escrow]
  AB --> AC[Konfirmasi Pembeli]
  AB --> AD[Konfirmasi Penjual]
  AC --> AE[Validasi Penyelesaian]
  AD --> AE
  AE --> AF[Controller Konfirmasi]
  AF --> AG[Service Escrow]
  AG --> AH[Update Status Konfirmasi]
  AH --> AI[Jika Keduanya Konfirmasi → Transaksi Selesai & Escrow Dicairkan]
  AI --> EndEscrow((End))

  StartB --> AJ[Pembeli Menyelesaikan Transaksi]
  AJ --> AK[Complete Transaksi]
  AK --> AL[Validasi Penyelesaian]
  AL --> AM[Controller Complete Transaksi]
  AM --> AN[Service Complete Transaksi]
  AN --> AO[Update Status Selesai & Cairkan Escrow]
  AO --> EndManual((End))

  AG --> AP[Buat Notifikasi]
  AP --> AQ[User Menerima Notifikasi]
  AQ --> EndNotification((End))
```

## C. Basic Path Testing

Berikut adalah basic path testing yang disusun dari alur pemostingan dan pemesanan barang:

1. Posting Produk Baru
   - Start: User login/auth berhasil
   - Aksi: POST /products
   - Validasi: authMiddleware, productImageUpload, productPayloadValidator, validateRequest
   - Proses: productController.createProduct → productService.createProduct → insert produk ke database
   - Hasil: produk terposting sukses

2. Edit Produk
   - Start: User login/auth berhasil
   - Aksi: PUT /products/:id
   - Validasi: authMiddleware, productImageUpload, productUpdateValidator
   - Proses: productController.updateProduct
   - Hasil: produk terupdate

3. Tandai Produk Terjual
   - Start: User login/auth berhasil
   - Aksi: PATCH /products/:id/sold
   - Validasi: authMiddleware
   - Proses: productController.markProductSold
   - Hasil: produk ditandai terjual

4. Hapus Produk
   - Start: User login/auth berhasil
   - Aksi: DELETE /products/:id
   - Validasi: authMiddleware
   - Proses: productController.deleteProduct
   - Hasil: produk dihapus

5. Buat Tawaran Harga
   - Start: Buyer login/auth berhasil
   - Aksi: POST /offers
   - Validasi: authMiddleware, createOfferValidator, validateRequest
   - Proses: offerController.createOffer → offerService.createOffer → insert offer ke database
   - Hasil: tawaran terkirim

6. Lihat Tawaran Masuk
   - Start: Seller login/auth berhasil
   - Aksi: GET /offers/incoming
   - Proses: offerController.getIncomingOffers → offerService.getIncomingOffers
   - Hasil: daftar tawaran masuk tersedia

7. Terima Tawaran dan Buat Transaksi
   - Start: Seller login/auth berhasil
   - Aksi: PATCH /offers/:id/accept
   - Validasi: idParam + validateRequest
   - Proses: offerController.acceptOffer → offerService.acceptOffer → buat transaksi dan insert escrow
   - Hasil: transaksi dibuat otomatis

8. Tolak Tawaran
   - Start: Seller login/auth berhasil
   - Aksi: PATCH /offers/:id/reject
   - Validasi: idParam + validateRequest
   - Proses: offerController.rejectOffer → offerService.rejectOffer
   - Hasil: tawaran ditolak

9. Konfirmasi Escrow
   - Start: Buyer/Seller login/auth berhasil
   - Aksi: PATCH /transactions/:id/escrow/buyer-confirm atau PATCH /transactions/:id/escrow/seller-confirm
   - Validasi: completeTransactionValidator
   - Proses: transactionController.confirmBuyer / confirmSeller → transactionService.confirmEscrow → update timestamp
   - Hasil: jika kedua pihak konfirmasi, transaksi completed dan escrow dirilis

10. Selesaikan Transaksi Manual
    - Start: Buyer login/auth berhasil
    - Aksi: PATCH /transactions/:id/complete
    - Validasi: completeTransactionValidator
    - Proses: transactionController.completeTransaction → transactionService.completeTransaction → update status completed, release escrow
    - Hasil: transaksi selesai manual

11. Notifikasi Escrow
    - Start: Proses accept offer atau konfirmasi escrow
    - Proses: create notification ke pihak lain
    - Hasil: user menerima notifikasi

## D. Flow Graph dan Region

```mermaid
graph TD
  subgraph Produk [Region A: Manajemen Produk]
    A1[User login/auth]
    A2[POST /products]
    A3[PUT /products/:id]
    A4[PATCH /products/:id/sold]
    A5[DELETE /products/:id]
  end

  subgraph Tawaran [Region B: Siklus Tawaran]
    B1[POST /offers]
    B2[GET /offers/incoming]
    B3[PATCH /offers/:id/accept]
    B4[PATCH /offers/:id/reject]
  end

  subgraph Transaksi [Region C: Transaksi dan Escrow]
    C1[PATCH /transactions/:id/escrow/buyer-confirm]
    C2[PATCH /transactions/:id/escrow/seller-confirm]
    C3[PATCH /transactions/:id/complete]
    C4[Create notification]
  end

  A1 --> A2
  A1 --> A3
  A1 --> A4
  A1 --> A5

  B1 --> B2
  B1 --> B3
  B1 --> B4

  B3 --> C1
  B3 --> C2
  C1 --> C3
  C2 --> C3
  C3 --> C4
  C1 --> C4
  C2 --> C4

  A2 --> |produk tersedia| B1
  A4 --> |produk terjual| B4
```

### Region
- Region A: Manajemen Produk
  - Meliputi posting, edit, mark sold, dan delete produk.
- Region B: Siklus Tawaran
  - Meliputi pembuatan tawaran, melihat tawaran, accept/reject tawaran.
- Region C: Transaksi dan Escrow
  - Meliputi konfirmasi escrow buyer/seller, complete transaksi manual, dan notifikasi.

### Struktur Pola
- Pola umum:
  1. Auth/identitas
  2. Validasi request
  3. Controller
  4. Service
  5. Database / output
- Pola aliran:
  - Sequence: fitur mengikuti urutan validasi → controller → service.
  - Branch: satu titik login bercabang ke produk, tawaran, transaksi.
  - Merge: jalur tawaran yang diterima bergabung ke region transaksi.
- Pola fungsional:
  - Produk: CRUD produk.
  - Tawaran: lifecycle penawaran.
  - Transaksi: escrow, konfirmasi, penyelesaian.
