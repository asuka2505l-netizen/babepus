# C. UML Diagram

Dokumen ini menyajikan diagram UML untuk aplikasi BabePus: Use Case Diagram, Activity Diagram, Sequence Diagram, dan Class Diagram.

## 1. Use Case Diagram

```mermaid
graph TD

%% Actors
Guest[Guest]
Buyer[Buyer]
Seller[Seller]
Admin[Admin]

%% Guest Features
subgraph Guest_Features
    UC1((Register))
    UC2((Login))
    UC3((Browse Products))
    UC4((Search Products))
    UC5((View Product Detail))
    UC6((View Categories))
end

%% Buyer Features
subgraph Buyer_Features
    UC7((View Profile))
    UC8((Update Profile))
    UC9((Upload Avatar))
    UC10((Make Offer))
    UC11((View My Offers))
    UC12((Start Chat))
    UC13((View Conversations))
    UC14((Send Message))
    UC15((Add to Wishlist))
    UC16((Remove from Wishlist))
    UC17((Create Review))
    UC18((Create Report))
    UC19((Request Email Verification))
    UC20((Verify Email))
    UC21((View Notifications))
    UC22((Use Pricing Estimate))
end

%% Seller Features
subgraph Seller_Features
    UC23((Add Product))
    UC24((Update Product))
    UC25((Mark Product Sold))
    UC26((Delete Product))
    UC27((View My Products))
    UC28((View Incoming Offers))
    UC29((Accept Offer))
    UC30((Reject Offer))
    UC31((View Dashboard))
    UC32((View Seller Analytics))
end

%% Admin Features
subgraph Admin_Features
    UC33((View Admin Dashboard))
    UC34((Manage Users))
    UC35((Suspend User))
    UC36((View Products))
    UC37((View Reports))
    UC38((Update Report Status))
end

%% Actor Connections
Guest --> UC1
Guest --> UC2
Guest --> UC3
Guest --> UC4
Guest --> UC5
Guest --> UC6

Buyer --> UC7
Buyer --> UC8
Buyer --> UC9
Buyer --> UC10
Buyer --> UC11
Buyer --> UC12
Buyer --> UC13
Buyer --> UC14
Buyer --> UC15
Buyer --> UC16
Buyer --> UC17
Buyer --> UC18
Buyer --> UC19
Buyer --> UC20
Buyer --> UC21
Buyer --> UC22

Seller --> UC23
Seller --> UC24
Seller --> UC25
Seller --> UC26
Seller --> UC27
Seller --> UC28
Seller --> UC29
Seller --> UC30
Seller --> UC31
Seller --> UC32
Seller --> UC12
Seller --> UC13
Seller --> UC14

Admin --> UC33
Admin --> UC34
Admin --> UC35
Admin --> UC36
Admin --> UC37
Admin --> UC38

%% Login Dependencies
UC10 -. requires .-> UC2
UC23 -. requires .-> UC2
UC27 -. requires .-> UC2
UC28 -. requires .-> UC2
UC31 -. requires .-> UC2
UC33 -. requires .-> UC2
UC17 -. requires .-> UC2
UC18 -. requires .-> UC2
UC12 -. requires .-> UC2
UC14 -. requires .-> UC2
UC15 -. requires .-> UC2
```

## 2. Activity Diagram

```mermaid
flowchart TD
  Start([Start]) --> Login{User has account?}
  Login -->|No| Register[Register Account]
  Login -->|Yes| Auth[Authenticate User]
  Auth --> Dashboard[Show Homepage / Marketplace]
  Dashboard --> Action{User action}
  Action -->|Browse products| Browse[Request product list]
  Action -->|View product| Detail[Request product detail]
  Action -->|Make offer| OfferForm[Open offer form]
  Action -->|Chat| ChatStart[Open chat session]
  Action -->|Manage listing| SellerDashboard[Open seller dashboard]
  Browse --> RenderList[Render products]
  Detail --> RenderDetail[Show product detail]
  OfferForm --> SubmitOffer[Submit offer request]
  SubmitOffer --> Backend[Backend validates offer]
  Backend --> DB[Store offer]
  DB --> Notify[Notify seller]
  ChatStart --> SendMessage[Send/receive chat]
  SendMessage --> DB2[Persist message]
  DB2 --> RenderChat[Update chat view]
  SellerDashboard --> ReviewOffers[Review incoming offers]
  ReviewOffers --> UpdateOffer[Accept / reject offer]
  UpdateOffer --> Transaction[Create transaction if accepted]
  Transaction --> DB3[Update product and offer status]
  DB3 --> NotifyBuyer[Notify buyer]
  NotifyBuyer --> End([End])
```

## 3. Sequence Diagram

### 3.1 Login Sequence

```mermaid
sequenceDiagram
  participant User
  participant Frontend
  participant Backend
  participant Database

  User->>Frontend: Submit email/password
  Frontend->>Backend: POST /login
  Backend->>Database: SELECT user WHERE email
  Database-->>Backend: user record
  Backend->>Backend: Verify password
  Backend-->>Frontend: token + user info
  Frontend-->>User: Display dashboard
```

### 3.2 Create Offer Sequence

```mermaid
sequenceDiagram
  participant Buyer
  participant Frontend
  participant Backend
  participant Database
  participant Seller

  Buyer->>Frontend: Click "Make Offer"
  Frontend->>Backend: POST /offers
  Backend->>Database: INSERT offer
  Database-->>Backend: success
  Backend-->>Frontend: confirmation
  Backend->>Seller: send notification
  Frontend-->>Buyer: show success
```

### 3.3 Complete Transaction Sequence

```mermaid
sequenceDiagram
  participant Seller
  participant Backend
  participant Database
  participant Buyer

  Seller->>Backend: PATCH /offers/:id/status
  Backend->>Database: SELECT offer + product
  Backend->>Database: UPDATE offer status
  Backend->>Database: UPDATE product status
  Backend->>Database: INSERT transaction
  Database-->>Backend: success
  Backend->>Buyer: notify transaction created
  Backend-->>Seller: confirm completion
```

## 4. Class Diagram

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

## 5. Keterangan

- Use Case Diagram menampilkan aktor utama: `User`, `Seller`, `Admin`.
- Activity Diagram menunjukkan alur autentikasi, pencarian produk, pembuatan penawaran, dan transaksi.
- Sequence Diagram mengilustrasikan interaksi frontend-backend-database untuk login, penawaran, dan penyelesaian transaksi.
- Class Diagram menampilkan entitas data utama dan relasi antar objek sesuai struktur database.
