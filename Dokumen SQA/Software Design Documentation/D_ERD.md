# D. ERD (Entity Relationship Diagram)

Dokumen ini menjelaskan struktur database BabePus, termasuk tabel, relasi, primary key, dan foreign key.

## 1. ERD Diagram

```mermaid
erDiagram
    users {
        bigint id PK
        varchar full_name
        varchar email UK
        varchar password_hash
        varchar phone
        varchar campus
        varchar faculty
        varchar study_program
        varchar student_id
        varchar campus_email
        enum role "user|admin"
        varchar avatar_url
        varchar bio
        decimal rating_average
        int rating_count
        tinyint is_suspended
        enum verification_status "pending|verified|rejected"
        datetime email_verified_at
        varchar email_verification_token
        datetime email_verification_expires_at
        timestamp created_at
        timestamp updated_at
    }

    categories {
        bigint id PK
        varchar name
        varchar slug UK
        timestamp created_at
        timestamp updated_at
    }

    products {
        bigint id PK
        bigint seller_id FK
        bigint category_id FK
        varchar title
        varchar slug UK
        text description
        decimal price
        enum condition_label "like_new|good|fair|needs_repair"
        varchar campus_location
        varchar faculty
        varchar image_url
        enum status "active|sold|archived"
        int view_count
        datetime sold_at
        datetime deleted_at
        timestamp created_at
        timestamp updated_at
    }

    offers {
        bigint id PK
        bigint product_id FK
        bigint buyer_id FK
        bigint seller_id FK
        decimal offer_price
        varchar note
        enum status "pending|accepted|rejected|auto_rejected"
        timestamp created_at
        timestamp updated_at
    }

    transactions {
        bigint id PK
        bigint offer_id FK UK
        bigint product_id FK
        bigint buyer_id FK
        bigint seller_id FK
        decimal final_price
        enum status "pending_meetup|completed|cancelled"
        enum escrow_status "awaiting_payment|holding|released|refunded|disputed"
        datetime buyer_confirmed_at
        datetime seller_confirmed_at
        datetime payout_released_at
        datetime completed_at
        timestamp created_at
        timestamp updated_at
    }

    reviews {
        bigint id PK
        bigint transaction_id FK UK
        bigint reviewer_id FK
        bigint seller_id FK
        tinyint rating
        tinyint communication_rating
        tinyint item_accuracy_rating
        tinyint meetup_rating
        json tags
        tinyint is_anonymous
        varchar comment
        timestamp created_at
        timestamp updated_at
    }

    reports {
        bigint id PK
        bigint reporter_id FK
        enum target_type "product|user"
        bigint target_user_id FK
        bigint target_product_id FK
        varchar reason
        varchar details
        enum status "pending|reviewed|resolved|rejected"
        varchar admin_note
        bigint reviewed_by FK
        datetime reviewed_at
        timestamp created_at
        timestamp updated_at
    }

    verifications {
        bigint id PK
        bigint user_id FK
        varchar document_type
        varchar document_number
        varchar campus_email
        enum status "pending|approved|rejected"
        varchar notes
        bigint verified_by FK
        datetime verified_at
        timestamp created_at
        timestamp updated_at
    }

    wishlists {
        bigint id PK
        bigint user_id FK
        bigint product_id FK
        timestamp created_at
    }

    notifications {
        bigint id PK
        bigint user_id FK
        varchar type
        varchar title
        varchar body
        varchar action_url
        datetime read_at
        timestamp created_at
    }

    conversations {
        bigint id PK
        bigint product_id FK
        bigint buyer_id FK
        bigint seller_id FK
        datetime last_message_at
        timestamp created_at
        timestamp updated_at
    }

    messages {
        bigint id PK
        bigint conversation_id FK
        bigint sender_id FK
        varchar body
        datetime read_at
        timestamp created_at
    }

    escrow_events {
        bigint id PK
        bigint transaction_id FK
        bigint actor_id FK
        varchar event_type
        varchar note
        timestamp created_at
    }

    users ||--o{ products : "sells"
    users ||--o{ offers : "buyer_id"
    users ||--o{ offers : "seller_id"
    users ||--o{ transactions : "buyer_id"
    users ||--o{ transactions : "seller_id"
    users ||--o{ reviews : "reviewer_id"
    users ||--o{ reviews : "seller_id"
    users ||--o{ reports : "reporter_id"
    users ||--o{ reports : "target_user_id"
    users ||--o{ reports : "reviewed_by"
    users ||--o{ verifications : "user_id"
    users ||--o{ verifications : "verified_by"
    users ||--o{ wishlists : "user_id"
    users ||--o{ notifications : "user_id"
    users ||--o{ conversations : "buyer_id"
    users ||--o{ conversations : "seller_id"
    users ||--o{ messages : "sender_id"
    users ||--o{ escrow_events : "actor_id"

    categories ||--o{ products : "contains"

    products ||--o{ offers : "receives"
    products ||--o{ transactions : "used_in"
    products ||--o{ wishlists : "saved_in"
    products ||--o{ conversations : "discussed_in"
    products ||--o{ reports : "target_product_id"

    offers ||--|| transactions : "offer_id"
    transactions ||--|| reviews : "transaction_id"
    conversations ||--o{ messages : "has"
    transactions ||--o{ escrow_events : "logs"
```

## 2. Tabel Utama dan Relasi

### 2.1 users
- Primary Key: `id`
- Relasi:
  - `products.seller_id` → `users.id`
  - `offers.buyer_id` → `users.id`
  - `offers.seller_id` → `users.id`
  - `transactions.buyer_id` → `users.id`
  - `transactions.seller_id` → `users.id`
  - `reviews.reviewer_id` → `users.id`
  - `reviews.seller_id` → `users.id`
  - `reports.reporter_id` → `users.id`
  - `reports.target_user_id` → `users.id`
  - `reports.reviewed_by` → `users.id`
  - `verifications.user_id` → `users.id`
  - `verifications.verified_by` → `users.id`
  - `wishlists.user_id` → `users.id`
  - `notifications.user_id` → `users.id`
  - `conversations.buyer_id` → `users.id`
  - `conversations.seller_id` → `users.id`
  - `messages.sender_id` → `users.id`
  - `escrow_events.actor_id` → `users.id`

### 2.2 categories
- Primary Key: `id`
- Relasi:
  - `products.category_id` → `categories.id`

### 2.3 products
- Primary Key: `id`
- Foreign Keys:
  - `seller_id` → `users.id`
  - `category_id` → `categories.id`
- Relasi:
  - `offers.product_id` → `products.id`
  - `transactions.product_id` → `products.id`
  - `reports.target_product_id` → `products.id`
  - `wishlists.product_id` → `products.id`
  - `conversations.product_id` → `products.id`

### 2.4 offers
- Primary Key: `id`
- Foreign Keys:
  - `product_id` → `products.id`
  - `buyer_id` → `users.id`
  - `seller_id` → `users.id`
- Relasi:
  - `transactions.offer_id` → `offers.id`

### 2.5 transactions
- Primary Key: `id`
- Foreign Keys:
  - `offer_id` → `offers.id`
  - `product_id` → `products.id`
  - `buyer_id` → `users.id`
  - `seller_id` → `users.id`
- Relasi:
  - `reviews.transaction_id` → `transactions.id`
  - `escrow_events.transaction_id` → `transactions.id`

### 2.6 reviews
- Primary Key: `id`
- Foreign Keys:
  - `transaction_id` → `transactions.id`
  - `reviewer_id` → `users.id`
  - `seller_id` → `users.id`

### 2.7 reports
- Primary Key: `id`
- Foreign Keys:
  - `reporter_id` → `users.id`
  - `target_user_id` → `users.id`
  - `target_product_id` → `products.id`
  - `reviewed_by` → `users.id`

### 2.8 verifications
- Primary Key: `id`
- Foreign Keys:
  - `user_id` → `users.id`
  - `verified_by` → `users.id`

### 2.9 wishlists
- Primary Key: `id`
- Foreign Keys:
  - `user_id` → `users.id`
  - `product_id` → `products.id`

### 2.10 notifications
- Primary Key: `id`
- Foreign Keys:
  - `user_id` → `users.id`

### 2.11 conversations
- Primary Key: `id`
- Foreign Keys:
  - `product_id` → `products.id`
  - `buyer_id` → `users.id`
  - `seller_id` → `users.id`

### 2.12 messages
- Primary Key: `id`
- Foreign Keys:
  - `conversation_id` → `conversations.id`
  - `sender_id` → `users.id`

### 2.13 escrow_events
- Primary Key: `id`
- Foreign Keys:
  - `transaction_id` → `transactions.id`
  - `actor_id` → `users.id`

## 3. Catatan Desain ISO

- Semua tabel utama menggunakan `BIGINT` sebagai `id` untuk konsistensi.
- Relasi foreign key dijaga menggunakan `REFERENCES ... ON DELETE ...` di database schema.
- Setiap entitas memiliki `created_at` dan `updated_at` untuk pencatatan audit.
- Beberapa field unik ditandai dengan `UNIQUE` pada ERD, seperti `users.email`, `categories.slug`, `products.slug`, `transactions.offer_id`, dan `reviews.transaction_id`.
- Nama kolom mengikuti pola lower_snake_case yang konsisten dengan desain database MySQL.
