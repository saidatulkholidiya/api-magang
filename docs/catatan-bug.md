## Temuan Hari Jumat (Minggu 15)

### 1. Migration Lupa Membuat Enum
- **Gejala:** `npm run test:int` gagal dengan error `type "public.peserta_status_enum" does not exist` saat menjalankan migration dari nol.
- **Penyebab:** Migration `InitialSchema` menggunakan tipe enum tetapi tidak pernah membuatnya (`CREATE TYPE`). Di database development hal ini tidak terasa karena enum mungkin dibuat manual.
- **Perbaikan:** Menambahkan perintah `CREATE TYPE` di awal fungsi `up()` dan `DROP TYPE` di akhir `down()` pada `InitialSchema`.
- **Test yang mencegah:** Integration test (`npm run test:int`) yang selalu menjalankan migration dari database kosong.

### 2. Tabel Dibuat Dua Kali (Duplikasi Migration)
- **Gejala:** `npm run test:int` gagal dengan error `relation "skill" already exists`.
- **Penyebab:** Tabel `skill` dan `peserta_skill` dibuat di dua file migration yang berbeda (`AddRelasiPesertaJurnal` dan `AddSkillManyToMany`).
- **Perbaikan:** Menghapus `CREATE TABLE` duplikat di `AddSkillManyToMany` dan hanya menyisakan perintah `ALTER TABLE` yang memang belum dijalankan.
- **Test yang mencegah:** Integration test (`npm run test:int`).

### 3. Uji Kekuatan Test (Suntik Bug)
- **Skenario:** Mengubah `Math.ceil` menjadi `Math.floor` di fungsi `buatMeta`.
- **Hasil:** Test langsung **GAGAL** (4 test merah).
- **Kesimpulan:** Test yang ditulis benar-benar menjaga logika, bukan sekadar pajangan.