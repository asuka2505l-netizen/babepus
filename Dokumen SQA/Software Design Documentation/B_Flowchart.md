# B. Flowchart

Dokumen ini menjelaskan alur kerja aplikasi BabePus secara visual dan langkah demi langkah.

## 1. Alur Kerja Umum

```mermaid
flowchart TD
  A[Pengguna membuka aplikasi web] --> B[Frontend React memuat halaman]
  B --> C[Pengguna memilih aksi]
  C --> D{Aksi pengguna}
  D -->|Login/Register| E[Form autentikasi]
  D -->|Lihat produk| F[Request daftar produk ke API]
  D -->|Lihat detail| G[Request produk / detail ke API]
  D -->|Buat penawaran| H[Request penawaran ke API]
  D -->|Chat| I[Request pesan / kirim pesan ke API]
  E --> J[Backend memproses autentikasi]
  F --> K[Backend mengambil data produk dari database]
  G --> L[Backend mengambil detail produk dari database]
  H --> M[Backend menyimpan penawaran ke database]
  I --> N[Backend menyimpan / mengambil pesan chat]
  J --> O[Backend mengirim respon ke frontend]
  K --> O
  L --> O
  M --> O
  N --> O
  O --> P[Frontend menampilkan hasil ke pengguna]
```

## 2. Flowchart Interaksi Frontend dan Backend

```mermaid
flowchart TB
  subgraph Frontend
    A1[Halaman UI React]
    A2[Form & tombol aksi]
    A3[HTTP request ke API]
    A4[Tampilan hasil]
  end

  subgraph Backend
    B1[Express Router]
    B2[Controller / Service]
    B3[Database MariaDB]
    B4[Upload file / storage]
  end

  A1 --> A2
  A2 --> A3
  A3 --> B1
  B1 --> B2
  B2 --> B3
  B2 --> B4
  B3 --> B2
  B4 --> B2
  B2 --> A4
  A4 --> A1
```

## 3. Penjelasan Langkah Alur Utama

1. Pengguna membuka aplikasi BabePus dan frontend React akan memuat halaman awal.
2. Pengguna melakukan aksi seperti login, melihat produk, membuat penawaran, atau chat.
3. Frontend mengirim request HTTP/HTTPS ke backend API untuk memproses aksi.
4. Backend menerima permintaan, menjalankan kontroler yang sesuai, dan berinteraksi dengan database atau storage.
5. Backend mengembalikan hasil atau data ke frontend.
6. Frontend menampilkan hasil kepada pengguna.

## 4. Contoh Alur Spesifik: Login

```mermaid
flowchart TD
  U[User memasukkan email/password] --> F[Frontend kirim POST /login]
  F --> B[Backend menerima request]
  B --> V[Validasi data & cek kredensial]
  V --> DB[Database: cari user]
  DB --> V
  V --> T{Kredensial valid?}
  T -->|Ya| S[Generate token & respon sukses]
  T -->|Tidak| E[Respon error]
  S --> F
  E --> F
  F --> U[Frontend tampilkan status login]
```

## 5. Contoh Alur Spesifik: Marketplace

```mermaid
flowchart TD
  U2[Pengguna membuka halaman marketplace] --> F2[Frontend request GET /products]
  F2 --> B2[Backend terima permintaan]
  B2 --> DB2[Query daftar produk]
  DB2 --> B2
  B2 --> F2[Response daftar produk]
  F2 --> U2[Frontend render produk]
```

## 6. Ringkasan

Flowchart ini menggambarkan bahwa aplikasi BabePus bekerja sebagai SPA React yang berinteraksi dengan backend API Node.js/Express, dan backend tersebut bertanggung jawab mengakses database serta storage untuk menyelesaikan setiap operasi.
