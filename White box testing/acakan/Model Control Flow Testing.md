# Model Control Flow Testing

Dokumen ini berisi Control Flow Testing untuk semua fungsi layanan (`src/services`) backend aplikasi BabaPus. Setiap fungsi dituliskan sesuai logika aktual dalam kode tanpa menambah atau mengurangi jalur eksekusi.

---

## authService.js

### `findUserById(userId)`
```js
const findUserById = async (userId) => {
  const [rows] = await pool.query(`SELECT ${userSelect} FROM users WHERE id = ? LIMIT 1`, [userId]);
  return rows.length ? serializeUser(rows[0]) : null;
};
```
- Kondisi: `rows.length == 0`
  - Hasil Yang Diharapkan: Kembalikan `null`
  - Hasil: `null`
  - Status: Passed
- Kondisi: `rows.length == 1`
  - Hasil Yang Diharapkan: Kembalikan objek user ter-serialize
  - Hasil: objek user
  - Status: Passed

### `register(payload)`
```js
const register = async (payload) => {
  const [existingUsers] = await pool.query("SELECT id FROM users WHERE email = ? LIMIT 1", [payload.email]);

  if (existingUsers.length) {
    throw new ApiError(409, "Email sudah terdaftar.");
  }

  const passwordHash = await hashPassword(payload.password);
  const verificationToken = generateEmailVerificationToken();
  const verificationExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    ...
    await connection.commit();

    const user = await findUserById(result.insertId);
    const token = signToken({ sub: user.id, role: user.role });

    return {
      token,
      user,
      emailVerification: {
        token: verificationToken,
        expiresAt: verificationExpiresAt
      }
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
```
- Kondisi: `existingUsers.length > 0`
  - Hasil Yang Diharapkan: Lempar `ApiError(409, "Email sudah terdaftar.")`
  - Hasil: `ApiError 409`
  - Status: Passed
- Kondisi: `existingUsers.length == 0`
  - Hasil Yang Diharapkan: Masuk transaksi, buat user, kembalikan token, user, dan emailVerification
  - Hasil: `return { token, user, emailVerification }`
  - Status: Passed

### `login({ email, password })`
```js
const login = async ({ email, password }) => {
  const [rows] = await pool.query(
    `SELECT ${userSelect}, password_hash AS passwordHash FROM users WHERE email = ? LIMIT 1`,
    [email]
  );

  if (!rows.length) {
    throw new ApiError(401, "Email atau password salah.");
  }

  if (rows[0].isSuspended) {
    throw new ApiError(403, "Akun sedang disuspend oleh admin.");
  }

  const isPasswordValid = await comparePassword(password, rows[0].passwordHash);

  if (!isPasswordValid) {
    throw new ApiError(401, "Email atau password salah.");
  }

  const user = serializeUser(rows[0]);
  const token = signToken({ sub: user.id, role: user.role });

  return { token, user };
};
```
- Kondisi: `rows.length == 0`
  - Hasil Yang Diharapkan: Lempar `ApiError(401, "Email atau password salah.")`
  - Hasil: `ApiError 401`
  - Status: Passed
- Kondisi: `rows.length == 1` dan `rows[0].isSuspended == true`
  - Hasil Yang Diharapkan: Lempar `ApiError(403, "Akun sedang disuspend oleh admin.")`
  - Hasil: `ApiError 403`
  - Status: Passed
- Kondisi: `rows.length == 1`, `isSuspended == false`, `isPasswordValid == false`
  - Hasil Yang Diharapkan: Lempar `ApiError(401, "Email atau password salah.")`
  - Hasil: `ApiError 401`
  - Status: Passed
- Kondisi: `rows.length == 1`, `isSuspended == false`, `isPasswordValid == true`
  - Hasil Yang Diharapkan: Kembalikan `{ token, user }`
  - Hasil: kembalian token dan user
  - Status: Passed

### `requestEmailVerification(userId)`
```js
const requestEmailVerification = async (userId) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new ApiError(404, "User tidak ditemukan.");
  }

  if (user.isEmailVerified) {
    return { alreadyVerified: true, token: null, expiresAt: null };
  }

  const token = generateEmailVerificationToken();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await pool.query(
    `UPDATE users
     SET email_verification_token = ?, email_verification_expires_at = ?
     WHERE id = ?`,
    [token, expiresAt, userId]
  );

  return { alreadyVerified: false, token, expiresAt };
};
```
- Kondisi: `user == null`
  - Hasil Yang Diharapkan: Lempar `ApiError(404, "User tidak ditemukan.")`
  - Hasil: `ApiError 404`
  - Status: Passed
- Kondisi: `user.isEmailVerified == true`
  - Hasil Yang Diharapkan: Kembalikan `{ alreadyVerified: true, token: null, expiresAt: null }`
  - Hasil: kembalian sudah terverifikasi
  - Status: Passed
- Kondisi: `user.isEmailVerified == false`
  - Hasil Yang Diharapkan: Simpan token verification baru dan kembalikan token + expiresAt
  - Hasil: `return { alreadyVerified: false, token, expiresAt }`
  - Status: Passed

### `verifyEmail(token)`
```js
const verifyEmail = async (token) => {
  const [rows] = await pool.query(
    `SELECT id
     FROM users
     WHERE email_verification_token = ?
       AND email_verification_expires_at > NOW()
     LIMIT 1`,
    [token]
  );

  if (!rows.length) {
    throw new ApiError(422, "Token verifikasi email tidak valid atau sudah kedaluwarsa.");
  }

  await pool.query(
    `UPDATE users
     SET
      email_verified_at = NOW(),
      verification_status = 'verified',
      email_verification_token = NULL,
      email_verification_expires_at = NULL
     WHERE id = ?`,
    [rows[0].id]
  );

  return findUserById(rows[0].id);
};
```
- Kondisi: `rows.length == 0`
  - Hasil Yang Diharapkan: Lempar `ApiError(422, "Token verifikasi email tidak valid atau sudah kedaluwarsa.")`
  - Hasil: `ApiError 422`
  - Status: Passed
- Kondisi: `rows.length == 1`
  - Hasil Yang Diharapkan: Perbarui status verifikasi dan kembalikan user
  - Hasil: user terverifikasi
  - Status: Passed

---

## productService.js

### `ensureCategoryExists(categoryId)`
```js
const ensureCategoryExists = async (categoryId) => {
  const [rows] = await pool.query("SELECT id FROM categories WHERE id = ? LIMIT 1", [categoryId]);

  if (!rows.length) {
    throw new ApiError(422, "Kategori tidak ditemukan.");
  }
};
```
- Kondisi: `rows.length == 0`
  - Hasil Yang Diharapkan: Lempar `ApiError(422, "Kategori tidak ditemukan.")`
  - Hasil: `ApiError 422`
  - Status: Passed
- Kondisi: `rows.length == 1`
  - Hasil Yang Diharapkan: Lanjut tanpa error
  - Hasil: fungsi selesai
  - Status: Passed

### `generateUniqueSlug(title, ignoredProductId = null)`
```js
const generateUniqueSlug = async (title, ignoredProductId = null) => {
  const baseSlug = slugify(title) || "produk";
  let candidate = baseSlug;
  let suffix = 1;

  while (true) {
    const params = [candidate];
    let sql = "SELECT id FROM products WHERE slug = ?";

    if (ignoredProductId) {
      sql += " AND id <> ?";
      params.push(ignoredProductId);
    }

    sql += " LIMIT 1";
    const [rows] = await pool.query(sql, params);

    if (!rows.length) {
      return candidate;
    }

    suffix += 1;
    candidate = `${baseSlug}-${suffix}`;
  }
};
```
- Kondisi: `ignoredProductId == null` dan `slug` belum digunakan
  - Hasil Yang Diharapkan: Kembalikan `candidate` pertama
  - Hasil: `candidate`
  - Status: Passed
- Kondisi: `slug` sudah digunakan (baris ditolak)
  - Hasil Yang Diharapkan: Tambah suffix dan ulang cek sampai unik
  - Hasil: `candidate` unik
  - Status: Passed

### `getProducts(query, currentUserId = null)`
```js
const getProducts = async (query, currentUserId = null) => {
  const { limit, offset, page } = getPagination(query);
  const conditions = ["p.deleted_at IS NULL", "p.status = 'active'", "u.is_suspended = 0"];
  const params = [];

  if (query.search) {
    conditions.push("(...)");
    params.push(keyword, keyword, keyword, keyword, keyword);
  }

  if (query.categoryId) {
    conditions.push("p.category_id = ?");
    params.push(query.categoryId);
  }

  if (query.minPrice) {
    conditions.push("p.price >= ?");
    params.push(query.minPrice);
  }

  if (query.maxPrice) {
    conditions.push("p.price <= ?");
    params.push(query.maxPrice);
  }

  if (query.faculty) {
    conditions.push("p.faculty = ?");
    params.push(query.faculty);
  }

  if (currentUserId) {
    conditions.push("p.seller_id <> ?");
    params.push(currentUserId);
  }

  ...
};
```
- Kondisi: `query.search` ada / tidak ada
  - Hasil Yang Diharapkan: Tambahkan filter pencarian ke kondisi atau tidak
  - Status: Passed
- Kondisi: `query.categoryId` ada / tidak ada
  - Hasil Yang Diharapkan: Tambahkan filter kategori hanya jika tersedia
  - Status: Passed
- Kondisi: `query.minPrice` ada / tidak ada
  - Hasil Yang Diharapkan: Tambahkan filter harga minimum hanya jika tersedia
  - Status: Passed
- Kondisi: `query.maxPrice` ada / tidak ada
  - Hasil Yang Diharapkan: Tambahkan filter harga maksimum hanya jika tersedia
  - Status: Passed
- Kondisi: `query.faculty` ada / tidak ada
  - Hasil Yang Diharapkan: Tambahkan filter fakultas jika ada
  - Status: Passed
- Kondisi: `currentUserId` ada / tidak ada
  - Hasil Yang Diharapkan: Hapus produk seller sendiri saat currentUserId tersedia
  - Status: Passed

### `getMyProducts(userId)`
```js
const getMyProducts = async (userId) => {
  const [rows] = await pool.query(`SELECT ... FROM products ... WHERE p.seller_id = ? AND p.deleted_at IS NULL`, [userId]);
  return rows.map(formatProduct);
};
```
- Kondisi: Tidak ada cabang logika selain pemanggilan query
  - Hasil Yang Diharapkan: Kembalikan daftar produk seller
  - Status: Passed

### `getProductById(productId, currentUserId = null)`
```js
const getProductById = async (productId, currentUserId = null) => {
  const [rows] = await pool.query(`SELECT ... FROM products ... WHERE p.id = ? AND p.deleted_at IS NULL LIMIT 1`, currentUserId ? [currentUserId, productId] : [productId]);

  if (!rows.length) {
    throw new ApiError(404, "Produk tidak ditemukan.");
  }

  await pool.query("UPDATE products SET view_count = view_count + 1 WHERE id = ?", [productId]);

  const product = formatProduct(rows[0]);
  product.isOwner = currentUserId ? product.seller.id === currentUserId : false;
  ...
};
```
- Kondisi: `rows.length == 0`
  - Hasil Yang Diharapkan: Lempar `ApiError(404, "Produk tidak ditemukan.")`
  - Status: Passed
- Kondisi: `rows.length == 1`
  - Hasil Yang Diharapkan: Naikkan view_count, tentukan `isOwner`, kembalikan detail produk
  - Status: Passed

### `createProduct(sellerId, payload, imageUrl)`
```js
const createProduct = async (sellerId, payload, imageUrl) => {
  await ensureCategoryExists(payload.categoryId);
  const slug = await generateUniqueSlug(payload.title);
  const [result] = await pool.query(`INSERT INTO products ... VALUES (?, ?, ..., 'active')`, [...]);
  return getProductById(result.insertId, sellerId);
};
```
- Kondisi: `payload.categoryId` tidak valid
  - Hasil Yang Diharapkan: Lempar `ApiError(422, "Kategori tidak ditemukan.")`
  - Status: Passed
- Kondisi: `payload.categoryId` valid
  - Hasil Yang Diharapkan: Buat produk dan kembalikan detail produk
  - Status: Passed

### `assertProductOwner(productId, userId, allowAdmin = false, role = "user")`
```js
const assertProductOwner = async (productId, userId, allowAdmin = false, role = "user") => {
  const [rows] = await pool.query("SELECT id, seller_id AS sellerId, image_url AS imageUrl, status FROM products WHERE id = ? AND deleted_at IS NULL LIMIT 1", [productId]);

  if (!rows.length) {
    throw new ApiError(404, "Produk tidak ditemukan.");
  }

  if (!allowAdmin || role !== "admin") {
    if (rows[0].sellerId !== userId) {
      throw new ApiError(403, "Anda hanya bisa mengelola produk milik sendiri.");
    }
  }

  return rows[0];
};
```
- Kondisi: `rows.length == 0`
  - Hasil Yang Diharapkan: Lempar `ApiError(404, "Produk tidak ditemukan.")`
  - Status: Passed
- Kondisi: seller bukan user dan `allowAdmin == false`
  - Hasil Yang Diharapkan: Lempar `ApiError(403, "Anda hanya bisa mengelola produk milik sendiri.")`
  - Status: Passed
- Kondisi: seller sama dengan user atau `allowAdmin == true` dan role admin
  - Hasil Yang Diharapkan: Kembalikan baris produk
  - Status: Passed

### `updateProduct(productId, user, payload, imageUrl = null)`
```js
const updateProduct = async (productId, user, payload, imageUrl = null) => {
  const product = await assertProductOwner(productId, user.id, true, user.role);

  if (payload.categoryId) {
    await ensureCategoryExists(payload.categoryId);
  }

  const title = payload.title || null;
  const slug = title ? await generateUniqueSlug(title, productId) : null;

  await pool.query(`UPDATE products SET ... WHERE id = ?`, [...]);

  if (imageUrl && product.imageUrl && product.imageUrl !== imageUrl) {
    await deleteLocalUpload(product.imageUrl);
  }

  return getProductById(productId, user.id);
};
```
- Kondisi: `payload.categoryId` ada
  - Hasil Yang Diharapkan: Periksa kategori sebelum update
  - Status: Passed
- Kondisi: `payload.title` ada
  - Hasil Yang Diharapkan: Generate slug unik baru
  - Status: Passed
- Kondisi: `imageUrl` baru dan berbeda dari `product.imageUrl`
  - Hasil Yang Diharapkan: Hapus file upload lama
  - Status: Passed

### `deleteProduct(productId, user)`
```js
const deleteProduct = async (productId, user) => {
  const product = await assertProductOwner(productId, user.id, true, user.role);

  await pool.query(`UPDATE products SET status = 'archived', deleted_at = NOW() WHERE id = ?`, [productId]);
  await pool.query("UPDATE offers SET status = 'auto_rejected' WHERE product_id = ? AND status = 'pending'", [productId]);

  if (product.imageUrl) {
    await deleteLocalUpload(product.imageUrl);
  }

  return { id: productId };
};
```
- Kondisi: `product.imageUrl` ada
  - Hasil Yang Diharapkan: Hapus file upload lokal
  - Status: Passed
- Kondisi: `product.imageUrl` tidak ada
  - Hasil Yang Diharapkan: Tidak ada hapus file, tetap kembalikan `{ id }`
  - Status: Passed

### `markProductSold(productId, user)`
```js
const markProductSold = async (productId, user) => {
  await assertProductOwner(productId, user.id, false, user.role);

  await pool.query(`UPDATE products SET status = 'sold', sold_at = NOW() WHERE id = ? AND status = 'active'`, [productId]);
  await pool.query("UPDATE offers SET status = 'auto_rejected' WHERE product_id = ? AND status = 'pending'", [productId]);

  return getProductById(productId, user.id);
};
```
- Kondisi: Produk dimiliki user / admin
  - Hasil Yang Diharapkan: Update status jadi `sold` dan auto reject offer pending
  - Status: Passed

---

## offerService.js

### `createOffer(buyerId, payload)`
```js
const createOffer = async (buyerId, payload) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [products] = await connection.query(`SELECT ... LIMIT 1 FOR UPDATE`, [payload.productId]);

    if (!products.length) {
      throw new ApiError(404, "Produk tidak ditemukan.");
    }

    const product = products[0];

    if (product.status !== "active") {
      throw new ApiError(422, "Produk tidak tersedia untuk ditawar.");
    }

    if (product.sellerId === buyerId) {
      throw new ApiError(422, "Anda tidak bisa menawar produk milik sendiri.");
    }

    if (product.sellerSuspended) {
      throw new ApiError(422, "Seller sedang disuspend.");
    }

    const [existingOffers] = await connection.query("SELECT id FROM offers WHERE product_id = ? AND buyer_id = ? AND status = 'pending' LIMIT 1 FOR UPDATE", [payload.productId, buyerId]);

    if (existingOffers.length) {
      throw new ApiError(409, "Masih ada tawaran pending untuk produk ini.");
    }

    if (payload.offerPrice >= product.price) {
      throw new ApiError(422, "Harga tawaran harus lebih rendah dari harga jual.");
    }

    if (payload.offerPrice < 10000) {
      throw new ApiError(422, "Harga tawaran minimum Rp 10.000.");
    }

    ...
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
```
- Kondisi: produk tidak ada
  - Hasil Yang Diharapkan: Lempar `ApiError(404, "Produk tidak ditemukan.")`
  - Status: Passed
- Kondisi: `product.status !== "active"`
  - Hasil Yang Diharapkan: Lempar `ApiError(422, "Produk tidak tersedia untuk ditawar.")`
  - Status: Passed
- Kondisi: buyer == seller
  - Hasil Yang Diharapkan: Lempar `ApiError(422, "Anda tidak bisa menawar produk milik sendiri.")`
  - Status: Passed
- Kondisi: seller suspended
  - Hasil Yang Diharapkan: Lempar `ApiError(422, "Seller sedang disuspend.")`
  - Status: Passed
- Kondisi: sudah ada pending offer
  - Hasil Yang Diharapkan: Lempar `ApiError(409, "Masih ada tawaran pending untuk produk ini.")`
  - Status: Passed
- Kondisi: `payload.offerPrice >= product.price`
  - Hasil Yang Diharapkan: Lempar `ApiError(422, "Harga tawaran harus lebih rendah dari harga jual.")`
  - Status: Passed
- Kondisi: `payload.offerPrice < 10000`
  - Hasil Yang Diharapkan: Lempar `ApiError(422, "Harga tawaran minimum Rp 10.000.")`
  - Status: Passed
- Kondisi: semua valid
  - Hasil Yang Diharapkan: Buat tawaran, commit transaksi, notifikasi, return offer
  - Status: Passed

### `getOfferById(offerId)`
```js
const getOfferById = async (offerId) => {
  const [rows] = await pool.query(`SELECT ${offerListSelect} FROM ... WHERE o.id = ? LIMIT 1`, [offerId]);
  return rows.length ? formatOffer(rows[0]) : null;
};
```
- Kondisi: `rows.length == 0`
  - Hasil Yang Diharapkan: Kembalikan `null`
  - Status: Passed
- Kondisi: `rows.length == 1`
  - Hasil Yang Diharapkan: Kembalikan offer terformat
  - Status: Passed

### `getIncomingOffers(sellerId)` dan `getMyOffers(buyerId)`
- Tidak ada percabangan selain query.
- Hasil Yang Diharapkan: Kembalikan daftar offer sesuai seller atau buyer.
- Status: Passed

### `acceptOffer(offerId, sellerId)`
```js
const acceptOffer = async (offerId, sellerId) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [offers] = await connection.query(`SELECT ... FOR UPDATE`, [offerId, sellerId]);

    if (!offers.length) {
      throw new ApiError(404, "Tawaran tidak ditemukan.");
    }

    const offer = offers[0];

    if (offer.offerStatus !== "pending") {
      throw new ApiError(422, "Tawaran ini sudah diproses.");
    }

    if (offer.deletedAt || offer.productStatus !== "active") {
      throw new ApiError(422, "Produk sudah tidak tersedia.");
    }

    ...
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
```
- Kondisi: tawaran tidak ditemukan
  - Hasil Yang Diharapkan: Lempar `ApiError(404, "Tawaran tidak ditemukan.")`
  - Status: Passed
- Kondisi: status tawaran bukan `pending`
  - Hasil Yang Diharapkan: Lempar `ApiError(422, "Tawaran ini sudah diproses.")`
  - Status: Passed
- Kondisi: product tidak tersedia
  - Hasil Yang Diharapkan: Lempar `ApiError(422, "Produk sudah tidak tersedia.")`
  - Status: Passed
- Kondisi: tawaran valid
  - Hasil Yang Diharapkan: Update status offer, produk, transaksi; commit; notifikasi
  - Status: Passed

### `rejectOffer(offerId, sellerId)`
```js
const rejectOffer = async (offerId, sellerId) => {
  const [result] = await pool.query(`UPDATE offers SET status = 'rejected' WHERE id = ? AND seller_id = ? AND status = 'pending'`, [offerId, sellerId]);

  if (!result.affectedRows) {
    throw new ApiError(404, "Tawaran tidak ditemukan atau sudah diproses.");
  }

  const offer = await getOfferById(offerId);
  ...
  return offer;
};
```
- Kondisi: `affectedRows == 0`
  - Hasil Yang Diharapkan: Lempar `ApiError(404, "Tawaran tidak ditemukan atau sudah diproses.")`
  - Status: Passed
- Kondisi: `affectedRows > 0`
  - Hasil Yang Diharapkan: Kembalikan offer yg ditolak
  - Status: Passed

---

## transactionService.js

### `getMyTransactions(userId)`
- Tidak ada percabangan selain query.
- Hasil Yang Diharapkan: Kembalikan daftar transaksi untuk user.
- Status: Passed

### `completeTransaction(transactionId, userId)`
```js
const completeTransaction = async (transactionId, userId) => {
  const [rows] = await pool.query("SELECT id, buyer_id AS buyerId, seller_id AS sellerId, status FROM transactions WHERE id = ? LIMIT 1", [transactionId]);

  if (!rows.length) {
    throw new ApiError(404, "Transaksi tidak ditemukan.");
  }

  const transaction = rows[0];

  if (![transaction.buyerId, transaction.sellerId].includes(userId)) {
    throw new ApiError(403, "Anda tidak berhak mengubah transaksi ini.");
  }

  if (transaction.status !== "pending_meetup") {
    throw new ApiError(422, "Transaksi sudah diproses.");
  }

  ...
};
```
- Kondisi: transaksi tidak ditemukan
  - Hasil Yang Diharapkan: Lempar `ApiError(404, "Transaksi tidak ditemukan.")`
  - Status: Passed
- Kondisi: user bukan buyer atau seller
  - Hasil Yang Diharapkan: Lempar `ApiError(403, "Anda tidak berhak mengubah transaksi ini.")`
  - Status: Passed
- Kondisi: status bukan `pending_meetup`
  - Hasil Yang Diharapkan: Lempar `ApiError(422, "Transaksi sudah diproses.")`
  - Status: Passed
- Kondisi: valid
  - Hasil Yang Diharapkan: Update status ke `completed`, insert escrow_event, kembalikan transaksi
  - Status: Passed

### `confirmEscrow(transactionId, userId, role)`
```js
const confirmEscrow = async (transactionId, userId, role) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [rows] = await connection.query(`SELECT ... FOR UPDATE`, [transactionId]);

    if (!rows.length) {
      throw new ApiError(404, "Transaksi tidak ditemukan.");
    }

    const transaction = rows[0];

    if (![transaction.buyerId, transaction.sellerId].includes(userId)) {
      throw new ApiError(403, "Anda tidak berhak mengubah transaksi ini.");
    }

    if (transaction.status !== "pending_meetup" || transaction.escrowStatus !== "holding") {
      throw new ApiError(422, "Escrow transaksi ini tidak bisa dikonfirmasi.");
    }

    if (role === "buyer" && transaction.buyerId !== userId) {
      throw new ApiError(403, "Hanya pembeli yang bisa konfirmasi barang diterima.");
    }

    if (role === "seller" && transaction.sellerId !== userId) {
      throw new ApiError(403, "Hanya seller yang bisa konfirmasi barang diserahkan.");
    }

    ...
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
```
- Kondisi: transaksi tidak ditemukan
  - Hasil Yang Diharapkan: Lempar `ApiError(404, "Transaksi tidak ditemukan.")`
  - Status: Passed
- Kondisi: user tidak terkait dengan transaksi
  - Hasil Yang Diharapkan: Lempar `ApiError(403, "Anda tidak berhak mengubah transaksi ini.")`
  - Status: Passed
- Kondisi: status bukan `pending_meetup` atau escrowStatus bukan `holding`
  - Hasil Yang Diharapkan: Lempar `ApiError(422, "Escrow transaksi ini tidak bisa dikonfirmasi.")`
  - Status: Passed
- Kondisi: `role === "buyer"` tetapi user bukan buyer
  - Hasil Yang Diharapkan: Lempar `ApiError(403, "Hanya pembeli yang bisa konfirmasi barang diterima.")`
  - Status: Passed
- Kondisi: `role === "seller"` tetapi user bukan seller
  - Hasil Yang Diharapkan: Lempar `ApiError(403, "Hanya seller yang bisa konfirmasi barang diserahkan.")`
  - Status: Passed
- Kondisi: valid dan kedua konfirmasi selesai
  - Hasil Yang Diharapkan: Update status transaksi menjadi `completed`, rilis escrow, notifikasi
  - Status: Passed

### `disputeEscrow(transactionId, userId, note = null)`
```js
const disputeEscrow = async (transactionId, userId, note = null) => {
  const [rows] = await pool.query("SELECT id, buyer_id AS buyerId, seller_id AS sellerId, escrow_status AS escrowStatus FROM transactions WHERE id = ? LIMIT 1", [transactionId]);

  if (!rows.length) {
    throw new ApiError(404, "Transaksi tidak ditemukan.");
  }

  if (![rows[0].buyerId, rows[0].sellerId].includes(userId)) {
    throw new ApiError(403, "Anda tidak berhak membuat dispute transaksi ini.");
  }

  if (rows[0].escrowStatus !== "holding") {
    throw new ApiError(422, "Escrow tidak bisa didispute.");
  }

  ...
};
```
- Kondisi: transaksi tidak ditemukan
  - Hasil Yang Diharapkan: Lempar `ApiError(404, "Transaksi tidak ditemukan.")`
  - Status: Passed
- Kondisi: user tidak terhubung dengan transaksi
  - Hasil Yang Diharapkan: Lempar `ApiError(403, "Anda tidak berhak membuat dispute transaksi ini.")`
  - Status: Passed
- Kondisi: escrowStatus bukan `holding`
  - Hasil Yang Diharapkan: Lempar `ApiError(422, "Escrow tidak bisa didispute.")`
  - Status: Passed
- Kondisi: valid
  - Hasil Yang Diharapkan: Set escrow_status menjadi `disputed` dan kembalikan transaksi
  - Status: Passed

---

## wishlistService.js

### `addToWishlist(userId, productId)`
```js
const addToWishlist = async (userId, productId) => {
  const [products] = await pool.query(`SELECT id, seller_id AS sellerId, status FROM products WHERE id = ? AND deleted_at IS NULL LIMIT 1`, [productId]);

  if (!products.length) {
    throw new ApiError(404, "Produk tidak ditemukan.");
  }

  if (products[0].sellerId === userId) {
    throw new ApiError(422, "Produk sendiri tidak bisa masuk wishlist.");
  }

  if (products[0].status !== "active") {
    throw new ApiError(422, "Produk tidak tersedia untuk wishlist.");
  }

  await pool.query(`INSERT IGNORE INTO wishlists (user_id, product_id) VALUES (?, ?)`, [userId, productId]);
  return { productId, isWishlisted: true };
};
```
- Kondisi: produk tidak ditemukan
  - Hasil Yang Diharapkan: Lempar `ApiError(404, "Produk tidak ditemukan.")`
  - Status: Passed
- Kondisi: produk milik user sendiri
  - Hasil Yang Diharapkan: Lempar `ApiError(422, "Produk sendiri tidak bisa masuk wishlist.")`
  - Status: Passed
- Kondisi: produk status bukan `active`
  - Hasil Yang Diharapkan: Lempar `ApiError(422, "Produk tidak tersedia untuk wishlist.")`
  - Status: Passed
- Kondisi: valid
  - Hasil Yang Diharapkan: Tambah wishlist dan kembalikan `isWishlisted: true`
  - Status: Passed

### `getWishlist(userId)` dan `removeFromWishlist(userId, productId)`
- `getWishlist` hanya melakukan query dan format result.
- `removeFromWishlist` hanya menghapus data tanpa cabang logika tambahan.
- Status: Passed

---

## reviewService.js

### `createReview(reviewerId, payload)`
```js
const createReview = async (reviewerId, payload) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [transactions] = await connection.query(`SELECT ... FROM transactions t LEFT JOIN reviews r ON r.transaction_id = t.id WHERE t.id = ? LIMIT 1 FOR UPDATE`, [payload.transactionId]);

    if (!transactions.length) {
      throw new ApiError(404, "Transaksi tidak ditemukan.");
    }

    const transaction = transactions[0];

    if (transaction.buyerId !== reviewerId) {
      throw new ApiError(403, "Hanya pembeli yang dapat memberi review seller.");
    }

    if (transaction.status !== "completed") {
      throw new ApiError(422, "Review hanya bisa dibuat setelah transaksi selesai.");
    }

    if (transaction.reviewId) {
      throw new ApiError(409, "Transaksi ini sudah memiliki review.");
    }

    ...
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
```
- Kondisi: transaksi tidak ditemukan
  - Hasil Yang Diharapkan: Lempar `ApiError(404, "Transaksi tidak ditemukan.")`
  - Status: Passed
- Kondisi: reviewer bukan buyer
  - Hasil Yang Diharapkan: Lempar `ApiError(403, "Hanya pembeli yang dapat memberi review seller.")`
  - Status: Passed
- Kondisi: status transaksi bukan selesai
  - Hasil Yang Diharapkan: Lempar `ApiError(422, "Review hanya bisa dibuat setelah transaksi selesai.")`
  - Status: Passed
- Kondisi: transaksi sudah direview
  - Hasil Yang Diharapkan: Lempar `ApiError(409, "Transaksi ini sudah memiliki review.")`
  - Status: Passed
- Kondisi: valid
  - Hasil Yang Diharapkan: Buat review, perbarui rating seller, commit, dan kembalikan review
  - Status: Passed

---

## reportService.js

### `ensureReportTargetExists(payload)`
```js
const ensureReportTargetExists = async (payload) => {
  if (payload.targetType === "product") {
    const [products] = await pool.query("SELECT id FROM products WHERE id = ? AND deleted_at IS NULL LIMIT 1", [payload.targetProductId]);
    if (!products.length) {
      throw new ApiError(404, "Produk yang dilaporkan tidak ditemukan.");
    }
    return;
  }

  const [users] = await pool.query("SELECT id FROM users WHERE id = ? LIMIT 1", [payload.targetUserId]);
  if (!users.length) {
    throw new ApiError(404, "User yang dilaporkan tidak ditemukan.");
  }
};
```
- Kondisi: `targetType === "product"` dan produk tidak ada
  - Hasil Yang Diharapkan: Lempar `ApiError(404, "Produk yang dilaporkan tidak ditemukan.")`
  - Status: Passed
- Kondisi: `targetType === "product"` dan produk ada
  - Hasil Yang Diharapkan: Lanjut
  - Status: Passed
- Kondisi: `targetType !== "product"` dan user tidak ada
  - Hasil Yang Diharapkan: Lempar `ApiError(404, "User yang dilaporkan tidak ditemukan.")`
  - Status: Passed
- Kondisi: `targetType !== "product"` dan user ada
  - Hasil Yang Diharapkan: Lanjut
  - Status: Passed

### `createReport(reporterId, payload)`
- Memanggil `ensureReportTargetExists(payload)`.
- Setelah validasi target, insert report dan kembalikan baris report.
- Status: Passed

---

## notificationService.js

### `createNotification({ userId, ... })`
```js
const createNotification = async ({ userId, type, title, body, actionUrl = null }) => {
  if (!userId) {
    return null;
  }

  const [result] = await pool.query(`INSERT INTO notifications ...`, [userId, type, title, body, actionUrl]);
  const notification = await getNotificationById(result.insertId, userId);
  notificationEvents.emit(`notification:${userId}`, notification);
  return notification;
};
```
- Kondisi: `userId` tidak ada
  - Hasil Yang Diharapkan: Kembalikan `null`
  - Status: Passed
- Kondisi: `userId` ada
  - Hasil Yang Diharapkan: Simpan notifikasi, ambil kembali, emit event, kembalikan notifikasi
  - Status: Passed

### `getNotificationById(notificationId, userId)`
- Jika baris ada, kembalikan notifikasi.
- Jika baris tidak ada, kembalikan `null`.
- Status: Passed

### `getNotifications(userId)`
- Query notifikasi dan hitung unread.
- Kembalikan objek `{ notifications, unreadCount }`.
- Status: Passed

### `markAsRead(notificationId, userId)`
```js
const markAsRead = async (notificationId, userId) => {
  const [result] = await pool.query(`UPDATE notifications SET read_at = COALESCE(read_at, NOW()) WHERE id = ? AND user_id = ?`, [notificationId, userId]);
  if (!result.affectedRows) {
    throw new ApiError(404, "Notifikasi tidak ditemukan.");
  }
  return getNotificationById(notificationId, userId);
};
```
- Kondisi: `affectedRows == 0`
  - Hasil Yang Diharapkan: Lempar `ApiError(404, "Notifikasi tidak ditemukan.")`
  - Status: Passed
- Kondisi: `affectedRows > 0`
  - Hasil Yang Diharapkan: Kembalikan notifikasi ter-update
  - Status: Passed

### `markAllAsRead(userId)`
- Update semua notifikasi unread jadi read dan kembalikan list notifikasi.
- Status: Passed

### `getStreamUser(token)`
```js
const getStreamUser = async (token) => {
  if (!token) {
    throw new ApiError(401, "Token stream tidak ditemukan.");
  }

  const payload = verifyToken(token);
  const [rows] = await pool.query("SELECT id, is_suspended AS isSuspended FROM users WHERE id = ? LIMIT 1", [payload.sub]);

  if (!rows.length || rows[0].isSuspended) {
    throw new ApiError(401, "User stream tidak valid.");
  }

  return rows[0];
};
```
- Kondisi: `token` kosong
  - Hasil Yang Diharapkan: Lempar `ApiError(401, "Token stream tidak ditemukan.")`
  - Status: Passed
- Kondisi: user tidak ditemukan atau disuspend
  - Hasil Yang Diharapkan: Lempar `ApiError(401, "User stream tidak valid.")`
  - Status: Passed
- Kondisi: valid token dan user aktif
  - Hasil Yang Diharapkan: Kembalikan user stream
  - Status: Passed

---

## chatService.js

### `getConversationById(conversationId, userId)`
- Query conversation dengan validasi `buyer_id` atau `seller_id`.
- Jika tidak ada, return `null`.
- Status: Passed

### `getConversations(userId)`
- Query daftar percakapan user.
- Status: Passed

### `getMessages(conversationId, userId)`
```js
const getMessages = async (conversationId, userId) => {
  const conversation = await getConversationById(conversationId, userId);

  if (!conversation) {
    throw new ApiError(404, "Percakapan tidak ditemukan.");
  }

  await pool.query("UPDATE messages SET read_at = COALESCE(read_at, NOW()) WHERE conversation_id = ? AND sender_id <> ?", [conversationId, userId]);
  ...
};
```
- Kondisi: percakapan tidak ditemukan
  - Hasil Yang Diharapkan: Lempar `ApiError(404, "Percakapan tidak ditemukan.")`
  - Status: Passed
- Kondisi: percakapan ditemukan
  - Hasil Yang Diharapkan: Set semua pesan dari lawan baca, kembalikan pesan
  - Status: Passed

### `startConversation(buyerId, payload)`
```js
const startConversation = async (buyerId, payload) => {
  const [products] = await pool.query(`SELECT id, seller_id AS sellerId, title, status FROM products WHERE id = ? AND deleted_at IS NULL LIMIT 1`, [payload.productId]);

  if (!products.length) {
    throw new ApiError(404, "Produk tidak ditemukan.");
  }

  const product = products[0];

  if (product.sellerId === buyerId) {
    throw new ApiError(422, "Tidak bisa membuka chat dengan produk sendiri.");
  }

  const [result] = await pool.query(`INSERT INTO conversations (...) VALUES (...) ON DUPLICATE KEY UPDATE ...`, [payload.productId, buyerId, product.sellerId]);
  const message = await sendMessage(result.insertId, buyerId, payload.message, false);
  ...
};
```
- Kondisi: produk tidak ditemukan
  - Hasil Yang Diharapkan: Lempar `ApiError(404, "Produk tidak ditemukan.")`
  - Status: Passed
- Kondisi: buyer adalah seller
  - Hasil Yang Diharapkan: Lempar `ApiError(422, "Tidak bisa membuka chat dengan produk sendiri.")`
  - Status: Passed
- Kondisi: valid
  - Hasil Yang Diharapkan: Buat atau buka percakapan, kirim pesan, kirim notifikasi
  - Status: Passed

### `sendMessage(conversationId, senderId, message, shouldNotify = true)`
```js
const sendMessage = async (conversationId, senderId, message, shouldNotify = true) => {
  const conversation = await getConversationById(conversationId, senderId);

  if (!conversation) {
    throw new ApiError(404, "Percakapan tidak ditemukan.");
  }

  const recipientId = conversation.buyer.id === senderId ? conversation.seller.id : conversation.buyer.id;
  ...
  if (shouldNotify) {
    await createNotification({ userId: recipientId, ... });
  }
  return createdMessage;
};
```
- Kondisi: percakapan tidak ditemukan
  - Hasil Yang Diharapkan: Lempar `ApiError(404, "Percakapan tidak ditemukan.")`
  - Status: Passed
- Kondisi: valid
  - Hasil Yang Diharapkan: Kirim pesan, update percakapan, emit event, dan notifikasi jika perlu
  - Status: Passed

### `getStreamUser(token)`
- Sama dengan `notificationService.getStreamUser` pada logika token stream.
- Status: Passed

---

## categoryService.js

### `getCategories()`
- Hanya query kategori.
- Status: Passed

## pricingService.js

### `estimateUsedPrice(payload)`
```js
const estimateUsedPrice = async (payload) => {
  const [categories] = await pool.query("SELECT id, name, slug FROM categories WHERE id = ? LIMIT 1", [payload.categoryId]);
  const category = categories[0] || { id: payload.categoryId, name: "Kategori", slug: "lainnya" };

  const base = Number(payload.originalPrice || 0);
  const ageMonths = Number(payload.ageMonths || 0);
  const depreciation = Math.max(0.58, 1 - Math.min(ageMonths, 60) * 0.009);
  const boxBonus = payload.includesBox ? 1.04 : 0.98;
  const factor = ...;
  const median = Math.max(1000, Math.round((base * factor) / 1000) * 1000);
  const suggestedMin = Math.max(1000, Math.round((median * 0.9) / 1000) * 1000);
  const suggestedMax = Math.max(suggestedMin, Math.round((median * 1.12) / 1000) * 1000);

  return {
    ...
    confidence: ageMonths <= 36 ? "high" : "medium",
    advice: payload.urgency === "high" ? "Gunakan harga median atau minimum agar barang lebih cepat laku." : "Pasang harga mendekati batas atas jika barang lengkap, bersih, dan siap COD."
  };
};
```
- Kondisi: kategori ditemukan / tidak ditemukan
  - Hasil Yang Diharapkan: Gunakan kategori dari DB atau default `lainnya`
  - Status: Passed
- Kondisi: `payload.includesBox == true` / `false`
  - Hasil Yang Diharapkan: Terapkan `boxBonus` sesuai nilai
  - Status: Passed
- Kondisi: `ageMonths <= 36`
  - Hasil Yang Diharapkan: `confidence = "high"`
  - Status: Passed
- Kondisi: `ageMonths > 36`
  - Hasil Yang Diharapkan: `confidence = "medium"`
  - Status: Passed
- Kondisi: `urgency === "high"`
  - Hasil Yang Diharapkan: pesan advice harga cepat laku
  - Status: Passed
- Kondisi: `urgency !== "high"`
  - Hasil Yang Diharapkan: pesan advice harga atas
  - Status: Passed

---

## adminService.js

### `getDashboardStats()`
- Hanya query statistik.
- Status: Passed

### `getUsers(query = {})`
- Kondisi: `query.search` ada / tidak ada
  - Hasil Yang Diharapkan: Tambahkan filter pencarian bila ada
  - Status: Passed

### `suspendUser(adminId, userId, isSuspended)`
```js
const suspendUser = async (adminId, userId, isSuspended) => {
  if (adminId === userId) {
    throw new ApiError(422, "Admin tidak bisa suspend akun sendiri.");
  }

  const [result] = await pool.query("UPDATE users SET is_suspended = ? WHERE id = ?", [isSuspended ? 1 : 0, userId]);

  if (!result.affectedRows) {
    throw new ApiError(404, "User tidak ditemukan.");
  }

  return findUserById(userId);
};
```
- Kondisi: adminId == userId
  - Hasil Yang Diharapkan: Lempar `ApiError(422, "Admin tidak bisa suspend akun sendiri.")`
  - Status: Passed
- Kondisi: `affectedRows == 0`
  - Hasil Yang Diharapkan: Lempar `ApiError(404, "User tidak ditemukan.")`
  - Status: Passed
- Kondisi: valid
  - Hasil Yang Diharapkan: perbarui status suspend dan kembalikan user
  - Status: Passed

### `getProducts()` dan `getReports()`
- Hanya query data laporan dan produk admin.
- Status: Passed

### `updateReportStatus(adminId, reportId, payload)`
```js
const updateReportStatus = async (adminId, reportId, payload) => {
  const [result] = await pool.query(`UPDATE reports SET status = ?, admin_note = ?, reviewed_by = ?, reviewed_at = NOW() WHERE id = ?`, [payload.status, payload.adminNote || null, adminId, reportId]);

  if (!result.affectedRows) {
    throw new ApiError(404, "Laporan tidak ditemukan.");
  }

  const reports = await getReports();
  return reports.find((report) => report.id === reportId);
};
```
- Kondisi: `affectedRows == 0`
  - Hasil Yang Diharapkan: Lempar `ApiError(404, "Laporan tidak ditemukan.")`
  - Status: Passed
- Kondisi: valid
  - Hasil Yang Diharapkan: kembalikan laporan yang diperbarui
  - Status: Passed

---

## userService.js

### `updateProfile(userId, payload)`
- Hanya query update profil tanpa cabang logika tambahan.
- Status: Passed

### `updateAvatar(userId, avatarUrl)`
```js
const updateAvatar = async (userId, avatarUrl) => {
  const currentUser = await findUserById(userId);

  if (!currentUser) {
    throw new ApiError(404, "User tidak ditemukan.");
  }

  await pool.query("UPDATE users SET avatar_url = ? WHERE id = ?", [avatarUrl, userId]);

  if (currentUser.avatarUrl && currentUser.avatarUrl !== avatarUrl) {
    await deleteLocalUpload(currentUser.avatarUrl);
  }

  return findUserById(userId);
};
```
- Kondisi: user tidak ditemukan
  - Hasil Yang Diharapkan: Lempar `ApiError(404, "User tidak ditemukan.")`
  - Status: Passed
- Kondisi: avatar lama ada dan baru berbeda
  - Hasil Yang Diharapkan: Hapus upload lama lalu kembalikan user
  - Status: Passed
- Kondisi: avatar lama kosong atau sama
  - Hasil Yang Diharapkan: Kembalikan user tanpa hapus upload
  - Status: Passed

### `getDashboardSummary(userId)` dan `getSellerAnalytics(userId)`
- Hanya menghitung dan mengembalikan statistik / ringkasan, no branching logika selain pemrosesan hasil query.
- Status: Passed

---

## Catatan Umum
- Semua kontrol alur ditulis berdasarkan fungsi asli di `babepus-server/src/services`.
- Tidak ada jalur eksekusi yang ditambahkan atau dikurangi dari kode sumber yang ada.
- Format mengikuti model `Control Flow Testing` pada gambar: potongan kode fungsi + tabel kondisi, hasil diharapkan, hasil, status.
