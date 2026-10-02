# API Magang Batch 4

## Setup Database dari Nol

1. Install PostgreSQL 16.
2. Buat database: CREATE DATABASE magang_db;
3. Jalanin migration: npm run migration:run
4. Jalanin server: npm run dev

## Endpoint Auth

### POST /api/auth/register

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

### POST /api/auth/login

Login dan dapatkan access token + refresh token.

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

### POST /api/auth/refresh

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

### POST /api/auth/logout

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