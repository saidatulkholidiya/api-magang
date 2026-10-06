# Audit Endpoint

| Method | Path | Perlu Login? | Role | Masalah Desain |
|--------|------|--------------|------|----------------|
| POST | /api/auth/register | ❌ | - | - |
| POST | /api/auth/login | ❌ | - | - |
| POST | /api/auth/refresh | ❌ | - | - |
| POST | /api/auth/logout | ❌ | - | - |
| GET | /api/peserta | ❌ | - | - |
| GET | /api/peserta/:id | ❌ | - | - |
| GET | /api/peserta/profil-saya | ✅ | peserta/mentor | ❌ "profil-saya" campur bahasa |
| POST | /api/peserta | ❌ | - | - |
| PUT | /api/peserta/:id | ✅ | peserta/mentor | - |
| DELETE | /api/peserta/:id | ✅ | mentor | - |
| GET | /api/peserta/:id/jurnal | ❌ | - | - |
| GET | /api/jurnal | ✅ | mentor | - |
| GET | /api/jurnal/saya | ✅ | peserta/mentor | ❌ "saya" campur bahasa |
| GET | /api/jurnal/:id | ✅ | peserta/mentor | - |
| POST | /api/jurnal | ✅ | peserta/mentor | - |
| PUT | /api/jurnal/:id | ✅ | peserta/mentor | - |
| PATCH | /api/jurnal/:id/review | ✅ | mentor | - |
| DELETE | /api/jurnal/:id | ✅ | peserta/mentor | - |
| GET | /api/stats | ❌ | - | - |


## Status Code untuk 10 Skenario

| Skenario | Status Code | Alasan |
|----------|-------------|--------|
| a. Register berhasil | **201** | Bikin data baru |
| b. Register dengan email duplikat | **409** | Bentrok data |
| c. Login dengan password salah | **401** | Kredensial salah |
| d. Akses /me tanpa token | **401** | Belum login |
| e. Peserta akses endpoint mentor | **403** | Udah login, gak berhak |
| f. GET /peserta/9999 | **404** | Data gak ada |
| g. DELETE /peserta/1 berhasil | **204** | Berhasil tanpa body |
| h. POST /peserta dengan JSON rusak | **400** | Request gak bisa dipahami |
| i. POST /peserta dengan email format salah | **422** | Format OK, isi salah |
| j. Database mati | **503** | Dependensi mati |