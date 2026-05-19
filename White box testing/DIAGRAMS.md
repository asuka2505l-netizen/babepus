# BabePus - Diagram Documentation

Dokumen ini berisi semua diagram untuk aplikasi Babepus marketplace. Gunakan tools Mermaid online untuk memvisualisasikan.

---

## 1. MAIN USE CASE DIAGRAM

**Tool:** [Mermaid Live Editor](https://mermaid.live)  
**Copy-paste kode di bawah ke Mermaid Live Editor:**

```mermaid
graph TB
    subgraph Actors["Aktor"]
        Guest["👤 Guest"]
        User["👤 User/Buyer"]
        Seller["👤 Seller"]
        Admin["👤 Admin"]
    end

    subgraph Auth["Authentication & Profile"]
        UC1["UC-001: Register"]
        UC2["UC-002: Login"]
        UC3["UC-003: Verify Email"]
        UC4["UC-004: Auto Logout"]
        UC26["UC-026: Edit Profile"]
        UC27["UC-027: Upload Avatar"]
    end

    subgraph Products["Product Management"]
        UC5["UC-005: List Product"]
        UC6["UC-006: Edit Product"]
        UC7["UC-007: Delete Product"]
        UC8["UC-008: Browse Marketplace"]
        UC9["UC-009: View Product Detail"]
    end

    subgraph Offers["Offer & Negotiation"]
        UC10["UC-010: Make Offer"]
        UC11["UC-011: View Offers"]
        UC12["UC-012: Accept/Reject Offer"]
    end

    subgraph Transactions["Transactions"]
        UC13["UC-013: View Transactions"]
        UC14["UC-014: Complete Transaction"]
        UC15["UC-015: Make Review"]
        UC16["UC-016: View Reviews"]
    end

    subgraph Wishlist["Wishlist"]
        UC17["UC-017: Add to Wishlist"]
        UC18["UC-018: View Wishlist"]
        UC19["UC-019: Remove from Wishlist"]
    end

    subgraph Chat["Chat & Messaging"]
        UC20["UC-020: Open Chat"]
        UC21["UC-021: Send Message"]
        UC22["UC-022: View Chat List"]
    end

    subgraph Notifications["Notifications"]
        UC23["UC-023: View Notifications"]
        UC24["UC-024: Mark as Read"]
    end

    subgraph Analytics["Analytics"]
        UC25["UC-025: View Analytics"]
    end

    subgraph AdminFunctions["Admin"]
        UC28["UC-028: Admin Dashboard"]
        UC29["UC-029: Suspend User"]
        UC30["UC-030: Moderate Reports"]
        UC31["UC-031: Report Content"]
        UC32["UC-032: View Pricing"]
    end

    Guest --> UC1
    Guest --> UC2
    Guest --> UC8
    
    User --> UC2
    User --> UC3
    User --> UC4
    User --> UC26
    User --> UC27
    User --> UC8
    User --> UC9
    User --> UC10
    User --> UC13
    User --> UC14
    User --> UC15
    User --> UC16
    User --> UC17
    User --> UC18
    User --> UC19
    User --> UC20
    User --> UC21
    User --> UC22
    User --> UC23
    User --> UC24
    User --> UC31
    
    Seller --> UC5
    Seller --> UC6
    Seller --> UC7
    Seller --> UC11
    Seller --> UC12
    Seller --> UC25
    
    Admin --> UC28
    Admin --> UC29
    Admin --> UC30

style Auth fill:#e1f5ff
style Products fill:#f3e5f5
style Offers fill:#fff3e0
style Transactions fill:#e8f5e9
style Wishlist fill:#fce4ec
style Chat fill:#f1f8e9
style Notifications fill:#e0f2f1
style Analytics fill:#ede7f6
style AdminFunctions fill:#ffebee
```

---

## 2. PRODUCT PURCHASE FLOW (Sequence Diagram)

**Menunjukkan:** Alur dari browse produk hingga review  
**Interaksi:** Buyer → Client → API → Database → Seller

```mermaid
sequenceDiagram
    participant Buyer as 👤 Buyer
    participant Client as 🖥️ Client<br/>React
    participant API as 🔌 API<br/>Express
    participant DB as 💾 Database
    participant Seller as 👤 Seller

    Buyer->>Client: 1. Browse Marketplace
    Client->>API: GET /api/products
    API->>DB: Query products
    DB-->>API: Product list
    API-->>Client: Return products
    Client-->>Buyer: Display products

    Buyer->>Client: 2. Click Product Detail
    Client->>API: GET /api/products/:id
    API->>DB: Query product detail
    DB-->>API: Product data + seller info
    API-->>Client: Return product detail
    Client-->>Buyer: Display product detail

    Buyer->>Client: 3. Click "Tawar" (Make Offer)
    Client->>API: POST /api/offers<br/>{productId, offeredPrice, message}
    API->>DB: Create offer record
    DB-->>API: Offer created
    API->>DB: Create notification for seller
    DB-->>API: Notification created
    API-->>Client: Offer success
    Client-->>Buyer: Show success message

    Seller->>Client: 4. View Offers
    Client->>API: GET /api/offers
    API->>DB: Query seller's offers
    DB-->>API: Offers list
    API-->>Client: Return offers
    Client-->>Seller: Display offers

    Seller->>Client: 5. Accept Offer
    Client->>API: PUT /api/offers/:id<br/>{status: 'accepted'}
    API->>DB: Update offer status
    DB-->>API: Offer updated
    API->>DB: Create transaction
    DB-->>API: Transaction created
    API->>DB: Create notification for buyer
    DB-->>API: Notification created
    API-->>Client: Accept success
    Client-->>Seller: Show success

    Buyer->>Client: 6. View Transactions
    Client->>API: GET /api/transactions
    API->>DB: Query buyer's transactions
    DB-->>API: Transactions
    API-->>Client: Return transactions
    Client-->>Buyer: Display transactions

    Buyer->>Client: 7. Mark Complete
    Client->>API: PUT /api/transactions/:id<br/>{status: 'completed'}
    API->>DB: Update transaction
    DB-->>API: Transaction updated
    API-->>Client: Complete success
    Client-->>Buyer: Enable review feature

    Buyer->>Client: 8. Leave Review
    Client->>API: POST /api/reviews<br/>{sellerId, rating, comment}
    API->>DB: Create review
    API->>DB: Update seller rating_average
    DB-->>API: Review created
    API->>DB: Create notification
    DB-->>API: Notification created
    API-->>Client: Review success
    Client-->>Buyer: Show review confirmation
```

---

## 3. TRANSACTION STATE MACHINE

**Menunjukkan:** Semua state transaksi dan transisi yang valid

```mermaid
stateDiagram-v2
    [*] --> Pending: Offer Created
    
    Pending --> Accepted: Seller Accept
    Pending --> Rejected: Seller Reject
    Pending --> Cancelled: Buyer Cancel
    
    Accepted --> InProgress: Meeting Agreed
    
    InProgress --> Completed: Both Mark Complete
    InProgress --> Dispute: Dispute Raised
    
    Dispute --> CompletedByAdmin: Admin Resolve
    Dispute --> Cancelled
    
    Completed --> [*]
    Cancelled --> [*]
    Rejected --> [*]
    CompletedByAdmin --> [*]
    
    note right of Pending
        Waiting for seller response
        Buyer can cancel
    end note
    
    note right of Accepted
        Transaction confirmed
        Buyer & Seller ready to meet
    end note
    
    note right of InProgress
        Both parties meeting
        Product exchanged
    end note
    
    note right of Completed
        Both parties marked complete
        Review feature enabled
    end note
    
    note right of Dispute
        Disagreement about transaction
        Admin intervention needed
    end note
```

---

## 4. AUTHENTICATION FLOW DIAGRAM

**Menunjukkan:** Detail proses login, token handling, dan auto-logout

```mermaid
graph TD
    A["User Visits App<br/>/"] --> B{User<br/>Authenticated?}
    
    B -->|No| C["Show Login Page"]
    C --> D["User Enter Email<br/>& Password"]
    D --> E["Send POST<br/>/api/auth/login"]
    E --> F{Valid<br/>Credentials?}
    F -->|Yes| G["Generate JWT Token"]
    F -->|No| H["Show Error"]
    H --> D
    
    G --> I["Save Token<br/>to localStorage"]
    I --> J["Set User State<br/>in AuthContext"]
    
    B -->|Yes| K["Check if Email<br/>Verified"]
    K -->|Not Verified| L["Prompt Email<br/>Verification"]
    L --> M["User Verify Email"]
    M --> N["Redirect to<br/>Dashboard"]
    
    K -->|Verified| N
    
    J --> N
    
    N --> O["User Browse<br/>App"]
    O --> P["Make API Request<br/>with Bearer Token"]
    
    P --> Q{Token<br/>Valid?}
    Q -->|Yes| R["Request Success"]
    Q -->|No| S["Return 401"]
    
    S --> T["Axios Interceptor<br/>Detect 401"]
    T --> U["Call<br/>unauthorizedHandler"]
    U --> V["Clear Token<br/>from localStorage"]
    V --> W["Clear User State"]
    W --> X["Auto Redirect<br/>to Login"]
    
    X --> C
    
    style A fill:#e3f2fd
    style C fill:#fff3e0
    style E fill:#f3e5f5
    style G fill:#e8f5e9
    style I fill:#e8f5e9
    style N fill:#c8e6c9
    style P fill:#f3e5f5
    style S fill:#ffcdd2
    style T fill:#ffcdd2
    style X fill:#fff3e0
```

---

## 5. SYSTEM ARCHITECTURE DIAGRAM

**Menunjukkan:** Layer-based architecture (Client → API → Server → Database)

```mermaid
graph TB
    subgraph Client["🖥️ CLIENT LAYER (React)"]
        Pages["Pages<br/>- LoginPage<br/>- MarketplacePage<br/>- ProductDetailPage<br/>- DashboardPages"]
        Components["Components<br/>- Auth/ProtectedRoute<br/>- Navbar<br/>- ProductCard<br/>- ChatWindow"]
        Contexts["Context API<br/>- AuthContext<br/>- ThemeContext<br/>- ToastContext"]
        Hooks["Custom Hooks<br/>- useAuth<br/>- useTheme<br/>- useDebounce<br/>- useToast"]
        Services["Services<br/>- authService<br/>- productService<br/>- offerService<br/>- chatService"]
        Utils["Utils<br/>- cn<br/>- currency<br/>- date<br/>- storage"]
    end

    subgraph APILayer["🔌 API CLIENT (Axios)"]
        APIClient["API Client<br/>- baseURL config<br/>- Request interceptor<br/>- Response interceptor<br/>- 401 handler"]
    end

    subgraph Server["🖥️ SERVER LAYER (Express)"]
        Middleware["Middlewares<br/>- authMiddleware<br/>- requireRole<br/>- errorHandler<br/>- uploadMiddleware"]
        Routes["Routes<br/>- /auth<br/>- /products<br/>- /offers<br/>- /transactions<br/>- /reviews<br/>- /chat<br/>- /admin"]
        Controllers["Controllers<br/>- authController<br/>- productController<br/>- offerController<br/>- transactionController<br/>- reviewController<br/>- chatController"]
        Services_Server["Services<br/>- authService<br/>- productService<br/>- offerService<br/>- notificationService<br/>- chatService"]
    end

    subgraph Database["💾 DATA LAYER (MySQL)"]
        Tables["Tables<br/>- users<br/>- products<br/>- offers<br/>- transactions<br/>- reviews<br/>- chat_messages<br/>- notifications<br/>- wishlist<br/>- reports"]
    end

    subgraph External["🌐 EXTERNAL"]
        Uploads["File Storage<br/>/uploads"]
        Email["Email Service<br/>Verification<br/>Notifications"]
    end

    Pages --> Components
    Pages --> Contexts
    Pages --> Hooks
    Components --> Contexts
    Hooks --> Services
    Services --> APIClient
    
    APIClient --> APILayer
    APILayer --> Routes
    
    Routes --> Middleware
    Routes --> Controllers
    
    Middleware --> Services_Server
    Controllers --> Services_Server
    
    Services_Server --> Database
    Services_Server --> Uploads
    Services_Server --> Email
    
    Controllers --> Tables
    Middleware --> Tables

    style Client fill:#e3f2fd
    style APILayer fill:#f3e5f5
    style Server fill:#fff3e0
    style Database fill:#e8f5e9
    style External fill:#fce4ec
```

---

## 6. DETAILED OFFER & NEGOTIATION FLOW

**Menunjukkan:** 13 tahapan proses tawar-menawar dengan detail API calls

```mermaid
graph LR
    Buyer["👤 Buyer"] -->|1. Browse & Select| Marketplace["Marketplace"]
    Marketplace -->|2. View Detail| ProdDetail["Product Detail<br/>Product A - Rp 500K"]
    
    ProdDetail -->|3. Click 'Tawar'| OfferForm["Offer Form"]
    OfferForm -->|4. Input Price<br/>& Message| OfferInput["Harga: Rp 400K<br/>Message: Nego?"]
    OfferInput -->|5. Submit| BuyerAPI["POST /api/offers"]
    
    BuyerAPI -->|Create Offer| DB1["DB: offers table<br/>status=pending"]
    DB1 -->|Notification| DB2["DB: notifications"]
    
    DB1 -->|6. Notify| SellerNotif["🔔 Notification"]
    SellerNotif -->|7. Click| Seller["👤 Seller"]
    
    Seller -->|8. View Offers| OfferList["Dashboard > Offers"]
    OfferList -->|9. See Pending| OfferDetail["Offer Detail<br/>Buyer: User123<br/>Price: Rp 400K<br/>Status: Pending"]
    
    OfferDetail -->|10a. Accept| AcceptAPI["PUT /api/offers<br/>status=accepted"]
    OfferDetail -->|10b. Reject| RejectAPI["PUT /api/offers<br/>status=rejected"]
    OfferDetail -->|10c. Counter| CounterAPI["PUT /api/offers<br/>counter_price=450K"]
    
    AcceptAPI -->|Update DB| DB3["DB: offers table<br/>status=accepted"]
    RejectAPI -->|Update DB| DB4["DB: offers table<br/>status=rejected"]
    CounterAPI -->|Update DB| DB5["DB: offers table<br/>status=countered<br/>counter_price=450K"]
    
    DB3 -->|Create Transaction| TransDB["DB: transactions<br/>status=accepted"]
    DB3 -->|Notify Buyer| BuyerNotif2["🔔 Offer Accepted!"]
    
    DB4 -->|Notify Buyer| BuyerNotif3["🔔 Offer Rejected"]
    
    DB5 -->|Notify Buyer| BuyerNotif4["🔔 Counter Offer<br/>Rp 450K"]
    BuyerNotif4 -->|11. Buyer Respond| OfferForm2["Accept/Reject<br/>Counter Offer"]
    OfferForm2 -->|Back to Accept/Reject| AcceptAPI
    
    BuyerNotif2 -->|12. Both Confirm| Meeting["Agree to Meet"]
    Meeting -->|13. Mark Complete| CompleteAPI["PUT /api/transactions<br/>status=completed"]
    CompleteAPI -->|Update DB| TransDB2["DB: transactions<br/>status=completed"]
    TransDB2 -->|Enable Review| ReviewFeature["Review Feature<br/>Available"]
    
    style Buyer fill:#bbdefb
    style Seller fill:#bbdefb
    style Marketplace fill:#c8e6c9
    style ProdDetail fill:#c8e6c9
    style OfferForm fill:#fff9c4
    style OfferList fill:#fff9c4
    style BuyerAPI fill:#ffe0b2
    style AcceptAPI fill:#ffe0b2
    style RejectAPI fill:#ffe0b2
    style CounterAPI fill:#ffe0b2
    style DB1 fill:#e1f5fe
    style DB2 fill:#e1f5fe
    style TransDB fill:#e1f5fe
    style TransDB2 fill:#e1f5fe
    style BuyerNotif2 fill:#f8bbd0
    style BuyerNotif3 fill:#f8bbd0
    style BuyerNotif4 fill:#f8bbd0
    style SellerNotif fill:#f8bbd0
    style ReviewFeature fill:#c8e6c9
```

---

## 📋 Cara Menggunakan Diagram Ini

### Option 1: Mermaid Live Editor (Online)
1. Buka [https://mermaid.live](https://mermaid.live)
2. Copy-paste kode mermaid dari section di atas
3. Klik "Render" untuk visualisasi
4. Download sebagai SVG atau PNG

### Option 2: VS Code Plugin
1. Install extension: "Markdown Preview Mermaid Support"
2. Buka file markdown ini
3. Tekan Ctrl+Shift+V untuk preview
4. Diagram akan otomatis di-render

### Option 3: GitHub
1. Push file ini ke GitHub repository
2. Diagram akan otomatis di-render di GitHub preview

### Option 4: Notion/Confluence
1. Copy diagram dari Mermaid Live sebagai image
2. Paste ke Notion/Confluence docs

---

## 📝 Ringkasan Diagram

| No | Diagram | Gunanya |
|----|---------|---------|
| 1 | Main Use Case | Overview semua 32 use case & relasi dengan aktor |
| 2 | Purchase Flow | Sequence lengkap browse → tawar → transaksi → review |
| 3 | Transaction State | Semua state transaksi dan transisi yang valid |
| 4 | Auth Flow | Detail login, token, interceptor, auto-logout |
| 5 | Architecture | Layer-based system: Client → API → Server → DB |
| 6 | Offer Flow | Detail 13 tahapan proses tawar-menawar |

---

**Last Updated:** April 24, 2026  
**File:** DIAGRAMS.md (persisten di workspace)
