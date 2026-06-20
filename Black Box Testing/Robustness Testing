##  Class Diagram

```mermaid
classDiagram
  class User {
    +BIGINT id
    +VARCHAR full_name
    +VARCHAR email
    +VARCHAR password_hash
    +VARCHAR phone
    +VARCHAR campus
    +VARCHAR faculty
    +VARCHAR study_program
    +VARCHAR student_id
    +VARCHAR campus_email
    +ENUM role
    +VARCHAR avatar_url
    +VARCHAR bio
    +DECIMAL rating_average
    +INT rating_count
    +TINYINT is_suspended
    +ENUM verification_status
    +DATETIME email_verified_at
    +VARCHAR email_verification_token
    +DATETIME email_verification_expires_at
  }

  class Category {
    +BIGINT id
    +VARCHAR name
    +VARCHAR slug
  }

  class Product {
    +BIGINT id
    +BIGINT seller_id
    +BIGINT category_id
    +VARCHAR title
    +VARCHAR slug
    +TEXT description
    +DECIMAL price
    +ENUM condition_label
    +VARCHAR campus_location
    +VARCHAR faculty
    +VARCHAR image_url
    +ENUM status
    +INT view_count
  }

  class Offer {
    +BIGINT id
    +BIGINT product_id
    +BIGINT buyer_id
    +BIGINT seller_id
    +DECIMAL offer_price
    +VARCHAR note
    +ENUM status
  }

  class Transaction {
    +BIGINT id
    +BIGINT offer_id
    +BIGINT product_id
    +BIGINT buyer_id
    +BIGINT seller_id
    +DECIMAL final_price
    +ENUM status
    +ENUM escrow_status
  }

  class Review {
    +BIGINT id
    +BIGINT transaction_id
    +BIGINT reviewer_id
    +BIGINT seller_id
    +TINYINT rating
    +TINYINT communication_rating
    +TINYINT item_accuracy_rating
    +TINYINT meetup_rating
    +JSON tags
    +TINYINT is_anonymous
    +VARCHAR comment
  }

  class Report {
    +BIGINT id
    +BIGINT reporter_id
    +ENUM target_type
    +BIGINT target_user_id
    +BIGINT target_product_id
    +VARCHAR reason
    +ENUM status
    +VARCHAR admin_note
  }

  class Verification {
    +BIGINT id
    +BIGINT user_id
    +VARCHAR document_type
    +VARCHAR document_number
    +VARCHAR campus_email
    +ENUM status
    +VARCHAR notes
  }

  class Wishlist {
    +BIGINT id
    +BIGINT user_id
    +BIGINT product_id
  }

  class Notification {
    +BIGINT id
    +BIGINT user_id
    +VARCHAR type
    +VARCHAR title
    +VARCHAR body
    +VARCHAR action_url
  }

  class Conversation {
    +BIGINT id
    +BIGINT product_id
    +BIGINT buyer_id
    +BIGINT seller_id
    +DATETIME last_message_at
  }

  class Message {
    +BIGINT id
    +BIGINT conversation_id
    +BIGINT sender_id
    +VARCHAR body
    +DATETIME read_at
  }

  class AuthController {
    +register()
    +login()
    +me()
    +requestEmailVerification()
    +verifyEmail()
  }

  class ProductController {
    +listProducts()
    +searchProducts()
    +getMyProducts()
    +getProduct()
    +createProduct()
    +updateProduct()
    +markProductSold()
    +deleteProduct()
  }

  class OfferController {
    +createOffer()
    +getIncomingOffers()
    +getMyOffers()
    +acceptOffer()
    +rejectOffer()
  }

  class ChatController {
    +streamChat()
    +getConversations()
    +startConversation()
    +getMessages()
    +sendMessage()
  }

  class UserController {
    +getDashboardSummary()
    +getSellerAnalytics()
    +updateProfile()
    +uploadAvatar()
  }

  class AdminController {
    +getDashboard()
    +getUsers()
    +suspendUser()
    +getProducts()
    +getReports()
    +updateReportStatus()
  }

  class WishlistController {
    +getWishlist()
    +addToWishlist()
    +removeFromWishlist()
  }

  class NotificationController {
    +getNotifications()
    +markAllAsRead()
    +markAsRead()
    +streamNotifications()
  }

  class TransactionController {
    +getMyTransactions()
    +completeTransaction()
    +confirmBuyer()
    +confirmSeller()
    +disputeEscrow()
  }

  class ReviewController {
    +createReview()
  }

  class ReportController {
    +createReport()
  }

  class CategoryController {
    +getCategories()
  }

  class PricingController {
    +estimate()
  }

  User "1" -- "*" Product : sells
  User "1" -- "*" Offer : buys
  User "1" -- "*" Offer : sells
  User "1" -- "*" Transaction : buys
  User "1" -- "*" Transaction : sells
  User "1" -- "*" Review : writes
  User "1" -- "*" Review : receives
  User "1" -- "*" Report : reports
  User "1" -- "*" Verification : has
  User "1" -- "*" Wishlist : owns
  User "1" -- "*" Notification : receives
  User "1" -- "*" Conversation : participates_as_buyer
  User "1" -- "*" Conversation : participates_as_seller
  User "1" -- "*" Message : sends

  Category "1" -- "*" Product : groups
  Product "1" -- "*" Offer : receives
  Product "1" -- "*" Conversation : has
  Product "1" -- "*" Wishlist : saved_in
  Conversation "1" -- "*" Message : contains
  Offer "1" -- "1" Transaction : completes
  Transaction "1" -- "1" Review : evaluated_by

  AuthController ..> User : authenticates
  ProductController ..> Product : manages
  ProductController ..> Category : categorizes
  OfferController ..> Offer : manages
  OfferController ..> Product : references
  ChatController ..> Conversation : manages
  ChatController ..> Message : manages
  UserController ..> User : updates
  AdminController ..> User : moderates
  AdminController ..> Report : reviews
  WishlistController ..> Wishlist : manages
  WishlistController ..> Product : references
  NotificationController ..> Notification : manages
  TransactionController ..> Transaction : manages
  TransactionController ..> Offer : reads
  ReviewController ..> Review : creates
  ReportController ..> Report : creates
  CategoryController ..> Category : reads
  PricingController ..> Product : estimates
```
---

# 7. Robustness Testing

## 7.1 Tujuan Pengujian

Robustness Testing dilakukan untuk memastikan sistem tetap stabil dan mampu menangani kondisi abnormal, input tidak valid, data yang hilang, serta kegagalan komponen tanpa menyebabkan crash atau inkonsistensi data.

---

# 7.2 Authentication Module

## RT-AUTH-001 - Email Kosong Saat Login

| Atribut         | Deskripsi                                                       |
| --------------- | --------------------------------------------------------------- |
| Test Case ID    | RT-AUTH-001                                                     |
| Modul           | AuthController.login()                                          |
| Input           | email = null                                                    |
| Expected Result | Sistem menolak login dan menampilkan validasi email wajib diisi |
| Status          | Pass                                                            |

---

## RT-AUTH-002 - Password Kosong

| Atribut         | Deskripsi              |
| --------------- | ---------------------- |
| Test Case ID    | RT-AUTH-002            |
| Modul           | AuthController.login() |
| Input           | password = null        |
| Expected Result | Sistem menolak login   |
| Status          | Pass                   |

---

## RT-AUTH-003 - SQL Injection Login

| Atribut         | Deskripsi                                         |
| --------------- | ------------------------------------------------- |
| Test Case ID    | RT-AUTH-003                                       |
| Modul           | AuthController.login()                            |
| Input           | `' OR 1=1 --`                                     |
| Expected Result | Sistem menolak login dan melakukan sanitasi input |
| Status          | Pass                                              |

---

## RT-AUTH-004 - Token Verifikasi Kedaluwarsa

| Atribut         | Deskripsi                       |
| --------------- | ------------------------------- |
| Test Case ID    | RT-AUTH-004                     |
| Modul           | verifyEmail()                   |
| Input           | token expired                   |
| Expected Result | Sistem menolak verifikasi email |
| Status          | Pass                            |

---

# 7.3 Product Module

## RT-PROD-001 - Harga Produk Negatif

| Atribut         | Deskripsi                         |
| --------------- | --------------------------------- |
| Test Case ID    | RT-PROD-001                       |
| Modul           | createProduct()                   |
| Input           | price = -10000                    |
| Expected Result | Sistem menolak penyimpanan produk |
| Status          | Pass                              |

---

## RT-PROD-002 - Judul Produk Kosong

| Atribut         | Deskripsi                                     |
| --------------- | --------------------------------------------- |
| Test Case ID    | RT-PROD-002                                   |
| Modul           | createProduct()                               |
| Input           | title = ""                                    |
| Expected Result | Sistem menampilkan validasi judul wajib diisi |
| Status          | Pass                                          |

---

## RT-PROD-003 - Category Tidak Ditemukan

| Atribut         | Deskripsi                         |
| --------------- | --------------------------------- |
| Test Case ID    | RT-PROD-003                       |
| Modul           | createProduct()                   |
| Input           | category_id = 999999              |
| Expected Result | Sistem menolak penyimpanan produk |
| Status          | Pass                              |

---

## RT-PROD-004 - Upload Gambar Rusak

| Atribut         | Deskripsi                             |
| --------------- | ------------------------------------- |
| Test Case ID    | RT-PROD-004                           |
| Modul           | createProduct()                       |
| Input           | file corrupt                          |
| Expected Result | Sistem menampilkan pesan upload gagal |
| Status          | Pass                                  |

---

# 7.4 Offer Module

## RT-OFFER-001 - Menawar Produk Sendiri

| Atribut         | Deskripsi                      |
| --------------- | ------------------------------ |
| Test Case ID    | RT-OFFER-001                   |
| Modul           | createOffer()                  |
| Input           | buyer_id = seller_id           |
| Expected Result | Sistem menolak pembuatan offer |
| Status          | Pass                           |

---

## RT-OFFER-002 - Harga Penawaran Nol

| Atribut         | Deskripsi                |
| --------------- | ------------------------ |
| Test Case ID    | RT-OFFER-002             |
| Modul           | createOffer()            |
| Input           | offer_price = 0          |
| Expected Result | Sistem menolak penawaran |
| Status          | Pass                     |

---

## RT-OFFER-003 - Produk Sudah Sold

| Atribut         | Deskripsi             |
| --------------- | --------------------- |
| Test Case ID    | RT-OFFER-003          |
| Modul           | createOffer()         |
| Input           | product.status = sold |
| Expected Result | Sistem menolak offer  |
| Status          | Pass                  |

---

## RT-OFFER-004 - Product ID Tidak Ada

| Atribut         | Deskripsi                                       |
| --------------- | ----------------------------------------------- |
| Test Case ID    | RT-OFFER-004                                    |
| Modul           | createOffer()                                   |
| Input           | product_id invalid                              |
| Expected Result | Sistem menampilkan error produk tidak ditemukan |
| Status          | Pass                                            |

---

# 7.5 Transaction Module

## RT-TRANS-001 - Offer Tidak Ada

| Atribut         | Deskripsi                |
| --------------- | ------------------------ |
| Test Case ID    | RT-TRANS-001             |
| Modul           | completeTransaction()    |
| Input           | offer_id invalid         |
| Expected Result | Sistem menolak transaksi |
| Status          | Pass                     |

---

## RT-TRANS-002 - Duplikasi Transaksi

| Atribut         | Deskripsi                               |
| --------------- | --------------------------------------- |
| Test Case ID    | RT-TRANS-002                            |
| Modul           | completeTransaction()                   |
| Input           | offer yang sudah memiliki transaction   |
| Expected Result | Sistem menolak pembuatan transaksi baru |
| Status          | Pass                                    |

---

## RT-TRANS-003 - Kegagalan Penyimpanan Transaction

| Atribut         | Deskripsi                         |
| --------------- | --------------------------------- |
| Test Case ID    | RT-TRANS-003                      |
| Modul           | completeTransaction()             |
| Input           | database error                    |
| Expected Result | Sistem rollback seluruh perubahan |
| Status          | Pass                              |

---

# 7.6 Review Module

## RT-REV-001 - Rating Di Bawah Batas

| Atribut         | Deskripsi             |
| --------------- | --------------------- |
| Test Case ID    | RT-REV-001            |
| Modul           | createReview()        |
| Input           | rating = 0            |
| Expected Result | Sistem menolak review |
| Status          | Pass                  |

---

## RT-REV-002 - Rating Di Atas Maksimum

| Atribut         | Deskripsi             |
| --------------- | --------------------- |
| Test Case ID    | RT-REV-002            |
| Modul           | createReview()        |
| Input           | rating = 10           |
| Expected Result | Sistem menolak review |
| Status          | Pass                  |

---

## RT-REV-003 - Review Tanpa Transaksi

| Atribut         | Deskripsi              |
| --------------- | ---------------------- |
| Test Case ID    | RT-REV-003             |
| Modul           | createReview()         |
| Input           | transaction_id invalid |
| Expected Result | Sistem menolak review  |
| Status          | Pass                   |

---

# 7.7 Chat Module

## RT-CHAT-001 - Mengirim Pesan Kosong

| Atribut         | Deskripsi                       |
| --------------- | ------------------------------- |
| Test Case ID    | RT-CHAT-001                     |
| Modul           | sendMessage()                   |
| Input           | body=""                         |
| Expected Result | Sistem menolak pengiriman pesan |
| Status          | Pass                            |

---

## RT-CHAT-002 - Conversation Tidak Ada

| Atribut         | Deskripsi                                             |
| --------------- | ----------------------------------------------------- |
| Test Case ID    | RT-CHAT-002                                           |
| Modul           | sendMessage()                                         |
| Input           | conversation_id invalid                               |
| Expected Result | Sistem menampilkan error conversation tidak ditemukan |
| Status          | Pass                                                  |

---

## RT-CHAT-003 - Pesan Sangat Panjang

| Atribut         | Deskripsi                                        |
| --------------- | ------------------------------------------------ |
| Test Case ID    | RT-CHAT-003                                      |
| Modul           | sendMessage()                                    |
| Input           | body > 10000 karakter                            |
| Expected Result | Sistem menolak atau memotong pesan sesuai aturan |
| Status          | Pass                                             |

---

# 7.8 Wishlist Module

## RT-WISH-001 - Menambahkan Produk yang Sama Dua Kali

| Atribut         | Deskripsi                       |
| --------------- | ------------------------------- |
| Test Case ID    | RT-WISH-001                     |
| Modul           | addToWishlist()                 |
| Input           | produk sudah ada dalam wishlist |
| Expected Result | Sistem mencegah duplikasi data  |
| Status          | Pass                            |

---

## RT-WISH-002 - Produk Tidak Ditemukan

| Atribut         | Deskripsi                  |
| --------------- | -------------------------- |
| Test Case ID    | RT-WISH-002                |
| Modul           | addToWishlist()            |
| Input           | product_id invalid         |
| Expected Result | Sistem menolak penyimpanan |
| Status          | Pass                       |

---

# 7.9 Report Module

## RT-REP-001 - Alasan Laporan Kosong

| Atribut         | Deskripsi              |
| --------------- | ---------------------- |
| Test Case ID    | RT-REP-001             |
| Modul           | createReport()         |
| Input           | reason = null          |
| Expected Result | Sistem menolak laporan |
| Status          | Pass                   |

---

## RT-REP-002 - Melaporkan Diri Sendiri

| Atribut         | Deskripsi                    |
| --------------- | ---------------------------- |
| Test Case ID    | RT-REP-002                   |
| Modul           | createReport()               |
| Input           | reporter_id = target_user_id |
| Expected Result | Sistem menolak laporan       |
| Status          | Pass                         |

---

# 7.10 Admin Module

## RT-ADMIN-001 - Suspend User Tidak Ada

| Atribut         | Deskripsi                                     |
| --------------- | --------------------------------------------- |
| Test Case ID    | RT-ADMIN-001                                  |
| Modul           | suspendUser()                                 |
| Input           | user_id invalid                               |
| Expected Result | Sistem menampilkan error user tidak ditemukan |
| Status          | Pass                                          |

---

## RT-ADMIN-002 - User Biasa Mengakses Endpoint Admin

| Atribut         | Deskripsi                               |
| --------------- | --------------------------------------- |
| Test Case ID    | RT-ADMIN-002                            |
| Modul           | AdminController                         |
| Input           | role = user                             |
| Expected Result | Sistem mengembalikan HTTP 403 Forbidden |
| Status          | Pass                                    |

---

# 7.11 Ringkasan Pengujian

| Modul          | Jumlah Test Case |
| -------------- | ---------------- |
| Authentication | 4                |
| Product        | 4                |
| Offer          | 4                |
| Transaction    | 3                |
| Review         | 3                |
| Chat           | 3                |
| Wishlist       | 2                |
| Report         | 2                |
| Admin          | 2                |
| **Total**      | **27 Test Case** |
