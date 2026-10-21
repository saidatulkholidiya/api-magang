# Konvensi API SiTrack

## 1. URL

- Kata benda jamak, huruf kecil, kebab-case, tanpa trailing slash
- Prefix versi: `/api/v1`
- Endpoint milik user yang login: `/me`, `/me/jurnal`

Contoh:
- ✅ `/api/v1/peserta`
- ✅ `/api/v1/peserta/1/jurnal`
- ✅ `/api/v1/me`
- ❌ `/api/getAllPeserta`

## 2. Method & Status Code

| Method | Fungsi | Status Sukses |
|--------|--------|---------------|
| GET | Baca data | 200 |
| POST | Bikin data baru | 201 + header Location |
| PATCH | Ubah sebagian data | 200 |
| DELETE | Hapus data | 204 (tanpa body) |

Status code error:
- 400 hanya untuk body yang tidak bisa di-parse sama sekali (INVALID_JSON)
- 401 belum login / token invalid / token expired
- 403 sudah login tapi tidak berhak
- 404 data atau route tidak ada
- 409 konflik data (email duplikat)
- 422 SEMUA kegagalan validasi DTO (body, query, maupun params)
- 429 terlalu banyak request
- 500 bug di server
- 503 dependensi mati (database down)

## 3. Format Response Sukses

    {
      "sukses": true,
      "pesan": "Berhasil",
      "data": { ... }
    }

Response daftar (list) pake meta:

    {
      "sukses": true,
      "pesan": "Berhasil",
      "data": [ ... ],
      "meta": {
        "page": 1,
        "limit": 10,
        "total": 50,
        "totalPages": 5,
        "hasNext": true,
        "hasPrev": false
      }
    }

## 4. Format Response Error

    {
      "sukses": false,
      "error": {
        "kode": "VALIDATION_ERROR",
        "pesan": "Validasi gagal",
        "detail": [
          { "field": "email", "pesan": "Format email tidak valid" }
        ]
      },
      "requestId": "abc-123-def"
    }

## 5. Daftar (List)

Query parameter:
- page: halaman ke berapa (default 1)
- limit: jumlah data per halaman (default 10, maks 100)
- sortBy: kolom pengurutan (whitelist, default createdAt)
- order: asc atau desc (default desc)
- q: kata kunci pencarian

Meta di response: page, limit, total, totalPages, hasNext, hasPrev

## 6. Keamanan

- Password tidak pernah dikirim dan tidak pernah dicatat di log
- Field yang boleh diubah dipilih eksplisit (tanpa mass assignment)
- Error DB dan stack trace tidak dikirim ke client di production
- sortBy dan filter memakai whitelist
- Rate limit dipasang di endpoint sensitif (login)

## 7. Penamaan

- Bahasa Indonesia untuk field dan pesan
- camelCase untuk nama field JSON (contoh: pesertaId, statusReview)

## 8. Endpoint Final (setelah versioning)

| Method | Path | Perlu Login? | Role | Status Code Sukses |
|--------|------|--------------|------|---------------------|
| POST | /api/v1/auth/register | ❌ | - | 201 |
| POST | /api/v1/auth/login | ❌ | - | 200 |
| POST | /api/v1/auth/refresh | ❌ | - | 200 |
| POST | /api/v1/auth/logout | ❌ | - | 200 |
| GET | /api/v1/me | ✅ | peserta/mentor | 200 |
| GET | /api/v1/me/jurnal | ✅ | peserta/mentor | 200 |
| GET | /api/v1/peserta | ❌ | - | 200 |
| GET | /api/v1/peserta/:id | ❌ | - | 200 |
| POST | /api/v1/peserta | ❌ | - | 201 + Location |
| PATCH | /api/v1/peserta/:id | ✅ | peserta/mentor | 200 |
| DELETE | /api/v1/peserta/:id | ✅ | mentor | 204 |
| GET | /api/v1/peserta/:id/jurnal | ❌ | - | 200 |
| GET | /api/v1/jurnal | ✅ | mentor | 200 |
| GET | /api/v1/jurnal/:id | ✅ | peserta/mentor | 200 |
| POST | /api/v1/jurnal | ✅ | peserta/mentor | 201 + Location |
| PATCH | /api/v1/jurnal/:id | ✅ | peserta/mentor | 200 |
| PATCH | /api/v1/jurnal/:id/review | ✅ | mentor | 200 |
| DELETE | /api/v1/jurnal/:id | ✅ | peserta/mentor | 204 |
| GET | /api/v1/stats | ❌ | - | 200 |
| GET | /api/v1/health | ❌ | - | 200 |
| GET | /api/v1/health/ready | ❌ | - | 200/503 |

## 9. Validasi dengan DTO (Minggu 14)

- Semua input (body, query, params) divalidasi pakai DTO (class-validator).
- Body memakai `whitelist: true` + `forbidNonWhitelisted: true`.
- Query dan params memakai `@Type(() => Number)` untuk konversi angka.
- Email dinormalkan: `@Trim()` + `@KeHurufKecil()`.
- Field yang gak boleh diisi lewat body: `id`, `role`, `password`, `pesertaId`.
- Response memakai Response DTO (`@Expose()`).
- Validasi gagal → **422**.
- Body JSON rusak → **400 INVALID_JSON**.
- Body terlalu besar → **413 PAYLOAD_TOO_LARGE**.
- Properti asing ditolak → **422**.