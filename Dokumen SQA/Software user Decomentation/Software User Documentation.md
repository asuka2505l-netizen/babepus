# Software User Documentation

## 1. Overview
BabePus adalah aplikasi marketplace web untuk komunitas kampus yang membantu mahasiswa dan staff kampus menjual, membeli, dan menawar barang bekas. Dokumentasi ini menjelaskan cara menggunakan aplikasi dari sisi pengguna.

## 2. Supported User Roles
- **Guest**: Pengguna yang belum login. Dapat melihat produk di marketplace dan detil produk.
- **Buyer**: Pengguna yang telah login dan dapat membeli, membuat penawaran, mengelola wishlist, chat, mengajukan laporan, serta menulis review.
- **Seller**: Pengguna terautentikasi yang dapat membuat, mengedit, menghapus produk, melihat penawaran masuk, dan memantau transaksi.
- **Admin**: Pengguna khusus dengan akses dashboard admin untuk memantau platform, mengelola pengguna, menanggapi laporan, dan menyuspend user.

## 3. Getting Started
1. Buka aplikasi BabePus di browser (web-based).
2. Jika belum memiliki akun, pilih menu `Register`.
3. Isi data pendaftaran:
   - Email kampus
   - Password
   - Nama lengkap
   - Nomor telepon
   - Kampus
   - Fakultas
   - Program studi
   - Nomor induk mahasiswa (student ID)
4. Setelah mendaftar, login menggunakan email dan password.
5. Setelah login, Anda dapat mengakses dashboard, marketplace, profil, dan fitur yang tersedia sesuai peran.

## 4. Authentication
### 4.1 Login
- Masuk ke halaman `Login`.
- Masukkan email dan password.
- Jika berhasil, aplikasi menyimpan token autentikasi dan mengarahkan Anda ke halaman utama atau dashboard.

### 4.2 Logout & Token Expiry
- jika token kedaluwarsa atau server mengembalikan error 401, aplikasi akan otomatis mengeluarkan Anda dan mengarahkan ke halaman login.

### 4.3 Email Verification
- Setelah register, sistem dapat mengirimkan token verifikasi ke email.
- Pada dashboard profil, Anda dapat membuat token verifikasi dan memasukkannya untuk memverifikasi email.
- Verifikasi email memastikan akun Anda aktif sepenuhnya.

## 5. Marketplace
### 5.1 Melihat Daftar Produk
- Buka halaman `Marketplace`.
- Produk ditampilkan dengan foto, nama, harga, kondisi, lokasi/kampus, dan rating seller.
- Gunakan fitur pencarian dan filter untuk menyaring produk berdasarkan kategori, kondisi, harga, dan lokasi.

### 5.2 Melihat Detail Produk
- Klik produk untuk membuka halaman detail.
- Di halaman detail, Anda dapat melihat:
  - Foto produk
  - Nama produk
  - Harga
  - Kondisi
  - Deskripsi lengkap
  - Lokasi / kampus
  - Informasi seller (nama, rating, avatar)
  - Tombol aksi seperti `Tawar`, `Chat Seller`, dan `Tambah ke Wishlist`.

## 6. Seller Features
### 6.1 Menambahkan Produk Baru
- Buka `Dashboard` Anda, pilih halaman `Products` atau `Tambah Produk`.
- Isi detail produk:
  - Nama produk
  - Deskripsi
  - Kategori
  - Harga
  - Kondisi
  - Foto produk
  - Lokasi / kampus
- Submit form untuk mempublikasikan produk.

### 6.2 Mengedit Produk
- Di halaman `Dashboard > Products`, pilih produk milik Anda.
- Ubah informasi yang diperlukan.
- Simpan pembaruan.

### 6.3 Menghapus Produk
- Di halaman `Dashboard > Products`, pilih produk yang ingin dihapus.
- Konfirmasi penghapusan.
- Produk akan dihapus dari marketplace.

### 6.4 Menandai Produk Terjual
- Jika produk sudah terjual, gunakan opsi pada halaman produk atau listing untuk menandai produk sebagai sold.

## 7. Buyer & Offer Flow
### 7.1 Mengajukan Penawaran
- Pada halaman detail produk, klik `Tawar`.
- Masukkan harga tawaran dan pesan (opsional).
- Submit penawaran.
- Status penawaran akan muncul di dashboard seller.

### 7.2 Melihat Penawaran Masuk (Seller)
- Seller membuka halaman `Offers` di dashboard.
- Semua penawaran untuk produk seller akan ditampilkan.
- Penawaran ditampilkan dengan informasi buyer, harga yang ditawarkan, status, dan waktu.

### 7.3 Menerima atau Menolak Penawaran
- Seller pilih penawaran yang ingin direspons.
- Gunakan tombol `Terima` atau `Tolak`.
- Jika diterima, sistem akan membuat transaksi secara otomatis.
- Jika ditolak, buyer akan diberitahu.

## 8. Transactions
### 8.1 Melihat Riwayat Transaksi
- Buka halaman `Transactions` di dashboard.
- Lihat semua transaksi yang berkaitan dengan Anda sebagai buyer atau seller.
- Detail transaksi mencakup status, produk, harga, counterpart user, dan waktu.

### 8.2 Menyelesaikan Transaksi
- Setelah penawaran diterima dan pertemuan selesai, tandai transaksi sebagai `completed`.
- Status akan diperbarui di sistem dan review dapat dilakukan.

## 9. Wishlist
### 9.1 Menambahkan Produk ke Wishlist
- Saat melihat detail produk, klik tombol `Tambah ke Wishlist` atau icon hati.
- Produk akan disimpan ke daftar wishlist Anda.

### 9.2 Melihat Wishlist
- Buka halaman `Wishlist` di dashboard.
- Semua produk yang disimpan dapat dilihat di satu tempat.
- Dari sini, Anda juga dapat mengakses detail produk atau menghapus item.

### 9.3 Menghapus Produk dari Wishlist
- Di halaman wishlist, pilih item yang ingin dihapus.
- Konfirmasi penghapusan.
- Produk akan dihapus dari daftar.

## 10. Chat & Messaging
### 10.1 Memulai Chat
- Klik tombol `Chat` di halaman detail produk atau profile user.
- Sistem akan membuka percakapan baru jika belum ada.
- Semua pesan disimpan dalam thread obrolan.

### 10.2 Mengirim Pesan
- Ketik pesan Anda di input chat.
- Klik tombol `Send` atau tekan `Enter`.
- Pesan akan dikirim ke lawan bicara dan ditampilkan di layar percakapan.

### 10.3 Melihat Daftar Chat
- Buka halaman `Chat` di dashboard.
- Daftar percakapan menampilkan avatar, nama lawan bicara, preview pesan terakhir, dan timestamp.
- Gunakan daftar untuk memilih percakapan yang ingin dilanjutkan.

## 11. Review & Rating
### 11.1 Menulis Review
- Setelah transaksi selesai, buka detail transaksi.
- Pilih opsi `Buat Review`.
- Isi rating, judul review, komentar, dan foto jika tersedia.
- Submit review.

### 11.2 Melihat Review
- Review dapat dilihat di profile seller atau halaman review terkait.
- Tampilan review menampilkan rating, komentar, penulis review, dan tanggal.

## 12. Reporting Content
### 12.1 Melaporkan Produk atau Pengguna
- Di halaman detail produk atau profile user, pilih opsi `Report` atau `Laporkan`.
- Isi formulir laporan dengan kategori, deskripsi, dan lampiran jika perlu.
- Submit laporan.
- Laporan akan dikirimkan ke admin untuk ditinjau.

### 12.2 Status Laporan
- Admin dapat melihat, meninjau, dan memperbarui status laporan.
- Status laporan yang umum meliputi `open` dan `resolved`.

## 13. Notifications
### 13.1 Melihat Notifikasi
- Klik icon bell di bagian atas halaman.
- Daftar notifikasi menunjukkan pesan terkait tawaran, transaksi, chat, dan laporan.
- Klik notifikasi untuk menavigasi ke konten terkait.

### 13.2 Menandai Notifikasi Sudah Dibaca
- Buka panel notifikasi.
- Klik notifikasi atau tombol `Mark Read` untuk menandainya sebagai sudah dibaca.

## 14. Profile Management
### 14.1 Melihat dan Mengedit Profil
- Buka halaman `Profile` di dashboard.
- Edit informasi pribadi seperti nama, nomor telepon, kampus, fakultas, dan program studi.
- Simpan perubahan untuk memperbarui data Anda.

### 14.2 Upload Avatar
- Di halaman profil, pilih area upload avatar.
- Pilih file gambar dari perangkat Anda.
- Upload avatar baru dan simpan.
- Sistem akan menampilkan preview avatar baru setelah berhasil.

## 15. Admin User Guide
> Bagian ini berlaku untuk pengguna dengan peran `admin`.

### 15.1 Mengakses Dashboard Admin
- Buka halaman `/admin` setelah login sebagai admin.
- Dashboard menampilkan ringkasan jumlah user, produk, transaksi, pendapatan, laporan, dan pengguna yang disuspend.

### 15.2 Mengelola Pengguna
- Buka section `Users` di admin dashboard.
- Cari atau filter pengguna.
- Klik tombol `Suspend` untuk menangguhkan akses user.
- Klik kembali untuk `Un-suspend` jika ingin mengaktifkan kembali.

### 15.3 Menangani Laporan
- Buka section `Reports`.
- Tinjau daftar laporan, alasan, dan item terkait.
- Pilih aksi untuk menyelesaikan laporan, seperti menolak atau menyetujui tindakan.

### 15.4 Mengelola Produk
- Buka section `Products` di admin dashboard.
- Tinjau produk yang terdaftar.
- Admin dapat memutuskan tindakan moderation sesuai kebijakan.

## 16. Known Notes
- BabePus adalah aplikasi web-based, bukan aplikasi mobile APK.
- Email verification tersedia melalui token verifikasi dalam halaman profil.
- Notifikasi backend dan isi email tertentu dikendalikan oleh sistem server.

## 17. Support
Jika mengalami masalah, gunakan halaman `Contact` atau admin platform (jika tersedia) untuk meminta bantuan.

---

Dokumentasi ini dibuat berdasarkan fitur, use case, dan persyaratan yang terverifikasi dalam kode sumber BabePus.
