# Software Requirements Specification (SRS)

## 1. Introduction

### 1.1 Purpose
This Software Requirements Specification (SRS) document defines the functional and non-functional requirements for the BabePus marketplace application. It establishes a shared understanding of system behavior and constraints for developers, quality assurance engineers, UI/UX designers, and project managers.

### 1.2 Scope
BabePus is a web-based marketplace application targeting university students and academic communities. The platform facilitates buying, selling, bargaining, and communicating around second-hand goods. Core system capabilities include user authentication, product listing management, bargaining workflow, transaction handling, messaging, wishlist management, notification delivery, user verification, and administrative monitoring.

### 1.3 Definitions, Acronyms, and Abbreviations
- API: Application Programming Interface
- CRUD: Create, Read, Update, Delete
- JWT: JSON Web Token
- UI: User Interface
- UX: User Experience
- SRS: Software Requirements Specification
- SLA: Service Level Agreement
- HTTP: Hypertext Transfer Protocol

### 1.4 Document Organization
This SRS is organized into the following sections:
- Section 2: Functional Requirements
- Section 3: Non-Functional Requirements
- Section 4: User Roles
- Section 5: Business Rules
- Section 6: Acceptance Criteria

## 2. Functional Requirements

### 2.1 User Authentication and Authorization
The system shall provide secure user authentication and role-based authorization.

| ID | Requirement | Description |
|---|---|---|
| FR-1 | User Registration | The system shall allow new users to register with a full name, email address, and password. |
| FR-2 | User Login | The system shall allow registered users to authenticate using email and password. |
| FR-3 | Token Issuance | Upon successful login, the system shall issue a JWT token to the client. |
| FR-4 | Protected Endpoints | Protected API endpoints shall require `Authorization: Bearer <token>`. |
| FR-5 | Profile Access | Authenticated users shall retrieve their own profile details. |
| FR-6 | Email Verification | Users shall request email verification and validate a verification token. |

### 2.2 Product Management
The product management module shall support listing lifecycle, search, and seller operations.

| ID | Requirement | Description |
|---|---|---|
| FR-7 | Create Product | Authenticated users shall create product listings with category, title, description, price, condition, and image. |
| FR-8 | Browse Products | Users shall browse available products. |
| FR-9 | Product Search | Users shall search and filter products by category, condition, price range, and keyword. |
| FR-10 | Product Details | Users shall view detailed product information. |
| FR-11 | Update Product | Sellers shall update product information. |
| FR-12 | Mark Sold | Sellers shall mark their product as sold. |
| FR-13 | Delete Product | Sellers shall remove their own products from the marketplace. |
| FR-14 | Seller Inventory | Sellers shall list and manage their own products. |

### 2.3 Offer and Transaction Management
The offer and transaction workflow shall support negotiation, acceptance, and transaction finalization.

| ID | Requirement | Description |
|---|---|---|
| FR-15 | Submit Offer | Authenticated users shall submit purchase offers for listed products. |
| FR-16 | Incoming Offers | Sellers shall review incoming offers on their products. |
| FR-17 | Accept/Reject Offer | Sellers shall accept or reject offers. |
| FR-18 | Transaction Creation | The system shall create a transaction record automatically when an offer is accepted. |
| FR-19 | Transaction History | Users shall view their transaction history. |
| FR-20 | Escrow Confirmation | Buyers and sellers shall confirm escrow-related milestones. |
| FR-21 | Escrow Dispute | Users shall raise escrow disputes when required. |

### 2.4 Messaging and Communication
The communication module shall enable buyer-seller conversations and real-time message delivery.

| ID | Requirement | Description |
|---|---|---|
| FR-22 | Start Conversation | Authenticated users shall initiate chat sessions based on product listings. |
| FR-23 | View Conversations | Users shall view their active conversations. |
| FR-24 | Send Message | Users shall send messages within a conversation thread. |
| FR-25 | Real-Time Messaging | The system shall stream messages using server-sent events or equivalent mechanism. |

### 2.5 Wishlist and Notifications
Wishlist and notification capabilities shall improve user engagement and awareness.

| ID | Requirement | Description |
|---|---|---|
| FR-26 | Add Wishlist | Authenticated users shall add products to a wishlist. |
| FR-27 | Remove Wishlist | Authenticated users shall remove products from the wishlist. |
| FR-28 | View Wishlist | Users shall view saved products in their wishlist. |
| FR-29 | Notification Delivery | The system shall notify users of relevant events, including received offers, transaction updates, and chat messages. |
| FR-30 | Mark Read | Users shall mark notifications as read. |
| FR-31 | Notification Streaming | Notifications shall be available through a streaming event endpoint. |

### 2.6 Review and Reporting
The review and reporting module shall support post-transaction feedback and abuse reporting.

| ID | Requirement | Description |
|---|---|---|
| FR-32 | Submit Review | Buyers shall submit reviews after transaction completion. |
| FR-33 | Submit Report | Users shall report products or sellers for violations. |
| FR-34 | Admin Review Reports | Administrators shall view reported items. |
| FR-35 | Update Report Status | Administrators shall update the status of reports. |

### 2.7 Administrative Management
Administrative functions shall support platform oversight and governance.

| ID | Requirement | Description |
|---|---|---|
| FR-36 | Admin Dashboard | Administrators shall view platform metrics and system health. |
| FR-37 | Manage Users | Administrators shall retrieve and manage user accounts. |
| FR-38 | Suspend Users | Administrators shall suspend or reinstate users. |
| FR-39 | Review Products | Administrators shall inspect product listings. |
| FR-40 | Review Reports | Administrators shall review and process user reports. |

## 3. Non-Functional Requirements

### 3.1 Performance
- NFR-1: Common API requests shall respond within two seconds under normal operating load.
- NFR-2: Listing endpoints shall support pagination, returning consistent metadata for page size and count.

### 3.2 Security
- NFR-3: All protected endpoints shall require JWT-based authentication.
- NFR-4: Passwords shall be securely hashed using an industry-standard hashing algorithm.
- NFR-5: File uploads shall only accept image content types and enforce maximum size limits.
- NFR-6: Personally identifiable information shall not be exposed to unauthorized users.

### 3.3 Reliability and Availability
- NFR-7: The API shall provide a health-check endpoint to validate service availability.
- NFR-8: The system shall return informative error responses when backend dependencies fail.

### 3.4 Scalability
- NFR-9: The architecture shall allow horizontal scaling of the API layer and database read replicas.
- NFR-10: Search queries shall use appropriate database indexes to maintain response time at scale.

### 3.5 Usability
- NFR-11: The user interface shall follow standard web usability patterns for marketplace workflows.
- NFR-12: Error messages shall be clear, actionable, and user-centric.

### 3.6 Maintainability
- NFR-13: The source code shall be modular, with clear separation between API, business logic, and data access layers.
- NFR-14: Configuration shall be externalized from code through environment variables.

## 4. User Roles

### 4.1 User Role Matrix

| Role | Permissions | Primary Responsibilities |
|---|---|---|
| Guest | Browse products, view categories, register, login | Discover listings, create account |
| Buyer | Offer products, chat, wishlist, transaction history, reviews, reports | Purchase items, negotiate offers, communicate with sellers |
| Seller | All Buyer permissions plus product management, incoming offer review, seller dashboard | List items for sale, manage listings, process offers |
| Admin | All Buyer permissions plus platform monitoring, user suspension, report management | Maintain marketplace integrity, resolve disputes, manage platform data |

### 4.2 Role Constraints
- Guests cannot access any protected resource or perform write operations.
- Buyers and Sellers must authenticate before executing transactions, messaging, or wishlist operations.
- Administrators require role validation before accessing administrative endpoints.

## 5. Business Rules

### 5.1 Data Validation and Consistency
- BR-1: Email addresses must be unique and comply with standard email format.
- BR-2: Passwords shall be at least eight characters in length.
- BR-3: Product listings shall require category, title, description, price, condition, and image.
- BR-4: Offers may only be submitted by authenticated users.
- BR-5: Sellers may not submit offers for their own products.

### 5.2 Transaction Lifecycle
- BR-6: Accepting an offer shall generate a transaction record automatically.
- BR-7: A product marked as sold shall become unavailable for new offers.
- BR-8: Buyer and seller confirmations are required for escrow progress.
- BR-9: Dispute escalation shall persist a record and notify administrators.

### 5.3 Review and Reporting Policy
- BR-10: Reviews shall only be permitted for completed transactions.
- BR-11: Reports shall reference either a product or a user as the target entity.
- BR-12: Administrators shall review and update report statuses promptly.

### 5.4 Access and Security Controls
- BR-13: Administrative functions are restricted to users with the admin role.
- BR-14: JWT tokens shall be validated for expiration and revocation status.
- BR-15: All data-modifying actions shall be enforced through authentication middleware.

## 6. Acceptance Criteria

### 6.1 Authentication
- AC-1: A valid user registration request results in account creation.
- AC-2: Successful login returns a valid JWT token.
- AC-3: Protected endpoints reject requests missing a valid authorization token.

### 6.2 Product Management
- AC-4: Authenticated users can create, update, delete, and mark products as sold.
- AC-5: Product listings are presented with pagination metadata.
- AC-6: Product search and filter functionality returns relevant results.

### 6.3 Offer and Transaction Flow
- AC-7: Buyers can submit offers and sellers can accept or reject them.
- AC-8: Accepting an offer creates a transaction automatically.
- AC-9: Users can retrieve transaction history with accurate statuses.

### 6.4 Communication and Notification
- AC-10: Users can initiate conversations and send messages.
- AC-11: Messages are persistently stored and retrievable by conversation.
- AC-12: Notifications appear in the notification list and can be marked read.

### 6.5 Review and Reporting
- AC-13: Buyers can provide reviews only after completed transactions.
- AC-14: Users can submit reports against products or users.
- AC-15: Administrators can update report statuses.

### 6.6 Administrative Capabilities
- AC-16: Administrators can access dashboard metrics.
- AC-17: Administrators can suspend and reinstate user accounts.
- AC-18: Administrators can view and manage products and reports.

### 6.7 Non-Functional Criteria
- AC-19: API responses for standard requests are returned in acceptable timeframes.
- AC-20: Paginated endpoints include `page`, `limit`, `total`, and `pageCount` metadata.
- AC-21: Confidential user information is excluded from public responses.

## 7. Stakeholders

- Developers: Implement feature requirements and ensure code quality.
- QA Engineers: Validate requirements with test cases and regression suites.
- UI/UX Designers: Ensure the interface supports marketplace workflows and accessibility.
- Project Managers: Monitor requirement fulfillment, timeline, and stakeholder alignment.

## 8. Assumptions and Constraints

- The system is assumed to operate on a modern web stack using React/Vite for frontend and Node.js/Express for backend.
- The application is designed for Indonesian academic community context but may support internationalization.
- File upload capability is constrained to image formats and defined maximum sizes.
- The system depends on a relational database supporting transactions and referential integrity.
