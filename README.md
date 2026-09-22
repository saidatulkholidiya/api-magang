# 📄 Catatan: Apa itu ORM?

ORM (Object-Relational Mapping) itu cara buat "menerjemahkan" antara kode kita (class/interface) dengan tabel di database. Jadi kita gak perlu nulis SQL manual, cukup nulis kode TypeScript biasa.

**Contoh perbandingan:**

Tanpa ORM (SQL manual):

SELECT * FROM peserta WHERE sekolah = 'SMK 5 Malang';


Dengan ORM (TypeORM):

pesertaRepository.find({ where: { sekolah: "SMK 5 Malang" } });

**Kenapa pakai ORM?**

1. Type-safe — TypeScript bisa ngecek tipe data, salah ketik langsung ketahuan.
2. Lebih rapi — logika database kepisah dari logika bisnis.
3. Gampang ganti database — dari PostgreSQL ke MySQL tinggal ubah config.
4. Tidak perlu hafal SQL — fokus ke logika aplikasi.
5. Lebih aman — otomatis escape input, jadi terhindar dari SQL injection.

**Kekurangannya?**

- Kadang query-nya kurang optimal jika datanya sudah banyak.
- Query rumit tetep perlu SQL manual.
- Butuh waktu buat belajar.

Buat project skala kecil-menengah, ORM sangat membantu. Tapi tetep perlu paham dasar SQL.