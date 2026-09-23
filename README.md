# Kenapa Kemampuan Revert Penting di Kerja Tim?

Revert adalah tombol "undo" pada migration. Jika ada migration yang keliru atau menimbulkan masalah, kita dapat mengembalikan database ke kondisi sebelumnya dengan cepat.

Di kerja tim, kemampuan ini sangat penting, karena:

1. **Jika ada bug**, kita dapat langsung mengembalikan database tanpa harus memperbaikinya secara manual satu per satu.
2. **Jika terjadi kesalahan migration**, kita tidak perlu panik — cukup lakukan revert, kemudian perbaiki.
3. **Jika ingin mengulang dari awal**, kita dapat me-revert semua migration, lalu menjalankannya kembali.
4. **Jika ada deployment yang gagal**, kita dapat segera kembali ke versi sebelumnya.

Bayangkan jika fitur revert tidak ada. Setiap kali terjadi kesalahan migration, kita harus memperbaikinya secara manual satu per satu di database. Selain merepotkan, risikonya juga besar — bisa saja data terhapus tanpa sengaja, atau database menjadi tidak konsisten.

Dengan adanya revert, kita memiliki jalan keluar yang aman. Jadi, jika ada masalah, kita cukup mengembalikannya, lalu mencoba lagi.

---

## Fungsi Tabel `migrations`

Tabel `migrations` adalah catatan riwayat. Isinya daftar migration yang sudah pernah dijalankan di database ini.

Kolomnya:
- `id`: nomor urut
- `timestamp`: waktu migration dibuat
- `name`: nama file migration

Kenapa perlu?
- Biar TypeORM tahu migration mana yang sudah dijalankan, mana yang belum.
- Jika kita menjalankan `npm run migration:run`, TypeORM cek tabel ini dulu — hanya menjalankan migration yang belum ada di sini.
- Jika kita menjalankan `npm run migration:revert`, TypeORM revert migration terakhir yang tercatat di tabel ini.

Analoginya: seperti buku absen. Tiap migration yang sudah dijalankan dicatat di sini, biar tidak dijalankan dua kali.