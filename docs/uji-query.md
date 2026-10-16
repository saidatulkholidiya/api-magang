# Uji Query — Sebelum vs Sesudah

| Input | Minggu 13 (Koreksi Diam) | Minggu 14 (Tolak Jelas) |
|-------|-------------------------|-------------------------|
| ?page=0 | 200, page dipaksa jadi 1 | 200, page jadi 1 |
| ?page=abc | 200, page dipaksa jadi 1 | 200, page jadi 1 |
| ?limit=1000 | 200, limit dipotong jadi 100 | 200, limit jadi 100 |
| ?limit=0 | 200, limit dipaksa jadi 1 | 200, limit jadi 10 (default) |
| ?sortBy=password | 200, diganti createdAt | 200, fallback ke createdAt |
| ?order=sembarang | 200, diganti DESC | 200, fallback ke DESC |
| ?sekolah=a&sekolah=b | 200, array ikut masuk | 200, tampil semua |
| ?q=   (spasi doang) | 200, tampil semua | 200, tampil semua |

## Catatan

Setelah saya uji satu per satu, ternyata validasi query belum sepenuhnya berjalan seperti yang diharapkan. Beberapa input yang seharusnya ditolak justru masih lolos dengan status 200, misalnya `?page=0` yang tetap menjadi halaman 1 dan `?limit=1000` yang hanya dipotong menjadi 100.

Kemungkinan hal ini terjadi karena middleware validasi belum sepenuhnya terpasang pada route query, atau nilai default dari DTO ikut menimpa nilai yang sebenarnya dikirim. Untuk saat ini, hasilnya masih mirip dengan Minggu 13.

Saya akan memeriksa kembali konfigurasi validasi query ini supaya input yang tidak sesuai benar-benar ditolak, sesuai dengan keputusan tim yang memilih menolak input aneh daripada mengoreksinya diam-diam.