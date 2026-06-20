# Testing Endurance Image

Dokumen ini berisi pengujian endurance image berdasarkan tabel pada gambar referensi. Seluruh file bahan uji sudah tersedia di folder [endurance testing/src](endurance%20testing/src).

## Daftar File Gambar Uji

| No | File Gambar |
|---|---|
| 1 | [seo.jfif](endurance%20testing/src/seo.jfif) |
| 2 | [image.png](endurance%20testing/src/image.png) |
| 3 | [rhodes.jpg](endurance%20testing/src/rhodes.jpg) |
| 4 | [peakpx.jpg](endurance%20testing/src/peakpx.jpg) |
| 5 | [images.jpg](endurance%20testing/src/images.jpg) |
| 6 | [dreamina-2025-11-30-7497-buatkan gambar ini menjadi 16_9 tanpa me....png](endurance%20testing/src/dreamina-2025-11-30-7497-buatkan%20gambar%20ini%20menjadi%2016_9%20tanpa%20me....png) |

## Tabel Pengujian Endurance Image

| No | UCP | DCP | PKP | PKHE | HPS | HPU | WP | WPU | UCSP |
|---|---|---|---:|---:|---|---|---:|---:|---:|
| 1 | JPEG 4.46 KB | 100 x 100 | 585 | 1068 | Berhasil | Berhasil | 1.187 | 0.377 | 22.1 |
| 2 | JPG 7.16 KB | 150 x 150 | 585 | 1068 | Berhasil | Berhasil | 1.271 | 0.454 | 50.5 |
| 3 | JPEG 29.3 KB | 650 x 650 | 585 | 1068 | Berhasil | Berhasil | 1.396 | 0.612 | 110 |
| 4 | JPG 47.3 KB | 700 x 393 | 585 | 1068 | Berhasil | Berhasil | 1.326 | 0.565 | 613 |
| 5 | PNG 150 KB | 800 x 800 | 585 | 1068 | Berhasil | Berhasil | 1.443 | 0.596 | 274 |
| 6 | JPEG 4.46 KB | 100 x 100 | 1809 | 2983 | Gagal pesan terlalu panjang | - | - | - | - |

## Keterangan Variabel

- UCP = ukuran citra penampung
- DCP = dimensi citra penampung
- PKP = panjang karakter pesan
- PKHE = panjang karakter hasil enkripsi
- HPS = hasil penyisipan
- HPU = hasil penguraian
- WP = waktu penyisipan (detik)
- WPU = waktu penguraian (detik)
- UCSP = ukuran citra setelah penyisipan (KB)

## Kesimpulan

Berdasarkan pengujian, penyisipan dan penguraian pesan berhasil pada lima skenario pertama dengan ukuran citra dan dimensi yang berbeda. Skenario ke-6 gagal karena panjang pesan terlalu besar sehingga melebihi kapasitas citra penampung.