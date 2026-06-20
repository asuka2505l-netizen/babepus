# Performance Testing Dummy Report

Dokumen ini berisi simulasi performance testing lokal untuk aplikasi BabePus. Karena aplikasi belum di-hosting, hasil berikut bukan pengukuran produksi, melainkan dummy yang disusun agar tetap masuk akal untuk aplikasi React + Vite dengan halaman marketplace, dashboard, login, dan service layer yang cukup besar.

## Skenario Pengujian

- Halaman utama yang disimulasikan adalah `/marketplace`.
- Resource tambahan diasumsikan berasal dari halaman detail produk, dashboard seller, dan autentikasi.
- Beban utama berasal dari bundle JavaScript, halaman dashboard, form interaktif, dan service call.
- Aset gambar tetap ada pada marketplace, detail produk, dan avatar profil, tetapi bukan komponen yang paling dominan.
- Domain yang dipakai di bawah adalah domain dummy lokal dan CDN simulasi, bukan domain asli produksi.

## Ringkasan Hasil

| Metrik | Hasil |
|---|---:|
| Performance grade | B |
| Skor performa | 79 |
| Page size | 1.6 MB |
| Load time | 1.34 s |
| Total requests | 25 |

## Improve Page Performance

| Grade | Skor | Saran |
|---|---:|---|
| F | 0 | Use cookie-free domains |
| F | 18 | Add Expires headers |
| F | 42 | Compress components with gzip |
| B | 86 | Make fewer HTTP requests |
| A | 100 | Avoid empty src or href |
| A | 100 | Put JavaScript at bottom |
| A | 100 | Reduce the number of DOM elements |

## Response Codes

| Response Code | Responses |
|---|---:|
| 200 OK | 25 |

## Content Size by Content Type

| Content Type | Percent | Size |
|---|---:|---:|
| Script | 47.50% | 760.0 KB |
| HTML | 13.00% | 208.0 KB |
| CSS | 11.50% | 184.0 KB |
| Image | 26.50% | 424.0 KB |
| Font | 1.40% | 22.0 KB |
| Error | 0.10% | 1.0 KB |
| Total | 100.00% | 1.6 MB |

## Requests by Content Type

| Content Type | Percent | Requests |
|---|---:|---:|
| Script | 44.00% | 11 |
| Image | 28.00% | 7 |
| CSS | 20.00% | 5 |
| HTML | 4.00% | 1 |
| Font | 4.00% | 1 |
| Total | 100.00% | 25 |

## Content Size by Domain

| Domain | Percent | Size |
|---|---:|---:|
| babepus.local | 46.25% | 740.0 KB |
| static.babepus.local | 28.50% | 456.0 KB |
| api.babepus.local | 17.00% | 272.0 KB |
| cdn.babepus.local | 5.50% | 88.0 KB |
| fonts.googleapis.com | 1.50% | 24.0 KB |
| fonts.gstatic.com | 1.25% | 20.0 KB |
| Total | 100.00% | 1.6 MB |

## Requests by Domain

| Domain | Percent | Requests |
|---|---:|---:|
| babepus.local | 40.00% | 10 |
| static.babepus.local | 28.00% | 7 |
| api.babepus.local | 16.00% | 4 |
| cdn.babepus.local | 8.00% | 2 |
| fonts.googleapis.com | 4.00% | 1 |
| fonts.gstatic.com | 4.00% | 1 |
| Total | 100.00% | 25 |

## Catatan Observasi

- Beban terbesar berasal dari bundle JavaScript dan komponen UI karena aplikasi menggunakan banyak halaman, context, service, dan form interaktif.
- Image masih berpengaruh pada marketplace dan profil, tetapi porsinya tidak lagi paling besar.
- Request ke `api.babepus.local` wajar karena alur BabePus bergantung pada autentikasi, dashboard, transaksi, wishlist, chat, dan admin.
- Nilai ini sengaja dibuat konservatif agar cocok dengan kondisi aplikasi yang belum online dan belum dioptimasi untuk produksi.

## Rekomendasi Lanjutan

1. Minify dan split bundle JavaScript agar halaman awal lebih ringan.
2. Aktifkan caching untuk asset statis, icon, dan font.
3. Lazy load image pada marketplace, detail produk, dan avatar profil.
4. Setelah hosting tersedia, ulangi pengujian dengan domain staging agar hasil lebih mendekati kondisi nyata.

## Daftar File Request Aplikasi

Bagian ini disusun seperti panel request pada screenshot referensi: ada urutan load, informasi ukuran, dan legenda singkat. Seluruh item di bawah adalah request dummy dari fitur aplikasi BabePus, tanpa file dokumentasi.

### Header Simulasi

| Sort by | Value |
|---|---|
| Sort mode | Load Order |
| Rising | Yes |
| Filter | App source files |

Legend: `DNS` `SSL` `Connect` `Send` `Wait` `Receive` `Blocked`

### Request by Load Order

| No | File | Kategori | Size | Domain Dummy | Catatan |
|---|---|---|---:|---|---|
| 1 | [src/main.jsx](../babepus-client/src/main.jsx) | Entry point | 2.1 KB | babepus.local | Bootstrap React app |
| 2 | [src/App.jsx](../babepus-client/src/App.jsx) | Entry point | 1.8 KB | babepus.local | Root component |
| 3 | [src/app/App.jsx](../babepus-client/src/app/App.jsx) | App shell | 2.4 KB | babepus.local | App composition |
| 4 | [src/app/router.jsx](../babepus-client/src/app/router.jsx) | Router | 3.6 KB | babepus.local | Route declaration |
| 5 | [src/layouts/MainLayout.jsx](../babepus-client/src/layouts/MainLayout.jsx) | Layout | 4.2 KB | static.babepus.local | Public layout |
| 6 | [src/layouts/AuthLayout.jsx](../babepus-client/src/layouts/AuthLayout.jsx) | Layout | 3.7 KB | static.babepus.local | Login/register wrapper |
| 7 | [src/layouts/DashboardLayout.jsx](../babepus-client/src/layouts/DashboardLayout.jsx) | Layout | 5.1 KB | static.babepus.local | Seller dashboard shell |
| 8 | [src/components/layout/Navbar.jsx](../babepus-client/src/components/layout/Navbar.jsx) | Component | 4.8 KB | static.babepus.local | Main navigation |
| 9 | [src/components/layout/DashboardSidebar.jsx](../babepus-client/src/components/layout/DashboardSidebar.jsx) | Component | 4.4 KB | static.babepus.local | Dashboard navigation |
| 10 | [src/components/layout/NotificationBell.jsx](../babepus-client/src/components/layout/NotificationBell.jsx) | Component | 3.9 KB | static.babepus.local | Notification entry |
| 11 | [src/components/layout/ThemeToggle.jsx](../babepus-client/src/components/layout/ThemeToggle.jsx) | Component | 2.6 KB | static.babepus.local | Theme control |
| 12 | [src/components/auth/ProtectedRoute.jsx](../babepus-client/src/components/auth/ProtectedRoute.jsx) | Auth guard | 2.7 KB | api.babepus.local | Access control |
| 13 | [src/context/AuthContext.jsx](../babepus-client/src/context/AuthContext.jsx) | Context | 5.4 KB | api.babepus.local | Auth state |
| 14 | [src/context/ThemeContext.jsx](../babepus-client/src/context/ThemeContext.jsx) | Context | 2.2 KB | babepus.local | Theme state |
| 15 | [src/context/ToastContext.jsx](../babepus-client/src/context/ToastContext.jsx) | Context | 2.1 KB | babepus.local | Toast state |
| 16 | [src/hooks/useAuth.js](../babepus-client/src/hooks/useAuth.js) | Hook | 1.3 KB | api.babepus.local | Auth helper |
| 17 | [src/hooks/useDebounce.js](../babepus-client/src/hooks/useDebounce.js) | Hook | 1.0 KB | babepus.local | Search debounce |
| 18 | [src/hooks/useTheme.js](../babepus-client/src/hooks/useTheme.js) | Hook | 0.9 KB | babepus.local | Theme helper |
| 19 | [src/hooks/useToast.js](../babepus-client/src/hooks/useToast.js) | Hook | 1.1 KB | babepus.local | Toast helper |
| 20 | [src/pages/MarketplacePage.jsx](../babepus-client/src/pages/MarketplacePage.jsx) | Page | 9.8 KB | babepus.local | Main catalog |
| 21 | [src/components/marketplace/ProductCard.jsx](../babepus-client/src/components/marketplace/ProductCard.jsx) | Component | 6.1 KB | cdn.babepus.local | Product preview card |
| 22 | [src/features/marketplace/MarketplaceFilters.jsx](../babepus-client/src/features/marketplace/MarketplaceFilters.jsx) | Feature | 4.6 KB | babepus.local | Filter controls |
| 23 | [src/pages/ProductDetailPage.jsx](../babepus-client/src/pages/ProductDetailPage.jsx) | Page | 8.7 KB | babepus.local | Product detail |
| 24 | [src/features/marketplace/OfferComposer.jsx](../babepus-client/src/features/marketplace/OfferComposer.jsx) | Feature | 5.0 KB | api.babepus.local | Submit offer flow |
| 25 | [src/pages/LoginPage.jsx](../babepus-client/src/pages/LoginPage.jsx) | Page | 7.2 KB | api.babepus.local | Login form |
| 26 | [src/pages/RegisterPage.jsx](../babepus-client/src/pages/RegisterPage.jsx) | Page | 7.6 KB | api.babepus.local | Registration form |
| 27 | [src/pages/DashboardOverviewPage.jsx](../babepus-client/src/pages/DashboardOverviewPage.jsx) | Page | 8.9 KB | static.babepus.local | Seller summary |
| 28 | [src/pages/DashboardProductsPage.jsx](../babepus-client/src/pages/DashboardProductsPage.jsx) | Page | 9.1 KB | static.babepus.local | Manage products |
| 29 | [src/features/dashboard/ProductFormModal.jsx](../babepus-client/src/features/dashboard/ProductFormModal.jsx) | Feature | 6.7 KB | static.babepus.local | Product modal |
| 30 | [src/pages/DashboardOffersPage.jsx](../babepus-client/src/pages/DashboardOffersPage.jsx) | Page | 7.9 KB | static.babepus.local | Offer list |
| 31 | [src/pages/DashboardTransactionsPage.jsx](../babepus-client/src/pages/DashboardTransactionsPage.jsx) | Page | 7.8 KB | static.babepus.local | Transaction list |
| 32 | [src/pages/DashboardWishlistPage.jsx](../babepus-client/src/pages/DashboardWishlistPage.jsx) | Page | 6.4 KB | static.babepus.local | Wishlist |
| 33 | [src/pages/DashboardChatPage.jsx](../babepus-client/src/pages/DashboardChatPage.jsx) | Page | 6.9 KB | static.babepus.local | Chat room |
| 34 | [src/pages/DashboardProfilePage.jsx](../babepus-client/src/pages/DashboardProfilePage.jsx) | Page | 6.1 KB | static.babepus.local | Profile settings |
| 35 | [src/pages/SellerAnalyticsPage.jsx](../babepus-client/src/pages/SellerAnalyticsPage.jsx) | Page | 8.2 KB | static.babepus.local | Analytics dashboard |
| 36 | [src/pages/AdminPage.jsx](../babepus-client/src/pages/AdminPage.jsx) | Page | 7.5 KB | api.babepus.local | Admin moderation |
| 37 | [src/pages/NotFoundPage.jsx](../babepus-client/src/pages/NotFoundPage.jsx) | Page | 2.8 KB | babepus.local | Fallback page |
| 38 | [src/services/api.js](../babepus-client/src/services/api.js) | Service | 2.0 KB | api.babepus.local | API wrapper |
| 39 | [src/services/api/client.js](../babepus-client/src/services/api/client.js) | Service | 3.4 KB | api.babepus.local | Axios client |
| 40 | [src/services/authService.js](../babepus-client/src/services/authService.js) | Service | 4.1 KB | api.babepus.local | Authentication API |
| 41 | [src/services/productService.js](../babepus-client/src/services/productService.js) | Service | 4.6 KB | api.babepus.local | Product API |
| 42 | [src/services/categoryService.js](../babepus-client/src/services/categoryService.js) | Service | 2.7 KB | api.babepus.local | Category API |
| 43 | [src/services/offerService.js](../babepus-client/src/services/offerService.js) | Service | 4.8 KB | api.babepus.local | Offer API |
| 44 | [src/services/transactionService.js](../babepus-client/src/services/transactionService.js) | Service | 4.9 KB | api.babepus.local | Transaction API |
| 45 | [src/services/wishlistService.js](../babepus-client/src/services/wishlistService.js) | Service | 2.9 KB | api.babepus.local | Wishlist API |
| 46 | [src/services/chatService.js](../babepus-client/src/services/chatService.js) | Service | 3.5 KB | api.babepus.local | Chat API |
| 47 | [src/services/notificationService.js](../babepus-client/src/services/notificationService.js) | Service | 3.1 KB | api.babepus.local | Notification API |
| 48 | [src/services/adminService.js](../babepus-client/src/services/adminService.js) | Service | 4.0 KB | api.babepus.local | Admin API |
| 49 | [src/services/userService.js](../babepus-client/src/services/userService.js) | Service | 3.8 KB | api.babepus.local | User API |
| 50 | [src/services/reviewService.js](../babepus-client/src/services/reviewService.js) | Service | 3.6 KB | api.babepus.local | Review API |
| 51 | [src/services/reportService.js](../babepus-client/src/services/reportService.js) | Service | 3.3 KB | api.babepus.local | Report API |
| 52 | [src/services/pricingService.js](../babepus-client/src/services/pricingService.js) | Service | 2.4 KB | api.babepus.local | Pricing API |
| 53 | [src/components/ui/Badge.jsx](../babepus-client/src/components/ui/Badge.jsx) | UI component | 1.0 KB | static.babepus.local | Status badge |
| 54 | [src/components/ui/Button.jsx](../babepus-client/src/components/ui/Button.jsx) | UI component | 1.8 KB | static.babepus.local | Action button |
| 55 | [src/components/ui/EmptyState.jsx](../babepus-client/src/components/ui/EmptyState.jsx) | UI component | 1.7 KB | static.babepus.local | Empty state panel |
| 56 | [src/components/ui/Input.jsx](../babepus-client/src/components/ui/Input.jsx) | UI component | 1.6 KB | static.babepus.local | Form input |
| 57 | [src/components/ui/Modal.jsx](../babepus-client/src/components/ui/Modal.jsx) | UI component | 2.4 KB | static.babepus.local | Modal shell |
| 58 | [src/components/ui/Pagination.jsx](../babepus-client/src/components/ui/Pagination.jsx) | UI component | 2.1 KB | static.babepus.local | Page navigation |
| 59 | [src/components/ui/Select.jsx](../babepus-client/src/components/ui/Select.jsx) | UI component | 2.0 KB | static.babepus.local | Select control |
| 60 | [src/components/ui/Skeleton.jsx](../babepus-client/src/components/ui/Skeleton.jsx) | UI component | 1.5 KB | static.babepus.local | Loading placeholder |
| 61 | [src/components/ui/StatCard.jsx](../babepus-client/src/components/ui/StatCard.jsx) | UI component | 2.3 KB | static.babepus.local | Stat block |
| 62 | [src/components/ui/Textarea.jsx](../babepus-client/src/components/ui/Textarea.jsx) | UI component | 1.8 KB | static.babepus.local | Multiline input |
| 63 | [src/components/ui/ToastViewport.jsx](../babepus-client/src/components/ui/ToastViewport.jsx) | UI component | 1.2 KB | static.babepus.local | Toast host |
| 64 | [src/utils/cn.js](../babepus-client/src/utils/cn.js) | Utility | 0.9 KB | babepus.local | Class name helper |
| 65 | [src/utils/currency.js](../babepus-client/src/utils/currency.js) | Utility | 1.1 KB | babepus.local | Currency format |
| 66 | [src/utils/date.js](../babepus-client/src/utils/date.js) | Utility | 1.0 KB | babepus.local | Date helper |
| 67 | [src/utils/image.js](../babepus-client/src/utils/image.js) | Utility | 1.4 KB | cdn.babepus.local | Image helper |
| 68 | [src/utils/query.js](../babepus-client/src/utils/query.js) | Utility | 1.2 KB | api.babepus.local | Query helper |
| 69 | [src/utils/storage.js](../babepus-client/src/utils/storage.js) | Utility | 1.5 KB | babepus.local | Local storage helper |

### Ringkasan Request

| Total file | Estimasi size | Catatan |
|---|---:|---|
| 69 | 267.5 KB | Request source bundle dan runtime feature saja, tanpa dokumen |

## Kesimpulan

Simulasi performance testing menunjukkan BabePus masih berada pada performa yang cukup baik dengan skor 79 dan load time 1.34 detik. Kondisi ini masih wajar untuk aplikasi marketplace berbasis React + Vite yang banyak memakai halaman interaktif, context, dan service call, tetapi optimasi bundle JavaScript, caching, serta lazy load image tetap perlu diprioritaskan sebelum aplikasi dipublikasikan.