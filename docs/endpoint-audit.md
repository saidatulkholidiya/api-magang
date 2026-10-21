# Audit Endpoint

## Daftar Endpoint Minggu 10-12

| Method | Path | Perlu Login? | Role | Catatan |
|--------|------|--------------|------|---------|
| POST | /api/auth/register | ❌ | - | - |
| POST | /api/auth/login | ❌ | - | - |
| POST | /api/auth/refresh | ❌ | - | - |
| POST | /api/auth/logout | ❌ | - | - |
| GET | /api/peserta | ❌ | - | - |
| GET | /api/peserta/:id | ❌ | - | - |
| GET | /api/peserta/profil-saya | ✅ | peserta/mentor | Nama endpoint campur bahasa |
| POST | /api/peserta | ❌ | - | - |
| PUT | /api/peserta/:id | ✅ | peserta/mentor | - |
| DELETE | /api/peserta/:id | ✅ | mentor | - |
| GET | /api/peserta/:id/jurnal | ❌ | - | - |
| GET | /api/jurnal | ✅ | mentor | - |
| GET | /api/jurnal/saya | ✅ | peserta/mentor | Nama endpoint campur bahasa |
| GET | /api/jurnal/:id | ✅ | peserta/mentor | - |
| POST | /api/jurnal | ✅ | peserta/mentor | - |
| PATCH | /api/jurnal/:id/review | ✅ | mentor | - |
| DELETE | /api/jurnal/:id | ✅ | peserta/mentor | - |
| GET | /api/stats | ❌ | - | - |

## Yang Saya Perbaiki

- Endpoint `/api/peserta/profil-saya` saya ganti jadi `/api/v1/me` biar konsisten pakai bahasa Inggris.
- Endpoint `/api/jurnal/saya` saya ganti jadi `/api/v1/me/jurnal`, alasannya sama.
- Semua route saya pindah ke bawah `/api/v1` biar ada versi API-nya.
- Method `PUT` saya ganti `PATCH` karena lebih praktis — cuma kirim field yang berubah aja.

## Status Code untuk 10 Skenario

| Skenario | Status Code |
|----------|-------------|
| a. Register berhasil | 201 |
| b. Register email duplikat | 409 |
| c. Login password salah | 401 |
| d. Akses /me tanpa token | 401 |
| e. Peserta akses endpoint mentor | 403 |
| f. GET /peserta/9999 | 404 |
| g. DELETE /peserta/1 berhasil | 204 |
| h. POST dengan JSON rusak | 400 |
| i. POST email format salah | 422 |
| j. Database mati | 503 |

## Test Kasus Tepi

| Kasus | Hasil | Status |
|-------|-------|--------|
| ?page=0 | page jadi 1 | ✅ |
| ?page=-5 | page jadi 1 | ✅ |
| ?page=abc | page jadi 1 | ✅ |
| ?limit=1000 | limit jadi 100 | ✅ |
| ?limit=0 | limit jadi 1 | ✅ |
| ?limit=abc | limit jadi 10 | ✅ |
| ?sortBy=password | fallback ke createdAt | ✅ |
| ?sortBy=nama;DROP TABLE peserta | fallback ke createdAt | ✅ |
| ?q=% | di-escape, gak cocokin semua | ✅ |
| ?q=_ | di-escape | ✅ |
| ?q= | tampil semua | ✅ |

##  Daftar Endpoint Setelah Dirapikan

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

## Audit DTO Minggu 14

| Method | Endpoint | DTO Body | DTO Query | DTO Params |
|--------|----------|----------|-----------|------------|
| POST | /api/v1/auth/register | RegisterDto | - | - |
| POST | /api/v1/auth/login | LoginDto | - | - |
| POST | /api/v1/auth/refresh | - (manual) | - | - |
| POST | /api/v1/auth/logout | - (manual) | - | - |
| GET | /api/v1/me | - | - | - |
| PATCH | /api/v1/me | UpdateProfilDto | - | - |
| GET | /api/v1/peserta | - | ListPesertaQueryDto | - |
| GET | /api/v1/peserta/:id | - | - | IdParamDto |
| POST | /api/v1/peserta | RegisterDto | - | - |
| PATCH | /api/v1/peserta/:id | UpdateProfilDto | - | IdParamDto |
| DELETE | /api/v1/peserta/:id | - | - | IdParamDto |
| GET | /api/v1/peserta/:id/jurnal | - | - | IdParamDto |
| GET | /api/v1/jurnal | - | ListJurnalQueryDto | - |
| GET | /api/v1/jurnal/saya | - | - | - |
| GET | /api/v1/jurnal/:id | - | - | IdParamDto |
| POST | /api/v1/jurnal | CreateJurnalDto | - | - |
| PATCH | /api/v1/jurnal/:id | UpdateJurnalDto | - | IdParamDto |
| PATCH | /api/v1/jurnal/:id/review | ReviewJurnalDto | - | IdParamDto |
| DELETE | /api/v1/jurnal/:id | - | - | IdParamDto |
| GET | /api/v1/stats | - | - | - |
| GET | /api/v1/health | - | - | - |
| GET | /api/v1/health/ready | - | - | - |