**LAPORAN WHITE BOX TESTING --- LOOP TESTING**

Aplikasi BABEPUS (Barang Bekas Puspita)

Stack: Node.js + Express.js + MySQL + React.js

Total Loop Diuji: 12 Struktur Perulangan dari 7 Modul

**1. Pendahuluan & Konsep Loop Testing**

Loop Testing adalah metode White Box Testing yang berfokus pada pengujian struktur perulangan dalam kode program. Tujuannya adalah memastikan bahwa setiap jenis loop --- baik yang dieksekusi nol kali, satu kali, maupun banyak kali --- menghasilkan output yang benar dan tidak menyebabkan infinite loop, off-by-one error, atau kerusakan data.

**1.1 Jenis Loop dalam Aplikasi BABEPUS**

| **Jenis Loop** | **Konstruksi** | **Jumlah** | **Lokasi Utama** |
|:---|:---|:---|:---|
| Infinite Loop + Break | while(true) { \... if(kondisi) return; } | 1 | productService --- generateUniqueSlug() |
| Array.map() | array.map(fn) --- transformasi setiap elemen | 10 | Semua service --- format data DB ke object JS |
| Array.filter() | array.filter(fn) --- seleksi berdasarkan predikat | 1 | notificationService --- hitung unread count |

**1.2 Strategi Pengujian Loop (Boundary Testing)**

Setiap loop diuji dengan skenario berikut untuk memastikan perilaku di semua kondisi batas:

| **Skenario** | **Deskripsi** | **Tujuan** |
|:---|:---|:---|
| 0 iterasi | Loop tidak berjalan sama sekali --- array kosong | Pastikan tidak ada error saat data kosong |
| 1 iterasi | Loop berjalan tepat 1 kali --- 1 elemen | Pastikan logika benar untuk kasus minimal |
| n iterasi (normal) | Loop berjalan n kali dalam kondisi normal | Pastikan transformasi benar untuk data biasa |
| n = batas maksimum | Loop berjalan hingga batas LIMIT query | Pastikan LIMIT dipatuhi dan data tidak over-load |
| n = melebihi batas | Input melebihi batas --- harus di-cap | Pastikan ada proteksi (LIMIT/Math.min) |
| Kondisi khusus per elemen | Nilai null, 0, string --- tipe tidak terduga | Pastikan konversi tipe (Number, Boolean) aman |

**2. Ringkasan Loop yang Diuji**

| **ID** | **Jenis Loop** | **Lokasi** | **Batas Iterasi** | **TC** |
|:---|:---|:---|:---|:---|
| L1 | Infinite Loop + Conditional Break | productService.js --- generateUniqueSlug(title, ignoredProductId) | Tidak ada batas iterasi eksplisit --- aman karena suffix terus meningkat (1, 2, 3\...) dan pasti akan menemukan slug unik | 5 |
| L2 | Array.map() --- Transformasi Data DB ke Object | adminService.js --- getUsers(query) | LIMIT 100 pada query --- maksimum 100 iterasi | 5 |
| L3 | Array.filter() --- Seleksi Elemen Berdasarkan Kondisi | notificationService.js --- getNotifications(userId) | Maksimum 50 iterasi (LIMIT 50 pada query) | 5 |
| L4 | Array.map() --- Transformasi dengan Logika Internal (isBuyer) | chatService.js --- getConversations(userId) | LIMIT 100 pada query | 5 |
| L5 | Array.map() --- Transformasi Pesan Chat | chatService.js --- getMessages(conversationId, userId) | LIMIT 200 pada query --- maks 200 pesan per percakapan | 5 |
| L6 | Array.map() --- Transformasi Produk dengan Type Casting | productService.js --- getProducts(query, currentUserId) | LIMIT dari getPagination --- default 12, maksimum 50 | 6 |
| L7 | Array.map() --- Transformasi Review dengan parseJsonArray | productService.js --- getProductById(productId, currentUserId) | LIMIT 10 pada query review --- maks 10 iterasi | 5 |
| L8 | Array.map() --- Transformasi Offer dengan Nested Object | offerService.js --- getIncomingOffers() & getMyOffers() | Tidak ada LIMIT eksplisit --- berpotensi besar jika user aktif | 5 |
| L9 | Array.map() --- Transformasi Transaksi dengan Logika canReview | transactionService.js --- getMyTransactions(userId) | Tidak ada LIMIT --- potensi besar untuk user aktif | 5 |
| L10 | Array.map() --- Transformasi Wishlist ke Objek Produk Lengkap | wishlistService.js --- getWishlist(userId) | Tidak ada LIMIT eksplisit pada query | 5 |
| L11 | Array.map() --- Normalisasi Error Validasi | validateRequest.js --- middleware validasi global | Sama dengan jumlah field dalam validator --- terbatas secara alami | 5 |
| L12 | Array.map() --- Normalisasi Tipe Data Analitik (Dua Loop Paralel) | userService.js --- getSellerAnalytics(userId) | topProducts: LIMIT 8 \| offerTrend: maks 30 baris (1 per hari) | 5 |

**3. Analisis Loop Testing per Struktur Perulangan**

**3.L1. L1 --- Infinite Loop + Conditional Break**

**Lokasi: productService.js --- generateUniqueSlug(title, ignoredProductId)**

*Konstruksi: while (true) { \... if (!rows.length) return; suffix++ }*

Deskripsi Loop:

Loop tak terbatas yang keluar saat slug unik ditemukan. Setiap iterasi menambahkan suffix angka pada candidate slug dan mengecek ketersediaannya di database.

| **Kondisi Keluar Loop** | **Kondisi Lanjut Iterasi** | **Batas Aman** |
|:---|:---|:---|
| rows.length === 0 → return candidate | rows.length \> 0 → suffix++, candidate = baseSlug-N, lanjut iterasi | Tidak ada batas iterasi eksplisit --- aman karena suffix terus meningkat (1, 2, 3\...) dan pasti akan menemukan slug unik |

Contoh Source Code Aktual:

> // productService.js --- generateUniqueSlug()\
> const baseSlug = slugify(title) \|\| \'produk\'; // e.g. \'laptop-asus\'\
> let candidate = baseSlug; // iterasi 1: \'laptop-asus\'\
> let suffix = 1;\
> \
> while (true) { // Loop tak terbatas\
> const params = \[candidate\];\
> let sql = \'SELECT id FROM products WHERE slug = ?\';\
> if (ignoredProductId) { // Branch dalam loop\
> sql += \' AND id \<\> ?\';\
> params.push(ignoredProductId);\
> }\
> sql += \' LIMIT 1\';\
> const \[rows\] = await pool.query(sql, params);\
> \
> if (!rows.length) return candidate; // EXIT: slug tersedia\
> \
> suffix += 1; // Increment suffix\
> candidate = \`\${baseSlug}-\${suffix}\`; // \'laptop-asus-2\', \'-3\', \...\
> }

Tabel Test Case Loop Testing:

| **ID TC** | **Skenario** | **Input / Kondisi Awal** | **Jumlah Iterasi** | **Kondisi Loop** | **Output / Expected** | **Status** |
|:---|:---|:---|:---|:---|:---|:---|
| TC-L1-1 | Iterasi 0 kali (slug langsung tersedia) | title=\'Laptop Asus\' --- slug \'laptop-asus\' belum ada di DB | 1 kali query, langsung return | rows.length=0 pada iterasi pertama | \'laptop-asus\' | Pass |
| TC-L1-2 | Iterasi 1 kali (suffix -2) | slug \'laptop-asus\' sudah ada, \'laptop-asus-2\' belum ada | 2 kali query | rows.length\>0 iterasi 1, rows.length=0 iterasi 2 | \'laptop-asus-2\' | Pass |
| TC-L1-3 | Iterasi N kali (suffix besar) | slug \'laptop-asus\', \'-2\', \'-3\', \'-4\' sudah ada, \'-5\' belum | 5 kali query | rows\>0 di 4 iterasi, rows=0 di iterasi ke-5 | \'laptop-asus-5\' | Pass |
| TC-L1-4 | Loop dengan ignoredProductId (update produk) | slug sudah ada tapi ID produk sama (produk yang sedang diedit) | 1 kali --- SQL tambah AND id \<\> ? | rows.length=0 karena produk sendiri dikecualikan | slug lama dikembalikan aman | Pass |
| TC-L1-5 | title kosong --- fallback \'produk\' | title=\'\' atau undefined → slugify menghasilkan \'\' → fallback \'produk\' | 1+ kali tergantung ketersediaan slug \'produk\' | baseSlug=\'produk\' atau \'produk-2\' dst | \'produk\' atau \'produk-N\' | Pass |

**3.L2. L2 --- Array.map() --- Transformasi Data DB ke Object**

**Lokasi: adminService.js --- getUsers(query)**

*Konstruksi: rows.map((row) =\> ({ \...row, ratingAverage: Number(\...), \... }))*

Deskripsi Loop:

Memetakan setiap baris hasil query database ke objek JavaScript dengan tipe data yang tepat. Number() dan Boolean() memastikan konversi tipe dari nilai MySQL (string/tinyint) ke tipe JavaScript yang benar.

| **Kondisi Keluar Loop** | **Kondisi Lanjut Iterasi** | **Batas Aman** |
|:---|:---|:---|
| Selesai setelah semua elemen rows diproses | Setiap elemen diproses satu per satu secara sinkron | LIMIT 100 pada query --- maksimum 100 iterasi |

Contoh Source Code Aktual:

> // adminService.js --- getUsers()\
> // Query dengan LIMIT 100 --- batas aman iterasi\
> const \[rows\] = await pool.query(\`SELECT \... LIMIT 100\`, params);\
> \
> return rows.map((row) =\> ({ // Loop: 0 sampai 100 iterasi\
> \...row, // Spread semua kolom\
> ratingAverage: Number(row.ratingAverage \|\| 0), // Cast ke number\
> ratingCount: Number(row.ratingCount \|\| 0), // Cast ke number\
> isSuspended: Boolean(row.isSuspended), // Cast ke boolean\
> productCount: Number(row.productCount \|\| 0), // Cast ke number\
> }));

Tabel Test Case Loop Testing:

| **ID TC** | **Skenario** | **Input / Kondisi Awal** | **Jumlah Iterasi** | **Kondisi Loop** | **Output / Expected** | **Status** |
|:---|:---|:---|:---|:---|:---|:---|
| TC-L2-1 | rows kosong (0 elemen) | Tidak ada user terdaftar / semua terfilter | 0 iterasi | rows.length = 0 | \[\] (array kosong) | Pass |
| TC-L2-2 | rows 1 elemen | 1 user ditemukan | 1 iterasi | rows.length = 1 | Array 1 objek user terformat | Pass |
| TC-L2-3 | rows banyak elemen (n \< 100) | 50 user ditemukan | 50 iterasi | rows.length = 50 | Array 50 objek user terformat | Pass |
| TC-L2-4 | rows mencapai batas LIMIT 100 | 101 user ada di DB --- LIMIT 100 pada query | 100 iterasi | rows.length = 100 | Array 100 objek user terformat | Pass |
| TC-L2-5 | ratingAverage = null dari DB | User baru belum ada rating (NULL di DB) | Per elemen | row.ratingAverage = null → Number(null\|\|0) = 0 | ratingAverage: 0 (bukan null/NaN) | Pass |

**3.L3. L3 --- Array.filter() --- Seleksi Elemen Berdasarkan Kondisi**

**Lokasi: notificationService.js --- getNotifications(userId)**

*Konstruksi: notifications.filter((notification) =\> !notification.readAt).length*

Deskripsi Loop:

Menghitung jumlah notifikasi yang belum dibaca (readAt = null) dari array yang sudah dimap. Filter berjalan atas setiap elemen dan menghasilkan subset array yang memenuhi predikat !readAt.

| **Kondisi Keluar Loop** | **Kondisi Lanjut Iterasi** | **Batas Aman** |
|:---|:---|:---|
| Semua elemen telah dievaluasi | Setiap elemen dievaluasi: jika !readAt = true maka masuk hasil filter | Maksimum 50 iterasi (LIMIT 50 pada query) |

Contoh Source Code Aktual:

> // notificationService.js --- getNotifications()\
> const \[rows\] = await pool.query(\
> \`SELECT \... FROM notifications WHERE user_id = ?\
> ORDER BY created_at DESC LIMIT 50\`,\
> \[userId\]\
> );\
> \
> const notifications = rows.map(formatNotification); // Loop 1: format\
> \
> // Loop 2: filter untuk hitung unread\
> const unreadCount = notifications.filter( // 0 sampai 50 iterasi\
> (notification) =\> !notification.readAt // Predikat: belum dibaca\
> ).length; // Ambil panjang hasil filter\
> \
> return { notifications, unreadCount };

Tabel Test Case Loop Testing:

| **ID TC** | **Skenario** | **Input / Kondisi Awal** | **Jumlah Iterasi** | **Kondisi Loop** | **Output / Expected** | **Status** |
|:---|:---|:---|:---|:---|:---|:---|
| TC-L3-1 | Semua notifikasi sudah dibaca | 50 notifikasi, semua readAt terisi | 50 iterasi filter, 0 lolos | !notification.readAt = false untuk semua | unreadCount = 0 | Pass |
| TC-L3-2 | Semua notifikasi belum dibaca | 50 notifikasi, semua readAt = null | 50 iterasi filter, 50 lolos | !notification.readAt = true untuk semua | unreadCount = 50 | Pass |
| TC-L3-3 | Sebagian belum dibaca | 50 notifikasi, 12 belum dibaca | 50 iterasi, 12 lolos filter | Mixed: ada readAt null dan terisi | unreadCount = 12 | Pass |
| TC-L3-4 | 0 notifikasi (array kosong) | User baru, belum ada notifikasi | 0 iterasi | notifications.length = 0 | unreadCount = 0, notifications = \[\] | Pass |
| TC-L3-5 | 1 notifikasi belum dibaca | 1 notifikasi, readAt = null | 1 iterasi, 1 lolos | !readAt = true | unreadCount = 1 | Pass |

**3.L4. L4 --- Array.map() --- Transformasi dengan Logika Internal (isBuyer)**

**Lokasi: chatService.js --- getConversations(userId)**

*Konstruksi: rows.map((row) =\> formatConversation(row, userId))*

Deskripsi Loop:

Memetakan setiap baris percakapan ke objek terformat. Setiap iterasi memanggil formatConversation yang di dalamnya berisi percabangan (isBuyer) untuk menentukan counterpart --- sehingga setiap elemen diproses dengan logika yang berbeda tergantung peran user.

| **Kondisi Keluar Loop** | **Kondisi Lanjut Iterasi** | **Batas Aman** |
|:---|:---|:---|
| Semua elemen rows diproses | Setiap baris percakapan diproses dengan fungsi yang sama | LIMIT 100 pada query |

Contoh Source Code Aktual:

> // chatService.js --- getConversations()\
> // Query LIMIT 100 conversations\
> const \[rows\] = await pool.query(\`SELECT \... LIMIT 100\`, \[\...\]);\
> \
> return rows.map((row) =\> formatConversation(row, userId));\
> // \^ Loop: 0-100 iterasi\
> \
> // formatConversation() --- dipanggil tiap iterasi\
> const formatConversation = (row, userId) =\> {\
> const isBuyer = row.buyerId === userId; // Branch dalam loop\
> return {\
> // \...\
> counterpart: isBuyer\
> ? { id: row.sellerId, role: \'seller\' } // isBuyer = true\
> : { id: row.buyerId, role: \'buyer\' } // isBuyer = false\
> };\
> };

Tabel Test Case Loop Testing:

| **ID TC** | **Skenario** | **Input / Kondisi Awal** | **Jumlah Iterasi** | **Kondisi Loop** | **Output / Expected** | **Status** |
|:---|:---|:---|:---|:---|:---|:---|
| TC-L4-1 | 0 percakapan | User belum memulai percakapan apapun | 0 iterasi | rows.length = 0 | \[\] (array kosong) | Pass |
| TC-L4-2 | User sebagai buyer di semua chat | User membeli dari 5 seller berbeda | 5 iterasi, isBuyer=true semua | row.buyerId === userId = true semua | 5 conversations, counterpart = seller | Pass |
| TC-L4-3 | User sebagai seller di semua chat | 5 buyer menghubungi user sebagai seller | 5 iterasi, isBuyer=false semua | row.buyerId !== userId = true semua | 5 conversations, counterpart = buyer | Pass |
| TC-L4-4 | User sebagai buyer DAN seller (mixed) | User punya 3 chat sebagai buyer, 2 chat sebagai seller | 5 iterasi, isBuyer bervariasi | 3 row: buyerId=userId, 2 row: buyerId≠userId | counterpart bervariasi per percakapan | Pass |
| TC-L4-5 | Maksimum 100 percakapan | User sangat aktif --- 100+ percakapan (query dibatasi LIMIT 100) | 100 iterasi | rows.length = 100 (batas query) | Array 100 conversations terformat | Pass |

**3.L5. L5 --- Array.map() --- Transformasi Pesan Chat**

**Lokasi: chatService.js --- getMessages(conversationId, userId)**

*Konstruksi: rows.map(formatMessage)*

Deskripsi Loop:

Memetakan setiap baris pesan dari database ke objek pesan terformat. Setiap iterasi memanggil formatMessage yang menyusun ulang nama kolom dari snake_case ke camelCase.

| **Kondisi Keluar Loop** | **Kondisi Lanjut Iterasi** | **Batas Aman** |
|:---|:---|:---|
| Semua elemen rows diproses | Setiap pesan diformat dengan fungsi yang sama | LIMIT 200 pada query --- maks 200 pesan per percakapan |

Contoh Source Code Aktual:

> // chatService.js --- getMessages()\
> // Sebelum map: tandai semua pesan sebagai terbaca\
> await pool.query(\
> \'UPDATE messages SET read_at = COALESCE(read_at, NOW())\
> WHERE conversation_id = ? AND sender_id \<\> ?\',\
> \[conversationId, userId\]\
> );\
> \
> const \[rows\] = await pool.query(\`SELECT \... LIMIT 200\`);\
> \
> return rows.map(formatMessage); // 0-200 iterasi\
> \
> // formatMessage() --- fungsi murni, tidak ada side effect\
> const formatMessage = (row) =\> ({\
> id: row.id,\
> conversationId: row.conversationId,\
> senderId: row.senderId,\
> body: row.body,\
> readAt: row.readAt,\
> createdAt: row.createdAt\
> });

Tabel Test Case Loop Testing:

| **ID TC** | **Skenario** | **Input / Kondisi Awal** | **Jumlah Iterasi** | **Kondisi Loop** | **Output / Expected** | **Status** |
|:---|:---|:---|:---|:---|:---|:---|
| TC-L5-1 | 0 pesan (percakapan baru) | Conversation baru dibuat tapi belum ada pesan | 0 iterasi | rows.length = 0 | \[\] (array kosong) | Pass |
| TC-L5-2 | 1 pesan | Percakapan dengan 1 pesan saja | 1 iterasi | rows.length = 1 | Array 1 objek pesan terformat | Pass |
| TC-L5-3 | Pesan dalam jumlah normal (n \< 200) | 50 pesan dalam percakapan | 50 iterasi | rows.length = 50 | Array 50 objek pesan terformat | Pass |
| TC-L5-4 | Percakapan mencapai batas LIMIT 200 | 250 pesan ada di DB --- LIMIT 200 | 200 iterasi (batas query) | rows.length = 200 | 200 pesan terbaru (ORDER BY created_at ASC) | Pass |
| TC-L5-5 | Pesan dengan readAt null (belum dibaca) | Pesan yang dikirim sebelum user membuka chat | Per elemen | row.readAt = null sebelum UPDATE COALESCE | readAt terisi NOW() setelah query UPDATE sebelum map | Pass |

**3.L6. L6 --- Array.map() --- Transformasi Produk dengan Type Casting**

**Lokasi: productService.js --- getProducts(query, currentUserId)**

*Konstruksi: rows.map(formatProduct)*

Deskripsi Loop:

Memetakan hasil query produk ke objek terformat. Fungsi formatProduct melakukan konversi tipe data (Number, Boolean) dan menyusun nested object (category, seller) dari kolom-kolom flat hasil JOIN.

| **Kondisi Keluar Loop** | **Kondisi Lanjut Iterasi** | **Batas Aman** |
|:---|:---|:---|
| Semua elemen rows diproses | Setiap baris produk diformat dengan fungsi yang sama | LIMIT dari getPagination --- default 12, maksimum 50 |

Contoh Source Code Aktual:

> // productService.js --- getProducts()\
> const { limit, offset, page } = getPagination(query);\
> // limit: default 12, max 50 --- batas iterasi map\
> \
> const \[rows\] = await pool.query(\
> \`SELECT p.\*, c.\*, u.\* \... LIMIT ? OFFSET ?\`,\
> \[\...params, limit, offset\]\
> );\
> \
> return {\
> products: rows.map(formatProduct), // 0-50 iterasi\
> meta: buildPaginationMeta({\...})\
> };\
> \
> // formatProduct() --- nested object dari flat JOIN result\
> const formatProduct = (row) =\> ({\
> price: Number(row.price), // MySQL DECIMAL → JS Number\
> isWishlisted: Boolean(row.isWishlisted), // MySQL 0/1 → JS boolean\
> category: { id: row.categoryId, name: row.categoryName },\
> seller: { id: row.sellerId, fullName: row.sellerName, \... }\
> });

Tabel Test Case Loop Testing:

| **ID TC** | **Skenario** | **Input / Kondisi Awal** | **Jumlah Iterasi** | **Kondisi Loop** | **Output / Expected** | **Status** |
|:---|:---|:---|:---|:---|:---|:---|
| TC-L6-1 | Tidak ada produk yang cocok | Pencarian dengan kata kunci yang tidak ada di DB | 0 iterasi | rows.length = 0 | { products: \[\], meta: { total: 0, totalPages: 1 } } | Pass |
| TC-L6-2 | 1 produk ditemukan | Pencarian spesifik, 1 produk cocok | 1 iterasi | rows.length = 1 | Array 1 produk terformat dengan nested category & seller | Pass |
| TC-L6-3 | Halaman pertama (default limit=12) | Tanpa parameter limit --- gunakan default | Maks 12 iterasi | rows.length = 12 (atau kurang jika total \< 12) | 12 produk terformat + meta pagination | Pass |
| TC-L6-4 | Limit custom 50 (maksimum) | query.limit = 50 --- batas maksimum | Maks 50 iterasi | rows.length ≤ 50 | Array ≤50 produk terformat | Pass |
| TC-L6-5 | Limit melebihi batas --- di-cap ke 50 | query.limit = 100 --- lebih dari batas | Maks 50 iterasi (Math.min cap) | getPagination: limit = Math.min(100, 50) = 50 | Maksimum 50 produk (tidak 100) | Pass |
| TC-L6-6 | isWishlisted null (tidak login) | currentUserId = null → subquery tidak ada, nilai hardcode 0 | Per elemen | row.isWishlisted = 0 → Boolean(0) = false | isWishlisted: false untuk semua produk | Pass |

**3.L7. L7 --- Array.map() --- Transformasi Review dengan parseJsonArray**

**Lokasi: productService.js --- getProductById(productId, currentUserId)**

*Konstruksi: reviews.map((review) =\> ({ \...review, tags: parseJsonArray(review.tags), isAnonymous: Boolean(\...) }))*

Deskripsi Loop:

Memetakan setiap review produk ke objek terformat. Setiap iterasi memanggil parseJsonArray untuk tags yang bisa berupa string JSON, array, atau null --- dan mengonversi isAnonymous dari MySQL tinyint ke Boolean JS.

| **Kondisi Keluar Loop** | **Kondisi Lanjut Iterasi** | **Batas Aman** |
|:---|:---|:---|
| Semua elemen reviews diproses | Setiap review diformat dengan konversi tipe | LIMIT 10 pada query review --- maks 10 iterasi |

Contoh Source Code Aktual:

> // productService.js --- getProductById()\
> const \[reviews\] = await pool.query(\
> \`SELECT r.\*, \... FROM reviews r \... LIMIT 10\`,\
> \[product.seller.id\]\
> );\
> \
> return {\
> \...product,\
> reviews: reviews.map((review) =\> ({ // 0-10 iterasi\
> \...review,\
> tags: parseJsonArray(review.tags), // null/string/array → array\
> isAnonymous: Boolean(review.isAnonymous) // 0/1 → false/true\
> }))\
> };\
> \
> // parseJsonArray dipanggil setiap iterasi --- 4 jalur internal:\
> // if (!value) return \[\] → tags null\
> // if (Array.isArray) return → sudah array\
> // JSON.parse berhasil → string JSON valid\
> // catch → return \[\] → string tidak valid

Tabel Test Case Loop Testing:

| **ID TC** | **Skenario** | **Input / Kondisi Awal** | **Jumlah Iterasi** | **Kondisi Loop** | **Output / Expected** | **Status** |
|:---|:---|:---|:---|:---|:---|:---|
| TC-L7-1 | 0 review (produk baru) | Produk belum pernah ada review | 0 iterasi | reviews.length = 0 | reviews: \[\] | Pass |
| TC-L7-2 | 1 review dengan tags null | Review tanpa memilih tag | 1 iterasi, parseJsonArray(null) → \[\] | review.tags = null | tags: \[\] | Pass |
| TC-L7-3 | Review dengan tags JSON string | tags = \'\[\"fast_response\",\"item_as_described\"\]\' (dari DB) | 1+ iterasi, JSON.parse berhasil | typeof tags === \'string\' → JSON.parse | tags: \[\'fast_response\', \'item_as_described\'\] | Pass |
| TC-L7-4 | Review anonim | review.isAnonymous = 1 (MySQL tinyint) | Per elemen | Boolean(1) = true | isAnonymous: true, reviewerName: \'Mahasiswa BabePus\' | Pass |
| TC-L7-5 | Maksimum 10 review (LIMIT 10) | Produk punya 50+ review di DB | 10 iterasi (batas LIMIT) | reviews.length = 10 | 10 review terbaru saja | Pass |

**3.L8. L8 --- Array.map() --- Transformasi Offer dengan Nested Object**

**Lokasi: offerService.js --- getIncomingOffers() & getMyOffers()**

*Konstruksi: rows.map(formatOffer)*

Deskripsi Loop:

Memetakan baris penawaran hasil JOIN (offers + products + users) ke objek terstruktur dengan nested object product, buyer, dan seller. Number() memastikan offerPrice adalah angka JavaScript.

| **Kondisi Keluar Loop** | **Kondisi Lanjut Iterasi** | **Batas Aman** |
|:---|:---|:---|
| Semua elemen rows diproses | Setiap baris offer diformat | Tidak ada LIMIT eksplisit --- berpotensi besar jika user aktif |

Contoh Source Code Aktual:

> // offerService.js --- getIncomingOffers() / getMyOffers()\
> const \[rows\] = await pool.query(\
> \`SELECT \${offerListSelect} FROM offers o\
> INNER JOIN products p \... INNER JOIN users buyer \...\
> WHERE o.seller_id = ? \-- atau buyer_id\
> ORDER BY \...\`\
> \[sellerId\]\
> );\
> \
> return rows.map(formatOffer); // 0-N iterasi (tanpa LIMIT!)\
> \
> // formatOffer() --- nested objects\
> const formatOffer = (row) =\> ({\
> offerPrice: Number(row.offerPrice), // Type cast\
> product: { id: row.productId, title: row.productTitle, \... },\
> buyer: { id: row.buyerId, fullName: row.buyerName, \... },\
> seller: { id: row.sellerId, fullName: row.sellerName, \... }\
> });

Tabel Test Case Loop Testing:

| **ID TC** | **Skenario** | **Input / Kondisi Awal** | **Jumlah Iterasi** | **Kondisi Loop** | **Output / Expected** | **Status** |
|:---|:---|:---|:---|:---|:---|:---|
| TC-L8-1 | 0 offer masuk/keluar | Seller belum menerima tawaran / buyer belum menawar | 0 iterasi | rows.length = 0 | \[\] | Pass |
| TC-L8-2 | 1 offer | 1 tawaran masuk/keluar | 1 iterasi | rows.length = 1 | Array 1 offer terformat dengan nested objects | Pass |
| TC-L8-3 | Banyak offer dengan status berbeda | 10 offer: 3 pending, 4 accepted, 3 rejected | 10 iterasi | rows.length = 10, status bervariasi | 10 offer terformat, status tetap terjaga | Pass |
| TC-L8-4 | offerPrice dari DB adalah string | MySQL mengembalikan DECIMAL sebagai string \'250000.00\' | Per elemen | Number(\'250000.00\') = 250000 | offerPrice: 250000 (Number, bukan string) | Pass |
| TC-L8-5 | User sangat aktif --- banyak offer (potensi performance) | Seller/buyer dengan 500+ offer | 500+ iterasi (tidak ada LIMIT) | rows.length tidak dibatasi | Array besar --- potensi lambat pada data besar | Warning ⚠ |

**3.L9. L9 --- Array.map() --- Transformasi Transaksi dengan Logika canReview**

**Lokasi: transactionService.js --- getMyTransactions(userId)**

*Konstruksi: rows.map((row) =\> formatTransaction(row, userId))*

Deskripsi Loop:

Memetakan baris transaksi ke objek terformat. Setiap iterasi menghitung myRole (buyer/seller) dan canReview (apakah user bisa memberi review) berdasarkan kondisi gabungan isBuyer, status, dan reviewId.

| **Kondisi Keluar Loop** | **Kondisi Lanjut Iterasi** | **Batas Aman** |
|:---|:---|:---|
| Semua elemen rows diproses | Setiap transaksi diformat dengan logika peran | Tidak ada LIMIT --- potensi besar untuk user aktif |

Contoh Source Code Aktual:

> // transactionService.js --- getMyTransactions()\
> const \[rows\] = await pool.query(\
> \`SELECT t.\*, p.\*, buyer.\*, seller.\*, r.id AS reviewId\
> FROM transactions t \... WHERE t.buyer_id = ? OR t.seller_id = ?\
> ORDER BY t.created_at DESC\`,\
> \[userId, userId\]\
> );\
> \
> return rows.map((row) =\> formatTransaction(row, userId));\
> \
> // formatTransaction() --- logika kompleks per iterasi\
> const formatTransaction = (row, currentUserId) =\> {\
> const isBuyer = row.buyerId === currentUserId; // Branch 1\
> return {\
> myRole: isBuyer ? \'buyer\' : \'seller\', // Branch 2 (ternary)\
> canReview: isBuyer // Branch 3 (compound)\
> && row.status === \'completed\'\
> && !row.reviewId,\
> counterpart: isBuyer // Branch 4 (ternary)\
> ? { id: row.sellerId, role: \'seller\' }\
> : { id: row.buyerId, role: \'buyer\' }\
> };\
> };

Tabel Test Case Loop Testing:

| **ID TC** | **Skenario** | **Input / Kondisi Awal** | **Jumlah Iterasi** | **Kondisi Loop** | **Output / Expected** | **Status** |
|:---|:---|:---|:---|:---|:---|:---|
| TC-L9-1 | 0 transaksi | User belum pernah bertransaksi | 0 iterasi | rows.length = 0 | \[\] | Pass |
| TC-L9-2 | User sebagai buyer, transaksi completed, belum review | 1 transaksi completed, reviewId = null, userId = buyerId | 1 iterasi | isBuyer=true, status=\'completed\', !reviewId=true | myRole:\'buyer\', canReview: true | Pass |
| TC-L9-3 | User sebagai buyer, sudah review | 1 transaksi completed, reviewId terisi | 1 iterasi | isBuyer=true, completed, reviewId ada | canReview: false (sudah review) | Pass |
| TC-L9-4 | User sebagai seller | 1 transaksi, userId = sellerId | 1 iterasi | isBuyer=false | myRole:\'seller\', canReview: false (seller tidak bisa review) | Pass |
| TC-L9-5 | Transaksi belum selesai (pending_meetup) | 1 transaksi status=\'pending_meetup\' | 1 iterasi | status !== \'completed\' | canReview: false (belum selesai) | Pass |

**3.L10. L10 --- Array.map() --- Transformasi Wishlist ke Objek Produk Lengkap**

**Lokasi: wishlistService.js --- getWishlist(userId)**

*Konstruksi: rows.map((row) =\> ({ id, title, price: Number(row.price), \..., seller: { \... } }))*

Deskripsi Loop:

Memetakan baris hasil JOIN wishlist + products + categories + users ke objek produk lengkap dengan seller info. isWishlisted selalu true karena query hanya ambil item yang ada di wishlist.

| **Kondisi Keluar Loop** | **Kondisi Lanjut Iterasi** | **Batas Aman** |
|:---|:---|:---|
| Semua elemen rows diproses | Setiap item wishlist diformat | Tidak ada LIMIT eksplisit pada query |

Contoh Source Code Aktual:

> // wishlistService.js --- getWishlist()\
> const \[rows\] = await pool.query(\
> \`SELECT p.\*, c.\*, u.\*, 1 AS isWishlisted \-- Hardcode 1\
> FROM wishlists w\
> INNER JOIN products p ON p.id = w.product_id\
> INNER JOIN categories c \... INNER JOIN users u \...\
> WHERE w.user_id = ? AND p.deleted_at IS NULL\
> ORDER BY w.created_at DESC\`,\
> \[userId\]\
> );\
> \
> return rows.map((row) =\> ({ // 0-N iterasi\
> price: Number(row.price),\
> isWishlisted: Boolean(row.isWishlisted), // Boolean(1) = true selalu\
> category: { id: row.categoryId, name: row.categoryName },\
> seller: {\
> ratingAverage: Number(row.sellerRatingAverage \|\| 0),\
> ratingCount: Number(row.sellerRatingCount \|\| 0),\
> }\
> }));

Tabel Test Case Loop Testing:

| **ID TC** | **Skenario** | **Input / Kondisi Awal** | **Jumlah Iterasi** | **Kondisi Loop** | **Output / Expected** | **Status** |
|:---|:---|:---|:---|:---|:---|:---|
| TC-L10-1 | Wishlist kosong | User belum mewishlist apapun | 0 iterasi | rows.length = 0 | \[\] | Pass |
| TC-L10-2 | 1 item di wishlist | User mewishlist 1 produk | 1 iterasi | rows.length = 1 | Array 1 produk terformat, isWishlisted: true | Pass |
| TC-L10-3 | Banyak item wishlist | User mewishlist 20 produk | 20 iterasi | rows.length = 20 | 20 produk terformat, semua isWishlisted: true | Pass |
| TC-L10-4 | Produk di wishlist sudah dihapus seller | Produk soft-deleted (deleted_at IS NOT NULL) | Produk tersebut tidak muncul | Query filter: p.deleted_at IS NULL → produk terhapus tidak masuk rows | Produk terhapus otomatis hilang dari wishlist response | Pass |
| TC-L10-5 | sellerRatingAverage null (seller baru) | Seller belum ada rating --- NULL di DB | Per elemen | Number(null \|\| 0) = 0 | ratingAverage: 0 (tidak NaN) | Pass |

**3.L11. L11 --- Array.map() --- Normalisasi Error Validasi**

**Lokasi: validateRequest.js --- middleware validasi global**

*Konstruksi: errors.array().map((error) =\> ({ field: error.path, message: error.msg }))*

Deskripsi Loop:

Memetakan array error dari express-validator ke format standar API ({field, message}). Loop ini hanya berjalan saat ada error validasi (jalur error path). Jumlah iterasi = jumlah field yang tidak valid.

| **Kondisi Keluar Loop** | **Kondisi Lanjut Iterasi** | **Batas Aman** |
|:---|:---|:---|
| Semua error diformat | Setiap error diformat dengan field + message | Sama dengan jumlah field dalam validator --- terbatas secara alami |

Contoh Source Code Aktual:

> // validateRequest.js --- middleware\
> const validateRequest = (req, \_res, next) =\> {\
> const errors = validationResult(req);\
> \
> if (!errors.isEmpty()) { // Hanya jika ada error\
> return next(new ApiError(\
> 422,\
> \'Input tidak valid.\',\
> errors.array().map((error) =\> ({ // Loop: 0-N iterasi\
> field: error.path, // Nama field yang error\
> message: error.msg // Pesan error\
> }))\
> ));\
> }\
> \
> return next(); // Tidak ada error → lanjut ke controller\
> };

Tabel Test Case Loop Testing:

| **ID TC** | **Skenario** | **Input / Kondisi Awal** | **Jumlah Iterasi** | **Kondisi Loop** | **Output / Expected** | **Status** |
|:---|:---|:---|:---|:---|:---|:---|
| TC-L11-1 | Semua input valid --- loop tidak berjalan | Request dengan semua field valid sesuai validator | 0 iterasi (errors.isEmpty() = true) | errors.array().length = 0 --- map tidak dipanggil | next() dipanggil tanpa error | Pass |
| TC-L11-2 | 1 field tidak valid | Login: email kosong, password diisi | 1 iterasi | errors.array().length = 1 | \[{ field: \'email\', message: \'Email wajib diisi.\' }\] | Pass |
| TC-L11-3 | Semua field wajib kosong | Register: fullName, email, password, campus kosong semua | 4+ iterasi (per field wajib) | errors.array().length = 4 | Array 4 error objects dengan field & message | Pass |
| TC-L11-4 | Format tidak valid | email=\'bukan-email\', password=\'123\' (kurang dari 8 char) | 2 iterasi | errors.array().length = 2 | \[{field:\'email\',\...},{field:\'password\',\...}\] | Pass |
| TC-L11-5 | ID bukan integer (param validator) | GET /products/abc (bukan angka) | 1 iterasi | idParam(\'id\') validator gagal | \[{ field: \'id\', message: \'ID harus berupa bilangan bulat positif.\' }\] | Pass |

**3.L12. L12 --- Array.map() --- Normalisasi Tipe Data Analitik (Dua Loop Paralel)**

**Lokasi: userService.js --- getSellerAnalytics(userId)**

*Konstruksi: topProducts.map(p=\>({\...p,price:Number(\...)})) dan funnel.map(item=\>({\...}))*

Deskripsi Loop:

Dua loop map yang berjalan secara berurutan untuk menormalisasi tipe data hasil analitik penjual. Loop pertama untuk topProducts (maks 8 item), loop kedua untuk offerTrend (data 30 hari terakhir).

| **Kondisi Keluar Loop** | **Kondisi Lanjut Iterasi** | **Batas Aman** |
|:---|:---|:---|
| Semua elemen masing-masing array diproses | Setiap elemen dikonversi Number() | topProducts: LIMIT 8 \| offerTrend: maks 30 baris (1 per hari) |

Contoh Source Code Aktual:

> // userService.js --- getSellerAnalytics()\
> // Loop 1: topProducts --- maks 8 iterasi (LIMIT 8)\
> topProducts: topProducts.map((product) =\> ({\
> \...product,\
> price: Number(product.price \|\| 0),\
> viewCount: Number(product.viewCount \|\| 0),\
> wishlistCount: Number(product.wishlistCount \|\| 0),\
> offerCount: Number(product.offerCount \|\| 0)\
> })),\
> \
> // Loop 2: offerTrend --- maks 30 iterasi (30 hari)\
> offerTrend: funnel.map((item) =\> ({\
> date: item.date,\
> offers: Number(item.offers \|\| 0) // Konversi ke Number\
> }))

Tabel Test Case Loop Testing:

| **ID TC** | **Skenario** | **Input / Kondisi Awal** | **Jumlah Iterasi** | **Kondisi Loop** | **Output / Expected** | **Status** |
|:---|:---|:---|:---|:---|:---|:---|
| TC-L12-1 | Seller baru --- 0 produk dan 0 offer | Seller baru mendaftar, belum ada produk/offer | Loop1: 0 iterasi \| Loop2: 0 iterasi | topProducts.length=0, funnel.length=0 | topProducts:\[\], offerTrend:\[\] | Pass |
| TC-L12-2 | topProducts normal (\< 8 produk) | Seller punya 5 produk | Loop1: 5 iterasi \| Loop2: variasi | topProducts.length = 5 | Array 5 produk terformat | Pass |
| TC-L12-3 | topProducts mencapai batas LIMIT 8 | Seller punya 20 produk aktif | Loop1: 8 iterasi (batas LIMIT 8) | topProducts.length = 8 | 8 produk terpopuler saja | Pass |
| TC-L12-4 | offerTrend 30 hari penuh aktif | Seller menerima offer setiap hari selama 30 hari | Loop2: 30 iterasi | funnel.length = 30 | 30 data point trend offer | Pass |
| TC-L12-5 | offerTrend hari tanpa offer (tidak muncul) | Offer hanya 15 hari dari 30 hari terakhir | Loop2: 15 iterasi | GROUP BY DATE hanya menghasilkan hari yang ada offer | 15 data point (hari tanpa offer tidak ada di hasil) | Pass |

**4. Temuan & Catatan Penting dari Loop Testing**

| **No** | **Temuan** | **Loop** | **Kategori** | **Rekomendasi** |
|:---|:---|:---|:---|:---|
| 1 | while(true) di generateUniqueSlug tidak memiliki batas iterasi maksimum eksplisit | L1 (while) | Perhatian | Aman secara logika karena suffix terus meningkat, tapi tambahkan batas (misal: maks 100 iterasi) untuk mencegah infinite loop jika terjadi bug DB |
| 2 | getIncomingOffers() dan getMyOffers() tidak memiliki LIMIT query | L8 (map offers) | Perhatian | Tambahkan LIMIT (misal: 100) pada query untuk mencegah response besar jika user sangat aktif |
| 3 | getMyTransactions() tidak memiliki LIMIT query | L9 (map transaksi) | Perhatian | Tambahkan LIMIT dan paginasi untuk user dengan banyak transaksi |
| 4 | getWishlist() tidak memiliki LIMIT query | L10 (map wishlist) | Minor | Tambahkan LIMIT untuk konsistensi dengan endpoint lain |
| 5 | Semua .map() dengan Number() dan Boolean() sudah aman terhadap nilai null dari DB | L2-L12 | Positif | Pertahankan pattern \|\| 0 dan Boolean() untuk konversi tipe yang aman |
| 6 | LIMIT pada query menjadi batas alami semua map() --- tidak perlu guard tambahan | L2,L4,L5,L6,L7 | Positif | Query LIMIT adalah pola yang tepat untuk mengontrol ukuran loop .map() |
| 7 | filter() di getNotifications efisien karena data sudah dibatasi LIMIT 50 | L3 | Positif | LIMIT 50 memastikan filter berjalan maksimum 50 iterasi saja |

**5. Kesimpulan Loop Testing**

**5.1 Ringkasan Hasil**

| **Metrik** | **Nilai** |
|:---|:---|
| Total struktur loop yang diuji | 12 loop (1 while, 10 map, 1 filter) |
| Total test case yang dibuat | 61 test case |
| Test case Pass | 60 test case |
| Test case Warning (perlu perhatian) | 1 test case (L8: getIncomingOffers tanpa LIMIT) |
| Loop dengan batas aman (LIMIT query / Math.min) | 9 dari 12 loop (75%) |
| Loop tanpa batas eksplisit | 3 loop: L8 (offers), L9 (transactions), L10 (wishlist) |
| Potensi infinite loop ditemukan | Tidak ada --- while(true) dijamin keluar oleh logika suffix |
| Off-by-one error ditemukan | Tidak ada --- LIMIT dan getPagination menangani batas iterasi |

**5.2 Kesimpulan Akhir**

1.  Sebanyak 12 struktur perulangan dari 7 modul service aplikasi BABEPUS berhasil diidentifikasi dan diuji menggunakan metode Loop Testing dengan pendekatan boundary testing (0 iterasi, 1 iterasi, n iterasi, dan batas maksimum).

2.  Total 61 test case berhasil dibuat dan dieksekusi secara analitis --- mencakup kondisi array kosong, 1 elemen, n elemen normal, elemen mencapai batas LIMIT, dan kondisi nilai null/tipe tidak terduga.

3.  Satu-satunya struktur while(true) pada generateUniqueSlug() terbukti aman secara logika karena suffix integer yang terus bertambah menjamin terminasi loop, namun disarankan menambahkan batas iterasi maksimum sebagai pengaman.

4.  Tiga loop .map() pada getIncomingOffers(), getMyTransactions(), dan getWishlist() tidak memiliki LIMIT query --- disarankan menambahkan LIMIT dan paginasi untuk mencegah response payload yang besar pada user aktif.

5.  Pola Number(value \|\| 0) dan Boolean(value) yang digunakan secara konsisten di semua .map() memastikan keamanan konversi tipe data dari MySQL ke JavaScript, mencegah nilai NaN, null, atau undefined pada response API.
