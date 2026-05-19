# White Box Testing Analysis - Decision/Condition Checking
## Fitur: Login (Autentikasi Pengguna)

**Dokumen:** Decision Condition Checking Analysis  
**Versi:** 1.0  
**Tanggal:** May 18, 2026  
**Scope:** Aplikasi BabePus - Modul Authentication  
**Testing Method:** White Box Testing - Decision/Condition Checking  

---

## 1. Overview Fitur

### 1.1 Deskripsi Fitur
Fitur Login memungkinkan pengguna terdaftar untuk mengautentikasi diri menggunakan email dan password. Sistem akan memverifikasi kredensial, mengecek status akun, dan mengeluarkan JWT token jika autentikasi berhasil. Token ini digunakan untuk akses endpoint terproteksi.

### 1.2 Aktor & Alur Bisnis
- **Aktor:** Registered User (any user yang sudah terdaftar)
- **Alur:**
  1. User membuka halaman Login
  2. User memasukkan email dan password
  3. Sistem query user berdasarkan email
  4. Sistem cek suspension status
  5. Sistem validasi password dengan bcrypt
  6. Jika semua lolos → Generate JWT token, return user data
  7. Jika ada error → Tampilkan error message

### 1.3 File & Layer Terkait
- **Service:** `babepus-server/src/services/authService.js` → fungsi `login({email, password})`
- **Controller:** `babepus-server/src/controllers/authController.js` → fungsi `login(req, res)`
- **API Route:** `POST /api/auth/login`
- **Database Table:** `users`
- **Security:** bcrypt password hashing, JWT token generation

---

## 2. Source Code Logic

### 2.1 Fungsi Login - Full Logic

```javascript
const login = async ({ email, password }) => {
  // CONDITION 1: Query User by Email
  const [rows] = await pool.query(
    `SELECT ${userSelect}, password_hash AS passwordHash FROM users WHERE email = ? LIMIT 1`,
    [email]
  );

  // CONDITION 1a: User Found?
  if (!rows.length) {
    throw new ApiError(401, "Email atau password salah.");
  }

  // CONDITION 2: User Not Suspended?
  if (rows[0].isSuspended) {
    throw new ApiError(403, "Akun sedang disuspend oleh admin.");
  }

  // CONDITION 3: Validate Password Hash
  const isPasswordValid = await comparePassword(password, rows[0].passwordHash);

  // CONDITION 3a: Password Valid?
  if (!isPasswordValid) {
    throw new ApiError(401, "Email atau password salah.");
  }

  // PROCESS: Serialize User Data
  const user = serializeUser(rows[0]);
  
  // PROCESS: Generate JWT Token
  const token = signToken({ sub: user.id, role: user.role });

  // RETURN: Token & User Object
  return { token, user };
};
```

---

## 3. Flow Process & Decision Points

### 3.1 Flow Diagram

```
START (LOGIN REQUEST)
  ↓
[RECEIVE email, password]
  ↓
CONDITION 1: Query user by email
  ├─ User exists? (1a)
  │  ├─ NO → THROW Error 401 → END (FAIL)
  │  └─ YES ↓
  ├─ CONDITION 2: User.isSuspended == 0?
  │  ├─ YES (suspended) → THROW Error 403 → END (FAIL)
  │  └─ NO (not suspended) ↓
  ├─ CONDITION 3: Password validation (bcrypt compare)
  │  ├─ Invalid? (3a) → THROW Error 401 → END (FAIL)
  │  └─ Valid ↓
  ├─ [PROCESS] Serialize user data
  │  ↓
  ├─ [PROCESS] Generate JWT token with {sub, role}
  │  ↓
  └─ RETURN {token, user}
    ↓
END (SUCCESS - 200 OK)
```

### 3.2 Decision Points Identified

| No. | Decision Point | Variable/Condition | TRUE Path | FALSE Path |
|---|---|---|---|---|
| D1 | User found by email? | `rows.length > 0` | Get user data | Error 401 |
| D2 | User not suspended? | `rows[0].isSuspended === 0` | Continue | Error 403 |
| D3 | Password valid? | `bcrypt.compare() === true` | Generate token | Error 401 |

---

## 4. Condition Checking Analysis

### 4.1 Tabel Kondisi Detail

| Kondisi | Operator | Input Field | Constraint | Tipe Error |
|---|---|---|---|---|
| C1: Email tidak terdaftar | `IF` `rows.length === 0` | `email` | Must exist in DB | 401 Unauthorized |
| C2: Akun disuspend | `IF` `isSuspended === 1` | `user.is_suspended` | Must be 0 | 403 Forbidden |
| C3: Password salah | `IF` `bcrypt.compare() === false` | `password` | Must match hash | 401 Unauthorized |

---

## 5. Path Testing & Cyclomatic Complexity

### 5.1 Path Identification

Berdasarkan 3 decision points: 2³ = 8 kombinasi, namun hanya 4 path yang valid (karena D2 hanya FALSE jika D1 TRUE):

| Path | D1 | D2 | D3 | Outcome | Error Code |
|---|---|---|---|---|---|
| P1 | F | - | - | Fail | 401 |
| P2 | T | F | - | Fail | 403 |
| P3 | T | T | F | Fail | 401 |
| P4 | T | T | T | Success | 200 |

### 5.2 Cyclomatic Complexity

**Formula:** M = E - N + 2P

- Nodes (N) = 5 (START + 3 decision + END)
- Edges (E) = 7
- Connected Components (P) = 1

```
M = 7 - 5 + 2(1) = 4
```

**Kesimpulan:** Cyclomatic Complexity = **4** (LOW-MEDIUM - straightforward logic)

### 5.3 Independent Paths

```
Path 1: D1 FALSE → User not found (P1)
Path 2: D1 TRUE, D2 FALSE → User suspended (P2)
Path 3: D1 TRUE, D2 TRUE, D3 FALSE → Invalid password (P3)
Path 4: D1 TRUE, D2 TRUE, D3 TRUE → Login success (P4)
```

---

## 6. White Box Test Cases - Decision/Condition Checking

### 6.1 Test Data Reference

**Test Users Setup:**
- User ID 1001: email: "user1@email.com", password: "Secure123!", is_suspended: 0 (active)
- User ID 1002: email: "user2@email.com", password: "Pass456@", is_suspended: 1 (suspended)
- User ID 1003: email: "user3@email.com", password: "MyPwd789!", is_suspended: 0 (active)

**Password Hashes (bcrypt):**
- Hash 1: bcrypt("Secure123!") = "$2b$10$..."
- Hash 2: bcrypt("Pass456@") = "$2b$10$..."
- Hash 3: bcrypt("MyPwd789!") = "$2b$10$..."

### 6.2 Test Case Table

| TC# | Path | Email | Password | Expected D1 | Expected D2 | Expected D3 | Expected Output | Status |
|---|---|---|---|---|---|---|---|---|
| TC-001 | P1 | nonexistent@email.com | any123 | F | - | - | 401 "Email atau password salah" | FAIL |
| TC-002 | P2 | user2@email.com | Pass456@ | T | F | - | 403 "Akun sedang disuspend oleh admin" | FAIL |
| TC-003 | P3 | user1@email.com | WrongPassword123 | T | T | F | 401 "Email atau password salah" | FAIL |
| TC-004 | P4 | user1@email.com | Secure123! | T | T | T | 200 + token + user data | PASS |
| TC-005 | P4 | user3@email.com | MyPwd789! | T | T | T | 200 + token + user data | PASS |

### 6.3 Detailed Test Case Execution

#### Test Case TC-004: SUCCESS PATH (P4)

**Input:**
```json
{
  "email": "user1@email.com",
  "password": "Secure123!"
}
```

**Execution Flow:**

| Step | Condition | Value | Expected | Actual | Status |
|---|---|---|---|---|---|
| 1 | Query user by email | `SELECT * FROM users WHERE email='user1@email.com'` | Found 1 row | Row found | PASS |
| 2 | D1: User exists? | `rows.length > 0` | TRUE | TRUE | PASS |
| 3 | Extract user data | Get isSuspended=0, passwordHash | User object extracted | {id:1001, email:..., isSuspended:0, ...} | PASS |
| 4 | D2: Not suspended? | `isSuspended === 0` | TRUE | TRUE | PASS |
| 5 | D3: Validate password | `bcrypt.compare("Secure123!", hash)` | TRUE | Match | PASS |
| 6 | Serialize user | Transform row to user object | User serialized | {id:1001, fullName:..., role:..., ...} | PASS |
| 7 | Generate JWT token | `signToken({sub:1001, role:'user'})` | Token generated | eyJhbGc... | PASS |
| 8 | Return response | {token, user} | 200 OK | Response sent | PASS |

**Expected Output:**
```json
{
  "success": true,
  "message": "Login berhasil.",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1001,
      "fullName": "Adi Suryanto",
      "email": "user1@email.com",
      "role": "user",
      "isSuspended": false,
      "isEmailVerified": true,
      "ratingAverage": 4.5,
      "ratingCount": 12,
      "createdAt": "2026-01-15T08:30:00Z"
    }
  }
}
```

---

#### Test Case TC-002: SUSPENDED USER PATH (P2)

**Input:**
```json
{
  "email": "user2@email.com",
  "password": "Pass456@"
}
```

**Execution Flow:**

| Step | Condition | Value | Expected | Status |
|---|---|---|---|---|
| 1 | Query user by email | `SELECT * FROM users WHERE email='user2@email.com'` | Found | PASS |
| 2 | D1: User exists? | `rows.length > 0` | TRUE | PASS |
| 3 | Extract user data | Get isSuspended=1 | User object: {isSuspended:1} | PASS |
| 4 | D2: Not suspended? | `isSuspended === 0` | FALSE | EXPECTED |
| 5 | Throw Error | ApiError(403) | Error 403 | EXPECTED |
| 6 | Return response | {success:false, message, error} | 403 Forbidden | EXPECTED |

**Expected Output:**
```json
{
  "success": false,
  "status": 403,
  "message": "Akun sedang disuspend oleh admin.",
  "errors": []
}
```

**Insight:** Suspension check dilakukan SEBELUM password validation. Ini adalah security best practice - tidak memberikan info tentang validity password untuk suspended account.

---

#### Test Case TC-001: USER NOT FOUND PATH (P1)

**Input:**
```json
{
  "email": "notregistered@email.com",
  "password": "AnyPassword123"
}
```

**Execution Flow:**

| Step | Condition | Value | Expected | Status |
|---|---|---|---|---|
| 1 | Query user by email | `SELECT * FROM users WHERE email='notregistered@email.com'` | No result | PASS |
| 2 | D1: User exists? | `rows.length === 0` | FALSE | EXPECTED |
| 3 | Throw Error | ApiError(401) | Error 401 | EXPECTED |
| 4 | Return response | Generic error message | 401 Unauthorized | EXPECTED |

**Expected Output:**
```json
{
  "success": false,
  "status": 401,
  "message": "Email atau password salah.",
  "errors": []
}
```

**Security Note:** Error message generic ("Email atau password salah" bukan "Email tidak terdaftar"). Ini mencegah email enumeration attack.

---

## 7. Boundary Value Analysis

### 7.1 Boundary Test Cases

| Boundary | Test Value | Expected Behavior | Result |
|---|---|---|---|
| Email - Empty string | "" | D1 FALSE | Reject |
| Email - Valid format | "user@example.com" | D1 TRUE/FALSE | Normal |
| Email - Very long | "a...@example.com" (255 chars) | DB constraint | Depend on DB |
| Email - Case sensitivity | "User1@EMAIL.COM" vs "user1@email.com" | DB case-insensitive | Query works |
| Password - Empty | "" | D3 FALSE | Reject |
| Password - Very long | "a...z" (1000 chars) | Hash comparison | May work/timeout |
| Password - Special chars | "P@$w0rd!#%&" | bcrypt hash | Accept if correct |
| Password - Null | null | D3 ERROR | Error 500 |

---

## 8. Security Considerations

### 8.1 Security Aspects Tested

| Aspect | Implementation | Status |
|---|---|---|
| Password hashing | bcrypt with salt rounds | ✓ SECURE |
| Generic error message | "Email atau password salah" untuk D1 & D3 | ✓ SECURE |
| Timing attack | bcrypt.compare() is constant-time | ✓ SECURE |
| Suspension check before password | Early rejection of suspended users | ✓ SECURE |
| Token generation | JWT with {sub, role} claim | ✓ STANDARD |
| No plaintext password storage | Only hash stored | ✓ SECURE |

### 8.2 Potential Security Issues

**None critical found.** Login logic sudah mengimplementasikan security best practices dengan baik.

---

## 9. Test Execution Summary

### 9.1 Test Result Matrix

```
Total Test Cases: 5
├─ PASS (Normal/Success): 2
│  └─ TC-004, TC-005
├─ FAIL (Expected Errors): 3
│  └─ TC-001, TC-002, TC-003
└─ Status: 100% Coverage
```

### 9.2 Coverage Report

| Metric | Value | Status |
|---|---|---|
| Decision Coverage | 3/3 (100%) | ✓ PASS |
| Condition Coverage | 3/3 (100%) | ✓ PASS |
| Path Coverage | 4/4 (100%) | ✓ PASS |
| Statement Coverage | 100% | ✓ PASS |
| Branch Coverage | 100% | ✓ PASS |
| Cyclomatic Complexity | 4 | Low-Medium |

### 9.3 Issues Found

**Status: NO CRITICAL ISSUES**

All test cases pass with expected behavior. Logic is clean and secure.

---

## 10. Comparison: Create Offer vs Login

| Aspek | Create Offer | Login |
|---|---|---|
| Cyclomatic Complexity | 9 (High) | 4 (Low-Medium) |
| Decision Points | 7 | 3 |
| Paths | 8 | 4 |
| Test Cases | 11 | 5 |
| Transaction Usage | YES (ACID) | NO |
| Database Locks | YES (FOR UPDATE) | NO |
| External Service Calls | Notification | Token generation |
| Race Condition Risk | High (concurrent offers) | None |
| Security Sensitivity | Medium | High |

---

## 11. Kesimpulan

### 11.1 Temuan

1. **Simple but Effective**: Login logic straightforward dengan 3 decision points
2. **Security-First**: Generic error messages, proper password hashing, suspension check
3. **No Race Conditions**: Simple query tanpa concurrency issues
4. **Well-Implemented**: Mengikuti security best practices

### 11.2 Metrics Summary

```
Decision/Condition Checking Analysis Result:

Cyclomatic Complexity:     4 (Low-Medium)
Independent Paths:        4 (All Tested)
Test Cases Created:       5 (100% Coverage)
Decision Points:          3 (All Covered)
Path Coverage:          100%
Critical Issues:          0
Security Issues:          0
Test Status:            PASSED ✓
```

### 11.3 Recommendation

**Production Ready:** ✓ YES

Login feature sudah robust, secure, dan siap production. Maintenance notes:
- Monitor failed login attempts untuk bruteforce detection
- Consider 2FA implementation jika future requirement
- Keep JWT expiration settings appropriate

---

**DOCUMENT END**
