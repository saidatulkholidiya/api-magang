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