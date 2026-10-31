# API Magang Batch 4

![Test](https://github.com/saidatulkholidiya/api-magang/actions/workflows/test.yml/badge.svg)

REST API untuk program magang PT Nawasena Insan Permata. Proyek ini dibangun dari nol menggunakan Node.js, Express, TypeScript, dan PostgreSQL, dilengkapi dengan pengujian otomatis (Unit, HTTP, Integration) serta dokumentasi interaktif (Swagger).

## Teknologi yang Digunakan
- Runtime & Bahasa: Node.js + TypeScript
- Framework Web: Express.js (v5)
- Database & ORM: PostgreSQL + TypeORM
- Testing: Jest, Supertest, Swagger Parser
- Dokumentasi: Swagger UI (OpenAPI 3.0)
- Keamanan: JWT (Access & Refresh Token), Bcrypt (Hash Password), Helmet, CORS, Rate Limiter

## Alamat Dokumentasi API
Dokumentasi interaktif dapat diakses di: **`http://localhost:3000/api/docs/`**
Ekspor dokumen OpenAPI (JSON): **`http://localhost:3000/api/docs.json`**

## Setup Database dari Nol
1. Pastikan PostgreSQL 16 sudah terinstal dan berjalan.
2. Buat database utama: `CREATE DATABASE magang_db;`
3. Buat database khusus untuk testing: `CREATE DATABASE magang_test;`
4. Jalankan migrasi tabel: `npm run migration:run`
5. Jalankan server: `npm run dev`
6. Buka dokumentasi Swagger di: `http://localhost:3000/api/docs/`

## Daftar Endpoint Ringkas
- **Auth:** `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout`
- **Profil:** `GET /me`, `PATCH /me`, `GET /me/jurnal`
- **Peserta:** `GET /peserta`, `GET /peserta/{id}`, `PATCH /peserta/{id}`, `DELETE /peserta/{id}`
- **Jurnal:** `GET /jurnal`, `POST /jurnal`, `GET /jurnal/{id}`, `PATCH /jurnal/{id}`, `PATCH /jurnal/{id}/review`, `DELETE /jurnal/{id}`
- **Sistem:** `GET /health`, `GET /health/ready`

## Cara Menjalankan Pengujian (Test)

**1. Unit, DTO & HTTP Test (Cepat, Tanpa Database)**
Pengujian ini menggunakan mock dan tidak memerlukan koneksi database. Sangat cepat dan menguji logika bisnis serta kontrak API.
Perintah:
```bash
npm test
Output Terminal:

text
Test Suites: 17 passed, 17 total
Tests:       183 passed, 183 total
Snapshots:   0 total
Time:        15.369 s
Ran all test suites.
2. Test Coverage
Menjalankan test sekaligus melihat persentase baris kode yang sudah tercakup. Proyek ini menargetkan threshold minimal 60%.
Perintah:

bash
npm run test:coverage
Output Terminal:

text
Test Suites: 17 passed, 17 total
Tests:       183 passed, 183 total
All files        80.66 |    68.05 |   65.69 |   81.26 |
3. Integration Test (Membutuhkan Database Asli)
Pengujian ini akan menyambung ke database PostgreSQL magang_test, menghapus data lama, dan menjalankan migrasi dari nol untuk menguji alur aplikasi secara nyata.
Perintah:

bash
npm run test:int
Output Terminal:

text
Test Suites: 2 passed, 2 total
Tests:       5 passed, 5 total
Snapshots:   0 total
Time:        5.157 s
Ran all test suites.
Keputusan Desain & Arsitektur
Perbedaan Entity dan DTO
Entity adalah bentuk tabel di database (memuat semua field, termasuk password). DTO adalah bentuk data yang diizinkan masuk/keluar dari API (hanya field relevan). Entity tidak boleh dipakai langsung sebagai DTO untuk mencegah mass assignment, kebocoran password, dan menjaga kontrak API saat database berubah.

Kenapa DELETE Harus Idempotent
DELETE harus idempotent karena kalau kita menghapus data yang sama berkali-kali, hasilnya tetap sama (data terhapus). Ini membuat sistem lebih terprediksi dan client bisa mencoba ulang tanpa khawatir efek ganda.

Kenapa Tidak Boleh Menghapus Lewat GET
GET harus bersifat "safe" (tidak mengubah data). Jika ada endpoint seperti GET /peserta/1/hapus, browser atau crawler bisa memanggilnya secara otomatis dan menghapus data tanpa sepengetahuan kita. Aksi modifikasi wajib pakai POST, PUT, PATCH, atau DELETE.

Perbedaan Express 5
Proyek ini menggunakan Express 5. Beberapa perbedaan dari versi lama:

req.query bersifat hanya-baca, hasil validasi disimpan di req.validated.

req.body bernilai undefined jika tidak ada body (bukan objek kosong).

Sintaks path regex seperti /:id(\d+) sudah tidak didukung.

Refleksi Pengujian: Menguji Perilaku, Bukan Implementasi
Test yang baik memeriksa apa yang terjadi (hasil, error, efek samping), bukan bagaimana caranya (method apa yang dipanggil). Contoh terlalu detail: expect(repo.findOne).toHaveBeenCalledWith(...). Versi sehat: expect(hasil).toEqual(peserta) dan expect(repo.save).not.toHaveBeenCalled().

Konsep OpenAPI dan Swagger
OpenAPI adalah spesifikasi standar format (JSON/YAML) untuk mendeskripsikan REST API. Swagger adalah kumpulan alat (tools) yang menggunakan standar OpenAPI, salah satunya Swagger UI yang mengubah dokumen menjadi halaman web interaktif. Dokumentasi tetap perlu dibuat agar frontend/QA memiliki kontrak yang jelas tanpa harus membaca kode backend.

Terjemahan DTO ke OpenAPI
IsString() menjadi type: string

IsEmail() menjadi type: string, format: email

MinLength(10) menjadi minLength: 10

MaxLength(200) menjadi maxLength: 200

Min(1) / Max(5) menjadi minimum: 1 / maximum: 5

IsIn(["belum", "sudah"]) menjadi enum: ["belum", "sudah"]

IsUrl() menjadi type: string, format: uri

IsBoolean() menjadi type: boolean

IsOptional() menjadi properti tidak dimasukkan ke array required

ValidateNested() menjadi menggunakan $ref ke schema lain