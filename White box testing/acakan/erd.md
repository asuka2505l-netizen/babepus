# Entity-Relationship Diagram (ERD) - BabePus Marketplace

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
    users ||--o{ offers : "makes_offers_as_buyer"
    users ||--o{ offers : "receives_offers_as_seller"
    users ||--o{ transactions : "buys"
    users ||--o{ transactions : "sells"
    users ||--o{ reviews : "writes_reviews"
    users ||--o{ reviews : "receives_reviews"
    users ||--o{ reports : "reports"
    users ||--o{ reports : "reported"
    users ||--o{ reports : "reviews_reports"
    users ||--o{ verifications : "verifies"
    users ||--o{ verifications : "verified_by"
    users ||--o{ wishlists : "has_wishlist"
    users ||--o{ notifications : "receives"
    users ||--o{ conversations : "participates_as_buyer"
    users ||--o{ conversations : "participates_as_seller"
    users ||--o{ messages : "sends"
    users ||--o{ escrow_events : "performs_actions"

    categories ||--o{ products : "contains"

    products ||--o{ offers : "receives"
    products ||--o{ transactions : "sold_in"
    products ||--o{ wishlists : "saved_in"
    products ||--o{ conversations : "discussed_in"
    products ||--o{ reports : "reported"

    offers ||--|| transactions : "leads_to"

    transactions ||--|| reviews : "reviewed_in"
    transactions ||--o{ escrow_events : "has_events"
```

## Entity Relationships Summary

### Core Business Entities
- **Users**: Central entity representing students and admins
- **Products**: Items listed for sale by sellers
- **Categories**: Product classification system
- **Offers**: Purchase proposals from buyers to sellers
- **Transactions**: Completed sales with escrow system

### Supporting Entities
- **Reviews**: User feedback and ratings
- **Reports**: Moderation system for products/users
- **Verifications**: Student identity verification
- **Wishlists**: Saved products for users
- **Notifications**: System and user notifications
- **Conversations & Messages**: Chat system between buyers/sellers
- **Escrow Events**: Audit trail for transaction escrow

### Key Relationships
1. **Users** can be buyers, sellers, or admins
2. **Products** belong to sellers and categories
3. **Offers** connect buyers, sellers, and products
4. **Transactions** are created from accepted offers
5. **Reviews** are tied to completed transactions
6. **Escrow system** manages payment security
7. **Chat system** enables buyer-seller communication
8. **Moderation system** handles reports and verifications