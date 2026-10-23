# API Magang Batch 4

## Setup Database dari Nol

1. Install PostgreSQL 16.
2. Buat database: CREATE DATABASE magang_db;
3. Jalankan migration: npm run migration:run
4. Jalankan server: npm run dev

## Endpoint Auth

### POST /api/v1/auth/register

Registrasi peserta baru.

Body:

    {
      "nama": "Test Refresh",
      "sekolah": "SMK Test",
      "email": "testrefresh@example.com",
      "password": "rahasia123"
    }

Response 201:

    {
      "sukses": true,
      "pesan": "Registrasi berhasil",
      "data": {
        "id": 9,
        "nama": "Test Refresh",
        "email": "testrefresh@example.com",
        "role": "peserta"
      }
    }

### POST /api/v1/auth/login

Login dan dapatkan access token beserta refresh token.

Body:

    {
      "email": "testrefresh@example.com",
      "password": "rahasia123"
    }

Response 200:

    {
      "sukses": true,
      "pesan": "Login berhasil",
      "data": {
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "peserta": {
          "id": 9,
          "nama": "Test Refresh",
          "sekolah": "SMK Test",
          "email": "testrefresh@example.com",
          "fase": 1,
          "status": "aktif",
          "role": "peserta"
        }
      }
    }

### POST /api/v1/auth/refresh

Tukar refresh token dengan access token baru.

Body:

    {
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }

Response 200:

    {
      "sukses": true,
      "pesan": "Access token berhasil diperbarui",
      "data": {
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      }
    }

### POST /api/v1/auth/logout

Hapus refresh token dari database.

Body:

    {
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }

Response 200:

    {
      "sukses": true,
      "pesan": "Logout berhasil"
    }

## Kenapa DELETE Harus Idempotent

DELETE harus idempotent karena kalau kita menghapus data yang sama berkali-kali, hasilnya tetap sama, yaitu data tersebut terhapus. Hal ini membuat sistem menjadi lebih terprediksi, sehingga client bisa mencoba ulang permintaan DELETE tanpa khawatir menimbulkan efek ganda. Berbeda dengan POST yang akan membuat data baru setiap kali dipanggil.

## Kenapa Tidak Boleh Menghapus Lewat GET

GET harus selalu bersifat "safe", artinya tidak mengubah data apa pun. Apabila ada endpoint seperti GET /peserta/1/hapus, browser atau crawler bisa memanggilnya secara otomatis (misalnya melalui prefetch atau cache) tanpa kita sadari. Akibatnya data bisa terhapus tanpa ada yang menekan tombol apa pun. Itulah sebabnya aksi yang mengubah data harus menggunakan POST, PUT, PATCH, atau DELETE.

## Perbedaan Entity dan DTO

Entity adalah bentuk tabel yang ada di database. Field-nya lengkap, mulai dari id, password, sampai waktu pembuatan data. Satu entity mewakili satu tabel.

DTO adalah bentuk data yang diizinkan masuk atau keluar dari API. Field-nya hanya yang relevan untuk kebutuhan tertentu. Satu entity bisa memiliki beberapa DTO, misalnya untuk pendaftaran, pembaruan, dan respons.

Entity Peserta tidak sebaiknya dipakai langsung sebagai bentuk data pendaftaran, karena tiga alasan berikut:

1. Pengguna bisa saja mengirim field yang tidak seharusnya, seperti `role` atau `id`.
2. Data password yang sudah di-hash bisa ikut terkirim di respons jika kurang berhati-hati.
3. Apabila struktur database berubah, kontrak API akan langsung terganggu.

## Perbedaan Express 5

Proyek ini menggunakan Express versi 5.2.1. Ada beberapa hal yang berbeda dari versi sebelumnya:

1. `req.query` bersifat hanya-baca, sehingga tidak dapat ditimpa. Oleh karena itu, hasil validasi saya simpan di `req.validated`.
2. `req.body` bernilai `undefined` apabila permintaan tidak memiliki body, bukan berupa objek kosong. Middleware perlu menangani kondisi ini.
3. Sintaks path route mengalami perubahan. Pola regex seperti `/:id(\d+)` dan parameter opsional `/:bulan?` sudah tidak didukung lagi.# API Magang Batch 4

## Setup Database dari Nol

1. Install PostgreSQL 16.
2. Buat database: CREATE DATABASE magang_db;
3. Jalankan migration: npm run migration:run
4. Jalankan server: npm run dev

## Endpoint Auth

### POST /api/v1/auth/register

Registrasi peserta baru.

Body:

    {
      "nama": "Test Refresh",
      "sekolah": "SMK Test",
      "email": "testrefresh@example.com",
      "password": "rahasia123"
    }

Response 201:

    {
      "sukses": true,
      "pesan": "Registrasi berhasil",
      "data": {
        "id": 9,
        "nama": "Test Refresh",
        "email": "testrefresh@example.com",
        "role": "peserta"
      }
    }

### POST /api/v1/auth/login

Login dan dapatkan access token beserta refresh token.

Body:

    {
      "email": "testrefresh@example.com",
      "password": "rahasia123"
    }

Response 200:

    {
      "sukses": true,
      "pesan": "Login berhasil",
      "data": {
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "peserta": {
          "id": 9,
          "nama": "Test Refresh",
          "sekolah": "SMK Test",
          "email": "testrefresh@example.com",
          "fase": 1,
          "status": "aktif",
          "role": "peserta"
        }
      }
    }

### POST /api/v1/auth/refresh

Tukar refresh token dengan access token baru.

Body:

    {
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }

Response 200:

    {
      "sukses": true,
      "pesan": "Access token berhasil diperbarui",
      "data": {
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      }
    }

### POST /api/v1/auth/logout

Hapus refresh token dari database.

Body:

    {
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }

Response 200:

    {
      "sukses": true,
      "pesan": "Logout berhasil"
    }

## Kenapa DELETE Harus Idempotent

DELETE harus idempotent karena kalau kita menghapus data yang sama berkali-kali, hasilnya tetap sama, yaitu data tersebut terhapus. Hal ini membuat sistem menjadi lebih terprediksi, sehingga client bisa mencoba ulang permintaan DELETE tanpa khawatir menimbulkan efek ganda. Berbeda dengan POST yang akan membuat data baru setiap kali dipanggil.

## Kenapa Tidak Boleh Menghapus Lewat GET

GET harus selalu bersifat "safe", artinya tidak mengubah data apa pun. Apabila ada endpoint seperti GET /peserta/1/hapus, browser atau crawler bisa memanggilnya secara otomatis (misalnya melalui prefetch atau cache) tanpa kita sadari. Akibatnya data bisa terhapus tanpa ada yang menekan tombol apa pun. Itulah sebabnya aksi yang mengubah data harus menggunakan POST, PUT, PATCH, atau DELETE.

## Perbedaan Entity dan DTO

Entity adalah bentuk tabel yang ada di database. Field-nya lengkap, mulai dari id, password, sampai waktu pembuatan data. Satu entity mewakili satu tabel.

DTO adalah bentuk data yang diizinkan masuk atau keluar dari API. Field-nya hanya yang relevan untuk kebutuhan tertentu. Satu entity bisa memiliki beberapa DTO, misalnya untuk pendaftaran, pembaruan, dan respons.

Entity Peserta tidak sebaiknya dipakai langsung sebagai bentuk data pendaftaran, karena tiga alasan berikut:

1. Pengguna bisa saja mengirim field yang tidak seharusnya, seperti `role` atau `id`.
2. Data password yang sudah di-hash bisa ikut terkirim di respons jika kurang berhati-hati.
3. Apabila struktur database berubah, kontrak API akan langsung terganggu.

## Perbedaan Express 5

Proyek ini menggunakan Express versi 5.2.1. Ada beberapa hal yang berbeda dari versi sebelumnya:

1. `req.query` bersifat hanya-baca, sehingga tidak dapat ditimpa. Oleh karena itu, hasil validasi saya simpan di `req.validated`.
2. `req.body` bernilai `undefined` apabila permintaan tidak memiliki body, bukan berupa objek kosong. Middleware perlu menangani kondisi ini.
3. Sintaks path route mengalami perubahan. Pola regex seperti `/:id(\d+)` dan parameter opsional `/:bulan?` sudah tidak didukung lagi.# API Magang Batch 4

## Setup Database dari Nol

1. Install PostgreSQL 16.
2. Buat database: CREATE DATABASE magang_db;
3. Jalankan migration: npm run migration:run
4. Jalankan server: npm run dev

## Endpoint Auth

### POST /api/v1/auth/register

Registrasi peserta baru.

Body:

    {
      "nama": "Test Refresh",
      "sekolah": "SMK Test",
      "email": "testrefresh@example.com",
      "password": "rahasia123"
    }

Response 201:

    {
      "sukses": true,
      "pesan": "Registrasi berhasil",
      "data": {
        "id": 9,
        "nama": "Test Refresh",
        "email": "testrefresh@example.com",
        "role": "peserta"
      }
    }

### POST /api/v1/auth/login

Login dan dapatkan access token beserta refresh token.

Body:

    {
      "email": "testrefresh@example.com",
      "password": "rahasia123"
    }

Response 200:

    {
      "sukses": true,
      "pesan": "Login berhasil",
      "data": {
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "peserta": {
          "id": 9,
          "nama": "Test Refresh",
          "sekolah": "SMK Test",
          "email": "testrefresh@example.com",
          "fase": 1,
          "status": "aktif",
          "role": "peserta"
        }
      }
    }

### POST /api/v1/auth/refresh

Tukar refresh token dengan access token baru.

Body:

    {
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }

Response 200:

    {
      "sukses": true,
      "pesan": "Access token berhasil diperbarui",
      "data": {
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      }
    }

### POST /api/v1/auth/logout

Hapus refresh token dari database.

Body:

    {
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }

Response 200:

    {
      "sukses": true,
      "pesan": "Logout berhasil"
    }

## Kenapa DELETE Harus Idempotent

DELETE harus idempotent karena kalau kita menghapus data yang sama berkali-kali, hasilnya tetap sama, yaitu data tersebut terhapus. Hal ini membuat sistem menjadi lebih terprediksi, sehingga client bisa mencoba ulang permintaan DELETE tanpa khawatir menimbulkan efek ganda. Berbeda dengan POST yang akan membuat data baru setiap kali dipanggil.

## Kenapa Tidak Boleh Menghapus Lewat GET

GET harus selalu bersifat "safe", artinya tidak mengubah data apa pun. Apabila ada endpoint seperti GET /peserta/1/hapus, browser atau crawler bisa memanggilnya secara otomatis (misalnya melalui prefetch atau cache) tanpa kita sadari. Akibatnya data bisa terhapus tanpa ada yang menekan tombol apa pun. Itulah sebabnya aksi yang mengubah data harus menggunakan POST, PUT, PATCH, atau DELETE.

## Perbedaan Entity dan DTO

Entity adalah bentuk tabel yang ada di database. Field-nya lengkap, mulai dari id, password, sampai waktu pembuatan data. Satu entity mewakili satu tabel.

DTO adalah bentuk data yang diizinkan masuk atau keluar dari API. Field-nya hanya yang relevan untuk kebutuhan tertentu. Satu entity bisa memiliki beberapa DTO, misalnya untuk pendaftaran, pembaruan, dan respons.

Entity Peserta tidak sebaiknya dipakai langsung sebagai bentuk data pendaftaran, karena tiga alasan berikut:

1. Pengguna bisa saja mengirim field yang tidak seharusnya, seperti `role` atau `id`.
2. Data password yang sudah di-hash bisa ikut terkirim di respons jika kurang berhati-hati.
3. Apabila struktur database berubah, kontrak API akan langsung terganggu.

## Perbedaan Express 5

Proyek ini menggunakan Express versi 5.2.1. Ada beberapa hal yang berbeda dari versi sebelumnya:

1. `req.query` bersifat hanya-baca, sehingga tidak dapat ditimpa. Oleh karena itu, hasil validasi saya simpan di `req.validated`.
2. `req.body` bernilai `undefined` apabila permintaan tidak memiliki body, bukan berupa objek kosong. Middleware perlu menangani kondisi ini.
3. Sintaks path route mengalami perubahan. Pola regex seperti `/:id(\d+)` dan parameter opsional `/:bulan?` sudah tidak didukung lagi.

## Refleksi — Menguji Perilaku, Bukan Implementasi

Test yang baik memeriksa **apa yang terjadi** (hasil, error yang dilempar, efek samping), bukan **bagaimana caranya** (method apa yang dipanggil, argumen persisnya). Contoh terlalu detail: `expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: { jurnalList: true, skills: true } })` — test ini patah setiap kali cara query diubah, padahal perilakunya sama. Versi sehatnya: `expect(hasil).toEqual(peserta)` dan `expect(repo.save).not.toHaveBeenCalled()` saat email duplikat — memeriksa hasil akhir dan efek penting, bukan rantai pemanggilan.

## Cara Menjalankan Test

**1. Persiapan Awal (Instalasi Dependency)**
Sebelum menjalankan test, pastikan semua library yang dibutuhkan sudah terpasang di dalam project. Jika belum, jalankan perintah:
```bash
npm install

**2. Unit & HTTP Test (Cepat, Tanpa Database)**
Pengujian ini berfokus pada logika fungsi, validasi DTO, controller, dan kontrak API menggunakan mock (tanpa koneksi database asli).
Perintah:

bash
npm test
Output Terminal:

text
> api-magang@1.0.0 test
> jest

Test Suites: 15 passed, 15 total
Tests:       180 passed, 180 total
Snapshots:   0 total
Time:        13.509 s
Ran all test suites.
**3. Test Coverage (Melihat Persentase Kode yang Teruji)**
Pengujian ini dijalankan untuk melihat seberapa besar kode yang sudah tercakup oleh test, sekaligus memastikan angka tersebut lolos dari batas minimal (threshold) yang ditetapkan sebesar 60%.
Perintah:

bash
npm run test:coverage
Output Terminal:

text
> api-magang@1.0.0 test:coverage
> jest --coverage

Test Suites: 15 passed, 15 total
Tests:       180 passed, 180 total
Snapshots:   0 total
Time:        19.796 s
Ran all test suites.
All files        80.66 |    68.05 |   65.69 |   81.26 |  

**4. Integration Test (Membutuhkan Database Asli)**
Pengujian ini memastikan alur aplikasi berjalan dengan baik saat terhubung langsung ke database PostgreSQL. Test ini akan menghapus dan membuat ulang skema database dari nol menggunakan migration.
Langkah pertama, pastikan service PostgreSQL menyala dan buat database khusus test (jika belum ada):

bash
psql -U postgres -c "CREATE DATABASE magang_test;"
Langkah kedua, jalankan perintah test integrasi:

bash
npm run test:int
Output Terminal:

text
> api-magang@1.0.0 test:int
> jest --config jest.integration.config.ts --runInBand

PASS  tests/integration/auth-flow.test.ts
  Alur autentikasi lengkap (database sungguhan)
    √ register, login, akses /me, tolak mass assignment, refresh, logout, refresh ditolak (330 ms)
    √ menolak email duplikat walau beda huruf besar dan spasi (409) (137 ms)
    √ dua register bersamaan dengan email sama: satu 201, satu 409 (UNIQUE constraint) (196 ms)

PASS  tests/integration/peserta-jurnal.test.ts
  Alur peserta & jurnal (database sungguhan)
    √ GET /peserta dengan 15 data: pagination dan filter bekerja
    √ DELETE /peserta/:id yang masih punya jurnal — perilaku ON DELETE

Test Suites: 2 passed, 2 total
Tests:       5 passed, 5 total
Snapshots:   0 total
Time:        5.157 s
Ran all test suites.