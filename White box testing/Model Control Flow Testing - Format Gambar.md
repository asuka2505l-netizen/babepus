# Model Control Flow Testing (Format Gambar)

Dokumen ini berisi Control Flow Testing untuk fungsi-fungsi service backend di `babepus-server/src/services`. Setiap fungsi ditampilkan dengan potongan kode, lalu diiringi tabel kondisi dan hasil yang sesuai dengan format gambar.

---

## authService.js

### `findUserById(userId)`
```js
const findUserById = async (userId) => {
  const [rows] = await pool.query(`SELECT ${userSelect} FROM users WHERE id = ? LIMIT 1`, [userId]);
  return rows.length ? serializeUser(rows[0]) : null;
};
```
| Kondisi | Hasil Yang Diharapkan | Hasil | Status |
|---|---|---|---|
| `rows.length == 0` | Kembalikan `null` | `null` | Passed |
| `rows.length == 1` | Kembalikan object user | object user | Passed |

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
| Kondisi | Hasil Yang Diharapkan | Hasil | Status |
|---|---|---|---|
| `existingUsers.length > 0` | Lempar `ApiError(409, "Email sudah terdaftar.")` | `ApiError 409` | Passed |
| `existingUsers.length == 0` | Buat user dan kembalikan token/user/emailVerification | `return { token, user, emailVerification }` | Passed |

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
| Kondisi | Hasil Yang Diharapkan | Hasil | Status |
|---|---|---|---|
| `rows.length == 0` | Lempar `ApiError(401, "Email atau password salah.")` | `ApiError 401` | Passed |
| `rows[0].isSuspended == true` | Lempar `ApiError(403, "Akun sedang disuspend oleh admin.")` | `ApiError 403` | Passed |
| `isPasswordValid == false` | Lempar `ApiError(401, "Email atau password salah.")` | `ApiError 401` | Passed |
| `isPasswordValid == true` | Kembalikan `{ token, user }` | `return { token, user }` | Passed |

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
| Kondisi | Hasil Yang Diharapkan | Hasil | Status |
|---|---|---|---|
| `user == null` | Lempar `ApiError(404, "User tidak ditemukan.")` | `ApiError 404` | Passed |
| `user.isEmailVerified == true` | Kembalikan `alreadyVerified: true` | `{ alreadyVerified: true, token: null, expiresAt: null }` | Passed |
| `user.isEmailVerified == false` | Simpan token baru dan kembalikan token + expiresAt | `{ alreadyVerified: false, token, expiresAt }` | Passed |

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
| Kondisi | Hasil Yang Diharapkan | Hasil | Status |
|---|---|---|---|
| `rows.length == 0` | Lempar `ApiError(422, "Token verifikasi email tidak valid atau sudah kedaluwarsa.")` | `ApiError 422` | Passed |
| `rows.length == 1` | Perbarui status verifikasi dan kembalikan user | User terverifikasi | Passed |

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
| Kondisi | Hasil Yang Diharapkan | Hasil | Status |
|---|---|---|---|
| `rows.length == 0` | Lempar `ApiError(422, "Kategori tidak ditemukan.")` | `ApiError 422` | Passed |
| `rows.length == 1` | Lanjut tanpa error | Fungsi selesai | Passed |

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
| Kondisi | Hasil Yang Diharapkan | Hasil | Status |
|---|---|---|---|
| `rows.length == 0` | Kembalikan slug pertama yang unik | `candidate` unik | Passed |
| `rows.length > 0` | Tambah suffix dan ulangi | `candidate` incremented | Passed |

### `getProducts(query, currentUserId = null)`
```js
const getProducts = async (query, currentUserId = null) => {
  const { limit, offset, page } = getPagination(query);
  const conditions = ["p.deleted_at IS NULL", "p.status = 'active'", "u.is_suspended = 0"];
  const params = [];

  if (query.search) {
    conditions.push("(p.title LIKE ? OR p.description LIKE ? OR c.name LIKE ? OR p.campus_location LIKE ? OR p.faculty LIKE ?)");
    const keyword = `%${query.search}%`;
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
| Kondisi | Hasil Yang Diharapkan | Hasil | Status |
|---|---|---|---|
| `query.search` tersedia | Tambahkan filter pencarian | Query ditambahkan filter search | Passed |
| `query.categoryId` tersedia | Tambahkan filter kategori | Query ditambahkan filter categoryId | Passed |
| `query.minPrice` tersedia | Tambahkan filter harga minimum | Query ditambahkan filter minPrice | Passed |
| `query.maxPrice` tersedia | Tambahkan filter harga maksimum | Query ditambahkan filter maxPrice | Passed |
| `query.faculty` tersedia | Tambahkan filter fakultas | Query ditambahkan filter faculty | Passed |
| `currentUserId` tersedia | Hapus produk milik sendiri | Query ditambahkan kondisi seller_id <> currentUserId | Passed |

### `getMyProducts(userId)`
```js
const getMyProducts = async (userId) => {
  const [rows] = await pool.query(
    `SELECT ... FROM products p
     INNER JOIN categories c ON c.id = p.category_id
     INNER JOIN users u ON u.id = p.seller_id
     WHERE p.seller_id = ? AND p.deleted_at IS NULL
     ORDER BY p.created_at DESC`,
    [userId]
  );

  return rows.map(formatProduct);
};
```
| Kondisi | Hasil Yang Diharapkan | Hasil | Status |
|---|---|---|---|
| tanpa kondisi cabang | Kembalikan produk seller | Daftar produk seller | Passed |

### `getProductById(productId, currentUserId = null)`
```js
const getProductById = async (productId, currentUserId = null) => {
  const [rows] = await pool.query(
    `SELECT ... FROM products p
     INNER JOIN categories c ON c.id = p.category_id
     INNER JOIN users u ON u.id = p.seller_id
     WHERE p.id = ? AND p.deleted_at IS NULL
     LIMIT 1`,
    currentUserId ? [currentUserId, productId] : [productId]
  );

  if (!rows.length) {
    throw new ApiError(404, "Produk tidak ditemukan.");
  }

  await pool.query("UPDATE products SET view_count = view_count + 1 WHERE id = ?", [productId]);

  const product = formatProduct(rows[0]);
  product.isOwner = currentUserId ? product.seller.id === currentUserId : false;
  ...
};
```
| Kondisi | Hasil Yang Diharapkan | Hasil | Status |
|---|---|---|---|
| `rows.length == 0` | Lempar `ApiError(404, "Produk tidak ditemukan.")` | `ApiError 404` | Passed |
| `rows.length == 1` | Perbarui view_count, tetapkan isOwner, kembalikan produk | Produk detail dikembalikan | Passed |

### `createProduct(sellerId, payload, imageUrl)`
```js
const createProduct = async (sellerId, payload, imageUrl) => {
  await ensureCategoryExists(payload.categoryId);
  const slug = await generateUniqueSlug(payload.title);

  const [result] = await pool.query(
    `INSERT INTO products (...) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
    [sellerId, payload.categoryId, payload.title, slug, payload.description, payload.price, payload.conditionLabel, payload.campusLocation, payload.faculty || null, imageUrl]
  );

  return getProductById(result.insertId, sellerId);
};
```
| Kondisi | Hasil Yang Diharapkan | Hasil | Status |
|---|---|---|---|
| `payload.categoryId` invalid | Lempar `ApiError(422, "Kategori tidak ditemukan.")` | `ApiError 422` | Passed |
| `payload.categoryId` valid | Buat produk dan kembalikan produk | `return getProductById(result.insertId, sellerId)` | Passed |

### `assertProductOwner(productId, userId, allowAdmin = false, role = "user")`
```js
const assertProductOwner = async (productId, userId, allowAdmin = false, role = "user") => {
  const [rows] = await pool.query(
    "SELECT id, seller_id AS sellerId, image_url AS imageUrl, status FROM products WHERE id = ? AND deleted_at IS NULL LIMIT 1",
    [productId]
  );

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
| Kondisi | Hasil Yang Diharapkan | Hasil | Status |
|---|---|---|---|
| `rows.length == 0` | Lempar `ApiError(404, "Produk tidak ditemukan.")` | `ApiError 404` | Passed |
| seller bukan user tanpa admin | Lempar `ApiError(403, "Anda hanya bisa mengelola produk milik sendiri.")` | `ApiError 403` | Passed |
| seller sama user atau admin valid | Kembalikan baris produk | product row | Passed |

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
| Kondisi | Hasil Yang Diharapkan | Hasil | Status |
|---|---|---|---|
| `payload.categoryId` ada | Periksa kategori sebelum update | `ensureCategoryExists` dipanggil | Passed |
| `payload.title` ada | Generate slug unik baru | `generateUniqueSlug` dipanggil | Passed |
| `imageUrl` baru dan berbeda | Hapus upload lama | `deleteLocalUpload` dipanggil | Passed |

### `deleteProduct(productId, user)`
```js
const deleteProduct = async (productId, user) => {
  const product = await assertProductOwner(productId, user.id, true, user.role);

  await pool.query("UPDATE products SET status = 'archived', deleted_at = NOW() WHERE id = ?", [productId]);
  await pool.query("UPDATE offers SET status = 'auto_rejected' WHERE product_id = ? AND status = 'pending'", [productId]);

  if (product.imageUrl) {
    await deleteLocalUpload(product.imageUrl);
  }

  return { id: productId };
};
```
| Kondisi | Hasil Yang Diharapkan | Hasil | Status |
|---|---|---|---|
| `product.imageUrl` ada | Hapus file upload lama | `deleteLocalUpload` dipanggil | Passed |
| `product.imageUrl` tidak ada | Tidak hapus upload | Hanya return `{ id }` | Passed |

### `markProductSold(productId, user)`
```js
const markProductSold = async (productId, user) => {
  await assertProductOwner(productId, user.id, false, user.role);

  await pool.query("UPDATE products SET status = 'sold', sold_at = NOW() WHERE id = ? AND status = 'active'", [productId]);
  await pool.query("UPDATE offers SET status = 'auto_rejected' WHERE product_id = ? AND status = 'pending'", [productId]);

  return getProductById(productId, user.id);
};
```
| Kondisi | Hasil Yang Diharapkan | Hasil | Status |
|---|---|---|---|
| Produk valid dan user berwenang | Tandai produk sold dan reject offer pending | Produk dijadikan sold | Passed |

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
| Kondisi | Hasil Yang Diharapkan | Hasil | Status |
|---|---|---|---|
| Produk tidak ditemukan | Lempar `ApiError(404, "Produk tidak ditemukan.")` | `ApiError 404` | Passed |
| Produk status bukan active | Lempar `ApiError(422, "Produk tidak tersedia untuk ditawar.")` | `ApiError 422` | Passed |
| Buyer sama seller | Lempar `ApiError(422, "Anda tidak bisa menawar produk milik sendiri.")` | `ApiError 422` | Passed |
| Seller disuspend | Lempar `ApiError(422, "Seller sedang disuspend.")` | `ApiError 422` | Passed |
| Existing pending offer | Lempar `ApiError(409, "Masih ada tawaran pending untuk produk ini.")` | `ApiError 409` | Passed |
| offerPrice >= product.price | Lempar `ApiError(422, "Harga tawaran harus lebih rendah dari harga jual.")` | `ApiError 422` | Passed |
| offerPrice < 10000 | Lempar `ApiError(422, "Harga tawaran minimum Rp 10.000.")` | `ApiError 422` | Passed |
| Semua valid | Buat offer, commit, return offer | Offer dibuat | Passed |

### `getOfferById(offerId)`
```js
const getOfferById = async (offerId) => {
  const [rows] = await pool.query(`SELECT ${offerListSelect} FROM ... WHERE o.id = ? LIMIT 1`, [offerId]);
  return rows.length ? formatOffer(rows[0]) : null;
};
```
| Kondisi | Hasil Yang Diharapkan | Hasil | Status |
|---|---|---|---|
| `rows.length == 0` | Kembalikan `null` | `null` | Passed |
| `rows.length == 1` | Kembalikan offer terformat | Offer object | Passed |

### `getIncomingOffers(sellerId)` dan `getMyOffers(buyerId)`
```js
const getIncomingOffers = async (sellerId) => { ... };
const getMyOffers = async (buyerId) => { ... };
```
| Kondisi | Hasil Yang Diharapkan | Hasil | Status |
|---|---|---|---|
| tanpa cabang logika tambahan | Kembalikan daftar offer sesuai role | Daftar offers | Passed |

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
| Kondisi | Hasil Yang Diharapkan | Hasil | Status |
|---|---|---|---|
| Tawaran tidak ditemukan | Lempar `ApiError(404, "Tawaran tidak ditemukan.")` | `ApiError 404` | Passed |
| Status tawaran bukan pending | Lempar `ApiError(422, "Tawaran ini sudah diproses.")` | `ApiError 422` | Passed |
| Produk tidak tersedia | Lempar `ApiError(422, "Produk sudah tidak tersedia.")` | `ApiError 422` | Passed |
| Semua valid | Update status offer/product, buat transaksi, commit | Offer accepted | Passed |

### `rejectOffer(offerId, sellerId)`
```js
const rejectOffer = async (offerId, sellerId) => {
  const [result] = await pool.query(
    `UPDATE offers SET status = 'rejected' WHERE id = ? AND seller_id = ? AND status = 'pending'`,
    [offerId, sellerId]
  );

  if (!result.affectedRows) {
    throw new ApiError(404, "Tawaran tidak ditemukan atau sudah diproses.");
  }

  const offer = await getOfferById(offerId);
  ...
  return offer;
};
```
| Kondisi | Hasil Yang Diharapkan | Hasil | Status |
|---|---|---|---|
| `affectedRows == 0` | Lempar `ApiError(404, "Tawaran tidak ditemukan atau sudah diproses.")` | `ApiError 404` | Passed |
| `affectedRows > 0` | Kembalikan offer yang ditolak | Offer rejected | Passed |

---

## transactionService.js

### `getMyTransactions(userId)`
```js
const getMyTransactions = async (userId) => {
  const [rows] = await pool.query(`SELECT ... WHERE t.buyer_id = ? OR t.seller_id = ? ORDER BY t.created_at DESC`, [userId, userId]);
  return rows.map((row) => formatTransaction(row, userId));
};
```
| Kondisi | Hasil Yang Diharapkan | Hasil | Status |
|---|---|---|---|
| tanpa cabang logika tambahan | Kembalikan daftar transaksi untuk user | Daftar transaksi | Passed |

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
| Kondisi | Hasil Yang Diharapkan | Hasil | Status |
|---|---|---|---|
| Transaksi tidak ditemukan | Lempar `ApiError(404, "Transaksi tidak ditemukan.")` | `ApiError 404` | Passed |
| User bukan buyer/seller | Lempar `ApiError(403, "Anda tidak berhak mengubah transaksi ini.")` | `ApiError 403` | Passed |
| Status bukan pending_meetup | Lempar `ApiError(422, "Transaksi sudah diproses.")` | `ApiError 422` | Passed |
| Valid | Update status selesai dan return transaksi | Transaksi completed | Passed |

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
| Kondisi | Hasil Yang Diharapkan | Hasil | Status |
|---|---|---|---|
| Transaksi tidak ditemukan | Lempar `ApiError(404, "Transaksi tidak ditemukan.")` | `ApiError 404` | Passed |
| User tidak terhubung | Lempar `ApiError(403, "Anda tidak berhak mengubah transaksi ini.")` | `ApiError 403` | Passed |
| Status bukan pending_meetup atau escrow tidak holding | Lempar `ApiError(422, "Escrow transaksi ini tidak bisa dikonfirmasi.")` | `ApiError 422` | Passed |
| Role buyer tapi user bukan buyer | Lempar `ApiError(403, "Hanya pembeli yang bisa konfirmasi barang diterima.")` | `ApiError 403` | Passed |
| Role seller tapi user bukan seller | Lempar `ApiError(403, "Hanya seller yang bisa konfirmasi barang diserahkan.")` | `ApiError 403` | Passed |
| Valid | Konfirmasi dan release escrow bila kedua pihak setuju | Escrow confirmed | Passed |

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
| Kondisi | Hasil Yang Diharapkan | Hasil | Status |
|---|---|---|---|
| Transaksi tidak ditemukan | Lempar `ApiError(404, "Transaksi tidak ditemukan.")` | `ApiError 404` | Passed |
| User tidak terhubung | Lempar `ApiError(403, "Anda tidak berhak membuat dispute transaksi ini.")` | `ApiError 403` | Passed |
| Escrow bukan holding | Lempar `ApiError(422, "Escrow tidak bisa didispute.")` | `ApiError 422` | Passed |
| Valid | Set escrow_status ke disputed | Escrow disputed | Passed |

---

## userService.js

### `updateProfile(userId, payload)`
```js
const updateProfile = async (userId, payload) => {
  await pool.query(
    `UPDATE users
     SET full_name = COALESCE(?, full_name), phone = ?, campus = COALESCE(?, campus), faculty = ?, study_program = ?, bio = ?
     WHERE id = ?`,
    [payload.fullName || null, payload.phone || null, payload.campus || null, payload.faculty || null, payload.studyProgram || null, payload.bio || null, userId]
  );
  return findUserById(userId);
};
```
| Kondisi | Hasil Yang Diharapkan | Hasil | Status |
|---|---|---|---|
| Tanpa cabang logika | Perbarui profil user dan kembalikan user | User profile updated | Passed |

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
| Kondisi | Hasil Yang Diharapkan | Hasil | Status |
|---|---|---|---|
| User tidak ditemukan | Lempar `ApiError(404, "User tidak ditemukan.")` | `ApiError 404` | Passed |
| Avatar berubah dan lama ada | Hapus upload lama | `deleteLocalUpload` dipanggil | Passed |
| Avatar sama atau belum ada | Tidak hapus upload | User diupdate | Passed |

### `getDashboardSummary(userId)`
```js
const getDashboardSummary = async (userId) => {
  const [[productStats], [offerStats], [transactionStats], [recentProducts], [recentOffers]] = await Promise.all([...]);
  return { stats: {...}, recentProducts, recentOffers };
};
```
| Kondisi | Hasil Yang Diharapkan | Hasil | Status |
|---|---|---|---|
| Tanpa cabang logika tambahan | Kembalikan ringkasan dashboard user | Summary object | Passed |

### `getSellerAnalytics(userId)`
```js
const getSellerAnalytics = async (userId) => {
  const [[views], [wishlists], [revenue], [offers], [topProducts], [funnel]] = await Promise.all([...]);
  return { totalViews: ..., offerTrend: ... };
};
```
| Kondisi | Hasil Yang Diharapkan | Hasil | Status |
|---|---|---|---|
| Tanpa cabang logika tambahan | Kembalikan analytics seller | Analytics object | Passed |

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
| Kondisi | Hasil Yang Diharapkan | Hasil | Status |
|---|---|---|---|
| Produk tidak ditemukan | Lempar `ApiError(404, "Produk tidak ditemukan.")` | `ApiError 404` | Passed |
| Produk milik self | Lempar `ApiError(422, "Produk sendiri tidak bisa masuk wishlist.")` | `ApiError 422` | Passed |
| Produk tidak active | Lempar `ApiError(422, "Produk tidak tersedia untuk wishlist.")` | `ApiError 422` | Passed |
| Valid | Tambahkan ke wishlist | `isWishlisted: true` | Passed |

### `removeFromWishlist(userId, productId)`
```js
const removeFromWishlist = async (userId, productId) => {
  await pool.query("DELETE FROM wishlists WHERE user_id = ? AND product_id = ?", [userId, productId]);
  return { productId, isWishlisted: false };
};
```
| Kondisi | Hasil Yang Diharapkan | Hasil | Status |
|---|---|---|---|
| tanpa cabang logika | Hapus record wishlist | `isWishlisted: false` | Passed |

### `getWishlist(userId)`
```js
const getWishlist = async (userId) => {
  const [rows] = await pool.query(`SELECT ... FROM wishlists w INNER JOIN products p ... WHERE w.user_id = ? AND p.deleted_at IS NULL ORDER BY w.created_at DESC`, [userId]);
  return rows.map((row) => ({ ... }));
};
```
| Kondisi | Hasil Yang Diharapkan | Hasil | Status |
|---|---|---|---|
| tanpa cabang logika | Kembalikan wishlist user | Daftar wishlist | Passed |

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
| Kondisi | Hasil Yang Diharapkan | Hasil | Status |
|---|---|---|---|
| Transaksi tidak ditemukan | Lempar `ApiError(404, "Transaksi tidak ditemukan.")` | `ApiError 404` | Passed |
| Reviewer bukan buyer | Lempar `ApiError(403, "Hanya pembeli yang dapat memberi review seller.")` | `ApiError 403` | Passed |
| Transaksi belum selesai | Lempar `ApiError(422, "Review hanya bisa dibuat setelah transaksi selesai.")` | `ApiError 422` | Passed |
| Sudah direview | Lempar `ApiError(409, "Transaksi ini sudah memiliki review.")` | `ApiError 409` | Passed |
| Valid | Buat review dan update rating seller | Review created | Passed |

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
| Kondisi | Hasil Yang Diharapkan | Hasil | Status |
|---|---|---|---|
| `targetType === "product"` tidak ditemukan | Lempar `ApiError(404, "Produk yang dilaporkan tidak ditemukan.")` | `ApiError 404` | Passed |
| `targetType === "product"` ditemukan | Lanjut | Lanjut | Passed |
| `targetType !== "product"` user tidak ditemukan | Lempar `ApiError(404, "User yang dilaporkan tidak ditemukan.")` | `ApiError 404` | Passed |
| `targetType !== "product"` user ditemukan | Lanjut | Lanjut | Passed |

### `createReport(reporterId, payload)`
```js
const createReport = async (reporterId, payload) => {
  await ensureReportTargetExists(payload);

  const [result] = await pool.query(`INSERT INTO reports (...) VALUES (?, ?, ?, ?, ?, ?, 'pending')`, [reporterId, payload.targetType, payload.targetType === "user" ? payload.targetUserId : null, payload.targetType === "product" ? payload.targetProductId : null, payload.reason, payload.details || null]);

  const [rows] = await pool.query(`SELECT ... FROM reports WHERE id = ? LIMIT 1`, [result.insertId]);
  return rows[0];
};
```
| Kondisi | Hasil Yang Diharapkan | Hasil | Status |
|---|---|---|---|
| Target laporan valid | Buat report dan kembalikan data | Laporan dibuat | Passed |

---

## notificationService.js

### `createNotification({ userId, ... })`
```js
const createNotification = async ({ userId, type, title, body, actionUrl = null }) => {
  if (!userId) {
    return null;
  }

  const [result] = await pool.query(`INSERT INTO notifications (user_id, type, title, body, action_url) VALUES (?, ?, ?, ?, ?)`, [userId, type, title, body, actionUrl]);
  const notification = await getNotificationById(result.insertId, userId);
  notificationEvents.emit(`notification:${userId}`, notification);
  return notification;
};
```
| Kondisi | Hasil Yang Diharapkan | Hasil | Status |
|---|---|---|---|
| `userId` kosong | Kembalikan `null` | `null` | Passed |
| `userId` ada | Simpan notifikasi, emit event, kembalikan objek | Notification object | Passed |

### `getNotificationById(notificationId, userId)`
```js
const getNotificationById = async (notificationId, userId) => {
  const [rows] = await pool.query(`SELECT ... FROM notifications WHERE id = ? AND user_id = ? LIMIT 1`, [notificationId, userId]);
  return rows.length ? formatNotification(rows[0]) : null;
};
```
| Kondisi | Hasil Yang Diharapkan | Hasil | Status |
|---|---|---|---|
| `rows.length == 0` | Kembalikan `null` | `null` | Passed |
| `rows.length == 1` | Kembalikan notifikasi | Notification object | Passed |

### `getNotifications(userId)`
```js
const getNotifications = async (userId) => {
  const [rows] = await pool.query(`SELECT ... FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50`, [userId]);
  const notifications = rows.map(formatNotification);
  const unreadCount = notifications.filter((notification) => !notification.readAt).length;
  return { notifications, unreadCount };
};
```
| Kondisi | Hasil Yang Diharapkan | Hasil | Status |
|---|---|---|---|
| Tanpa cabang tambahan | Hitung unread dan kembalikan notifikasi | `{ notifications, unreadCount }` | Passed |

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
| Kondisi | Hasil Yang Diharapkan | Hasil | Status |
|---|---|---|---|
| `affectedRows == 0` | Lempar `ApiError(404, "Notifikasi tidak ditemukan.")` | `ApiError 404` | Passed |
| `affectedRows > 0` | Kembalikan notifikasi terbaru | Notification object | Passed |

### `markAllAsRead(userId)`
```js
const markAllAsRead = async (userId) => {
  await pool.query(`UPDATE notifications SET read_at = COALESCE(read_at, NOW()) WHERE user_id = ? AND read_at IS NULL`, [userId]);
  return getNotifications(userId);
};
```
| Kondisi | Hasil Yang Diharapkan | Hasil | Status |
|---|---|---|---|
| Tanpa cabang tambahan | Tandai semua read dan return list | Semua notifikasi read | Passed |

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
| Kondisi | Hasil Yang Diharapkan | Hasil | Status |
|---|---|---|---|
| `token` kosong | Lempar `ApiError(401, "Token stream tidak ditemukan.")` | `ApiError 401` | Passed |
| User tidak ditemukan atau disuspend | Lempar `ApiError(401, "User stream tidak valid.")` | `ApiError 401` | Passed |
| Valid | Kembalikan user stream | Valid user object | Passed |

---

## chatService.js

### `getConversationById(conversationId, userId)`
```js
const getConversationById = async (conversationId, userId) => {
  const [rows] = await pool.query(`SELECT ... WHERE c.id = ? AND (c.buyer_id = ? OR c.seller_id = ?) LIMIT 1`, [conversationId, userId, userId]);
  return rows.length ? formatConversation(rows[0], userId) : null;
};
```
| Kondisi | Hasil Yang Diharapkan | Hasil | Status |
|---|---|---|---|
| `rows.length == 0` | Kembalikan `null` | `null` | Passed |
| `rows.length == 1` | Kembalikan conversation | Conversation object | Passed |

### `getConversations(userId)`
```js
const getConversations = async (userId) => {
  const [rows] = await pool.query(`SELECT ... WHERE c.buyer_id = ? OR c.seller_id = ? ORDER BY c.last_message_at DESC LIMIT 100`, [userId, userId, userId]);
  return rows.map((row) => formatConversation(row, userId));
};
```
| Kondisi | Hasil Yang Diharapkan | Hasil | Status |
|---|---|---|---|
| Tanpa cabang tambahan | Kembalikan daftar percakapan | Conversation list | Passed |

### `getMessages(conversationId, userId)`
```js
const getMessages = async (conversationId, userId) => {
  const conversation = await getConversationById(conversationId, userId);

  if (!conversation) {
    throw new ApiError(404, "Percakapan tidak ditemukan.");
  }

  await pool.query("UPDATE messages SET read_at = COALESCE(read_at, NOW()) WHERE conversation_id = ? AND sender_id <> ?", [conversationId, userId]);
  const [rows] = await pool.query(`SELECT ... FROM messages WHERE conversation_id = ? ORDER BY created_at ASC LIMIT 200`, [conversationId]);
  return rows.map(formatMessage);
};
```
| Kondisi | Hasil Yang Diharapkan | Hasil | Status |
|---|---|---|---|
| Percakapan tidak ditemukan | Lempar `ApiError(404, "Percakapan tidak ditemukan.")` | `ApiError 404` | Passed |
| Percakapan ditemukan | Update read_at dan kembalikan pesan | Pesan ditampilkan | Passed |

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

  const [result] = await pool.query(`INSERT INTO conversations (...) VALUES (?, ?, ?, NOW()) ON DUPLICATE KEY UPDATE last_message_at = NOW(), id = LAST_INSERT_ID(id)`, [payload.productId, buyerId, product.sellerId]);
  const message = await sendMessage(result.insertId, buyerId, payload.message, false);
  ...
};
```
| Kondisi | Hasil Yang Diharapkan | Hasil | Status |
|---|---|---|---|
| Produk tidak ditemukan | Lempar `ApiError(404, "Produk tidak ditemukan.")` | `ApiError 404` | Passed |
| Buyer sama seller | Lempar `ApiError(422, "Tidak bisa membuka chat dengan produk sendiri.")` | `ApiError 422` | Passed |
| Valid | Buat percakapan, kirim pesan, notifikasi | Conversation created | Passed |

### `sendMessage(conversationId, senderId, message, shouldNotify = true)`
```js
const sendMessage = async (conversationId, senderId, message, shouldNotify = true) => {
  const conversation = await getConversationById(conversationId, senderId);

  if (!conversation) {
    throw new ApiError(404, "Percakapan tidak ditemukan.");
  }

  const recipientId = conversation.buyer.id === senderId ? conversation.seller.id : conversation.buyer.id;
  const [result] = await pool.query(`INSERT INTO messages (conversation_id, sender_id, body) VALUES (?, ?, ?)`, [conversationId, senderId, message]);
  await pool.query("UPDATE conversations SET last_message_at = NOW() WHERE id = ?", [conversationId]);
  ...
  if (shouldNotify) {
    await createNotification({ userId: recipientId, type: "chat", title: "Pesan chat baru", body: createdMessage.body, actionUrl: "/dashboard/chat" });
  }
  return createdMessage;
};
```
| Kondisi | Hasil Yang Diharapkan | Hasil | Status |
|---|---|---|---|
| Percakapan tidak ditemukan | Lempar `ApiError(404, "Percakapan tidak ditemukan.")` | `ApiError 404` | Passed |
| Valid | Simpan pesan, update last_message_at, notifikasi | Message sent | Passed |

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
| Kondisi | Hasil Yang Diharapkan | Hasil | Status |
|---|---|---|---|
| Token kosong | Lempar `ApiError(401, "Token stream tidak ditemukan.")` | `ApiError 401` | Passed |
| User tidak valid | Lempar `ApiError(401, "User stream tidak valid.")` | `ApiError 401` | Passed |
| Valid | Kembalikan user stream | Valid user | Passed |

---

## categoryService.js

### `getCategories()`
```js
const getCategories = async () => {
  const [rows] = await pool.query(`SELECT id, name, slug, created_at AS createdAt FROM categories ORDER BY name ASC`);
  return rows;
};
```
| Kondisi | Hasil Yang Diharapkan | Hasil | Status |
|---|---|---|---|
| Tanpa cabang logika | Kembalikan daftar kategori | Category list | Passed |

---

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
  const factor = (conditionFactor[payload.conditionLabel] || 0.58) * (categoryFactor[category.slug] || categoryFactor.lainnya) * depreciation * boxBonus * (urgencyFactor[payload.urgency || "normal"] || 1);
  const median = Math.max(1000, Math.round((base * factor) / 1000) * 1000);
  ...
  return { category, originalPrice: base, suggestedMin, suggestedMedian: median, suggestedMax, confidence: ageMonths <= 36 ? "high" : "medium", advice: payload.urgency === "high" ? "Gunakan harga median atau minimum agar barang lebih cepat laku." : "Pasang harga mendekati batas atas jika barang lengkap, bersih, dan siap COD." };
};
```
| Kondisi | Hasil Yang Diharapkan | Hasil | Status |
|---|---|---|---|
| Kategori ditemukan | Gunakan kategori DB | Category dari DB | Passed |
| Kategori tidak ditemukan | Gunakan slug default `lainnya` | Category default | Passed |
| `includesBox == true` | Terapkan bonus box | `boxBonus = 1.04` | Passed |
| `ageMonths <= 36` | confidence high | `confidence = "high"` | Passed |
| `ageMonths > 36` | confidence medium | `confidence = "medium"` | Passed |

---

## adminService.js

### `getDashboardStats()`
```js
const getDashboardStats = async () => {
  const [[users], [products], [offers], [transactions], [reports], [verifications]] = await Promise.all([...]);
  return { totalUsers: ..., pendingVerifications: ... };
};
```
| Kondisi | Hasil Yang Diharapkan | Hasil | Status |
|---|---|---|---|
| Tanpa cabang logika | Kembalikan statistik admin | Admin stats | Passed |

### `getUsers(query = {})`
```js
const getUsers = async (query = {}) => {
  const conditions = [];
  const params = [];

  if (query.search) {
    conditions.push("(full_name LIKE ? OR email LIKE ? OR campus LIKE ?)");
    const keyword = `%${query.search}%`;
    params.push(keyword, keyword, keyword);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const [rows] = await pool.query(`SELECT ... FROM users ${whereClause} ORDER BY created_at DESC LIMIT 100`, params);
  return rows.map((row) => ({ ...row, ratingAverage: Number(row.ratingAverage || 0), ratingCount: Number(row.ratingCount || 0), isSuspended: Boolean(row.isSuspended), productCount: Number(row.productCount || 0) }));
};
```
| Kondisi | Hasil Yang Diharapkan | Hasil | Status |
|---|---|---|---|
| `query.search` tersedia | Tambahkan filter pencarian | Query filter search diterapkan | Passed |
| `query.search` tidak ada | Query tanpa filter search | Semua user | Passed |

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
| Kondisi | Hasil Yang Diharapkan | Hasil | Status |
|---|---|---|---|
| adminId == userId | Lempar `ApiError(422, "Admin tidak bisa suspend akun sendiri.")` | `ApiError 422` | Passed |
| `affectedRows == 0` | Lempar `ApiError(404, "User tidak ditemukan.")` | `ApiError 404` | Passed |
| valid | Suspend user sukses | User found | Passed |

### `getProducts()`
```js
const getProducts = async () => {
  const [rows] = await pool.query(`SELECT ... FROM products p INNER JOIN categories c ON c.id = p.category_id INNER JOIN users u ON u.id = p.seller_id ORDER BY p.created_at DESC LIMIT 100`);
  return rows.map((row) => ({ ...row, price: Number(row.price) }));
};
```
| Kondisi | Hasil Yang Diharapkan | Hasil | Status |
|---|---|---|---|
| Tanpa cabang logika | Kembalikan produk admin | Product list | Passed |

### `getReports()`
```js
const getReports = async () => {
  const [rows] = await pool.query(`SELECT ... FROM reports r INNER JOIN users reporter ON reporter.id = r.reporter_id LEFT JOIN ... ORDER BY FIELD(r.status, 'pending', 'reviewed', 'resolved', 'rejected'), r.created_at DESC LIMIT 100`);
  return rows;
};
```
| Kondisi | Hasil Yang Diharapkan | Hasil | Status |
|---|---|---|---|
| Tanpa cabang logika | Kembalikan laporan admin | Report list | Passed |

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
| Kondisi | Hasil Yang Diharapkan | Hasil | Status |
|---|---|---|---|
| `affectedRows == 0` | Lempar `ApiError(404, "Laporan tidak ditemukan.")` | `ApiError 404` | Passed |
| valid | Kembalikan laporan yang diperbarui | Report updated | Passed |

---

## Catatan
- Dokumen ini mengikuti format gambar: setiap fungsi ditampilkan sebagai blok kode, lalu diiringi tabel kontrol alur.
- Semua tabel dibuat berdasarkan logika fungsi yang ada pada service backend.
- Tidak ada jalur kontrol tambahan yang ditambahkan atau dikurangi dari kode asli.
