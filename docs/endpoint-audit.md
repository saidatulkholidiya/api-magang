# Audit Endpoint

| Method | Path | Perlu Login? | Role | Masalah Desain |
|--------|------|--------------|------|----------------|
| POST | /api/auth/register | ❌ | - | - |
| POST | /api/auth/login | ❌ | - | - |
| POST | /api/auth/refresh | ❌ | - | - |
| POST | /api/auth/logout | ❌ | - | - |
| GET | /api/me | ✅ | peserta/mentor | - |
| GET | /api/me/jurnal | ✅ | peserta/mentor | - |
| GET | /api/peserta | ❌ | - | - |
| GET | /api/peserta/:id | ❌ | - | - |
| POST | /api/peserta | ❌ | - | - |
| PUT | /api/peserta/:id | ✅ | peserta/mentor | - |
| DELETE | /api/peserta/:id | ✅ | mentor | - |
| GET | /api/peserta/:id/jurnal | ❌ | - | - |
| GET | /api/jurnal | ✅ | mentor | - |
| GET | /api/jurnal/:id | ✅ | peserta/mentor | - |
| POST | /api/jurnal | ✅ | peserta/mentor | - |
| PUT | /api/jurnal/:id | ✅ | peserta/mentor | - |
| PATCH | /api/jurnal/:id/review | ✅ | mentor | - |
| DELETE | /api/jurnal/:id | ✅ | peserta/mentor | - |
| GET | /api/stats | ❌ | - | - |

## Test Kasus Tepi (SOAL 5)

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




